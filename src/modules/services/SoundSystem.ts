import { Howl, Howler } from 'howler';
import { utilsInstance } from "./Utils";
import { DataSound } from "../data/Dataset";

/**
 * Type for sound file
 * @interface soundFile
 * @property {string} file - The file path
 * @property {string} name - The name of the sound to be used in the system
 * @property {boolean} loop - True if the sound should loop
 * @property {boolean} autoplay - True if the sound should autoplay
 * @property {number} volume - The volume of the sound between 0 and 1
 */
interface soundFile {
    readonly file: string,
    readonly name: string,
    readonly loop: boolean,
    readonly autoplay: boolean,
    readonly volume: number
}

class soundSystem {
    private loadedSounds: { [name: string]: Howl } = {};
    private muteDelay: ReturnType<typeof setTimeout> = -1;
    private soundOn: boolean = false;
    private soundIcon: HTMLElement | null = null
    private soundControls: HTMLElement | null = null;

    constructor() { }

    /**
     * Initialize the sound system
     * @param mutedCookie The value of the muted cookie
     * @param isMobile True if the device is mobile
     */
    init(mutedCookie: string, isMobile: boolean): void {
        console.log("init sound system");
        this.soundIcon = document.querySelector("#sound-icon");
        this.soundControls = document.querySelector(".sound-controls");
        Howler.mute(true);
        this.loadSoundData();
        if (mutedCookie === "0") {
            this.unMuteAll();
        }
        this.enableSoundControls();
        if (!isMobile) {
            this.enableMouseOverAnimation();
        }
    }

    /**
     * Load all sounds into the system
     */
    private loadSoundData(): void {
        (DataSound as soundFile[]).forEach(s => {
            this.loadedSounds[s.name] = new Howl({
                src: s.file,
                loop: s.loop,
                volume: s.volume,
                autoplay: s.autoplay
            });
        });
    }

    /**
     * Disable all sound sources. It fades out the ambient sound and then mutes all sounds
     */
    muteAll(): void {
        console.log("mute all");
        this.soundOn = false;
        this.toggleAnimation();
        this.loadedSounds['ambient'].fade(1, 0, 1000);
        this.muteDelay = setTimeout(function () {
            Howler.mute(true);
        }, 1500);
    }

    /**
     * Unmute all sounds sources. It fades in the ambient sound and then unmutes all sounds
     */
    unMuteAll(): void {
        console.log("unMute all");
        this.soundOn = true;
        this.toggleAnimation();
        clearTimeout(this.muteDelay);
        Howler.mute(false);
        this.loadedSounds['ambient'].fade(0, 1, 1000);
    }

    /**
     * Toggle the animation of the sound system
     */
    private toggleAnimation(): void {
        document.querySelectorAll(".sbar").forEach(element => element.classList.toggle("noAnim"));
        const icon_classes = this.soundIcon!!.classList;
        if (this.soundOn) {
            icon_classes.add("fa-volume-up");
            icon_classes.remove("fa-volume-mute");
        } else {
            icon_classes.remove("fa-volume-up");
            icon_classes.add("fa-volume-mute");
        }
    }

    /**
     * Check if the sound is currently on
     * @returns {boolean} True if the sound is on
     */
    isSoundOn(): boolean {
        return this.soundOn;
    }

    /**
     * Enable the mouse over animation for the sound controls, only for desktop
     */
    private enableMouseOverAnimation(): void {
        this.soundControls!!.addEventListener("mouseover", () => {
            const icon_classes = this.soundIcon!!.classList;
            if (this.soundOn) {
                icon_classes.remove("fa-volume-up");
                icon_classes.add("fa-volume-mute");
            } else {
                icon_classes.add("fa-volume-up");
                icon_classes.remove("fa-volume-mute");
            }
        });
        this.soundControls!!.addEventListener("mouseout", () => {
            const icon_classes = this.soundIcon!!.classList;
            if (!this.soundOn) {
                icon_classes.remove("fa-volume-up");
                icon_classes.add("fa-volume-mute");
            } else {
                icon_classes.add("fa-volume-up");
                icon_classes.remove("fa-volume-mute");
            }
        });
    }

    /**
     * Set the event listener for the sound controls
     */
    private enableSoundControls(): void {
        this.soundControls!!.addEventListener("click", () => {
            this.playClick();
            if (this.soundOn) {
                this.muteAll();
                utilsInstance.setCookie("muted", 1, 7);
            } else {
                this.unMuteAll();
                utilsInstance.setCookie("muted", 0, 7);
            }
        });
    }

    /**
     * Play the click sound
     */
    public playClick(): void {
        this.loadedSounds['click'].play();
    }
}

const soundSystemInstance: soundSystem = new soundSystem();
export { soundFile, soundSystemInstance }