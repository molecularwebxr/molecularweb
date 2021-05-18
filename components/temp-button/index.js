const TempIconContent = /* html */ `
  <style>
    .container {
      position: relative;
    }

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
        height: 26px;
      }
    }
  </style>
  <div class="container">
    <a id="anchor">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle id="circle" cx="18" cy="18" r="18" />
        <path class="path" d="M22.1667 19.4005V10.6667C22.1667 8.64162 20.525 7 18.5 7C16.475 7 14.8333 8.64162 14.8333 10.6667V19.4004C13.7081 20.4075 13 21.8711 13 23.5C13 26.5376 15.4625 29 18.5 29C21.5375 29 24 26.5376 24 23.5C24 21.8711 23.2919 20.4075 22.1667 19.4005ZM18.5 27.1667C16.475 27.1667 14.8333 25.525 14.8333 23.5C14.8333 22.4414 15.282 21.4593 16.056 20.7665L16.6667 20.22V10.6667C16.6667 9.65414 17.4875 8.8333 18.5 8.8333C19.5126 8.8333 20.3334 9.65409 20.3334 10.6667V20.22L20.9441 20.7665C21.7181 21.4593 22.1667 22.4413 22.1667 23.5C22.1667 25.525 20.525 27.1667 18.5 27.1667Z" stroke="white" stroke-width="0.5"/>
        <path class="path" d="M19.4173 14.3335H17.584V25.3335H19.4173V14.3335Z"/>
        <path class="path" d="M18.5 26.25C20.0188 26.25 21.25 25.0188 21.25 23.5C21.25 21.9812 20.0188 20.75 18.5 20.75C16.9812 20.75 15.75 21.9812 15.75 23.5C15.75 25.0188 16.9812 26.25 18.5 26.25Z"/>
      </svg>
      <div id="tooltip" class="tooltip">
        <p><intl-message key="app.tempOptions"></p>
        <div class="triangle"></div>
      </div>
    </a>
  </div>`;

class TempIcon extends HTMLElement {

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
    shadow.innerHTML = TempIconContent;

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

customElements.define("enable-temp-controls", TempIcon);
