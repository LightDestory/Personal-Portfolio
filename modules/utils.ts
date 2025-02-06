import Toastify from 'toastify-js'

enum WEBGL_SUPPORT {
    WEBGL_NOT_SUPPORTED,
    WEBGL_DISABLED,
    WEBGL_SUPPORTED
}

class Utils {
    static readonly TOAST_INFORMATION: string = 'info';
    static readonly TOAST_ERROR: string = "error";
    private readonly toastTypes: { [key: string]: string } = {
        info: "radial-gradient(#0c304c, #060C1A)",
        error: "radial-gradient(#FF0000, #000000)"
    }

    constructor() {}

    /**
     * Show a toast message
     * @param text The message to display
     * @param duration The duration of the toast in ms
     * @param type The type of the toast (info, error)
     */
    showToast(text: string, duration: number, type: string): void {
        Toastify({
            text: text,
            duration: duration,
            gravity: "top",
            position: 'center',
            style: {
                background: this.toastTypes[type]
            }
        }).showToast();
    }

    /**
     * Detect if the user is using a mobile device based on the user agent string
     * @returns True if the user is using a mobile device
     */
    isMobile(): boolean {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substring(0, 4));
    }

    /**
     * Check if WebGL is supported by the browser and enabled
     * @returns The WebGL support status
     */
    isWebGLSupported(): WEBGL_SUPPORT {
        if (!!window.WebGLRenderingContext) {
            let canvas = document.createElement("canvas"),
                names = ["webgl2", "webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context: any = null;
            for (const name of names) {
                try {
                    context = canvas.getContext(name);
                    if (context && typeof context.getParameter == "function") {
                        return WEBGL_SUPPORT.WEBGL_SUPPORTED;
                    }
                } catch (e) {
                }
            }
            return WEBGL_SUPPORT.WEBGL_DISABLED;
        }
        return WEBGL_SUPPORT.WEBGL_NOT_SUPPORTED;
    }

    /**
     * Set a cookie with a name, value and expiration date
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param expire_days The expiration date of the cookie in days
     */
    setCookie(name: string, value: string | number, expire_days: number) : void {
        const d: Date = new Date();
        d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        const expires: string = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    /**
     * Get a cookie by name
     * @param name The name of the cookie to get
     * @returns The value of the cookie or "NotFound" if the cookie is not found
     */
    getCookie(name: string): string {
        name = `${name}=`;
        const cookie_collector: string[] = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < cookie_collector.length; i++) {
            let c: string = cookie_collector[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        // No cookie found
        return "NotFound";
    }
}

const utilsInstance: Utils = new Utils();
export {Utils, utilsInstance, WEBGL_SUPPORT}