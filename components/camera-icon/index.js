const CameraIconContent = /* html */ `
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
  <a id="anchor">
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
          <circle cx="113" cy="132" r="143" id="circle" />
      </g>
      <g id="photo-camera" class="path" transform="matrix(0.755859,0,0,0.755859,256,256)">
        <g transform="matrix(1,0,0,1,-235.52,-235.52)">
          <g>
            <path d="M414.72,112.64L365.568,112.64L338.432,71.68C328.192,56.32 310.272,47.104 291.84,47.104L179.2,47.104C160.768,47.104 142.848,56.32 132.608,71.68L105.472,112.64L56.32,112.64C25.088,112.64 0,137.728 0,168.96L0,367.616C0,398.848 25.088,423.936 56.32,423.936L414.72,423.936C445.952,423.936 471.04,398.848 471.04,367.616L471.04,168.96C471.04,137.728 445.952,112.64 414.72,112.64ZM235.52,377.856C165.376,377.856 108.544,321.024 108.544,250.88C108.544,180.736 165.376,124.416 235.52,124.416C305.664,124.416 362.496,181.248 362.496,251.392C362.496,321.024 305.664,377.856 235.52,377.856ZM407.552,192L385.024,192C375.808,191.488 368.64,183.808 369.152,174.592C369.664,165.888 376.32,159.232 385.024,158.72L405.504,158.72C414.72,158.208 422.4,165.376 422.912,174.592C423.424,183.808 416.768,191.488 407.552,192Z" style="fill-rule:nonzero;"/>
          </g>
          <g>
            <path d="M235.52,180.736C196.608,180.736 164.864,212.48 164.864,251.392C164.864,290.304 196.608,321.536 235.52,321.536C274.432,321.536 306.176,289.792 306.176,250.88C306.176,211.968 274.432,180.736 235.52,180.736Z" style="fill-rule:nonzero;"/>
          </g>
        </g>
    </g>
    </svg>

  </a>`;

class CameraIcon extends HTMLElement {

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

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = CameraIconContent;

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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "isActive") {
      this.isActive = newValue;
      this.toggle();
    }
  }
}

customElements.define("camera-icon", CameraIcon);
