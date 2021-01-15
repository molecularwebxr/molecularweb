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
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }

    .step-content {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
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
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .buttons { 
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      width: 80%;
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
      width: 5rem;
      margin: 0 0 1.25rem 0;
      display: flex;
      align-items: center;
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

    .hide{
      display: none;
    }

    .step-exit {
      opacity: 0.0;
      transform: scale(0.9) translateX(-50%);
      transition: all 300ms ease-out;
    }

    .step-hidden {
      opacity: 0.0;
      transform: scale(0.9) translateX(50%);
    }

    .step-enter {
      opacity: 1;
      transform: scale(1) translateX(0%);
      transition: all 300ms ease-out;
    }
    
  </style>
  <div id="overlay" class="overlay active">
    <div id="modal" class="instructions-container">
      <div class="box"></div>

      <div class="instructions-top">
        <div id="step-one" class="step-content">
          <h1 class="title">Welcome to MoleculARweb!</h1>
          <p class="text">A website for chemistry and biology education through augmented reality</p>
        </div>

        <div id="step-two" class="step-content step-hidden">
          <h1 class="title">Welcome to step 2!</h1>
          <p class="text">Here will go some text and instructions</p>
        </div>

        <div id="step-three" class="step-content step-hidden">
          <h1 class="title">Welcome to step 3!</h1>
          <p class="text">Here will go some text and instructions</p>
        </div>

        <div id="step-four" class="step-content step-hidden">
          <h1 class="title">Welcome to step 4!</h1>
          <p class="text">Here will go some text and instructions</p>
        </div>
      </div>

      
      <div class="instructions-bottom">
        <div class="step-circles row">
          <div id="circle-1" class="circle selected"></div>
          <div id="circle-2" class="circle"></div>
          <div id="circle-3" class="circle"></div>
          <div id="circle-4" class="circle"></div>
        </div>
        <div class="buttons">
          <button id="btn-skip" class="btn">Skip</button>
          <button id="btn-next" class="btn">Next</button>
        </div>
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
    this.handleNext = this.handleNext.bind(this);

    this.step = "ONE";

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = InstructionsContent;

    this.overlay = this.shadowRoot.getElementById("overlay");
    this.modal = this.shadowRoot.getElementById("modal");
    this.btnNext = this.shadowRoot.getElementById("btn-next");
    this.btnSkip = this.shadowRoot.getElementById("btn-skip");

    this.stepOne = this.shadowRoot.getElementById("step-one");
    this.stepTwo = this.shadowRoot.getElementById("step-two");
    this.stepThree = this.shadowRoot.getElementById("step-three");
    this.stepFour = this.shadowRoot.getElementById("step-four");

    this.circle1 = this.shadowRoot.getElementById("circle-1");
    this.circle2 = this.shadowRoot.getElementById("circle-2");
    this.circle3 = this.shadowRoot.getElementById("circle-3");
    this.circle4 = this.shadowRoot.getElementById("circle-4");

    this.overlay.addEventListener("click", this.toggle)
    this.btnNext.addEventListener("click", this.handleNext)
  }

  connectedCallback() {
    if (this.isActive) {
      this.overlay.classList.add("active");
    }
  }

  toggle(e) {
    if (e.target.id === "overlay" || e.target.id === "btn-skip") {
      this.overlay.classList.toggle("active");
      this.modal.classList.toggle("out");
    }
  }

  handleNext() {
    if (this.step === "ONE") {
      this.stepOne.classList.add("step-exit");
      this.stepTwo.classList.remove("step-hidden");
      this.stepTwo.classList.add("step-enter");

      this.circle1.classList.remove("selected");
      this.circle2.classList.add("selected");

      this.step = "TWO"
      return;
    }

    if (this.step === "TWO") {
      this.stepTwo.classList.remove("step-enter");
      this.stepTwo.classList.add("step-exit");
      this.stepThree.classList.remove("step-hidden");
      this.stepThree.classList.add("step-enter");

      this.circle2.classList.remove("selected");
      this.circle3.classList.add("selected");

      this.step = "THREE"
      return;
    }

    if (this.step === "THREE") {
      this.stepThree.classList.remove("step-enter");
      this.stepThree.classList.add("step-exit");
      this.stepFour.classList.remove("step-hidden");
      this.stepFour.classList.add("step-enter");

      this.circle3.classList.remove("selected");
      this.circle4.classList.add("selected");

      this.step === "FOUR"
      return;
    }

    if (this.step === "FOUR") {
      this.toggle();
    }    
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "isActive") {
      this.isActive = newValue;
      this.toggle();
    }
  }
}

customElements.define("app-instructions", Instructions);
