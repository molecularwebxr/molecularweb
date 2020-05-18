const instructionsTemplate = document.createElement("template");
instructionsTemplate.innerHTML = /* html */ `
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
      color: var(--azure);
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
    }

    p{
      margin: 0.5rem 0;
      font-size: 1.5rem;
      font-weight: normal;
      text-align: center;
      width: 54rem;
    }

    button {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
      padding: .5rem 1rem .6rem;
      border: none;
      color: var(--blue);
      margin: 2rem 0 0 0;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: inset 0 -.2em rgba(0, 0, 0, .2);
      outline: 0;
      transition: .2s;
      will-change: transform;
      background-color: var(--orange);
    }

    button:active {
      transform: scale(.9);
    }

    @media screen and (max-width: 500px) {
      
    }
  </style>
  <div class="overlay active" id="overlay">
    <molecule-icon medium no-strokes></molecule-icon>
    <h1>
      <slot name="title"></slot>
    </h1>
    <p>
      <intl-message key="app.markers"></intl-message>
    </p>
    <p>
      <slot name="instructions"></slot>
    </p>
    <button>Continue</button>
  </div>`;

class ActivityInstructions extends HTMLElement {
  static get observedAttributes() {
    return ["title"];
  }

  set title(value) {
    this._title = value;
    this.titleI18n.key = this._title;
    console.log(this.titleI18n.key);
  }

  get title() {
    return this._title;
  }

  constructor() {
    super();
    this.show = true;

    this.toggle = this.toggle.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(instructionsTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("button");
    this.buttonElement.addEventListener("click", this.toggle);

    this.overlayElement = this.shadowRoot.getElementById("overlay");
    this.titleI18n = this.shadowRoot.getElementById("title-i18n");
  }

  toggle() {
    this.overlayElement.classList.toggle("active");
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "title") {
      this.title = newValue;
    }
  }
}

customElements.define("activity-instructions", ActivityInstructions);
