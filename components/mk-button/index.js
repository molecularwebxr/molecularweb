const MkIconContent = /* html */ `
  <style>
    .container {
      position: relative;
    }

    a {
      cursor: pointer;
    }

    svg {
      width: 40px;
      height: 41px;
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
        height: 26.5px;
      }
    }
  </style>
  <div class="container">
    <a id="anchor">
      <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
            <circle id="circle" cx="113" cy="132" r="143" />
        </g>
        <g class="path" transform="matrix(15.9091,0,0,15.9091,256,256)">
          <g transform="matrix(1,0,0,1,-11,-11)">
              <path d="M21.356,16.843C21,16.843 20.711,17.132 20.711,17.488L20.711,18.522L18.09,15.93L18.09,9.667C18.09,9.482 18.006,9.292 17.851,9.167C17.85,9.166 17.849,9.165 17.848,9.164L11.645,4.201L11.645,2.2L12.367,2.923C12.619,3.174 13.027,3.174 13.279,2.923C13.531,2.671 13.531,2.263 13.279,2.011L11.456,0.188C11.205,-0.062 10.795,-0.063 10.544,0.188L8.721,2.011C8.47,2.263 8.47,2.671 8.721,2.923C8.973,3.174 9.381,3.174 9.633,2.923L10.355,2.2L10.355,4.201L4.152,9.164C4.151,9.165 4.15,9.166 4.149,9.167C3.999,9.288 3.91,9.475 3.91,9.667L3.91,15.93L1.289,18.522L1.289,17.488C1.289,17.132 1,16.843 0.645,16.843C0.289,16.843 0,17.132 0,17.488L0,20.066C0,20.073 0.001,20.079 0.001,20.086C0.012,20.441 0.306,20.71 0.644,20.71L3.223,20.71C3.579,20.71 3.867,20.422 3.867,20.066C3.867,19.71 3.579,19.421 3.223,19.421L2.213,19.421L4.6,17.06L10.597,21.858C10.829,22.044 11.165,22.048 11.403,21.858L17.4,17.06L19.787,19.421L18.777,19.421C18.421,19.421 18.133,19.71 18.133,20.066C18.133,20.422 18.421,20.71 18.777,20.71L21.356,20.71C21.694,20.71 21.988,20.442 21.999,20.086C21.999,20.079 22,20.073 22,20.066L22,17.488C22,17.132 21.711,16.843 21.356,16.843ZM10.355,20.014L5.199,15.889L5.199,11.008L10.355,15.133L10.355,20.014ZM11,13.998L5.586,9.667L11,5.337L16.414,9.667L11,13.998ZM16.801,15.889L11.645,20.014L11.645,15.133L16.801,11.008L16.801,15.889Z" />
          </g>
      </g>
      </svg>
      <div id="tooltip" class="tooltip">
        <p><intl-message key="app.pdbOptions"></p>
        <div class="triangle"></div>
      </div>
    </a>
  </div>`;

class MkIcon extends HTMLElement {

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
    shadow.innerHTML = MkIconContent;

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

customElements.define("enable-mk-menu", MkIcon);
