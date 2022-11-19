export default class ThemeSwitch extends HTMLElement {

    private shadow: ShadowRoot

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    get left() {
        return this.getAttribute('left') || 'light';
    }
    get mid() {
        return this.getAttribute('mid') || 'auto';
    }
    get right() {
        return this.getAttribute('right') || 'dark';
    }
    get left_meta() {
        return this.getAttribute('left_meta') || '';
    }
    get mid_meta() {
        return this.getAttribute('mid_meta') || '';
    }
    get right_meta() {
        return this.getAttribute('right_meta') || '';
    }
    get theme() {
        return this.getAttribute('theme') || this.mid;
    }

    set theme(theme) {
        this.setAttribute('theme', theme);
    }

    static get observedAttributes(): string[] {
        return [
            'left', 
            'mid',
            'right',
            'theme'
        ];
    }

    private chk = "mid"

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
          'click',
          event => {
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
        if (html) {
            html.setAttribute("data-theme", theme);
        }
        // Set the knob position
        if (theme === $this.left) {
            $this.chk = "left";
        }
        if (theme === $this.mid) $this.chk = "mid";
        if (theme === $this.right) $this.chk = "right";

        // Set browser meta theme-color
		let metaThemeColor = document.querySelector("meta[name='theme-color']");
		console.log("🚀 ~ file: main.ts ~ line 98 ~ ThemeSwitch ~ setTheme ~ metaThemeColor", metaThemeColor)
		if (metaThemeColor) {
			let color = $this.mid_meta;
			if (theme === $this.left) color = $this.left_meta;
			if (theme === $this.right) color = $this.right_meta;
			if (color) metaThemeColor.setAttribute("content", color);
		}

        // Store theme
        window.localStorage.setItem("theme", theme);

        $this.theme = theme;
    }

    public attributeChangedCallback (name: string, oldValue: string, newValue: string) {
        console.log('changed', name, oldValue, newValue);
        this.render();
    }

    private render() {
        this.shadow.innerHTML = `
        <style>
        .wrapper {
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
			background: var(--theme-switch-knob, #999);
			transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
			width: 1em;
			height: 1em;
			border-radius: 0.1em;
		}
		.track {
			background: var(--theme-switch-track, #88888822);
			height: 1em;
			border: 0.1em solid var(--theme-switch-border, #888);
			border-radius: 0.2em;
			padding: 0 0.1em;
			position: relative;
			grid-area: switch;
			width: 2.4em;
			display: flex;
		}
		[data-chk="left"] .knob {
			left: 0;
			transform: translateX(0%);
		}
		[data-chk="right"] .knob {
			left: 100%;
			transform: translateX(-100%);
		}
		[data-chk="left"] [part="left"] {
			color: var(--theme-switch-highlight, inherit);
		}
		[data-chk="mid"] [part="mid"] {
			color: var(--theme-switch-highlight, inherit);
		}
		[data-chk="right"] [part="right"] {
			color: var(--theme-switch-highlight, inherit);
		}
        </style>
        <div class="wrapper" data-chk=${this.chk}>
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
                <span><input value=${this.left} type="radio" name="theme" id="left" ?checked=${this.chk === "left"} aria-label="${this.left} theme" /></span>
                <span><input value=${this.mid} type="radio" name="theme" id="mid" ?checked=${this.chk === "mid"} aria-label="${this.mid} theme" /></span>
                <span><input value=${this.right} type="radio" name="theme" id="right" ?checked=${this.chk === "right"} aria-label="${this.right} theme" /></span>
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
customElements.define('theme-switch', ThemeSwitch);