const scaleIconTemplate = document.createElement("template");

scaleIconTemplate.innerHTML = /* html */ `
  <style>
    a {
      cursor: pointer;
    }
    svg {
      transition: transform 0.2s;
      width: 40px;
      height: 40px;
    }
    #circle {
      transition: 0.2s;
      fill: white;
    }
    .icon-path {
      fill: var(--primarydark);
    }
    .transform {
      transform: matrix(-0.999974,0.00723202,-0.00723202,-0.999974,97.8153,29.9393);
    }
    a:hover #circle {
      fill: var(--secondary);
    }
    @media (max-width: 440px) {
      svg {
        width: 30px;
        height: 30px;
      }
    }
  </style>
  <a id="anchor">
  <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
        <circle cx="113" cy="132" r="143" id="circle" />
    </g>
    <g id="reduce" transform="matrix(5.01563,0,0,4.6875,256,256)">
        <g transform="matrix(1,0,0,1,-32,-32)">
            <path class="icon-path" d="M0,30L2,30L2,2L62,2L62,62L34,62L34,64L64,64L64,0L0,0L0,30Z" />
            <path class="icon-path" d="M32,32L29,32L29,34L30,34L30,35L32,35L32,32Z" />
            <rect class="icon-path" x="23" y="32" width="4" height="2" />
            <rect class="icon-path" x="5" y="32" width="4" height="2" />
            <rect class="icon-path" x="17" y="32" width="4" height="2" />
            <rect class="icon-path" x="11" y="32" width="4" height="2" />
            <path class="icon-path" d="M2,34L3,34L3,32L0,32L0,35L2,35L2,34Z" />
            <rect class="icon-path" x="0" y="49" width="2" height="4" />
            <rect class="icon-path" x="0" y="43" width="2" height="4" />
            <rect class="icon-path" x="0" y="37" width="2" height="4" />
            <rect class="icon-path" x="0" y="55" width="2" height="4" />
            <path class="icon-path" d="M3,62L2,62L2,61L0,61L0,64L3,64L3,62Z" />
            <rect class="icon-path" x="17" y="62" width="4" height="2" />
            <rect class="icon-path" x="11" y="62" width="4" height="2" />
            <rect class="icon-path" x="23" y="62" width="4" height="2" />
            <rect class="icon-path" x="5" y="62" width="4" height="2" />
            <path class="icon-path" d="M29,64L32,64L32,61L30,61L30,62L29,62L29,64Z" />
            <rect class="icon-path" x="30" y="43" width="2" height="4" />
            <rect class="icon-path" x="30" y="37" width="2" height="4" />
            <rect class="icon-path" x="30" y="49" width="2" height="4" />
            <rect class="icon-path" x="30" y="55" width="2" height="4" />
            <g id="arrow" class="transform">
                <path class="icon-path" d="M40,12L40,23L41,24L52,24L52,22L43.414,22L57.707,7.707L56.293,6.293L42,20.586L42,12L40,12Z" />
            </g>
        </g>
    </g>
</svg>
  </a>`;

class ScaleGraphics extends HTMLElement {

  static get observedAttributes() {
    return ["type"];
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

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(scaleIconTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("a");
    this.arrowPath = this.shadowRoot.getElementById("arrow");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  connectedCallback() {
    if(this.type === "down") {
      this.arrowPath.classList.remove("transform");
    }
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("scaleGraphics", { detail: this.type }));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "type") {
      this.type = newValue;
    }
  }
}

customElements.define("scale-graphics", ScaleGraphics);
