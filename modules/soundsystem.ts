import {Howl, Howler} from 'howler';
import {utilsInstance} from "./utils";
import {DataSound} from "./dataset";

interface soundFile {
    readonly file: string,
    readonly name: string,
    readonly loop: boolean,
    readonly autoplay: boolean,
    readonly volume: number
}
class soundSystem {
    /* Settings */
    private soundSystemData: soundFile[];
    private loadedSounds: { [name: string] : Howl } = {};
    private muteDelay: ReturnType<typeof setTimeout> = null;
    private soundOn: boolean = false;
    constructor() {
        this.soundSystemData = DataSound;
    }
    /* init system */
    init(mutedCookie: string, isMobile: boolean): void {
        console.log("init sound system");
        Howler.mute(true);
        this.loadSounds();
        if (mutedCookie === "0") {
            this.soundOn = true;
            this.unMuteAll();
        }
        this.enableSoundControls();
        if (!isMobile) {
            this.enableMouseOverAnimation();
        }
    }
    /* load sounds */
    private loadSounds(): void {
        this.soundSystemData.forEach(s => {
            this.loadedSounds[s.name] = new Howl({
                src: s.file,
                loop: s.loop,
                volume: s.volume,
                name: s.name,
                autoplay: s.autoplay
            });
        });
    }
    /* mute control */
    muteAll(): void{
        console.log("mute all");
        this.toggleAnimation();
        this.loadedSounds['ambient'].fade(1, 0, 1000);
        this.muteDelay = setTimeout(function () {
            Howler.mute(true);
        }, 1500);
    }
    /* unmute control */
    unMuteAll(): void {
        console.log("unMute all");
        this.toggleAnimation();
        clearTimeout(this.muteDelay);
        Howler.mute(false);
        this.loadedSounds['ambient'].fade(0, 1, 1000);
    }
    /* toggle the sound-bars animation */
    private toggleAnimation(): void {
        document.querySelectorAll(".sbar").forEach(element => element.classList.toggle("noAnim"));
        const icon = document.querySelector("#sound-icon").classList;
        if (this.soundOn) {
            icon.add("fa-volume-up");
            icon.remove("fa-volume-mute");
        } else {
            icon.remove("fa-volume-up");
            icon.add("fa-volume-mute");
        }
    }
    isSoundOn(): boolean {
        return this.soundOn;
    }
    /* enable Mouse on Over animation on the controls icon*/
    private enableMouseOverAnimation(): void {
        document.querySelector(".sound-controls").addEventListener("mouseover", () => {
            const icon = document.querySelector("#sound-icon").classList;
            if (this.soundOn) {
                icon.remove("fa-volume-up");
                icon.add("fa-volume-mute");
            } else {
                icon.add("fa-volume-up");
                icon.remove("fa-volume-mute");
            }
        });
        document.querySelector(".sound-controls").addEventListener("mouseout", () => {
            const icon = document.querySelector("#sound-icon").classList;
            if (!this.soundOn) {
                icon.remove("fa-volume-up");
                icon.add("fa-volume-mute");
            } else {
                icon.add("fa-volume-up");
                icon.remove("fa-volume-mute");
            }
        });
    }
    /* enable sound controls such as mute and unmute */
    private enableSoundControls(): void {
        document.querySelector(".sound-controls").addEventListener("click", () => {
            this.playClick();
            if (this.soundOn) {
                this.soundOn = false;
                this.muteAll();
                utilsInstance.setCookie("muted", 1, 1);
            } else {
                this.soundOn = true;
                this.unMuteAll();
                utilsInstance.setCookie("muted", 0, 1);
            }
        });
    }
    public playClick(): void {
        this.loadedSounds['click'].play();
    }
}
const soundSystemInstance: soundSystem = new soundSystem();
export {soundFile, soundSystemInstance}