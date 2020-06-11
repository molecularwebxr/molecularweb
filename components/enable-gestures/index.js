const gesturesIconTemplate = document.createElement("template");
gesturesIconTemplate.innerHTML = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      align-items:center;
    }
    svg {
      width: 25px;
      height: 25px;
    }
    path {
      fill: var(--primary);
    }
    .circle {
      fill: rgba(255, 255, 255, 0.5);
    }
    .circle.active {
      fill: var(--secondary);
    }
  </style>
  <a id="anchor">
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
          <circle class="circle" id="circle" cx="113" cy="132" r="143" />
      </g>
      <g id="rotate" transform="matrix(5.15625,0,0,5.15625,256,256)">
          <g transform="matrix(1,0,0,1,-32,-32)">
              <path d="M30,2C30,3.097 30.903,4 32,4C39.479,4 46.51,6.913 51.798,12.202C57.087,17.49 60,24.521 60,32C60,39.381 57.158,46.323 52,51.587L52,46C52,44.903 51.097,44 50,44C48.903,44 48,44.903 48,46L48,58L60,58C61.097,58 62,57.097 62,56C62,54.903 61.097,54 60,54L55.224,54C60.885,48.032 64,40.257 64,32C64,23.453 60.671,15.417 54.626,9.373C48.583,3.329 40.547,0 32,0C30.903,0 30,0.903 30,2Z" />
              <path d="M9.374,54.627C15.417,60.671 23.453,64 32,64C33.097,64 34,63.097 34,62C34,60.903 33.097,60 32,60C24.521,60 17.49,57.087 12.202,51.798C6.913,46.51 4,39.479 4,32C4,24.619 6.842,17.677 12,12.413L12,18C12,19.097 12.903,20 14,20C15.097,20 16,19.097 16,18L16,6L4,6C2.903,6 2,6.903 2,8C2,9.097 2.903,10 4,10L8.776,10C3.115,15.968 0,23.743 0,32C0,40.547 3.329,48.583 9.374,54.627Z" />
          </g>
      </g>
    </svg>
  </a>`;

class EnableGestures extends HTMLElement {

  static get observedAttributes() {
    return ["isActive"];
  }

  set isActive(value) {
    this._isActive = value;
    if(this._isActive) {
      this.circleElement.classList.add("active");
    } else {
      this.circleElement.classList.remove("active");
    }
  }

  get isActive() {
    return this._isActive;
  }

  
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(gesturesIconTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("a");
    this.buttonElement.addEventListener("click", this.handleClick);

    this.circleElement = this.shadowRoot.getElementById("circle");

  }

  connectedCallback() {
    if(this.isActive) {
      this.circleElement.classList.add("active");
    }

  }

  toggle() {
    this.circleElement.classList.toggle("active");
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("enableGestures"));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "isActive") {
      this.isActive = newValue;
      this.toggle();
    }
  }

}

customElements.define("enable-gestures", EnableGestures);
