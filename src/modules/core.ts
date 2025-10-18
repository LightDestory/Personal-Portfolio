import { DataInfo, DataWebGL } from "./dataset";
import { Utils, utilsInstance, WEBGL_SUPPORT } from "./utils";
import { soundSystemInstance } from "./soundsystem";
import { viewInstance, Views } from "./views";
import webGLInstance from "./webgl";
import AOS from 'aos';
import LazyLoad, { ILazyLoadInstance } from "vanilla-lazyload";

export default class AppCore {
    static state: string;
    static lazyload: ILazyLoadInstance;
    static isMobile: boolean;
    private hidden: boolean = false;
    private readonly webGLSupport: WEBGL_SUPPORT;

    constructor() {
        AppCore.isMobile = utilsInstance.isMobile();
        this.webGLSupport = utilsInstance.isWebGLSupported();
    }

    /**
     * Say hello to the world. It initializes the app.
     */
    sayHello(): void {
        console.log(`${DataInfo.title} v${DataInfo.version}`);
        AppCore.state = "loading";
        // Setup views and inject HTML templates
        viewInstance.setupViews();
        viewInstance.getView(Views.LOADER_VIEW).show();
        // Check if WebGL is supported
        if (this.webGLSupport === WEBGL_SUPPORT.WEBGL_NOT_SUPPORTED) {
            alert(DataWebGL.upgradeMessage);
            return;
        } else if (this.webGLSupport === WEBGL_SUPPORT.WEBGL_DISABLED) {
            alert(DataWebGL.enableMessage);
            return;
        }
        // AOS init
        AOS.init({ offset: 60, duration: 1000 });
        // init views
        viewInstance.init();
        // init webgl and go to home
        webGLInstance.init();
        // init sound system and start background music
        soundSystemInstance.init(utilsInstance.getCookie("muted"), AppCore.isMobile);
        // init lazyload
        AppCore.lazyload = new LazyLoad();
        // adding visibility event
        this.onTabFocusChange();
        // show music warning
        utilsInstance.showToast("Don't miss the background music!", 3000, Utils.TOAST_INFORMATION);
    }

    /**
     * Disable audio when the tab is not visible
     */
    private onTabFocusChange(): void {
        const _self = this;
        // For modern browsers
        let hidden = "hidden";
        let visibilityChange = "visibilitychange";
        // Check for older browsers
        // @ts-ignore
        if (typeof document['mozHidden'] !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        }
        // @ts-ignore
        else if (typeof document['msHidden'] !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        }
        // @ts-ignore
        else if (typeof document['webkitHidden'] !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(visibilityChange, function () {
            // @ts-ignore
            _self.hidden = !!document[hidden];
            if (_self.hidden && soundSystemInstance.isSoundOn()) {
                soundSystemInstance.muteAll();
            } else if (!_self.hidden && soundSystemInstance.isSoundOn()) {
                soundSystemInstance.unMuteAll();
            }
        }, false);
    }
}