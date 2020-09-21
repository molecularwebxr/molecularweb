const scaleIconTemplate = document.createElement("template");

scaleIconTemplate.innerHTML = /* html */ `
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
    .circle {
      fill: #FFFFFF;
      transition: 0.2s;
    }
    path {
      fill: var(--primarydark);
    }
    a:hover .circle{
      fill: var(--secondary);
    }
    .hidden {
      display: none;
    }
    @media (max-width: 440px) {
      svg {
        width: 24px;
        height: 24px;
      }
    }
    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  </style>
  <a id="anchor">
    <svg id="increase" class="hidden" width="30" height="31" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" class="circle" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6318 12.3157C15.6318 11.9669 15.3491 11.6841 15.0003 11.6841C14.6514 11.6841 14.3687 11.9669 14.3687 12.3157V14.2104H12.4744C12.1255 14.2104 11.8428 14.4932 11.8428 14.842C11.8428 15.1908 12.1255 15.4736 12.4744 15.4736H14.3687V17.3683C14.3687 17.7172 14.6514 17.9999 15.0003 17.9999C15.3491 17.9999 15.6318 17.7172 15.6318 17.3683V15.4736H17.527C17.8758 15.4736 18.1586 15.1908 18.1586 14.842C18.1586 14.4932 17.8758 14.2104 17.527 14.2104H15.6318V12.3157Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M24.4746 12.3157C24.4746 11.9669 24.1918 11.6841 23.843 11.6841C23.4942 11.6841 23.2114 11.9669 23.2114 12.3157V14.2104H21.3162C20.9673 14.2104 20.6846 14.4932 20.6846 14.842C20.6846 15.1908 20.9673 15.4736 21.3162 15.4736H23.2114V17.3683C23.2114 17.7172 23.4942 17.9999 23.843 17.9999C24.1918 17.9999 24.4746 17.7172 24.4746 17.3683V15.4736H26.3688C26.7176 15.4736 27.0004 15.1908 27.0004 14.842C27.0004 14.4932 26.7176 14.2104 26.3688 14.2104H24.4746V12.3157Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.78906 12.3157C6.78906 11.9669 6.50629 11.6841 6.15748 11.6841C5.80866 11.6841 5.52589 11.9669 5.52589 12.3157V14.2104H3.63158C3.28277 14.2104 3 14.4932 3 14.842C3 15.1908 3.28277 15.4736 3.63158 15.4736H5.52589V17.3683C5.52589 17.7172 5.80866 17.9999 6.15748 17.9999C6.50629 17.9999 6.78906 17.7172 6.78906 17.3683V15.4736H8.68426C9.03307 15.4736 9.31584 15.1908 9.31584 14.842C9.31584 14.4932 9.03307 14.2104 8.68426 14.2104H6.78906V12.3157Z" />
    </svg>

    <svg id="decrease" class="hidden" width="30" height="30" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" r="15" transform="matrix(1 0 0 -1 15 15)" />
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 11.8428 15.7896)" fill="#4432B0"/>
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 20.6846 15.7896)" fill="#4432B0"/>
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 3 15.7896)" fill="#4432B0"/>
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
    this.increase = this.shadowRoot.getElementById("increase");
    this.decrease = this.shadowRoot.getElementById("decrease");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  connectedCallback() {
    if (this.type === "up") {
      this.increase.classList.remove("hidden");
    } else {
      this.decrease.classList.remove("hidden")
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
