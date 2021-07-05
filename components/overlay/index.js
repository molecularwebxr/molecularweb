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
      z-index: 2;
      visibility: hidden;
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
    
    .text {
      margin: 0.5rem 0;
      font-size: 1.5rem;
      font-weight: normal;
      text-align: center;
      width: 54rem;
      text-decoration: none;
      color: #FFFFFF;
    }

    .underline {
      text-decoration: underline;
    }
    
    .hidden {
      display: none;
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      margin: 1.75rem 0 0 0;
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

    .buttons button {
      color: var(--primary);
      background-color: #ffffff;
      margin: 0.25rem;
    }

    .buttons-text {
      margin-left: auto;
      margin-right: auto;
    }

    @media screen and (max-width: 1000px) {
      h1 {
        font-size: 2.5rem;
      }

      .text {
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

      .text {
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

      .text {
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

      .text {
        font-size: 0.75rem;
      }

      button {
        font-size: 0.6rem;
      }
    }

    @media screen and (max-height: 450px) and (orientation: landscape) {
      h1 {
        font-size: 1rem;
        margin: 1.25rem 0 1rem 0;
      }

      .text {
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

    <a id="markers"
       target="_blank"
       rel="noopener noreferrer"
       class="text underline"
       href="/assets/markers/markers.pdf"
    >
      <intl-message key="app.markers"></intl-message>
    </a>

    <p class="text" id="instructions">
      <slot name="instructions"></slot>
    </p>

    <p class="text" id="description">
      <slot name="description"></slot>
    </p>

    <div class="hidden" id="menu">
      <p class="text buttons-text">
      <intl-message key="app.preferredLang"></intl-message>
      </p>
      <div class="buttons">
        <button id="en">English</button>
        <button id="fr">Français</button>
        <button id="de">Deutsch</button>
        <button id="it">Italiano</button>
        <button id="es">Español</button>
        <button id="pt">Português</button>
        <button id="th">ไทย</button>
      </div>
    </div>

    <button id="continue-button">Continue</button>
  </div>`;

class ActivityOverlay extends HTMLElement {
  static get observedAttributes() {
    return ["default", "type", "marker"];
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

  set marker(value) {
    this._marker = value;
  }

  get marker() {
    return this._marker;
  }

  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(overlayTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.getElementById("continue-button");
    this.buttonElement.addEventListener("click", this.toggle);

    this.overlayElement = this.shadowRoot.getElementById("overlay");

    this.markersTextElement = this.shadowRoot.getElementById("markers");
    this.descriptionTextElement = this.shadowRoot.getElementById("description");
    this.instructionsTextElement = this.shadowRoot.getElementById(
      "instructions"
    );
    this.menuTextElement = this.shadowRoot.getElementById("menu");

    this.english = this.shadowRoot.querySelector("#en");
    this.spanish = this.shadowRoot.querySelector("#es");
    this.french = this.shadowRoot.querySelector("#fr");
    this.italian = this.shadowRoot.querySelector("#it");
    this.portuguese = this.shadowRoot.querySelector("#pt");
    this.german = this.shadowRoot.querySelector("#de");
    this.thai = this.shadowRoot.querySelector("#th");

    this.english.addEventListener("click", this.handleLanguageChange);
    this.spanish.addEventListener("click", this.handleLanguageChange);
    this.french.addEventListener("click", this.handleLanguageChange);
    this.italian.addEventListener("click", this.handleLanguageChange);
    this.portuguese.addEventListener("click", this.handleLanguageChange);
    this.german.addEventListener("click", this.handleLanguageChange);
    this.thai.addEventListener("click", this.handleLanguageChange);
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

    if (this.marker === "cube") {
      this.markersTextElement.href = "/assets/markers/cube.pdf"
    }
  }

  toggle() {
    this.overlayElement.classList.toggle("active");
  }

  handleLanguageChange(e) {
    var lang = e.target.id;
    e.preventDefault();
    i18next.changeLanguage(lang);
    this.toggle();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "default") {
      this.default = newValue;
    }

    if (attrName === "type") {
      this.type = newValue;
    }

    if (attrName === "marker") {
      this.marker = newValue;
    }
  }
}

customElements.define("activity-overlay", ActivityOverlay);
