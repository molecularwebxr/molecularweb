const InstructionsContent = /* html */ `
  <style>
    .overlay {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;
      visibility: hidden;
      transition: .6s ease-in;;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .instructions-container {
      border-radius: 20px;
      width: 650px;
      height: 600px;
      background-color: white;
      animation: animationIn .5s forwards;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-family: "Montserrat", sans-serif;
    }

    .instructions-container.out {
      animation: animationOut .5s forwards;
    }

    @keyframes animationIn {
      0%{
        transform: translateY(-3000px);
      }
      60%{
        transform: translateY(25px);
      }
      75%{
        transform: translateY(-10px);
      }
      90%{
        transform: translateY(5px);
      }
    }

    @keyframes animationOut {
      0% {
        transform: translateY(0);
      }

      30% {
        transform: translateY(5px);
      }

      100% {
        transform: translateY(-3000px);
      }
    }

    .box{
      width: 10px;
      height: 45px;
      position: absolute;
      left: 0;
      top: 80px;
      background-color: var(--secondary);
    }

    .instructions-top {
      height: 430px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .title {
      font-weight: 600;
      font-size: 3rem;
      color: var(--primarydark);
      text-align: center;
      margin: 0 0 5.75rem 0;
    }

    .text {
      font-size: 1.75rem;
      color: var(--primarylight);
      width: 30rem;
      margin: 0 0 1.25rem 0;
      text-align: center;
    }

    .instructions-bottom {
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .btn {
      display: block;
      border-radius: 6px;
      border-style: none;
      border-width: 0;
      outline: none;
      cursor: pointer;
      -webkit-appearance: button;
      padding: 1rem 3rem;
      background-color: var(--secondary);
      color: var(--primary);
      font-family: "Roboto";
      font-weight: bold;
      font-size: 24px;
      margin: 0.25rem auto;
      transition: .2s;
    }

    .btn:active{
      transform: scale(.9);
    }

    .step-circles{
      width: 2rem;
      margin: 0 0 1.25rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-between;
    }

    .circle{
      width: 10px;
      height: 10px;
      border: 1px solid lightgray;
      border-radius: 100%;
      transition: .3s;
    }

    .circle.selected{
      border: 1px solid var(--secondary);
      background-color: var(--secondary);
    }
    
  </style>
  <div id="overlay" class="overlay active">
    <div id="modal" class="instructions-container">
      <div class="box"></div>
      <div class="instructions-top">
        <h1 class="title">Welcome to MoleculARweb!</h1>
        <p class="text">A website for chemistry and biology education through augmented reality</p>
      </div>
      <div class="instructions-bottom">
        <div class="step-circles row">
          <div class="circle selected"></div>
          <div class="circle"></div>
        </div>
        <button id="btn-next" class="btn">Next</button>
      </div>
    </div>
  </div>`;

class Instructions extends HTMLElement {
  static get observedAttributes() {
    return ["isActive"];
  }

  set isActive(value) {
    this._isActive = value;
    if (this._isActive) {
      this.instructionsContainer.classList.add("active");
    } else {
      this.instructionsContainer.classList.remove("active");
    }
  }

  get isActive() {
    return this._isActive;
  }

  constructor() {
    super();

    this.toggle = this.toggle.bind(this);

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = InstructionsContent;

    this.overlay = this.shadowRoot.getElementById("overlay");
    this.modal = this.shadowRoot.getElementById("modal");
    this.btnNext = this.shadowRoot.getElementById("btn-next");

    this.btnNext.addEventListener("click", this.toggle)
  }

  connectedCallback() {
    if (this.isActive) {
      this.overlay.classList.add("active");
    }
  }

  toggle() {
    this.overlay.classList.toggle("active");
    this.modal.classList.toggle("out");
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "isActive") {
      this.isActive = newValue;
      this.toggle();
    }
  }
}

customElements.define("app-instructions", Instructions);
