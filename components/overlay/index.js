const overlayTemplate = document.createElement("template");
overlayTemplate.innerHTML = /* html */ `
  <style>
    .overlay {
      background-color: rgba(23, 58, 123, 0.6);
      backdrop-filter: blur(14px);
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: .3s ease-in;
      opacity: 0;
      z-index: 1;
      visibility: hidden;
      will-change: opacity;
      color: #FFFFFF;
      font-family: "Montserrat", sans-serif;
    }

    .overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    h1 {
      margin: 2rem 0 1.5rem 0;
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
    }
    
    p{
      margin: 0.5rem 0;
      font-size: 1.5rem;
      font-weight: normal;
      text-align: center;
      width: 54rem;
    }
    
    p.hidden {
      display: none;
    }

    button {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
      padding: .5rem 1rem .6rem;
      border: none;
      color: var(--primary);
      margin: 2rem 0 0 0;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: inset 0 -.2em rgba(0, 0, 0, .2);
      outline: 0;
      transition: .2s;
      will-change: transform;
      background-color: var(--secondary);
    }

    button:active {
      transform: scale(.9);
    }

    @media screen and (max-width: 1000px) {
      h1 {
        font-size: 2.5rem;
      }

      p {
        font-size: 1.3rem;
        width: 70vw;
      }

      button {
        font-size: 1rem;
      }
    }

    @media screen and (max-width: 850px) {
      h1 {
        font-size: 2rem;
      }
    }

    @media screen and (max-width: 700px) {
      h1 {
        font-size: 1.75rem;
      }

      p {
        font-size: 1rem;
      }

      button {
        font-size: 0.8rem;
      }
    }

    @media screen and (max-width: 600px) {
      h1 {
        font-size: 1.5rem;
      }
    }

    @media screen and (max-width: 700px) {
      h1 {
        font-size: 1.25rem;
        width: 95vw;
      }

      p {
        font-size: 0.8rem;
      }

      button {
        font-size: 0.75rem;
      }
    }

    @media screen and (max-width: 350px) {
      h1 {
        font-size: 1rem;
      }

      p {
        font-size: 0.75rem;
      }

      button {
        font-size: 0.6rem;
      }
    }

    @media screen and (orientation: landscape) {
      h1 {
        font-size: 1rem;
        margin: 1.25rem 0 1rem 0;
      }

      p {
        font-size: 0.75rem;
        margin: 0.25rem 0;
      }

      button {
        font-size: 0.6rem;
        margin: 1.25rem 0 0 0;
      }
    }
  </style>
  <div class="overlay" id="overlay">
    <molecule-icon medium no-strokes></molecule-icon>
    <h1>
      <slot name="title"></slot>
    </h1>
    <p id="markers">
      <intl-message key="app.markers"></intl-message>
    </p>
    <p id="instructions">
      <slot name="instructions"></slot>
    </p>
    <p id="description">
      <slot name="description"></slot>
    </p>
    <p id="menu" class="hidden">
      Here will be the menu :)
    </p>
    <button>Continue</button>
  </div>`;

class ActivityOverlay extends HTMLElement {
  static get observedAttributes() {
    return ["default", "type"];
  }

  set default(value) {
    this._default = value;
  }

  get default() {
    return this._default;
  }

  set type(value) {
    this._type = value;
  }

  get type() {
    return this._type;
  }

  constructor() {
    super();

    this.toggle = this.toggle.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(overlayTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("button");
    this.buttonElement.addEventListener("click", this.toggle);

    this.overlayElement = this.shadowRoot.getElementById("overlay");

    this.markersTextElement = this.shadowRoot.getElementById("markers");
    this.descriptionTextElement = this.shadowRoot.getElementById("description");
    this.instructionsTextElement = this.shadowRoot.getElementById(
      "instructions"
    );
    this.menuTextElement = this.shadowRoot.getElementById("menu");
  }

  connectedCallback() {
    if (this.default === "open") {
      this.overlayElement.classList.add("active");
    }

    if (this.type === "description") {
      this.markersTextElement.classList.add("hidden");
      this.instructionsTextElement.classList.add("hidden");
    }

    if (this.type === "instructions") {
      this.descriptionTextElement.classList.add("hidden");
    }

    if (this.type === "menu") {
      this.markersTextElement.classList.add("hidden");
      this.instructionsTextElement.classList.add("hidden");
      this.descriptionTextElement.classList.add("hidden");
      this.menuTextElement.classList.remove("hidden");
    }
  }

  toggle() {
    this.overlayElement.classList.toggle("active");
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "default") {
      this.default = newValue;
    }

    if (attrName === "type") {
      this.type = newValue;
    }
  }
}

customElements.define("activity-overlay", ActivityOverlay);
