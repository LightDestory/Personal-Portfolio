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

    init(): void {
        const _self = this;
        if (!AppCore.isMobile) {
            this.enableMouseMove();
        }
        this.canvas = document.getElementById("webgl");
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 50);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00ff00);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas!! });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.target = new THREE.Object3D();
        this.target.position.set(0, 0, 0);
        this.scene.add(this.target);
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
        window.addEventListener("resize", function () {
            console.log("resize");
            const width = window.innerWidth;
            const height = window.innerHeight;
            _self.camera!!.aspect = width / height;
            _self.camera!!.updateProjectionMatrix();
            _self.renderer!!.setSize(width, height);
            _self.backgroundPlane!!.scale.set(110 * _self.camera!!.aspect, 110, 1);
            _self.backgroundUniforms!!.iResolution.value.x = width;
            _self.backgroundUniforms!!.iResolution.value.y = height;
            _self.backgroundUniforms!!.adj.value = .2 - height / width;
        }, true);
    }

    private createBackgroundShader(): void {
        console.log("background shader loading");
        this.BackgroundVertexShader = DataWebGL.backgroundVertShader;
        this.BackgroundFragmentShader = DataWebGL.backgroundFragShader;
        this.backgroundUniforms = {
            iTime: { value: 100.0 },
            iResolution: { value: new THREE.Vector2() },
            iMouse: { value: new THREE.Vector2() },
            audio1: { value: 0.0 },
            adj: { value: 0.0 },
            orbOpacity: { value: 1.0 },
            intensity: { value: 1.0 },
            iChannel0: { value: this.textures['tex1'] }
        };
        this.backgroundUniforms!!.iResolution.value.x = window.innerWidth;
        this.backgroundUniforms!!.iResolution.value.y = window.innerHeight;
        this.backgroundUniforms!!.adj.value = .2 - window.innerHeight / window.innerWidth;
        const material = new THREE.ShaderMaterial({
            uniforms: this.backgroundUniforms!!,
            vertexShader: this.BackgroundVertexShader,
            fragmentShader: this.BackgroundFragmentShader
        });
        const aspect = window.innerWidth / window.innerHeight;
        const geometry = new THREE.PlaneGeometry(1, 1);
        this.backgroundPlane = new THREE.Mesh(geometry, material);
        this.backgroundPlane.scale.set(110 * aspect, 110, 1);
        this.scene!!.add(this.backgroundPlane);
        navigationInstance.readyToStart();
    }

    private render(): void {
        let d: any = this.clock.getDelta();
        if (this.scene && this.camera) {
            if (this.backgroundUniforms) {
                this.backgroundUniforms.iTime.value += d;
                this.backgroundUniforms.audio1.value = 128.0 / 48.0 + Math.random() * .1;
                this.backgroundUniforms.iMouse.value = this.mouse;
                this.backgroundUniforms.intensity.value = this.intensity;
                for (let i = 0; i < this.scene.children.length; i++) {
                    let object = this.scene.children[i];
                    if (object.type == THREE.Points.name) {
                        object.rotation.y = .01 * this.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                        object.rotation.z = -.03 * this.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                        object.rotation.x = -.01 * this.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                    }
                }
            }
            if (!AppCore.isMobile) {
                this.camera.position.x += (-this.mouse.x * .01 - this.camera.position.x) * .05;
                this.camera.position.y += (this.mouse.y * .01 - this.camera.position.y) * .05;
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
        let vertices = [];
        let materials = [];
        let parameters: ObjectRenderingParameter[] = [
            { colorRGB: [1, 0.1, 0.1], texture: this.textures['sprite1']!!, size: 0.85 },
            { colorRGB: [0.3, 0.3, 0.3], texture: this.textures['sprite2']!!, size: 0.95 }
        ];
        for (let i = 0; i < particleQta; i++) {
            const x = Math.random() * 60 - 30;
            const y = Math.random() * 60 - 30;
            const z = Math.random() * 60 - 30;
            vertices.push(x, y, z);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        for (let i = 0; i < parameters.length; i++) {
            const color = parameters[i].colorRGB;
            materials[i] = new THREE.PointsMaterial({
                size: parameters[i].size,
                map: parameters[i].texture,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                opacity: 0.45
            });
            materials[i].color.setRGB(color[0], color[1], color[2]);
            const particles = new THREE.Points(geometry, materials[i]);
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            this.scene!!.add(particles);
        }
        this.render();
    }

    // mouse follow event
    private enableMouseMove(): void {
        const _self = this;
        window.addEventListener("mousemove", function (e) {
            _self.mouse.x = (e.clientX - window.innerWidth / 2);
            _self.mouse.y = (e.clientY - window.innerHeight / 2);
        });
    }

    // handle the state specific animations in the 3D scene
    go(state: string): void {
        //show the webgl canvas
        this.canvas!!.classList.add("show");
        // navigation animation
        console.log(`webgl: showing ${state} page`);
        const vars = {
            value: state === "home" ? 1.0 : 0.4,
            immediateRender: true,
            ease: state === "home" ? Circ.easeInOut : Quad.easeOut,
            duration: state === "home" ? 2.0 : 1.0
        }
        gsap.to(this.backgroundUniforms!!.orbOpacity, vars);
        if (state === "home") {
            (<Loader>viewInstance.getView(Views.LOADER_VIEW)).update(.0);
        }
    }
}

const webGLInstance: webGL = new webGL();
export default webGLInstance;