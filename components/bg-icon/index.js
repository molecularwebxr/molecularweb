const BgIconContent = /* html */ `
  <style>
    .container {
      position: relative;
    }
    a {
      cursor: pointer;
    }
    svg {
      width: 40px;
      height: 40px;
    }
    #circle {
      fill: #FFFFFF;
      transition: 0.2s;
    }
    .path {
      fill: var(--primarydark);
    }
    a:hover #circle{
      fill: var(--secondary);
    }
    #circle.active {
      fill: var(--secondary);
    }
    a:hover .tooltip {
      visibility: visible;
      opacity: 1;
    }
    .tooltip {
      right: calc(100% + 22px);
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      background-color: var(--primarylight);
      visibility: hidden;
      opacity: 0;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition: 0.2s;
      white-space: nowrap;
    }
    .tooltip p {
      font-family: "Roboto";
      color: #ffffff;
      font-size: 1rem;
      text-align: left;
      margin: 0;
    }
    .triangle {
      position: absolute;
      top: 50%;
      right: -10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid var(--primarylight);
      transform: translateY(-50%);
    }
    .hide {
      display: none;
    }
    @media screen and (max-width: 900px) {
      a:hover .tooltip {
        display: none;
      }
    }
    @media (max-width: 440px) {
      svg {
        width: 30px;
        height: 30px;
      }
    }
    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 28px;
        height: 29px;
      }
    }
  </style>
  <div class="container">
  <a id="anchor">  
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
        <circle cx="113" cy="132" r="143" id="circle" />
      </g>
      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="hand" class="path">
    <g transform="matrix(20,0,0,20,0,0)">
    <path d="M14 3.5V11V4.5C14 3.67157 14.6716 3 15.5 3C16.3284 3 17 3.67157 17 4.5V11V7.5C17 6.67157 17.6716 6 18.5 6C19.3284 6 20 6.67157 20 7.5V16C20 19.3137 17.3137 22 14 22H12.8727C11.3483 22 9.88112 21.4198 8.76904 20.3772L3.81045 15.7285C3.09365 15.0565 3.0754 13.9246 3.77016 13.2298C4.44939 12.5506 5.55063 12.5506 6.22985 13.2298L8.00001 15V6.5C8.00001 5.67157 8.67158 5 9.50001 5C10.3284 5 11 5.67157 11 6.5V11V3.5C11 2.67157 11.6716 2 12.5 2C13.3284 2 14 2.67157 14 3.5Z" stroke="#ffffff" stroke-width="0.8640000000000001" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>
    <div id="tooltip" class="tooltip">
      <p><intl-message key="app.cutbackground"></p>
      <div class="triangle"></div>
    </div>
  </a>
</div>`;

class BgIcon extends HTMLElement {

  static get observedAttributes() {
    return ["isActive"];
  }

  set isActive(value) {
    this._isActive = value;
    if(this._isActive) {
      this.circleElement.classList.add("active");
      this.tooltip.classList.add("hide");
    } else {
      this.circleElement.classList.remove("active");
      this.tooltip.classList.remove("hide");
    }
  }

  get isActive() {
    return this._isActive;
  }

  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = BgIconContent;

    this.circleElement = this.shadowRoot.getElementById("circle");
    this.tooltip = this.shadowRoot.getElementById("tooltip");
  }

  connectedCallback() {
    if(this.isActive) {
      this.circleElement.classList.add("active");
      this.tooltip.classList.add("hide");
    }
  }

  toggle() {
    this.circleElement.classList.toggle("active");
    this.tooltip.classList.toggle("hide");
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "isActive") {
      this.isActive = newValue;
      this.toggle();
    }
  }
}

customElements.define("bg-icon", BgIcon);