const TempControlContent = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
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
    .hidden {
      display: none;
    }
    a:hover .circle{
      fill: var(--secondary);
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

    <svg id="increase-high" class="hidden" width="30" height="31" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" class="circle" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6318 12.3157C15.6318 11.9669 15.3491 11.6841 15.0003 11.6841C14.6514 11.6841 14.3687 11.9669 14.3687 12.3157V14.2104H12.4744C12.1255 14.2104 11.8428 14.4932 11.8428 14.842C11.8428 15.1908 12.1255 15.4736 12.4744 15.4736H14.3687V17.3683C14.3687 17.7172 14.6514 17.9999 15.0003 17.9999C15.3491 17.9999 15.6318 17.7172 15.6318 17.3683V15.4736H17.527C17.8758 15.4736 18.1586 15.1908 18.1586 14.842C18.1586 14.4932 17.8758 14.2104 17.527 14.2104H15.6318V12.3157Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M24.4746 12.3157C24.4746 11.9669 24.1918 11.6841 23.843 11.6841C23.4942 11.6841 23.2114 11.9669 23.2114 12.3157V14.2104H21.3162C20.9673 14.2104 20.6846 14.4932 20.6846 14.842C20.6846 15.1908 20.9673 15.4736 21.3162 15.4736H23.2114V17.3683C23.2114 17.7172 23.4942 17.9999 23.843 17.9999C24.1918 17.9999 24.4746 17.7172 24.4746 17.3683V15.4736H26.3688C26.7176 15.4736 27.0004 15.1908 27.0004 14.842C27.0004 14.4932 26.7176 14.2104 26.3688 14.2104H24.4746V12.3157Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.78906 12.3157C6.78906 11.9669 6.50629 11.6841 6.15748 11.6841C5.80866 11.6841 5.52589 11.9669 5.52589 12.3157V14.2104H3.63158C3.28277 14.2104 3 14.4932 3 14.842C3 15.1908 3.28277 15.4736 3.63158 15.4736H5.52589V17.3683C5.52589 17.7172 5.80866 17.9999 6.15748 17.9999C6.50629 17.9999 6.78906 17.7172 6.78906 17.3683V15.4736H8.68426C9.03307 15.4736 9.31584 15.1908 9.31584 14.842C9.31584 14.4932 9.03307 14.2104 8.68426 14.2104H6.78906V12.3157Z" />
    </svg>

    <svg id="increase-medium" class="hidden"  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" class="circle" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.78906 9.63158C7.78906 9.28277 7.50629 9 7.15748 9C6.80866 9 6.52589 9.28277 6.52589 9.63158V11.5264H4.63158C4.28277 11.5264 4 11.8091 4 12.158C4 12.5068 4.28277 12.7895 4.63158 12.7895H6.52589V14.6843C6.52589 15.0331 6.80866 15.3158 7.15748 15.3158C7.50629 15.3158 7.78906 15.0331 7.78906 14.6843V12.7895H9.68426C10.0331 12.7895 10.3158 12.5068 10.3158 12.158C10.3158 11.8091 10.0331 11.5264 9.68426 11.5264H7.78906V9.63158Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6318 9.63158C16.6318 9.28277 16.3491 9 16.0003 9C15.6514 9 15.3687 9.28277 15.3687 9.63158V11.5264H13.4734C13.1246 11.5264 12.8418 11.8091 12.8418 12.158C12.8418 12.5068 13.1246 12.7895 13.4734 12.7895H15.3687V14.6843C15.3687 15.0331 15.6514 15.3158 16.0003 15.3158C16.3491 15.3158 16.6318 15.0331 16.6318 14.6843V12.7895H18.5261C18.8749 12.7895 19.1576 12.5068 19.1576 12.158C19.1576 11.8091 18.8749 11.5264 18.5261 11.5264H16.6318V9.63158Z" />
    </svg>

    <svg id="increase-low" class="hidden" width="20" height="21" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" class="circle" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.79 7.63158C10.79 7.28277 10.5073 7 10.1585 7C9.80964 7 9.52687 7.28277 9.52687 7.63158V9.52637H7.63158C7.28277 9.52637 7 9.80914 7 10.158C7 10.5068 7.28277 10.7895 7.63158 10.7895H9.52687V12.6843C9.52687 13.0331 9.80964 13.3158 10.1585 13.3158C10.5073 13.3158 10.79 13.0331 10.79 12.6843V10.7895H12.6843C13.0331 10.7895 13.3158 10.5068 13.3158 10.158C13.3158 9.80914 13.0331 9.52637 12.6843 9.52637H10.79V7.63158Z" />
    </svg>

    <svg id="decrease-high" class="hidden" width="30" height="30" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" r="15" transform="matrix(1 0 0 -1 15 15)" />
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 11.8428 15.7896)" fill="#4432B0"/>
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 20.6846 15.7896)" fill="#4432B0"/>
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 3 15.7896)" fill="#4432B0"/>
    </svg>

    <svg id="decrease-medium" class="hidden" width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" r="12" transform="matrix(1 0 0 -1 12 12)" />
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 4 12.4736)" fill="#4432B0"/>
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 12.8418 12.4736)" fill="#4432B0"/>
    </svg>


    <svg id="decrease-low" class="hidden" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" r="10" transform="matrix(1 0 0 -1 10 10)" />
      <rect width="6.31584" height="1.26317" rx="0.631584" transform="matrix(1 0 0 -1 7 10.4736)" fill="#4432B0"/>
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

    this.decreaseHigh = this.shadowRoot.getElementById("decrease-high");
    this.decreaseMedium = this.shadowRoot.getElementById("decrease-medium");
    this.decreaseLow = this.shadowRoot.getElementById("decrease-low");
  }

  connectedCallback() {
    if (this.size === "big") {
      if (this.type === "increase") {
        this.increaseHigh.classList.remove("hidden");
      } else {
        this.decreaseHigh.classList.remove("hidden")
      }
    }

    if (this.size === "medium") {
      if (this.type === "increase") {
        this.increaseMedium.classList.remove("hidden");
      } else {
        this.decreaseMedium.classList.remove("hidden")
      }
    }

    if (this.size === "small") {
      if (this.type === "increase") {
        this.increaseLow.classList.remove("hidden");
      } else {
        this.decreaseLow.classList.remove("hidden")
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
