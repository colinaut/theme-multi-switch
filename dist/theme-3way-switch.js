var o=Object.defineProperty;var n=(r,i,t)=>i in r?o(r,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[i]=t;var l=(r,i,t)=>(n(r,typeof i!="symbol"?i+"":i,t),t);class m extends HTMLElement{constructor(){super();l(this,"shadow");l(this,"active","mid");this.shadow=this.attachShadow({mode:"open"})}getA(t,e=""){return this.getAttribute(t)||e}get left(){return this.getA("left","light")}get mid(){return this.getA("mid","auto")}get right(){return this.getA("right","dark")}get metaLeft(){return this.getA("meta-left")}get metaMid(){return this.getA("meta-mid")}get metaRight(){return this.getA("meta-right")}get theme(){return this.getA("theme")||this.mid}set theme(t){this.setAttribute("theme",t)}static get observedAttributes(){return["left","mid","right","theme","meta-left","meta-mid","meta-right"]}connectedCallback(){const t=window.localStorage.getItem("theme");t&&this.setTheme(this,t),this.render(),this.addEventListeners(),document.addEventListener("theme-switch",e=>{this.theme!==e.detail&&this.setTheme(this,e.detail)})}addEventListeners(){this.shadow.addEventListener("click",t=>{this.eventListeners(this,t)},!1)}eventListeners(t,e){const a=e.target;a!=null&&a.checked&&t.setTheme(t,a.value),t.dispatchEvent(new CustomEvent("theme-switch",{detail:this.theme,bubbles:!0,cancelable:!0,composed:!0}))}setTheme(t,e){const a=document.querySelector("html");a&&a.setAttribute("data-theme",e);let h="mid",s=t.metaMid;e===t.left&&(h="left",s=t.metaLeft),e===t.right&&(h="right",s=t.metaRight);const d=document.querySelector("meta[name='theme-color']");d&&s&&(console.log(s),d.setAttribute("content",s)),window.localStorage.setItem("theme",e),console.log(h,e),t.active=h,t.theme=e}attributeChangedCallback(){this.render()}render(){this.shadow.innerHTML=`
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
                    <span><input value=${this.left} type="radio" name="theme" id="left" ?checked=${this.active==="left"} aria-label="${this.left} theme" /></span>
                    <span><input value=${this.mid} type="radio" name="theme" id="mid" ?checked=${this.active==="mid"} aria-label="${this.mid} theme" /></span>
                    <span><input value=${this.right} type="radio" name="theme" id="right" ?checked=${this.active==="right"} aria-label="${this.right} theme" /></span>
                    <div class="knob" part="knob"></div>
                </div>
            </div>
            <div class="side">
                <label title="${this.right}" for="right" part="right">
                    <slot name="right">${this.right}</slot>
                </label>
            </div>
        </div>
    `}}customElements.define("theme-switch",m);
