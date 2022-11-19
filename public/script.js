class ThemeSwitch extends HTMLElement {
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
    get theme() {
        return this.getAttribute('theme') || this.mid;
    }

    set theme(theme) {
        this.setAttribute('theme', theme);
    }

    static get observedAttributes() {
        return [
            'left', 
            'mid',
            'right',
            'theme'
        ];
    }

    chk = "mid"

    // attributeChangedCallback(name, oldVal, newVal) {
    //     this.render();
    //     let radiusInput = this.shadow.querySelector('#radius');
    //     let colorInput = this.shadow.querySelector('#color');
    //     radiusInput.addEventListener('change', this.changeRadius.bind(this));
    //     colorInput.addEventListener('change', this.changeColor.bind(this));
    // }

    connectedCallback() {
        const savedTheme = window.localStorage.getItem("theme");
		if (savedTheme) {
			this.setTheme(savedTheme, this);
		}
        this.render();
        
        // this.shadowRoot.addEventListener('click', this.onClick)
    }

    setTheme(theme, $this) {
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

        // Store theme
        window.localStorage.setItem("theme", theme);

        $this.theme = theme;
        console.log("🚀 ~ file: script.js ~ line 57 ~ ThemeSwitch ~ setTheme ~ $this.theme", $this.theme)
        // $this.render();
    }

    onClick(e,$this) {
        console.log('this',$this.left);

		const el = e.target;
		if (el.checked) {
            console.log('value',el.value);
			$this.setTheme(el.value, $this);
		}
		$this.dispatchEvent(
			new CustomEvent("theme-switch", {
				detail: {
					theme: this.theme,
				},
			})
		);
	}

    /**
     * Runs when the value of an attribute is changed on the component
     * @param  {String} name     The attribute name
     * @param  {String} oldValue The old attribute value
     * @param  {String} newValue The new attribute value
     */
    attributeChangedCallback (name, oldValue, newValue) {
        console.log('changed', name, oldValue, newValue, this);
        this.render()
    }

    render() {
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
        const wrapper = this.shadow.querySelector('.wrapper')
        console.log("🚀 ~ file: script.js ~ line 40 ~ ThemeSwitch ~ connectedCallback ~ wrapper", wrapper)
        if (wrapper) {
            wrapper.addEventListener('click', e => this.onClick(e,this))
        }
    }

    
}
customElements.define('theme-switch', ThemeSwitch);