export default class ThemeSwitch extends HTMLElement {
	private shadow: ShadowRoot;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	private getA(attr: string, fallback: string = ""): string {
		return this.getAttribute(attr) || fallback;
	}

	private getArray(attr: string, fallback: string[] = []): string[] {
		const temp = this.getA(attr, "");
		if (!temp) return fallback;

		let tempArray: string[] = [];
		try {
			// check to see if this is a JSON string
			tempArray = JSON.parse(temp);
		} catch (err) {
			// check to see if this a comma separated string
			tempArray = temp.split(",");
		}
		if (Array.isArray(tempArray)) {
			return tempArray;
		} else return fallback;
	}

	get layout(): string {
		return this.getA("layout", "around top");
	}
	get themes(): string[] {
		return this.getArray("themes", ["light", "auto", "dark"]);
	}
	get meta(): string[] {
		return this.getArray("meta-colors", []);
	}
	get theme() {
		return this.getA("theme") || this.themes[1];
	}
	set theme(theme) {
		this.setAttribute("theme", theme);
	}

	static get observedAttributes(): string[] {
		return ["themes", "theme", "meta-colors", "knob-width", "layout"];
	}

	public connectedCallback(): void {
		const savedTheme = window.localStorage.getItem("theme");
		if (savedTheme) {
			const active = this.themes.indexOf(savedTheme);
			if (active >= 0) {
				this.theme = savedTheme;
			}
		}

		this.render();
		this.addEventListeners();
	}

	private addEventListeners(): void {
		this.shadow.addEventListener(
			"click",
			(event) => {
				const el = event.target as HTMLInputElement;
				if (el?.checked && el.value !== this.theme) {
					this.theme = el.value;
				}
			},
			false
		);

		// Event Listener for "theme-switch" custom event
		document.addEventListener("theme-switch", (event) => {
			const theme = (<CustomEvent>event).detail;
			// only trigger if theme exists and is not active
			if (theme && theme !== this.theme && this.themes.includes(theme)) {
				// console.log("theme-switch event received", theme);
				this.theme = theme;
			}
		});
	}

	private setTheme($this: ThemeSwitch, theme: string): void {
		const active = $this.themes.indexOf(theme);

		// Only run if theme exists
		if (active > -1) {
			const html = document.querySelector("html");
			const metaThemeColor = document.querySelector("meta[name='theme-color']");
			let metaColor = $this.meta[active];

			// Set data-theme on html element
			if (html) {
				html.setAttribute("data-theme", theme);
			}

			// Set meta theme-color if available
			if (metaThemeColor && metaColor) {
				if (metaColor === "auto") {
					const light = $this.themes.indexOf("light");
					const dark = $this.themes.indexOf("dark");
					if (window.matchMedia("(prefers-color-scheme: dark)").matches && dark > -1) {
						metaColor = $this.meta[dark];
					} else if (window.matchMedia("(prefers-color-scheme: light)").matches && light > -1) {
						metaColor = $this.meta[light];
					}
				}
				metaThemeColor.setAttribute("content", metaColor);
			}

			// Store theme
			window.localStorage.setItem("theme", theme);

			// dispatch event
			this.dispatchEvent(
				new CustomEvent("theme-switch", {
					detail: theme,
					bubbles: true,
					cancelable: true,
					composed: true,
				})
			);
		}
	}

	public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		// console.log("changed", name, oldValue, newValue);

		// only run if value for theme has changed
		if (name === "theme" && newValue !== oldValue) {
			this.setTheme(this, newValue);
		}

		this.render();
	}

	private render() {
		const themes = this.themes;

		const cssLabelHighlight = themes.map((theme) => `[data-active="${theme}"] [part="${theme}"]`).join(",") + `{color: var(--theme-switch-highlight, inherit)}`;

		const cssKnobs = themes
			.map((theme, i) => `[data-active="${theme}"] .knob { left: ${(i / (themes.length - 1)) * 100}%; transform: translateX(-${(i / (themes.length - 1)) * 100}%); }`)
			.join("");

		let cssMidPadding = "1em 0 0";

		let cssMidLabelPosition = "top: 0px;";

		if (this.layout.includes("bottom")) {
			cssMidPadding = "0 0 1em";
			cssMidLabelPosition = "bottom: 0px;";
		}
		if (this.themes.length < 3 && this.layout.includes("around")) {
			cssMidPadding = "0";
		}
		const css = `
        <style>
            .wrap {
                position: relative;
                display: inline-flex;
                gap: 0.3em;
                align-items: end;
            }
            .side {
                height: 1.2em;
                padding: ${cssMidPadding};
            }
            .mid {
                position: relative;
                padding: ${cssMidPadding};
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
            .mid .labels {
                display: flex;
                position: absolute;
                width: 100%;
                ${cssMidLabelPosition}
                text-align: center;
            }
            .mid label {
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .track {
                background: var(--theme-switch-track, #88888822);
                height: 1em;
                border: 0.1em solid var(--theme-switch-track-border, currentColor);
                border-radius: 0.2em;
                padding: 0 0.1em;
                position: relative;
                grid-area: switch;
                display: flex;
            }
            .track span {
                width: calc(var(--theme-switch-knob-width, 1) * .9em);
                flex-shrink: 0;
                bottom: 0px;
                position: relative;
            }
            .knob {
                left: 50%;
                transform: translateX(-50%);
                position: absolute;
                top: 0em;
                background: var(--theme-switch-knob, currentColor);
                transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                width: calc(var(--theme-switch-knob-width, 1) * 1em);
                height: 1em;
                border-radius: 0.1em;
            }
            ${cssKnobs}
            ${cssLabelHighlight}
        </style>
        `;

		let labels = themes.map((theme) => `<label title="${theme}" for="${theme}" part="${theme}"><slot name="${theme}">${theme}</slot></label>`);

		const radios = themes.map(
			(theme) => `<span><input value=${theme} type="radio" name="theme" id="${theme}" ?checked=${this.theme === theme} aria-label="${theme} theme" /></span>`
		);

		let side = ["", ""];

		if (this.layout.includes("around")) {
			side[0] = `<div class="side">${labels[0]}</div>`;
			side[1] = `<div class="side">${labels[this.themes.length - 1]}</div>`;
			// remove first and last labels
			labels.pop();
			labels.shift();
		}

		let html = `
        <div class="wrap" data-active=${this.theme}>
            ${side[0]}
            <div class="mid"><div class="labels">${labels.join("")}</div>
                <div class="track" part="track">
                    ${radios.join("")}
                    <div class="knob" part="knob"></div>
                </div>
            </div>
            ${side[1]}
        </div>
        `;

		this.shadow.innerHTML = `${css}${html}`;
	}
}
customElements.define("theme-switch", ThemeSwitch);
