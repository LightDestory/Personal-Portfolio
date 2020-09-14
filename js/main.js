APP = {
    settings: {
        general: {
            isMobile: false,
            state: null,
            hidden: false,
            webGLSupport: null,
            lazyHandle: null
        },
        projectsFetch: {
            onProgress: false,
            data: {
                "isLoaded": false,
                "user": null,
                "projects": null
            },
            currentID: null
        },
        audio: {
            sounds: [],
            muteDelay: null,
            soundOn: false
        },
        toasts: {
            info: "radial-gradient(#0c304c, #060C1A)",
            error: "radial-gradient(#FF0000, #000000)"
        }
    },
    core: {
        // master init
        init: function () {
            // initialization the settings
            console.log(`${Data.information.title} v${Data.information.version}`);
            Settings.general.state = "loading";
            Views.loader.show();
            // get device specs and capabilities
            Utils.getSpecs();
            // WebGL compatibility
            if (Settings.general.webGLSupport === -1) {
                //WebGL is not supported
                alert(Data.webGL.upgradeMessage);
                return;
            } else if (Settings.general.webGLSupport === 0) {
                //WebGL is supported, but disabled
                alert(Data.webGL.enableMessage);
                return;
            }
            // AOS init
            AOS.init({offset: 60, duration: 1000});
            // init the webgl and views
            Views.init();
            WebGL.init();
            // init sound system and start background music
            SoundSystem.init();
            // init lazyload
            Settings.general.lazyHandle = new LazyLoad({});
            // adding useful events
            const injectEvents = function () {
                // visibility change based on window.hidden
                let hidden, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                } else if (typeof document.mozHidden !== "undefined") {
                    hidden = "mozHidden";
                    visibilityChange = "mozvisibilitychange";
                } else if (typeof document.msHidden !== "undefined") {
                    hidden = "msHidden";
                    visibilityChange = "msvisibilitychange";
                } else if (typeof document.webkitHidden !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                }
                document.addEventListener(visibilityChange, function () {
                    Settings.general.hidden = !!document[hidden];
                    if (Settings.general.hidden && Settings.audio.soundOn) {
                        SoundSystem.muteAll();
                    } else if (!Settings.general.hidden && Settings.audio.soundOn) {
                        SoundSystem.unMuteAll();
                    }
                }, false);
                // mouse follow event
                if (!Settings.general.isMobile) {
                    window.addEventListener("mousemove", function (e) {
                        WebGL.mouse.x = (e.clientX - window.innerWidth / 2);
                        WebGL.mouse.y = (e.clientY - window.innerHeight / 2);
                    });
                }
            }
            injectEvents();
            // show music warning
            Utils.showToast("Don't miss the background music!", 3000, Settings.toasts.info);
        },
        // navigation between sections and pages
        go: function (state) {
            if (Settings.general.state === state) {
                return false;
            }
            console.log("Change state requested. From " + Settings.general.state + " to " + state);
            // navigation logic
            const toPath = state.split('/'), fromPath = Settings.general.state.split('/');
            let toSection, toPage, fromSection, fromPage;
            toSection = toPath[0] ? toPath[0] : null;
            toPage = toPath[1] ? toPath[1] : null;
            fromSection = fromPath[0] != "loading" ? fromPath[0] : null;
            fromPage = fromPath[1] ? fromPath[1] : null;
            if (toSection) {
                console.log("section", toSection);
            }
            if (toPage) {
                console.log("page", toPage);
            }
            // close the menu if open
            Views.menu.hide();
            // handle leaving old state
            if (fromSection) {
                if (fromSection !== "projects") {
                    Views.hidePage(fromSection);
                } else {
                    if (fromPage) {
                        Views.hidePage("project-detail");
                    } else {
                        Views.hidePage("projects");
                    }
                }
            }
            // handle entering new state
            const docTitleRef = toPage ? "detailTitle" : "pageTitle";
            document.title = Data.views[toSection][docTitleRef];
            Settings.general.state = state;
            if (!toPage) {
                WebGL.go(toSection);
                Views.showPage(toSection);
            } else {
                // projects detail
                Settings.projectsFetch.currentID = toPage;
                Views.loader.update(.0);
                Views.loader.show();
                setTimeout(function () {
                    Views.projectDetail.load(toPage);
                }, 800);
                WebGL.go("projectDetail");
                setTimeout(function () {
                    Views.loader.update(.7);
                }, 500);
                setTimeout(function () {
                    Views.showPage("project-detail");
                    Views.loader.update(1.0);
                    Views.loader.hide()
                }, 1000);
            }
            // update loaded icon default image
            let rem = state === "home" ? "home-bar-hide" : "home-bar-show";
            let add = state === "home" ? "home-bar-show" : "home-bar-hide";
            const top_bar = document.querySelector(".top-bar").classList;
            const bot_bar = document.querySelector(".bottom-bar").classList;
            const header = document.querySelector(".header").classList;
            const footer_menu = document.querySelector(".footer-menu").classList;
            setTimeout(function () {
                top_bar.remove(rem);
                top_bar.add(add);
                bot_bar.remove(rem);
                bot_bar.add(add);
                if (state === "home") {
                    header.remove("show");
                    footer_menu.add("show");
                } else {
                    header.add("show");
                    footer_menu.remove("show");
                }
            }, 500);
            // hide / show anything globally here
            setTimeout(function () {
                document.querySelector("html").scrollTop = 0;
                document.querySelector("body").scrollTop = 0;
            }, 50);
        },
        // ready to go
        readyToStart: function () {
            console.log("READY... GO!");
            Views.loader.hide();
            Views.header.show();
            Core.go("home");
        }
    },
    soundSystem: {
        // loading sound files
        init: function () {
            console.log("init sound system");
            Howler.mute(true);
            Data.sounds.forEach(s => {
                Settings.audio.sounds[s.name] = new Howl({
                    src: s.file,
                    loop: s.loop,
                    volume: s.volume,
                    name: s.name,
                    autoplay: s.autoplay
                });
            });
            if (Utils.getCookie('muted') === "0") {
                Settings.audio.soundOn = true;
                SoundSystem.unMuteAll();
            }
            document.querySelector(".sound-controls").addEventListener("click", () => {
                Settings.audio.sounds['click'].play();
                if (Settings.audio.soundOn) {
                    Settings.audio.soundOn = false;
                    SoundSystem.muteAll();
                    Utils.setCookie("muted", 1, 1);
                } else {
                    Settings.audio.soundOn = true;
                    SoundSystem.unMuteAll();
                    Utils.setCookie("muted", 0, 1);
                }

            });
            if (!Settings.general.isMobile) {
                document.querySelector(".sound-controls").addEventListener("mouseover", () => {
                    const icon = document.querySelector("#sound-icon").classList;
                    if (Settings.audio.soundOn) {
                        icon.remove("fa-volume-up");
                        icon.add("fa-volume-mute");
                    } else {
                        icon.add("fa-volume-up");
                        icon.remove("fa-volume-mute");
                    }
                });
                document.querySelector(".sound-controls").addEventListener("mouseout", () => {
                    const icon = document.querySelector("#sound-icon").classList;
                    if (!Settings.audio.soundOn) {
                        icon.remove("fa-volume-up");
                        icon.add("fa-volume-mute");
                    } else {
                        icon.add("fa-volume-up");
                        icon.remove("fa-volume-mute");
                    }
                });
            }
        },
        // mute control
        muteAll: function () {
            console.log("mute all ");
            SoundSystem.toggleAnimation();
            Settings.audio.sounds['ambient'].fade(1, 0, 1000);
            Settings.audio.muteDelay = setTimeout(function () {
                Howler.mute(true);
            }, 1500);
        },
        // unmute control
        unMuteAll: function () {
            console.log("unMute all ");
            SoundSystem.toggleAnimation();
            clearTimeout(Settings.audio.muteDelay);
            Howler.mute(false);
            Settings.audio.sounds['ambient'].fade(0, 1, 1000);
        },
        toggleAnimation: function () {
            document.querySelectorAll(".sbar").forEach(element => element.classList.toggle("noAnim"));
            const icon = document.querySelector("#sound-icon").classList;
            if (Settings.audio.soundOn) {
                icon.add("fa-volume-up");
                icon.remove("fa-volume-mute");
            } else {
                icon.remove("fa-volume-up");
                icon.add("fa-volume-mute");
            }
        }
    },
    webGL: {
        canvas: null,
        camera: null,
        scene: null,
        renderer: null,
        target: null,
        manager: null,
        textures: [],
        mouse: new THREE.Vector2(0, 0),
        BackgroundVertexShader: null,
        BackgroundFragmentShader: null,
        backgroundUniforms: null,
        windowHalfX: window.innerWidth / 2,
        windowHalfY: window.innerHeight / 2,
        clock: new THREE.Clock(),
        backgroundPlane: null,
        intensity: 1.0,
        init: function () {
            WebGL.canvas = document.getElementById("webgl");
            WebGL.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
            WebGL.camera.position.set(0, 0, 50);
            WebGL.scene = new THREE.Scene();
            WebGL.scene.background = new THREE.Color(0x00ff00);
            WebGL.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
            WebGL.renderer.setSize(window.innerWidth, window.innerHeight);
            WebGL.target = new THREE.Object3D();
            WebGL.target.position.set(0, 0, 0);
            WebGL.scene.add(this.target);
            WebGL.manager = new THREE.LoadingManager();
            WebGL.manager.onProgress = function (item, loaded, total) {
                Views.loader.update(loaded / total);
            };
            const loader = new THREE.TextureLoader(WebGL.manager);
            Data.webGL.textures.forEach(t => {
                loader.load(t.file, function (object) {
                    WebGL.textures[t.name] = object;
                });
            });
            WebGL.manager.onLoad = function () {
                WebGL.initObjects();
                WebGL.createBackgroundShader();
            };
            window.addEventListener("resize", function () {
                console.log("resize");
                const width = window.innerWidth;
                const height = window.innerHeight;
                WebGL.camera.aspect = width / height;
                WebGL.camera.updateProjectionMatrix();
                WebGL.renderer.setSize(width, height);
                WebGL.windowHalfX = width / 2;
                WebGL.windowHalfY = height / 2;
                WebGL.backgroundPlane.scale.set(110 * WebGL.camera.aspect, 110, 1);
                WebGL.backgroundUniforms.iResolution.value.x = width;
                WebGL.backgroundUniforms.iResolution.value.y = height;
                WebGL.backgroundUniforms.adj.value = .2 - height / width;
            }, true);
        },
        createBackgroundShader: function () {
            console.log("background shader loading");
            WebGL.BackgroundVertexShader = Data.webGL.backgroundVertShader;
            WebGL.BackgroundFragmentShader = Data.webGL.backgroundFragShader;
            WebGL.backgroundUniforms = {
                iTime: {type: "f", value: 100.0},
                iResolution: {type: "v2", value: new THREE.Vector2()},
                iMouse: {type: "v2", value: new THREE.Vector2()},
                audio1: {type: "f", value: 0.0},
                adj: {type: "f", value: 0.0},
                orbOpacity: {type: "f", value: 1.0},
                intensity: {type: "f", value: 1.0},
                iChannel0: {type: 't', value: WebGL.textures['tex1']}
            };
            WebGL.backgroundUniforms.iResolution.value.x = window.innerWidth;
            WebGL.backgroundUniforms.iResolution.value.y = window.innerHeight;
            WebGL.backgroundUniforms.adj.value = .2 - window.innerHeight / window.innerWidth;
            const material = new THREE.ShaderMaterial({
                uniforms: WebGL.backgroundUniforms,
                vertexShader: WebGL.BackgroundVertexShader,
                fragmentShader: WebGL.BackgroundFragmentShader
            });
            const aspect = window.innerWidth / window.innerHeight;
            const geometry = new THREE.PlaneGeometry(1, 1);
            WebGL.backgroundPlane = new THREE.Mesh(geometry, material);
            WebGL.backgroundPlane.scale.set(110 * aspect, 110, 1);
            WebGL.scene.add(WebGL.backgroundPlane);
            Core.readyToStart();
        },
        render: function () {
            const d = WebGL.clock.getDelta();
            if (WebGL.scene && WebGL.camera) {
                if (WebGL.backgroundUniforms) {
                    WebGL.backgroundUniforms.iTime.value += d;
                    WebGL.backgroundUniforms.audio1.value = 128.0 / 48.0 + Math.random() * .1;
                    WebGL.backgroundUniforms.iMouse.value = WebGL.mouse;
                    WebGL.backgroundUniforms.intensity.value = WebGL.intensity;
                    for (let i = 0; i < WebGL.scene.children.length; i++) {
                        let object = WebGL.scene.children[i];
                        if (object instanceof THREE.Points) {
                            object.rotation.y = .01 * WebGL.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                            object.rotation.z = -.03 * WebGL.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                            object.rotation.x = -.01 * WebGL.backgroundUniforms.iTime.value * (i < 4 ? i + 1 : -(i + 1));
                        }
                    }
                }
                if (!Settings.general.isMobile) {
                    WebGL.camera.position.x += (-WebGL.mouse.x * .01 - WebGL.camera.position.x) * .05;
                    WebGL.camera.position.y += (WebGL.mouse.y * .01 - WebGL.camera.position.y) * .05;
                }
                WebGL.renderer.render(WebGL.scene, WebGL.camera);
            }
            requestAnimationFrame(WebGL.render);
        },
        initObjects: function () {
            console.log("init webgl objects");
            // ambient sprites
            const geometry = new THREE.BufferGeometry();
            const particleQta = Settings.general.isMobile ? 80 : 180;
            let vertices = [];
            let materials = [];
            let parameters = [
                [[1, 0.1, 0.1], WebGL.textures['sprite1'], 0.85],
                [[0.3, 0.3, 0.3], WebGL.textures['sprite2'], 0.95]
            ];
            for (let i = 0; i < particleQta; i++) {
                const x = Math.random() * 60 - 30;
                const y = Math.random() * 60 - 30;
                const z = Math.random() * 60 - 30;
                vertices.push(x, y, z);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            for (let i = 0; i < parameters.length; i++) {
                const color = parameters[i][0];
                const sprite = parameters[i][1];
                const size = parameters[i][2];
                materials[i] = new THREE.PointsMaterial({
                    size: size,
                    map: sprite,
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
                WebGL.scene.add(particles);
            }
            WebGL.render();
        },
        // handle the state specific animations in the 3D scene
        go: function (state) {
            //show the webgl canvas
            WebGL.canvas.classList.add("show");
            // navigation animation
            console.log(`webgl: showing ${state} page`);
            const vars = {
                value: state === "home" ? 1.0 : 0.4,
                immediateRender: true,
                ease: state === "home" ? Circ.easeInOut : Quad.easeOut,
            }
            const duration = state === "home" ? 2.0 : 1.0;
            TweenMax.to(WebGL.backgroundUniforms.orbOpacity, duration, vars);
            if (state === "home") {
                Views.loader.update(.0);
            }
        }
    },
    views: {
        init: function () {
            Object.keys(Views).forEach(element => {
                if (typeof Views[element] != "function" && element !== "loader") {
                    Views[element].init();
                }
            });
        },
        showPage: function (page) {
            console.log(`show ${page}`);
            const p = document.querySelector(`.${page}`).classList;
            p.remove("hide");
            setTimeout(function () {
                p.add("show");
                AOS.refresh();
            }, 100);
            const title = document.querySelector(`.${page} .page-title`).classList;
            const subtitle = document.querySelector(`.${page} .page-subtitle`).classList;
            title.remove("aos-animate");
            subtitle.remove("aos-animate");
            setTimeout(function () {
                title.add("aos-animate");
                subtitle.add("aos-animate");
            }, 500);
            if (page === "projects") {
                if (!Settings.projectsFetch.onProgress && !Settings.projectsFetch.data.isLoaded) {
                    console.log('error on fetching repositories, retrying...');
                    Utils.showToast("Unable to get response from GitHub API. Retrying...", 3000, Settings.toasts.error);
                    Views.projects.fetchData();
                } else if (Settings.projectsFetch.onProgress) {
                    Utils.showToast("Due to slow network the fetching is still on progress. Come back later!", 8000, Settings.toasts.info);
                }
            }
        },
        hidePage: function (page) {
            console.log(`hide ${page}`);
            const p = document.querySelector(`.${page}`).classList;
            p.remove("show");
            document.querySelector(`.${page} .page-title`).classList.remove("aos-animate");
            document.querySelector(`.${page} .page-subtitle`).classList.remove("aos-animate");
            if (page === "project-detail") {
                setTimeout(function () {
                    document.querySelector(`.${page} .details-container`).innerHTML = "";
                }, 500);
                // if we are going from a detail page to the same detail page, dont hide it from DOM
                if (Settings.general.state === "projects") {
                    return null;
                }
            }
            // hide page from DOM
            setTimeout(function () {
                p.add("hide");
            }, 1000);
        },
        loader: {
            name: "loader",
            show: function () {
                console.log("show loader");
                document.querySelector(".loader").classList.add("show");
            },
            hide: function () {
                console.log("hide loader");
                document.querySelector(".loader").classList.remove("show");
            },
            update: function (v) {
                const value = Math.round(v * 100) / 100;
                console.log("loader progress: ", value * 100 + "%");
                document.querySelector(".loader").style.width = `${value * 100}%`;
            }
        },
        header: {
            name: "header",
            init: function () {
                console.log("init header");
                document.querySelector(".logo").addEventListener("click", () => {
                    console.log('logo clicked');
                    Settings.audio.sounds["click"].play();
                    Core.go("home");
                });
            },
            show: function () {
                console.log("show header");
                const header = document.querySelector(".header").classList;
                header.add("show");
                header.add("shade");
            },
            hide: function () {
                console.log("hide header");
                const header = document.querySelector(".header").classList;
                header.remove("show");
                header.remove("shade");
            }
        },
        menu: {
            name: "menu",
            init: function () {
                console.log("init menu");
                let str = "", str2 = "", str3 = "";
                Data.views.menu.forEach(function (m, i) {
                    const p = i === 0 ? "" : " | ";
                    str += `<li class="menu-item menu-${m.link}" data-link="${m.link}">${p}${m.title}</li>`;
                    if (m.link !== "home") {
                        str2 += `<li class="menu-item menu-${m.link}" data-link="${m.link}">${m.title}</li>`;
                    }
                    str3 += `<li class="data-detail-container menu-item menu-${m.link}" data-link="${m.link}">${m.title}</li>`;
                });
                // loading into DOM
                document.querySelector(".header-menu .menu-items").innerHTML = str;
                document.querySelector(".footer-menu .menu-items").innerHTML = str2;
                document.querySelector(".menu .menu-items").innerHTML = str3;
                // click event
                document.querySelectorAll(".menu-item").forEach(item => {
                    item.addEventListener("click", () => {
                        const link = item.getAttribute("data-link");
                        console.log(`menu-item clicked: ${link}`);
                        Settings.audio.sounds["click"].play();
                        Core.go(link);
                    });
                });
                //  click event
                document.querySelector(".menu-button").addEventListener("click", () => {
                    Settings.audio.sounds["click"].play();
                    if (document.querySelector(".menu-button").classList.contains("active")) {
                        // hide menu
                        Views.menu.hide();
                    } else {
                        // show menu
                        Views.menu.show();
                    }
                })
            },
            show: function () {
                console.log("show menu");
                document.querySelector(".menu").classList.add("show");
                document.querySelector(".menu-button").classList.add("active");
            },
            hide: function () {
                console.log("hide menu");
                document.querySelector(".menu").classList.remove("show");
                document.querySelector(".menu-button").classList.remove("active");
            }
        },
        home: {
            name: "home",
            init: function () {
                console.log("init home");
                const collection = Data.views.home;
                document.querySelector(".home .page-title").innerHTML = collection.title;
                document.querySelector(".home .page-akatitle").innerHTML = collection.subtitle;
                document.querySelector(".home .page-subtitle").innerHTML = collection.subtitle2;
            },
            show: function () {
                console.log("show home");
                Views.showPage("home");
            },
            hide: function () {
                console.log("hide home");
                Views.hidePage("home");
            }
        },
        info: {
            name: "info",
            init: function () {
                console.log("init info");
                const collection = Data.views.info;
                document.querySelector(".info .page-title").innerHTML = collection.title;
                document.querySelector(".info .page-subtitle").innerHTML = collection.subtitle;
                document.querySelector(".info .feature .feature-image").setAttribute("data-src", collection.splash);
                // longer bio
                document.querySelector(".info .bio-title").innerHTML = "[ Biography ]";
                document.querySelector(".info .bio").innerHTML = collection.biography;
                //Skills
                document.querySelector(".info .skillset-title").innerHTML = "[ Skills ]";
                document.querySelector(".info .skill-intro").innerHTML = collection.skillInfo;
                const skillSet = collection.skillSet;
                const container = document.querySelector(".skillset");
                skillSet.forEach(function (skill, i) {
                    const group = skill.collection;
                    let component = `<div class="skill-container"><div class="skill-title">${skill.title}</div><ul class=${skill.category}>`;
                    group.forEach(function (element) {
                        const percent = element.level * 10;
                        const strStyle = element.level === 10 ? `width:${percent}%;border-radius:50px;` : `width:${percent}%;`;
                        const noteIcon = element.note ? `<i id="icon-more-${element.friendlyName}" class="fas fa-chevron-right"></i>` : "";
                        const note = element.note ? `<div class="more-skill-container more-${element.friendlyName}">${element.note}</div>` : "";
                        component += `<div class="skillbar-container" skill="${element.friendlyName}">${noteIcon}<li class="skill-name">${element.name} <i class='${element.icon}'></i></li><div class="skillbar" style="${strStyle}"></div></div>${note}`;
                    });
                    component += '</ul></div>';
                    if ((i + 1) % 2 === 1)
                        component += '<div class="padder"></div>';
                    container.innerHTML += component;
                });
                //click event
                document.querySelectorAll(".skillbar-container").forEach(item => {
                    item.addEventListener("click", () => {
                        const skill = item.getAttribute("skill");
                        if (item.querySelector(`#icon-more-${skill}`) == null) {
                            return;
                        }
                        const icon = document.querySelector(`#icon-more-${skill}`).classList;
                        const content = document.querySelector(`.more-${skill}`);
                        const hidden = icon.contains('fa-chevron-right');
                        if (hidden) {
                            icon.remove('fa-chevron-right');
                            icon.add('fa-chevron-down');
                            content.style.display = "block";
                        } else {
                            icon.add('fa-chevron-right');
                            icon.remove('fa-chevron-down');
                            content.style.display = "none";
                        }
                    })
                });
                //Ethic
                document.querySelector(".info .ethic-title").innerHTML = "[ Ethics ]";
                document.querySelector(".info .ethic").innerHTML = collection.ethic;
            }
        },
        projects: {
            name: "projects",
            init: function () {
                console.log("init projects");
                const collection = Data.views.projects;
                // Titles
                document.querySelector(".projects .page-title").innerHTML = collection.title;
                document.querySelector(".projects .page-subtitle").innerHTML = collection.subtitle;
                document.querySelector(".projects .projects-title").innerHTML = "[ Projects ]";
                document.querySelector(".projects .contributions-title").innerHTML = "[ Contributions ]";
                // async load of projects
                this.fetchData();
            },
            fetchData: function () {
                console.log('async fetch repositories');
                Settings.projectsFetch.onProgress = true;
                fetch(Data.views.projects.githubUserAPI)
                    .then(response => {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(response => {
                        Settings.projectsFetch.data.user = response;
                        return fetch(Data.views.projects.githubProjectsAPI)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(response => {
                        Settings.projectsFetch.data.projects = response;
                        Settings.projectsFetch.data.isLoaded = true;
                        Views.projects.loadData();
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        Settings.projectsFetch.onProgress = false;
                    });
            },
            loadData: function () {
                // generating user-card
                const user = Settings.projectsFetch.data.user;
                document.querySelector(".github-card").innerHTML = `<img class="github-card-avatar lazy" src="" alt="Profile Image" data-src="${user.avatar_url}" alt="${user.name}"><div class="github-card-title">${user.name} (${user.login})</div><div class="github-card-content"><div class="data-detail-container github-card-element"><a href="https://github.com/${user.login}?tab=repositories"><strong>${user.public_repos}</strong><br/>Repos</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${user.login}?tab=following"><strong>${user.following}</strong><br/>Following</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${user.login}?tab=followers"><strong>${user.followers}</strong><br/>Followers</a></div></div>`;
                // loading repositories
                const projects = document.querySelector(".projects-content");
                const forks = document.querySelector(".contributions-content");
                Settings.projectsFetch.data.projects.forEach(function (element, i) {
                    const desc = `${String(element.description) === "null" ? "No description has been set for the repository" : String(element.description).substr(0, 64)}&hellip;`;
                    const name = `${String(element.name).replace(/-/g, " ").replace(/_/g, " ")}`;
                    const str = `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class='data-container list-item project-item'><img alt="Repository Image" class='lazy' data-src='assets/images/projects/${element.id}.jpg'/><div class="info"><div class='title'>${name}</div><div class='text'><p>${desc}<p></div></div><div class="links"><div class='data-detail-container detail' data-link='projects/${i + 1}'>More</div></div></div>`;
                    if (!element['fork']) {
                        projects.innerHTML += str;
                    } else {
                        forks.innerHTML += str;
                    }
                });
                // assign click handlers
                document.querySelectorAll(".project-item .links .detail").forEach(item => {
                    item.addEventListener("click", () => {
                        Settings.audio.sounds["click"].play();
                        const link = item.getAttribute("data-link");
                        console.log("project-item clicked: ", link);
                        Core.go(link);
                    })
                });
                // placeholder inject
                document.querySelectorAll(".list-item img").forEach(image => {
                    image.addEventListener("error", () => {
                        image.setAttribute("src", Data.views.projects.placeHolder);
                    });
                });
                //lazyload update
                Settings.general.lazyHandle.update();
            }
        },
        projectDetail: {
            name: "project-detail",
            init: function () {
                console.log("init project detail");
                // next project navigation
                document.querySelector(".project-detail .bottom-next").addEventListener("click", () => {
                    Settings.audio.sounds["click"].play();
                    Views.projectDetail.goNext();
                });
                // previous project navigation
                document.querySelector(".project-detail .bottom-back").addEventListener("click", () => {
                    Settings.audio.sounds["click"].play();
                    Views.projectDetail.goBack();
                });
                // return project index navigation
                document.querySelector(".project-detail .bottom-up").addEventListener("click", () => {
                    Settings.audio.sounds["click"].play();
                    Core.go("projects");
                });
                document.querySelector(".project-detail img").addEventListener("error", () => {
                    document.querySelector(".project-detail img").setAttribute("src", Data.views.projects.placeHolder);
                });
            },
            load: function (id) {
                const collection = Settings.projectsFetch.data.projects[id - 1];
                const name = String(collection.name).replace(/-/g, " ").replace(/_/g, " ");
                const description = collection.description == null ? "No description has been set for the repository" : collection.description;
                console.log("loading project detail from data id:", id);
                document.querySelector(".project-detail .page-title").innerHTML = `${name}`;
                document.querySelector(".project-detail .page-subtitle").innerHTML = "Detail of";
                document.querySelector(".project-detail img").setAttribute("src", `assets/images/projects/${collection.id}.jpg`);
                document.querySelector(".project-detail .detail-title").innerHTML = "[ Brief ]";
                document.querySelector(".project-detail .description").innerHTML = `<p>${description}</p>`;
                // getting useful data
                const tags = Data.views.projects.projectDetailTags;
                let component = "";
                for (const [key, value] of Object.entries(tags)) {
                    component += `<div class="data-detail-container detail detail-${key}"><span class="detail-title">${key}</span><span class="detail-data">${eval(value)}</span></div>`;
                }
                document.querySelector(".project-detail .details-container").innerHTML = component;
            },
            goNext: function () {
                const current = parseInt(Settings.projectsFetch.currentID);
                if (current < Settings.projectsFetch.data.projects.length) {
                    console.log(`project detail nexting to ${current + 1}`);
                    Core.go(`projects/${current + 1}`);
                } else {
                    console.log("project detail nexting to 1");
                    Core.go(`projects/1`);
                }
            },
            goBack: function () {
                const current = parseInt(Settings.projectsFetch.currentID);
                if (current > 1) {
                    console.log(`project detail backing to ${current - 1}`);
                    Core.go(`projects/${current - 1}`);
                } else {
                    console.log(`project detail backing to ${Settings.projectsFetch.data.projects.length}`);
                    Core.go(`projects/${Settings.projectsFetch.data.projects.length}`);
                }
            }
        },
        platforms: {
            name: "platforms",
            init: function () {
                console.log("init platforms");
                const collection = Data.views.platforms;
                document.querySelector(".platforms .page-title").innerHTML = collection.title;
                document.querySelector(".platforms .page-subtitle").innerHTML = collection.subtitle;
                document.querySelector(".platforms .feature .feature-image").setAttribute("data-src", collection.splash);
                document.querySelector(".platforms .platforms-title").innerHTML = "[ Where you can find me ]";
                document.querySelector(".platforms .platforms-intro").innerHTML = collection.platformsInfo;
                const links = collection.links;
                let component = "";
                links.forEach(platform => {
                    const link = platform.link ? `href='${platform.link}'` : "";
                    component += `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-container platform platform-${String(platform.name).toLowerCase()}"><div class="platform-icon"><i class="${platform.icon} fa-4x"></i></div><div class="platform-title">${platform.name}</div><div class="data-detail-container platform-link"><a ${link} target="_blank">${platform.note}</a></div></div>`;
                });
                document.querySelector(".platforms .platforms-container").innerHTML = component;
            }
        },
        thanks: {
            name: "thanks",
            init: function () {
                console.log("init thanks");
                const collection = Data.views.thanks;
                document.querySelector(".thanks .page-title").innerHTML = collection.title;
                document.querySelector(".thanks .page-subtitle").innerHTML = collection.subtitle;
                document.querySelector(".thanks .feature .feature-image").setAttribute("data-src", collection.splash);
                document.querySelector(".thanks .poweredBy-title").innerHTML = "[ Powered by ]";
                document.querySelector(".thanks .thanks-title").innerHTML = "[ Thanks to ]";
                let component = "";
                // importing poweredBy data
                let isLeft = true;
                collection.poweredBy.forEach(element => {
                    const link = element.link ? `href='${element.link}'` : "";
                    component += `<div data-aos='fade-${isLeft ? "left" : "right"}' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail poweredby-${element.friendlyName}"><span class="detail-title">${element.name}</span><span class="detail-data">${element.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">Learn more...</a></div>`;
                    isLeft= !isLeft;
                });
                document.querySelector(".thanks .poweredBy-container").innerHTML = component;
                component = "";
                isLeft = false;
                // importing thanksLifeSaving data
                collection.thanksForLifeSaving.forEach(element => {
                    const link = element.link ? `href='${element.link}'` : "";
                    component += `<div data-aos='fade-${isLeft ? "left" : "right"}' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail thanks-to-${element.friendlyName}"><span class="detail-title">${element.name}</span><span class="detail-data">${element.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">Learn more...</a></div>`;
                    isLeft= !isLeft;
                });
                document.querySelector(".thanks .thanks-container").innerHTML = component;
            }
        }
    },
    utils: {
        // show a toast information
        showToast: function (text, duration, type) {
            Toastify({
                text: text,
                duration: duration,
                gravity: "top",
                position: 'center',
                backgroundColor: type
            }).showToast();
        },
        // detection of mobile device based on user-agent
        isMobile: function () {
            return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
        },
        // check of webgl support based on canvas' context
        isWebGLSupported: function () {
            if (!!window.WebGLRenderingContext) {
                let canvas = document.createElement("canvas"),
                    names = ["webgl2", "webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                    context = false;
                for (const name of names) {
                    try {
                        context = canvas.getContext(name);
                        if (context && typeof context.getParameter == "function") {
                            // WebGL is supported and enabled
                            return 1;
                        }
                    } catch (e) {
                    }
                }
                // WebGL is supported, but disabled
                return 0;
            }
            // WebGL is not supported
            return -1;
        },
        // initialization of specs
        getSpecs: function () {
            // test for mobile and tablet
            Settings.general.isMobile = Utils.isMobile();
            // test for webGL support
            Settings.general.webGLSupport = Utils.isWebGLSupported();
        },
        // cookies utilities
        setCookie: function (cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = `expires=${d.toUTCString()}`;
            document.cookie = `${cname}=${cvalue};${expires};path=/`;
        },
        getCookie: function (cname) {
            const name = `${cname}=`;
            const ca = decodeURIComponent(document.cookie).split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            // No cookie found
            return -1;
        }
    },
    data: {
        "information": {
            "title": "LightDestory's Personal Portfolio",
            "version": "0.1"
        },
        "webGL": {
            "upgradeMessage": "It appears you are on an older device or browser. Please retry using a WebGL enabled device.",
            "enableMessage": "It appears your browser supports WebGL but actually it is disabled. Please retry after enable WebGL support.",
            "backgroundFragShader": "varying vec2 vUv;uniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;uniform float audio1;uniform float adj;uniform sampler2D iChannel0;uniform sampler2D iChannel1;uniform float orbOpacity;uniform float intensity;mat2 makem2(in float theta){ float c = cos(theta); float s = sin(theta); return mat2(c, -s, s, c); }float noise( in vec2 x){ return texture2D(iChannel0, x * .01).x; }mat2 m2 = mat2(.80, 0.80, -0.80, 0.80);float grid(vec2 p){ float s = sin(p.x) * cos(p.y); return s;}float flow(in vec2 p){ float z = 4.; float rz = 0.; vec2 bp = p; for (float i = 1.; i < 8.; i++ ) { bp += (iTime * 0.1) * 1.5; vec2 gr = vec2(grid(p * 3. - (iTime * 0.1) * 2.), grid(p * 3. + 4. - (iTime * 0.1))) * 0.4; gr = normalize(gr) * 0.4; gr *= makem2((p.x + p.y) * .3 + (iTime * 0.1) * 10.); p += gr * 0.2; rz += (sin(noise(p) * 2.) * 0.5 + 0.5) / z; p = mix(bp, p, .5); z *= 1.5; p *= 2.5; p *= m2; bp *= 2.5; bp *= m2; } return rz;}float spiral(vec2 p, float scl){ float r = length(p); r = log(r); float a = atan(p.y, p.y); return abs(mod(scl * (r - 2. / scl * a), 6.2831853) - 1.) * 1.;}float Sin01(float t) { return .5 + 0.5 * sin(6.28319 * t);}float SineEggCarton(vec3 p) { return .1 + abs(sin(p.x) - cos(p.y) + sin(p.z)) * 1.2 * orbOpacity;}float Map(vec3 p, float scale) { float dSphere = length(p) - 1.0; return max(dSphere, (.85 - SineEggCarton(scale * p)) / scale);}vec3 GetColor(vec3 p) { float amount = clamp((1.5 - length(p)) / 2.0, 0.0, 1.0); vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * (audio1 * .6) * vec3(1.0, .9, 0.8))); return col * amount * (orbOpacity);}void main() { vec2 coord = gl_FragCoord.xy; /*Ring of light, place above the orb*/ vec2 p = coord / iResolution.xy - 0.5; p.x *= iResolution.x / iResolution.y; p *= .5; p.y += .8; float rz = flow(p); p /= exp(mod(2.1, 2.1)); rz *= (3. - spiral(p, .5)) * .6 * audio1; /* intensity / thickness of ring */ vec3 col = vec3(.02, 0.04, 0.09) / rz; col = pow(abs(col), vec3(1.01)); gl_FragColor += vec4(col, 1.0); /* Orb relative position*/ vec3 rd = normalize(vec3(2.0 * coord - iResolution.xy, -iResolution.y)); vec3 ro = vec3(0, 0, -1.4 * (1.0 - orbOpacity) - .5 + mix(2.5, 2.0, adj + Sin01((0.05) * iTime))); rd.xz = rd.xz * cos(0.2 * iTime) + vec2(-rd.xz.y, rd.xz.x) * sin(0.2 * iTime); ro.xz = ro.xz * cos(0.2 * iTime) + vec2(-ro.xz.y, ro.xz.x) * sin(0.2 * iTime); rd.yz = rd.yz * cos(0.1 * iTime) + vec2(-rd.yz.y, rd.yz.x) * sin(0.1 * iTime); ro.yz = ro.yz * cos(0.1 * iTime) + vec2(-ro.yz.y, ro.yz.x) * sin(0.1 * iTime); float t = 0.0; float scale = mix(1.5, 24.0 * (orbOpacity * orbOpacity), Sin01(0.3 * iTime * (.01))); for (int i = 0; i < 80; i++) { vec3 p = ro + t * rd; /*(orbOpacity) is more solid lines*/ float d = Map(p, scale); if (t > 80.0 || d < 0.0001) { break; } t += 0.8 * d; gl_FragColor.rgb += (0.05 * GetColor(p) * (audio1 * .6)) * orbOpacity; }}",
            "backgroundVertShader": "varying vec2 vUv;uniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;uniform float audio1;uniform sampler2D iChannel0;uniform sampler2D iChannel1;void main() {  vUv = uv;  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );  gl_Position = projectionMatrix * mvPosition;}",
            "textures": [
                {
                    "file": "assets/images/textures/tex1.png",
                    "name": "tex1"
                },
                {
                    "file": "assets/images/textures/sprite1.png",
                    "name": "sprite1"
                },
                {
                    "file": "assets/images/textures/sprite2.png",
                    "name": "sprite2"
                }
            ]
        },
        "sounds": [
            {
                "file": "assets/sounds/Knowing.ogg",
                "name": "ambient",
                "loop": true,
                "autoplay": true,
                "volume": 0.0
            },
            {
                "file": "assets/sounds/Beep.mp3",
                "name": "click",
                "loop": false,
                "autoplay": false,
                "volume": 1.0
            }
        ],
        "views": {
            "menu": [
                {"title": "home", "link": "home"},
                {"title": "about me", "link": "info"},
                {"title": "projects", "link": "projects"},
                {"title": "Socials & Contacts", "link": "platforms"},
                {"title": "Special Thanks", "link": "thanks"}
            ],
            "home": {
                "pageTitle": "Alessio Tudisco | Portfolio",
                "title": "Alessio Tudisco",
                "subtitle": "a.k.a LightDestory",
                "subtitle2": "Developer | SysAdmin | Manga&Anime Addicted"
            },
            "info": {
                "pageTitle": "Alessio Tudisco | Info",
                "title": "info",
                "subtitle": "Biography | Skills | Ethics",
                "splash": "assets/images/splashes/biography.jpg",
                "biography": "<p>Hello!<br/>Pleasure to 'meet' you, I'm <i>Alessio Tudisco</i>, also known as <i>LightDestory</i> (why? read below for a funny story*). I was born in a little city called 'Piazza Armerina' in Sicily, extreme south of Italy. I have a huge passion for computer science, communications' technologies and anime&manga. I am working hard to realize my <b>dream</b>: make a job out of my passions.</p><p>On 2018 I graduated with '100/100 cum laude' from a Technical Industrial Institute (high school) called '<a href='https://en.wikipedia.org/wiki/Ettore_Majorana'>Ettore Majorana</a>' where I attended Computer Science and Telecommunications course, you can find my record on Italy's <a href='http://www.indire.it/eccellenze/ricerca/index.php?action=risultato_specifico&provincia=Enna&database_richiesto=eccellenze_2018'>National Register of Excellence</a> managed by MIUR (Ministry of Education, University and Research). Currently I am a Computer Science university student at <a href='https://www.unict.it/en'>University of Catania</a>, Department of Mathematics and Informatics (DMI), in Sicily (Italy).</p><p>My journey as developer started at 11 year old learning the basics of programming and the language Visual Basic .NET. After that I started experiencing other languages such as C/C++, Java, C#, PHP, Python, JavaScript , SQL for databases, and learning nice stuff like pattern design, useful algorithms, containers and so on. I like to develop desktop application, both console and GUI, but also web app using framework such as Laravel.</p><p>Moreover, recently I got more interested on the System Administrator role: I am managing by myself few production and dev servers, learning every now and then new stuff.</p><p><i>Right now, I consider myself as Junior developer/sysadmin, I am still learning cool stuff every day and stacking up experience but if you need help or something from me don't wait and contact me!</i></p><p>(*) Why <i>LightDestory</i>? During my childhood I used <i>MeteoraPegaso</i> as username to play videogames but once, when I was creating a secondary character on World of Warcraft, I did a typo writing <i><b>LightDestory</b></i> instead of <i>LightDestroy</i>. However I ended up liking this typo-ed username so I am now using it as my official one.</p>",
                "skillInfo": "<p>My aim is to became a software engineer and a full-stack developer. <i>I am still young and I am continuously improving my skills learning new languages and new frameworks</i>.</p><p>I think that charts are unable to express fully the capabilities of a person but they can be used to provide a nice visual component that lists my skills and let you know how much confident I feel with a specific workload.</p>",
                "skillSet": [
                    {
                        "category": "languages",
                        "title": "Programming/Scripting Languages",
                        "collection": [
                            {
                                "name": "AutoIT",
                                "friendlyName": "autoit",
                                "level": 4,
                                "note": "I have mostly used it to develop prototypes of automation such as bots or other stuff that requires a simple/medium interaction.",
                                "icon": "fas fa-cogs"
                            },
                            {
                                "name": "C/C++",
                                "friendlyName": "c_cpp",
                                "level": 8,
                                "icon": "devicon-cplusplus-plain colored"
                            },
                            {
                                "name": "C#",
                                "friendlyName": "csharp",
                                "level": 6,
                                "icon": "devicon-csharp-plain colored"
                            },
                            {
                                "name": "CSS",
                                "friendlyName": "css3",
                                "level": 7,
                                "icon": "devicon-css3-plain-wordmark colored"
                            },
                            {
                                "name": "HTML5",
                                "friendlyName": "html5",
                                "level": 7,
                                "icon": "devicon-html5-plain-wordmark colored"
                            },
                            {
                                "name": "Haskell",
                                "friendlyName": "html5",
                                "level": 5,
                                "icon": "devicon-haskell-plain colored"
                            },
                            {
                                "name": "Java",
                                "friendlyName": "java",
                                "level": 8,
                                "icon": "devicon-java-plain colored",
                                "note": "I started using Java 7-8 and I am now studying the new features of Java 9+"
                            },
                            {
                                "name": "JavaScript",
                                "friendlyName": "js",
                                "level": 6,
                                "note": "For a long time I didn't care about improving my Javascript skill because web development wasn't on my scope but now I am studying Typescript and ES6!",
                                "icon": "devicon-javascript-plain colored"
                            },
                            {
                                "name": "PHP",
                                "friendlyName": "php",
                                "level": 8,
                                "icon": "devicon-php-plain colored"
                            },
                            {
                                "name": "Python",
                                "friendlyName": "py",
                                "level": 4,
                                "note": "Python wasn't on my favourite list, I have always prefered languages such as C++ or Java for programming and PHP for casual scripting. Recently I have got interested in machine learning (read as 'Tensorflow') and AI, so I am learning Python!",
                                "icon": "devicon-python-plain-wordmark colored"
                            },
                            {
                                "name": "Visual Basic .NET (VB 8)",
                                "friendlyName": "vb8",
                                "level": 5,
                                "note": "Nowadays I don't use it anymore but I have still some knowledge of the language.",
                                "icon": "devicon-dot-net-plain-wordmark colored"
                            }
                        ]
                    },
                    {
                        "category": "frameworks",
                        "title": "Frameworks",
                        "collection": [
                            {
                                "name": "Boostrap",
                                "friendlyName": "bshtmlcss",
                                "level": 7,
                                "icon": "devicon-bootstrap-plain-wordmark colored",
                                "note": "I am not a designer but I can create a simple UI with responsive behaviour for my needs."
                            },
                            {
                                "name": "jQuery",
                                "friendlyName": "jquery",
                                "level": 5,
                                "icon": "devicon-jquery-plain-wordmark",
                                "note": "In the past jQuery was my saviour, it gave the chance to someone like me without much experience with JS to develop something without thinking about browser's compatibility. In the present fortunately almost every browser support ES5/ES6 so let's use Javascript vanilla!"
                            },
                            {
                                "name": "Laravel",
                                "friendlyName": "laravel",
                                "level": 8,
                                "note": "I think that nowadays if you start a new PHP project the use of Laravel is a must.",
                                "icon": "devicon-laravel-plain-wordmark colored"
                            },
                            {
                                "name": "React",
                                "friendlyName": "react",
                                "level": 2,
                                "icon": "devicon-react-original-wordmark colored"
                            },
                            {
                                "name": "Vue.js",
                                "friendlyName": "vuejs",
                                "level": 2,
                                "icon": "devicon-vuejs-plain-wordmark colored"
                            },
                            {
                                "name": "Xamarin",
                                "friendlyName": "xamarin",
                                "level": 5,
                                "note": "I have mostly used it for Android development: a.k.a Xamarin.Android.",
                                "icon": "fas fa-mobile-alt"
                            }
                        ]
                    },
                    {
                        "category": "databases",
                        "title": "Databases",
                        "collection": [
                            {
                                "name": "CouchDB",
                                "friendlyName": "couchdb",
                                "level": 4,
                                "icon": "devicon-couchdb-plain colored"
                            },
                            {
                                "name": "MariaDB/MySQL",
                                "friendlyName": "mysql",
                                "level": 8,
                                "icon": "devicon-mysql-plain-wordmark"
                            },
                            {
                                "name": "SQLite",
                                "friendlyName": "sqlite",
                                "level": 8,
                                "icon": "fas fa-database"
                            },
                            {
                                "name": "PostgreSQL",
                                "friendlyName": "postgresql",
                                "level": 5,
                                "icon": "devicon-postgresql-plain-wordmark colored"
                            },
                            {
                                "name": "Redis",
                                "friendlyName": "redis",
                                "level": 4,
                                "icon": "devicon-redis-plain-wordmark colored"
                            }
                        ]
                    },
                    {
                        "category": "os",
                        "title": "Operating Systems",
                        "collection": [
                            {
                                "name": "Android",
                                "friendlyName": "android",
                                "level": 8,
                                "icon": "devicon-android-plain-wordmark colored",
                                "note": "Using Android devices since Android 4.2.2 with a great modding experience thanks to XDA community!"
                            },
                            {
                                "name": "iOS",
                                "friendlyName": "ios",
                                "level": 1,
                                "note": "I don't own any Apple's Mac system and Apple doesn't care giving devtools to non-Mac users",
                                "icon": "devicon-apple-original"
                            },
                            {
                                "name": "Linux (Debian-based)",
                                "friendlyName": "linuxdebian",
                                "level": 8,
                                "icon": "devicon-debian-plain-wordmark colored"
                            },
                            {
                                "name": "Linux (RHEL-based)",
                                "friendlyName": "linuxrhel",
                                "level": 7,
                                "icon": "devicon-redhat-plain-wordmark colored"
                            },
                            {
                                "name": "MacOS",
                                "friendlyName": "macos",
                                "level": 1,
                                "note": "I don't own any Apple's Mac system",
                                "icon": "devicon-apple-original"
                            },
                            {
                                "name": "Windows XP-10 (Pro feat.)",
                                "friendlyName": "winclient",
                                "level": 9,
                                "icon": "devicon-windows8-original colored",
                                "note": "Using Windows operation system since Windows Me to latest Windows 10 Insider Preview!"
                            },
                            {
                                "name": "Windows Server 2008+",
                                "friendlyName": "winserver",
                                "level": 7,
                                "icon": "devicon-windows8-original colored"
                            }
                        ]
                    },
                    {
                        "category": "devtools",
                        "title": "Dev Tools",
                        "collection": [
                            {
                                "name": "Atom",
                                "friendlyName": "atom",
                                "level": 6,
                                "icon": "devicon-atom-original"
                            },
                            {
                                "name": "Gimp",
                                "friendlyName": "gimp colored",
                                "level": 6,
                                "icon": "devicon-gimp-plain"
                            },
                            {
                                "name": "Git",
                                "friendlyName": "git",
                                "level": 8,
                                "icon": "devicon-git-plain colored"
                            },
                            {
                                "name": "JetBrains IDE",
                                "friendlyName": "jetbrains",
                                "level": 8,
                                "icon": "devicon-jetbrains-plain colored",
                                "note": "I use mainly IntelliJ, CLion, PyCharm and Datagrip"
                            },
                            {
                                "name": "Photoshop",
                                "friendlyName": "photoshop",
                                "level": 7,
                                "icon": "devicon-photoshop-plain colored"
                            },
                            {
                                "name": "Visual Studio Code",
                                "friendlyName": "vscode",
                                "level": 8,
                                "icon": "devicon-visualstudio-plain"
                            },
                            {
                                "name": "Visual Studio",
                                "friendlyName": "vs",
                                "level": 7,
                                "icon": "devicon-visualstudio-plain colored"
                            }
                        ]
                    },
                    {
                        "category": "serenv",
                        "title": "Server Setup",
                        "collection": [
                            {
                                "name": "Apache WebServer",
                                "friendlyName": "apachewebserver",
                                "level": 5,
                                "icon": "devicon-apache-line-wordmark"
                            },
                            {
                                "name": "Cloudflare CDN/DNS",
                                "friendlyName": "cloudflare",
                                "level": 8,
                                "icon": "fas fa-cloud"
                            },
                            {
                                "name": "Docker",
                                "friendlyName": "docker",
                                "level": 5,
                                "icon": "devicon-docker-plain-wordmark colored"
                            },
                            {
                                "name": "Nginx",
                                "friendlyName": "nginx",
                                "level": 7,
                                "icon": "devicon-nginx-original colored"
                            }
                        ]
                    }
                ],
                "ethic": "<p>I strongly believe that open-source is one of the most important cause on the IT world. Being able to contribute on any type of open-source project to make nicest software makes us programmers like a very big family.</p><p>An individual is not perfect, no one is able to do everything but if we share our projects makeing them open-source we will get the chance to get help from people that have more experience then us and continue our growth.</p><p>We live in a world that day after day depends more and more on Internet & Software. Nowadays it is unimaginable a scenario without these tools: <i>how many times our daily actions make use of Internet?</i></p><p>I strongly beleive that all the programmers around the world should think twice about the what are they coding and the usage that will be done. We must carry the responsibilities of our own code.</p><p><b>I will never write down code that aims to hurt someone or damage something.</b></p>"
            },
            "projects": {
                "pageTitle": "Alessio Tudisco | Projects",
                "detailTitle": "Alessio Tudisco | Viewing Project",
                "title": "projects",
                "subtitle": "Projects | Contributions",
                "githubUserAPI": "https://api.github.com/users/LightDestory",
                "githubProjectsAPI": "https://api.github.com/users/LightDestory/repos?sort=pushed",
                "placeHolder": "assets/images/projects/placeholder.png",
                "projectDetailTags": { // the element must be called 'collection'
                    "type": "(`This is a <i>${collection.fork ? 'forked' : 'original'}</i> repository`)",
                    "status": "(`It is <i>${collection.archived ? 'currently archived, no longer actively maintained' : 'still alive, an update can be released anytime'}</i>`)",
                    "stars": "collection.stargazers_count > 0 ? `It has <i>${collection.stargazers_count}</i> stars. Give a star if you find it useful!` : 'No stars has been given to the repository. <i>Be the first!</i>'",
                    "language": "collection.language != null ? `It is mainly programmed in <i>${collection.language}</i> <i class='devicon-${String(collection.language).replace('Processing', 'Java').replace('Kotlin', 'Java').replace('/+/g','Plus').replace('#', 'Sharp').toLowerCase()}-plain colored'></i>` : `The repository doesn't contain source code`",
                    "license": "collection.license != null && collection.license.name !='Other' ? `The repository is under <a href='${collection.license.url}'><i>${collection.license.name}</i></a>` : '<i>Custom license or no license has been applied to this repository</i>'",
                    "link": "(`<a href='${collection.html_url}' target='_blank' class='data-detail-button detail-button'>Visit GitHub Page for more details</a>`)"
                }
            },
            "platforms": {
                "pageTitle": "Alessio Tudisco | Platforms",
                "title": "platforms",
                "subtitle": "Socials | Contacts",
                "splash": "assets/images/splashes/platforms.jpg",
                "platformsInfo": "<p>You can find me on different social and gaming platforms. During my childhood I used <i>MeteoraPegaso</i> as username to play games but once, when I was creating a secondary character on World of Warcraft, I did a typo writing <i><b>LightDestory</b></i> instead of <i>LightDestroy</i>. However I ended up liking this typo-ed username so I am now using it as my official one.</p><br><p>Below a list of the main platforms where you can find me.</p>",
                "links": [
                    {
                        "name": "YouTube",
                        "icon": "fab fa-youtube",
                        "note": "Look into my channel, maybe you can find something useful!",
                        "link": "https://www.youtube.com/channel/UCxzI-f2yCW9RPAz_K3swS2Q"
                    },
                    {
                        "name": "GitHub",
                        "icon": "fab fa-github",
                        "note": "Check my GitHub's profile!",
                        "link": "https://github.com/LightDestory"
                    },
                    {
                        "name": "Steam",
                        "icon": "fab fa-steam",
                        "note": "Want to play together? Check my Steam's profile!",
                        "link": "https://steamcommunity.com/id/LightDestory"
                    },
                    {
                        "name": "Discord",
                        "icon": "fab fa-discord",
                        "note": "LightDestory#3083",
                        "link": ""
                    },
                    {
                        "name": "Email",
                        "icon": "fas fa-envelope",
                        "note": "Send me an e-mail!",
                        "link": "mailto:apb231@gmail.com"
                    },
                    {
                        "name": "LinkedIn",
                        "icon": "fab fa-linkedin-in",
                        "note": "Let's discuss on LinkedIn!",
                        "link": "https://www.linkedin.com/in/alessio-tudisco/"
                    },
                    {
                        "name": "Telegram",
                        "icon": "fab fa-telegram-plane",
                        "note": "Chat with me via Telegram!",
                        "link": "https://t.me/lightdestory"
                    },
                    {
                        "name": "Twitter",
                        "icon": "fab fa-twitter",
                        "note": "Hmm... yeah, Twitter!",
                        "link": "https://twitter.com/LightDestory"
                    }
                ]
            },
            "thanks": {
                "pageTitle": "Alessio Tudisco | Thanks",
                "title": "thanks",
                "subtitle": "Powered By | Thanks",
                "splash": "assets/images/splashes/thanks.jpg",
                "poweredBy": [
                    {
                        "name": "Animate On Scroll (AOS)",
                        "friendlyName": "aos",
                        "text": "Stylish animations on scroll, I used a lot of these!",
                        "link": "https://github.com/michalsnik/aos"
                    },
                    {
                        "name": "GreenSock Animation Platform (GSAP)",
                        "friendlyName": "gsap",
                        "text": "A very helpful library to handle animations!",
                        "link": "https://greensock.com/gsap/"
                    },
                    {
                        "name": "Howler.js",
                        "friendlyName": "howlerjs",
                        "text": "Are you listening to the background music? Well, it's its doing!",
                        "link": "https://github.com/goldfire/howler.js"
                    },
                    {
                        "name": "Vanilla Lazyload",
                        "friendlyName": "vanillalazyload",
                        "text": "Don't waste your bandwidth, just load what you need!",
                        "link": "https://github.com/verlok/vanilla-lazyload"
                    },
                    {
                        "name": "Three.js",
                        "friendlyName": "threejs",
                        "text": "Do you like the amazing background animation? Well, Three.js makes webGL easy!",
                        "link": "https://github.com/mrdoob/three.js/"
                    },
                    {
                        "name": "Toastify.js",
                        "friendlyName": "toastifyjs",
                        "text": "Who uses 'alert()' nowadays? You toast them all!",
                        "link": "https://github.com/apvarun/toastify-js"
                    }
                ],
                "thanksForLifeSaving": [
                    {
                        "name": "Matteo Joliveau",
                        "friendlyName": "backgroundmusic",
                        "text": "Anytime I had a doubt regarding Javascript, he explained me new useful stuff!",
                        "link": "https://matteojoliveau.com/"
                    },
                    {
                        "name": "Michael Vignola",
                        "friendlyName": "backgroundmusic",
                        "text": "He composed the fantastic song on background, I hope you are listening to it!",
                        "link": "https://www.youtube.com/watch?v=QS9bI-fjvhQ"
                    },
                    {
                        "name": "Post4VPS",
                        "friendlyName": "post4vps",
                        "text": "This amazing community together with different Hosting providers gives you a chance to get a free VPS!",
                        "link": "https://post4vps.com/"
                    },
                    {
                        "name": "VirMach",
                        "friendlyName": "virmach",
                        "text": "The sponsor of the VPS where my personal portfolio is hosted, 'customer' since 2019~",
                        "link": "https://virmach.com/"
                    }
                ]
            }
        }
    }
}
const Settings = APP.settings;
const Core = APP.core;
const WebGL = APP.webGL;
const Views = APP.views;
const SoundSystem = APP.soundSystem;
const Utils = APP.utils;
const Data = APP.data;