const RotationControlsContent = document.createElement("template");

RotationControlsContent.innerHTML = /* html */ `
  <style>
  input[type=range] {
    -webkit-appearance: none;
    margin: 10px auto;
    width: 90px;
    background-color: transparent;
    cursor: pointer;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    height: 3px;
    width: 90px;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    background: #000000;
    border-radius: 25px;
    border: 0px solid #000000;
  }
  input[type=range]::-webkit-slider-thumb {
    border: 0px solid #000000;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.6px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #000000;
  }
  input[type=range]::-moz-range-track {
    height: 3px;
    width: 90px;
    border-radius: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
    background: #000000;
    border: 0px solid #000101;
  }
  input[type=range]::-moz-range-thumb {
    border: 0px solid #000000;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    height: 3px;
    width: 90px;
    border-radius: 2px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    border-width: 39px 0;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #000000;
    border: 0px solid #000101;
    border-radius: 50px;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  }
  input[type=range]::-ms-fill-upper {
    background: #000000;
    border: 0px solid #000101;
    border-radius: 50px;
    box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  }
  input[type=range]::-ms-thumb {
    border: 0px solid #000000;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #000000;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #000000;
  }

  .rotation-controls {
    position: fixed;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    width: 540px;
    display: flex;
  }

  .rotation-marker1{
    width: 241px;
    padding:  0 12px;
    box-sizing: border-box;
  }

  .rotation-bar {
    width: 180px;
    height: 20px;
    background-color: rgba(91, 69, 235, 0.8);
    margin: 4px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 8px 0 8px;
    
  }

  .slider {
    height: 3px;
    width: 90px;
    border-radius: 2px;
    margin: 8px;
    background-color: black;
    position: relative;
  }

  .handler{
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 6px;
    position: absolute;
    top: -5px;
  }

  .number-box{
    width: 26px;
  }

  p.small {
    margin: 0;
    font-size: 12px;
    color: white;
    font-family: 'Roboto', sans-serif;
  }

  p.small.num {
    text-align: right;
  }
  </style>
  <div class="rotation-controls">
    <div class="rotation-marker1">
      <div class="rotation-bar">
        <p class="small">Rotate Y</p>
        <input type="range" min="0" max="180" value="0" step="5" id="marker1-y" />
        <div class="number-box">
          <p class="small num">
            <span id="marker1-y-value">0</span><span>°</span>
          </p>
        </div>
      </div>
      <div class="rotation-bar">
        <p class="small">Rotate X</p>
        <input type="range" min="0" max="180" value="0" step="5" id="marker1-x" />
        <div class="number-box">
          <p class="small num">
            <span id="marker1-x-value">0</span><span>°</span>
          </p>
        </div>
      </div>
    </div>
    <div class="rotation-marker1">
      <div class="rotation-bar">
        <p class="small">Rotate Y</p>
        <input type="range" min="0" max="180" value="0" step="5" id="marker2-y" />
        <div class="number-box">
          <p class="small num">
            <span id="marker2-y-value">0</span><span>°</span>
          </p>
        </div>
      </div>
      <div class="rotation-bar">
        <p class="small">Rotate X</p>
        <input type="range" min="0" max="180" value="0" step="5" id="marker2-x" />
        <div class="number-box">
          <p class="small num">
            <span id="marker2-x-value">0</span><span>°</span>
          </p>
        </div>
      </div>
    </div>
  </div>`;

class RotationControls extends HTMLElement {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      RotationControlsContent.content.cloneNode(true)
    );

    this.marker1Y = this.shadowRoot.getElementById("marker1-y");
    this.marker1X = this.shadowRoot.getElementById("marker1-x");
    this.marker2Y = this.shadowRoot.getElementById("marker2-y");
    this.marker2X = this.shadowRoot.getElementById("marker2-x");

    this.marker1Yvalue = this.shadowRoot.getElementById("marker1-y-value");
    this.marker1Xvalue = this.shadowRoot.getElementById("marker1-x-value");
    this.marker2Yvalue = this.shadowRoot.getElementById("marker2-y-value");
    this.marker2Xvalue = this.shadowRoot.getElementById("marker2-x-value");

    this.marker1Y.addEventListener("input", this.handleChange);
    this.marker1X.addEventListener("input", this.handleChange);
    this.marker2Y.addEventListener("input", this.handleChange);
    this.marker2X.addEventListener("input", this.handleChange);
  }

  handleChange(e) {
    var selectedElement = e.target.id;
    var newValue = e.target.value;
    var selectedValue;

    switch (selectedElement) {
      case "marker1-y":
        selectedValue = this.marker1Yvalue;
        break;
      case "marker1-x":
        selectedValue = this.marker1Xvalue;
        break;
      case "marker2-y":
        selectedValue = this.marker2Yvalue;
        break;
      case "marker2-x":
        selectedValue = this.marker2Xvalue;
        break;
    }

    selectedValue.innerHTML = newValue;
  }

  static get observedAttributes() {
    return ["display"];
  }

  set display(value) {
    this._display = value;
  }

  get display() {
    return this._display;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "display") {
      this.display = newValue;
    }
  }
}

customElements.define("rotation-controls", RotationControls);
