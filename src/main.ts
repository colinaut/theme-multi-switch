export default class ThemeSwitch extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	private getA(attr: string, fallback: string = ""): string {
		return this.getAttribute(attr) || fallback;
	}

	get left() {
		return this.getA("left", "light");
	}
	get mid() {
		return this.getA("mid", "auto");
	}
	get right() {
		return this.getA("right", "dark");
	}
	get metaLeft() {
		return this.getA("meta-left");
	}
	get metaMid() {
		return this.getA("meta-mid");
	}
	get metaRight() {
		return this.getA("meta-right");
	}
	get theme() {
		return this.getA("theme") || this.mid;
	}

	set theme(theme) {
		this.setAttribute("theme", theme);
	}

	static get observedAttributes(): string[] {
		return ["left", "mid", "right", "theme", "meta-left", "meta-mid", "meta-right"];
	}

	private active = "mid";

	public connectedCallback(): void {
		const savedTheme = window.localStorage.getItem("theme");
		if (savedTheme) {
			this.setTheme(this, savedTheme);
		}
		this.render();
		this.addEventListeners();
		document.addEventListener("theme-switch", (event) => {
			if (this.theme !== (<CustomEvent>event).detail) this.setTheme(this, (<CustomEvent>event).detail);
		});
	}

	private addEventListeners(): void {
		this.shadow.addEventListener(
			"click",
			(event) => {
				this.eventListeners(this, event);
			},
			false
		);
	}

	private eventListeners($this: ThemeSwitch, e: Event): void {
		const el = e.target as HTMLInputElement;
		if (el?.checked) {
			$this.setTheme($this, el.value);
		}
		$this.dispatchEvent(
			new CustomEvent("theme-switch", {
				detail: this.theme,
				bubbles: true,
				cancelable: true,
				composed: true,
			})
		);
	}

	private setTheme($this: ThemeSwitch, theme: string): void {
		const html = document.querySelector("html");

		// Set data-theme on html element
		if (html) {
			html.setAttribute("data-theme", theme);
		}

		// Default theme is mid
		let active = "mid";
		let color = $this.metaMid;

		// Switch if otherwise
		if (theme === $this.left) {
			active = "left";
			color = $this.metaLeft;
		}
		if (theme === $this.right) {
			active = "right";
			color = $this.metaRight;
		}

		// Set meta theme-color if available
		const metaThemeColor = document.querySelector("meta[name='theme-color']");
		if (metaThemeColor && color) {
			console.log(color);
			metaThemeColor.setAttribute("content", color);
		}

		// Store theme
		window.localStorage.setItem("theme", theme);

		console.log(active, theme);

		// set active and theme
		$this.active = active;
		$this.theme = theme;
	}

	public attributeChangedCallback() {
		// console.log("changed", name, oldValue, newValue);
		this.render();
	}

	private render() {
		this.shadow.innerHTML = `
        <!-- css-->
        <style>
            .wrap {
                position: relative;
                display: inline-flex;
                gap: 0.3em;
                align-items: end;
            }
            .side {
                height: 1.2em;
            }
            .mid {
                position: relative;
                padding-top: 1em;
            }
            label {
                cursor: pointer;
                line-height: 1;
                height: 100%;
                display: flex;
                align-items: center;
                font-weight: 700;
                font-size: 0.8em;
            }
            .track span {
                width: 0.8em;
                flex-shrink: 0;
                bottom: 0px;
                position: relative;
            }
            input {
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                width: 100%;
                height: 100%;
                cursor: pointer;
                opacity: 0;
            }
            .mid label {
                display: block;
                position: absolute;
                width: 100%;
                top: 0px;
                text-align: center;
            }
            .knob {
                left: 50%;
                transform: translateX(-50%);
                position: absolute;
                top: 0em;
                background: var(--theme-switch-knob, currentColor);
                transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                width: 1em;
                height: 1em;
                border-radius: 0.1em;
            }
            .track {
                background: var(--theme-switch-track, #88888822);
                height: 1em;
                border: 0.1em solid var(--theme-switch-track-border, currentColor);
                border-radius: 0.2em;
                padding: 0 0.1em;
                position: relative;
                grid-area: switch;
                width: 2.4em;
                display: flex;
            }
            [data-active="left"] .knob {
                left: 0;
                transform: translateX(0%);
            }
            [data-active="right"] .knob {
                left: 100%;
                transform: translateX(-100%);
            }
            [data-active="left"] [part="left"],
            [data-active="mid"] [part="mid"],
            [data-active="right"] [part="right"] {
                color: var(--theme-switch-highlight, inherit);
            }
        </style>
        <!-- html -->
        <div class="wrap" data-active=${this.active}>
            <div class="side">
                <label title="${this.left}" for="left" part="left">
                    <slot name="left">${this.left}</slot>
                </label>
            </div>
            <div class="mid">
                <label title="${this.mid}" for="mid" part="mid">
                    <slot name="mid">${this.mid}</slot>
                </label>
                <div class="track" part="track">
                    <span><input value=${this.left} type="radio" name="theme" id="left" ?checked=${this.active === "left"} aria-label="${this.left} theme" /></span>
                    <span><input value=${this.mid} type="radio" name="theme" id="mid" ?checked=${this.active === "mid"} aria-label="${this.mid} theme" /></span>
                    <span><input value=${this.right} type="radio" name="theme" id="right" ?checked=${this.active === "right"} aria-label="${this.right} theme" /></span>
                    <div class="knob" part="knob"></div>
                </div>
            </div>
            <div class="side">
                <label title="${this.right}" for="right" part="right">
                    <slot name="right">${this.right}</slot>
                </label>
            </div>
        </div>
    `;
	}
}
customElements.define("theme-switch", ThemeSwitch);
