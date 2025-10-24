import * as THREE from 'three'
import AppCore from "../core/AppCore";
import { viewInstance, Views } from "../ui/ViewsManager";
import { Loader } from "../ui/views/loader";
import { DataWebGL } from "../data/Dataset"
import { navigationInstance } from "../core/Navigation";
import { Circ, gsap, Quad } from 'gsap';

interface WebGLTexture {
    name: string;
    file: string;
}

interface ObjectRenderingParameter {
    colorRGB: number[];
    texture: THREE.Texture;
    size: number;
}

class webGL {
    private canvas: HTMLElement | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private scene: THREE.Scene | null = null;
    private renderer: THREE.WebGLRenderer | null = null;
    private target: THREE.Object3D | null = null;
    private manager: THREE.LoadingManager | null = null;
    private textures: { [name: string]: THREE.Texture } = {};
    private mouse = new THREE.Vector2(0, 0);
    private BackgroundVertexShader: string = "";
    private BackgroundFragmentShader: string = "";
    private backgroundUniforms: { [p: string]: THREE.IUniform } | null = null;
    private clock = new THREE.Clock();
    private backgroundPlane: THREE.Mesh | null = null;
    private intensity = 1.0;
    private particleSystems: THREE.Points[] = [];
    private isAnimating = false;

    init(): void {
        if (!AppCore.isMobile) {
            this.enableMouseMove();
        }
        this.canvas = document.getElementById("webgl");
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 50);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00ff00);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas!!,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.target = new THREE.Object3D();
        this.target.position.set(0, 0, 0);
        this.scene.add(this.target);
        this.setupLoadingManager();
        this.setupResizeHandler();
    }

    private setupLoadingManager(): void {
        const _self = this;
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = function (item, loaded, total) {
            (<Loader>viewInstance.getView(Views.LOADER_VIEW)).update(loaded / total);
        };
        const loader = new THREE.TextureLoader(this.manager);
        (DataWebGL.textures as WebGLTexture[]).forEach(t => {
            loader.load(t.file, function (object) {
                _self.textures[t.name] = object;
            });
        });
        this.manager.onLoad = function () {
            _self.createBackgroundShader();
            _self.initObjects();
        };
    }

    private setupResizeHandler(): void {
        const _self = this;
        let resizeTimeout: number;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                console.log("resize");
                const width = window.innerWidth;
                const height = window.innerHeight;
                _self.camera!!.aspect = width / height;
                _self.camera!!.updateProjectionMatrix();
                _self.renderer!!.setSize(width, height);
                _self.backgroundPlane!!.scale.set(110 * _self.camera!!.aspect, 110, 1);
                _self.backgroundUniforms!!.iResolution.value.set(width, height);
                _self.backgroundUniforms!!.adj.value = .2 - height / width;
            }, 100);
        }, true);
    }

    private createBackgroundShader(): void {
        console.log("background shader loading");
        this.BackgroundVertexShader = DataWebGL.backgroundVertShader;
        this.BackgroundFragmentShader = DataWebGL.backgroundFragShader;
        this.backgroundUniforms = {
            iTime: { value: 100.0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iMouse: { value: this.mouse },
            audio1: { value: 0.0 },
            adj: { value: .2 - window.innerHeight / window.innerWidth },
            orbOpacity: { value: 1.0 },
            intensity: { value: 1.0 },
            iChannel0: { value: this.textures['tex1'] }
        };
        const material = new THREE.ShaderMaterial({
            uniforms: this.backgroundUniforms!!,
            vertexShader: this.BackgroundVertexShader,
            fragmentShader: this.BackgroundFragmentShader
        });
        const aspect = window.innerWidth / window.innerHeight;
        const geometry = new THREE.PlaneGeometry(1, 1);
        this.backgroundPlane = new THREE.Mesh(geometry, material);
        this.backgroundPlane.scale.set(110 * aspect, 110, 1);
        this.backgroundPlane.frustumCulled = false;
        this.scene!!.add(this.backgroundPlane);
        navigationInstance.readyToStart();
    }

    private render(): void {
        if (!this.isAnimating) return;

        const delta = this.clock.getDelta();

        if (this.scene && this.camera) {
            if (this.backgroundUniforms) {
                this.backgroundUniforms.iTime.value += delta;
                this.backgroundUniforms.audio1.value = 128.0 / 48.0 + Math.random() * .1;
                this.backgroundUniforms.intensity.value = this.intensity;
                const timeValue = this.backgroundUniforms.iTime.value;
                this.particleSystems.forEach((particles, i) => {
                    const factor = i < 4 ? i + 1 : -(i + 1);
                    particles.rotation.y = .01 * timeValue * factor;
                    particles.rotation.z = -.03 * timeValue * factor;
                    particles.rotation.x = -.01 * timeValue * factor;
                });
            }

            if (!AppCore.isMobile) {
                const targetX = -this.mouse.x * .01;
                const targetY = this.mouse.y * .01;
                this.camera.position.x += (targetX - this.camera.position.x) * .05;
                this.camera.position.y += (targetY - this.camera.position.y) * .05;
            }

            this.renderer!!.render(this.scene, this.camera);
        }
        requestAnimationFrame(this.render.bind(this));
    }

    private initObjects(): void {
        console.log("init webgl objects");
        // ambient sprites
        const geometry = new THREE.BufferGeometry();
        const particleQta = AppCore.isMobile ? 80 : 180;
        const vertices = new Float32Array(particleQta * 3);
        for (let i = 0; i < particleQta; i++) {
            const index = i * 3;
            vertices[index] = Math.random() * 60 - 30;     // x
            vertices[index + 1] = Math.random() * 60 - 30; // y
            vertices[index + 2] = Math.random() * 60 - 30; // z
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const parameters: ObjectRenderingParameter[] = [
            { colorRGB: [1, 0.1, 0.1], texture: this.textures['sprite1']!!, size: 0.85 },
            { colorRGB: [0.3, 0.3, 0.3], texture: this.textures['sprite2']!!, size: 0.95 }
        ];

        parameters.forEach((param, i) => {
            const material = new THREE.PointsMaterial({
                size: param.size,
                map: param.texture,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                opacity: 0.45
            });
            material.color.setRGB(param.colorRGB[0], param.colorRGB[1], param.colorRGB[2]);

            const particles = new THREE.Points(geometry, material);
            particles.rotation.set(
                Math.random() * 6,
                Math.random() * 6,
                Math.random() * 6
            );
            particles.frustumCulled = false;
            this.scene!!.add(particles);
            this.particleSystems.push(particles);
        });

        this.isAnimating = true;
        this.render();
    }

    // mouse follow event
    private enableMouseMove(): void {
        window.addEventListener("mousemove", (e) => {
            this.mouse.x = (e.clientX - window.innerWidth / 2);
            this.mouse.y = (e.clientY - window.innerHeight / 2);
        }, { passive: true });
    }
    // handle the state specific animations in the 3D scene
    go(state: string): void {
        //show the webgl canvas
        this.canvas!!.classList.add("show");
        // navigation animation
        console.log(`webgl: showing ${state} page`);
        const isHome = state === "home";
        const vars = {
            value: isHome ? 1.0 : 0.4,
            immediateRender: true,
            ease: isHome ? Circ.easeInOut : Quad.easeOut,
            duration: isHome ? 2.0 : 1.0
        }
        gsap.to(this.backgroundUniforms!!.orbOpacity, vars);
        if (isHome) {
            (<Loader>viewInstance.getView(Views.LOADER_VIEW)).update(.0);
        }
    }
}

const webGLInstance: webGL = new webGL();
export default webGLInstance;