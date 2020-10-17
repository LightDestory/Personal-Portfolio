import {DataInfo, DataWebGL} from "./dataset";
import {Utils, utilsInstance} from "./utils";
import {soundSystemInstance} from "./soundsystem";
import {Views, viewInstance} from "./views";
import webGLInstance from "./webgl";
import AOS from 'aos';
import 'aos/dist/aos.css';
import LazyLoad, {ILazyLoadInstance} from "vanilla-lazyload";

export default class AppCore {
    static state: string;
    static lazyload: ILazyLoadInstance;
    static isMobile: boolean;
    private hidden: boolean = false;
    private readonly webGLSupport: number;

    constructor() {
        AppCore.isMobile = utilsInstance.isMobile();
        this.webGLSupport = utilsInstance.isWebGLSupported();
    }

    // let's start!
    sayHello(): void {
        console.log(`${DataInfo.title} v${DataInfo.version}`);
        AppCore.state = "loading";
        viewInstance.getView(Views.LOADER_VIEW).show();
        // get device specs and capabilities
        // WebGL compatibility
        if (this.webGLSupport === -1) {
            //WebGL is not supported
            alert(DataWebGL.upgradeMessage);
            return;
        } else if (this.webGLSupport === 0) {
            //WebGL is supported, but disabled
            alert(DataWebGL.enableMessage);
            return;
        }
        // AOS init
        AOS.init({offset: 60, duration: 1000});
        // init the webgl and views
        viewInstance.init();
        webGLInstance.init();
        // init sound system and start background music
        soundSystemInstance.init(utilsInstance.getCookie("muted"), AppCore.isMobile);
        // init lazyload
        AppCore.lazyload = new LazyLoad();
        // adding visibility event
        this.enableVisibilityEvent();
        // show music warning
        utilsInstance.showToast("Don't miss the background music!", 3000, Utils.TOAST_INFORMATION);
    }

    // visibility change based on window.hidden
    private enableVisibilityEvent(): void {
        const _self = this;
        let hidden: string, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        }
        if (typeof document['mozHidden'] !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        }
        if (typeof document['msHidden'] !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        }
        if (typeof document['webkitHidden'] !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(visibilityChange, function () {
            _self.hidden = !!document[hidden];
            if (_self.hidden && soundSystemInstance.isSoundOn()) {
                soundSystemInstance.muteAll();
            } else if (!_self.hidden && soundSystemInstance.isSoundOn()) {
                soundSystemInstance.unMuteAll();
            }
        }, false);
    }
}