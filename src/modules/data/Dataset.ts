// It is possible to use some Interfaces as types but there are some that aren't applicable... so "any"
const dataset: any = {
    "information": {
        "title": "LightDestory's Personal Portfolio",
        "version": "0.2"
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
                            "level": 8,
                            "icon": "devicon-html5-plain-wordmark colored"
                        },
                        {
                            "name": "Haskell",
                            "friendlyName": "html5",
                            "level": 5,
                            "icon": "devicon-haskell-plain colored"
                        },
                        {
                            "name": "Kotlin",
                            "friendlyName": "kotlin",
                            "level": 8,
                            "icon": "devicon-kotlin-plain colored"
                        },
                        {
                            "name": "Java",
                            "friendlyName": "java",
                            "level": 8,
                            "icon": "devicon-java-plain colored",
                            "note": "I started using Java 7-8 and I am now studying the new features of Java 9+"
                        },
                        {
                            "name": "JavaScript/TypeScript",
                            "friendlyName": "js",
                            "level": 8,
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
                            "level": 5,
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
                            "name": "Angular",
                            "friendlyName": "angular",
                            "level": 7,
                            "icon": "devicon-angularjs-plain colored",
                            "note": "Experimenting with Angular :)"
                        },
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
                            "name": "MongoDB",
                            "friendlyName": "mongodb",
                            "level": 7,
                            "icon": "devicon-mongodb-plain-wordmark colored"
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
                            "name": "Caddy WebServer",
                            "friendlyName": "caddy",
                            "level": 5,
                            "icon": "fas fa-lock"
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
                    "text": "Stylish animations on scroll, I used a lot of these!",
                    "link": "https://github.com/michalsnik/aos"
                },
                {
                    "name": "GreenSock Animation Platform (GSAP)",
                    "text": "A very helpful library to handle animations!",
                    "link": "https://greensock.com/gsap/"
                },
                {
                    "name": "Howler.js",
                    "text": "Are you listening to the background music? Well, it's its doing!",
                    "link": "https://github.com/goldfire/howler.js"
                },
                {
                    "name": "Vanilla Lazyload",
                    "text": "Don't waste your bandwidth, just load what you need!",
                    "link": "https://github.com/verlok/vanilla-lazyload"
                },
                {
                    "name": "Three.js",
                    "text": "Do you like the amazing background animation? Well, Three.js makes webGL easy!",
                    "link": "https://github.com/mrdoob/three.js/"
                },
                {
                    "name": "Toastify.js",
                    "text": "Who uses 'alert()' nowadays? You toast them all!",
                    "link": "https://github.com/apvarun/toastify-js"
                }
            ],
            "thanksForLifeSaving": [
                {
                    "name": "Matteo Joliveau",
                    "text": "Anytime I had a doubt regarding Javascript, he explained me new useful stuff!",
                    "link": "https://matteojoliveau.com/"
                },
                {
                    "name": "Michael Vignola",
                    "text": "He composed the fantastic song on background, I hope you are listening to it!",
                    "link": "https://www.youtube.com/watch?v=QS9bI-fjvhQ"
                }
            ]
        }
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
            "file": "assets/sounds/Beep.ogg",
            "name": "click",
            "loop": false,
            "autoplay": false,
            "volume": 1.0
        }
    ]
}
const DataInfo = dataset.information;
const DataSound = dataset.sounds;
const DataWebGL = dataset.webGL;
const DataView = dataset.views;
export {DataInfo, DataSound, DataWebGL, DataView};