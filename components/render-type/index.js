const RenderIconContent = /* html */ `
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
      left: -382%;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      background-color: var(--primarylight);
      visibility: hidden;
      opacity: 0;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition: 0.2s;
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
        width: 30px;
        height: 30px;
      }
    }
  </style>
  <div class="container">
    <a id="anchor">
      <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
            <circle cx="113" cy="132" r="143" id="circle" />
        </g>
        <g id="molecule" transform="matrix(0.585938,0,0,0.585938,256,256)" class="path" >
            <g transform="matrix(1,0,0,1,-256,-256)">
                <clipPath id="_clip1">
                    <rect x="0" y="0" width="512" height="512"/>
                </clipPath>
                <g clip-path="url(#_clip1)">
                    <g>
                        <path d="M61,301C36.186,301 16,321.186 16,346C16,370.814 36.186,391 61,391C85.814,391 106,370.814 106,346C106,344.132 105.67,342.354 105.449,340.547L182.308,302.119C193.097,315.815 208.302,325.875 226.001,329.482L226.001,424.763C208.579,430.976 196.001,447.47 196.001,467C196.001,491.814 216.187,512 241.001,512C265.815,512 286.001,491.814 286.001,467C286.001,447.47 273.423,430.976 256.001,424.763L256.001,329.482C273.7,325.875 288.905,315.815 299.694,302.119L376.553,340.547C376.33,342.354 376,344.132 376,346C376,370.814 396.186,391 421,391C445.814,391 466,370.814 466,346C466,321.186 445.814,301 421,301C408.899,301 397.945,305.856 389.85,313.653L313.162,275.309C314.826,269.109 316,262.717 316,256.001C316,242.806 312.279,230.579 306.27,219.796L428.707,113.855C435.306,117.656 442.852,120 451,120C475.814,120 496,99.814 496,75C496,50.186 475.814,30 451,30C426.186,30 406,50.186 406,75C406,80.709 407.174,86.124 409.122,91.154L286.771,197.02C274.065,187.134 258.307,181 241,181C227.805,181 215.578,184.721 204.795,190.73L99.853,67.293C103.656,60.694 106,53.148 106,45C106,20.186 85.814,-0 61,-0C36.186,-0 16,20.186 16,45C16,69.814 36.186,90 61,90C66.709,90 72.124,88.826 77.154,86.878L182.02,210.229C172.134,222.935 166,238.693 166,256C166,262.716 167.174,269.109 168.838,275.308L92.15,313.653C84.055,305.856 73.101,301 61,301Z" style="fill-rule:nonzero;"/>
                    </g>
                </g>
            </g>
          </g>
      </svg>
      <div class="tooltip">
        <p>Spheres/Sticks</p>
        <div class="triangle"></div>
      </div>
    </a>
  </div>`;

class RenderIcon extends HTMLElement {

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
    shadow.innerHTML = RenderIconContent;

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

customElements.define("render-type-icon", RenderIcon);
