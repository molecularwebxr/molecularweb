const TempControlContent = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      transition: transform 0.2s;
    }
    #circle {
      fill: #FFFFFF;
      transition: 0.2s;
    }
    .path {
      fill: var(--primarydark);
    }
    .big {
      width: 36px;
      height: 36px;
    }
    .medium {
      width: 28px;
      height: 28px;
    }
    .small {
      width: 20px;
      height: 20px;
    }
    .hidden {
      display: none;
    }
    a:hover #circle{
      fill: var(--secondary);
    }
  </style>
  <a id="anchor">
    <svg class="big" width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
        <circle id="circle" cx="113" cy="132" r="143" />
      </g>
      
      <g id="increase-high" class="hidden">
        <g transform="matrix(0.997551,0,0,0.939203,-93.3259,125.754)">
          <text class="path" x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;">+</text>
        </g>
        <g transform="matrix(0.997551,0,0,0.939203,64.6741,125.754)">
          <text class="path" x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;">+</text>
        </g>
        <g transform="matrix(0.997551,0,0,0.939203,222.674,125.754)">
          <text class="path" x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;">+</text>
        </g>
      </g> 

      <g id="increase-medium" class="hidden">
        <g transform="matrix(1.42507,0,0,1.34172,-128.323,69.9349)">
          <text x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;fill:rgb(68,50,176);">+</text>
        </g>
        <g transform="matrix(1.42507,0,0,1.34172,108.677,69.9349)">
            <text x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;fill:rgb(68,50,176);">+</text>
        </g>
      </g>

      <g id="increase-low" class="hidden" transform="matrix(1.42507,0,0,1.34172,-17.3227,69.9349)">
        <text x="110.655px" y="233.739px" style="font-family:'Roboto-Regular', 'Roboto';font-size:288px;fill:rgb(68,50,176);">+</text>
      </g>
      
    </svg>
  </a>`;

class TempControl extends HTMLElement {
  static get observedAttributes() {
    return ["size", "type"];
  }

  set size(value) {
    this._size = value;
  }

  get size() {
    return this._size;
  }

  set type(value) {
    this._type = value;
  }

  get type() {
    return this._type;
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = TempControlContent;

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);

    this.svgElement = this.shadowRoot.querySelector("svg");

    this.increaseHigh = this.shadowRoot.getElementById("increase-high");
    this.increaseMedium = this.shadowRoot.getElementById("increase-medium");
    this.increaseLow = this.shadowRoot.getElementById("increase-low");
  }

  connectedCallback() {
    if (this.size === "big") {
      this.svgElement.classList.add("big");
      if (this.type === "increase") {
        this.increaseHigh.classList.remove("hidden");
      }
    }

    if (this.size === "medium") {
      this.svgElement.classList.add("medium");
      if (this.type === "increase") {
        this.increaseMedium.classList.remove("hidden");
      }
    }

    if (this.size === "small") {
      this.svgElement.classList.add("small");
      if (this.type === "increase") {
        this.increaseLow.classList.remove("hidden");
      }
    }
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("updateTemp", {
      detail: { type: this.type, size: this.size },
    }));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "size") {
      this.size = newValue;
    }

    if (attrName === "type") {
      this.type = newValue;
    }
  }
}

customElements.define("temp-control", TempControl);
