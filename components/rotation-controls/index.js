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

  .rotation-marker {
    width: 241px;
    padding:  0 12px;
    box-sizing: border-box;
  }

  .embedded-container {
    padding-right: 0.5rem;
    width: auto;
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

  .embedded {
    background-color: transparent;
    padding-right: 0;
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

  @media screen and (max-width: 450px) {
    .rotation-controls {
     display: none;
    }
  }
  </style>
    <div id="container" class="rotation-marker">
      <div id="bar-z" class="rotation-bar">
        <p class="small">
          <intl-message key="app.rotate"></intl-message><span>Z</span>
        </p>
        <input type="range" min="0" max="360" value="0" step="5" id="marker-z" />
        <div class="number-box">
          <p class="small num">
            <span id="marker-z-value">0</span><span>°</span>
          </p>
        </div>
      </div>
      <div id="bar-y" class="rotation-bar">
        <p class="small">
          <intl-message key="app.rotate"></intl-message><span>Y</span>
        </p>
        <input type="range" min="0" max="360" value="0" step="5" id="marker-y" />
        <div class="number-box">
          <p class="small num">
            <span id="marker-y-value">0</span><span>°</span>
          </p>
        </div>
      </div>
      <div id="bar-x" class="rotation-bar">
        <p class="small">
          <intl-message key="app.rotate"></intl-message><span>X</span>
        </p>
        <input type="range" min="0" max="360" value="0" step="5" id="marker-x" />
        <div class="number-box">
          <p class="small num">
            <span id="marker-x-value">0</span><span>°</span>
          </p>
        </div>
      </div>
    </div>
    `;

class RotationControls extends HTMLElement {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      RotationControlsContent.content.cloneNode(true)
    );

    this.markerZ = this.shadowRoot.getElementById("marker-z");
    this.markerY = this.shadowRoot.getElementById("marker-y");
    this.markerX = this.shadowRoot.getElementById("marker-x");
    this.barZ = this.shadowRoot.getElementById("bar-z");
    this.barY = this.shadowRoot.getElementById("bar-y");
    this.barX = this.shadowRoot.getElementById("bar-x");
    this.container = this.shadowRoot.getElementById("container");

    this.markerZvalue = this.shadowRoot.getElementById("marker-z-value");
    this.markerYvalue = this.shadowRoot.getElementById("marker-y-value");
    this.markerXvalue = this.shadowRoot.getElementById("marker-x-value");

    this.markerZ.addEventListener("input", this.handleChange);
    this.markerY.addEventListener("input", this.handleChange);
    this.markerX.addEventListener("input", this.handleChange);
  }

  handleChange(e) {
    var selectedElement = e.target.id;
    var newValue = e.target.value;
    var markerSelected = this.marker;
    var selectedValue;
    var axis;

    switch (selectedElement) {
      case "marker-z":
        selectedValue = this.markerZvalue;
        axis = "z";
        break;
      case "marker-y":
        selectedValue = this.markerYvalue;
        axis = "y";
        break;
      case "marker-x":
        selectedValue = this.markerXvalue;
        axis = "x";
        break;
    }

    var detail = {
      marker: markerSelected,
      axis,
      value: newValue,
    };

    selectedValue.innerHTML = newValue;

    this.dispatchEvent(new CustomEvent("rotateGraphics", { detail }));
  }

  reset() {
    this.markerZ.value = 0;
    this.markerX.value = 0;
    this.markerY.value = 0;

    this.markerZvalue.innerHTML = "0";
    this.markerYvalue.innerHTML = "0";
    this.markerXvalue.innerHTML = "0";
  }

  static get observedAttributes() {
    return ["marker", "type"];
  }

  set marker(value) {
    this._marker = value;
  }

  get marker() {
    return this._marker;
  }

  set type(value) {
    this._type = value;
    if (this._type === "embedded") {
      this.barZ.classList.add("embedded");
      this.barY.classList.add("embedded");
      this.barX.classList.add("embedded");
      this.container.classList.add("embedded-container");
    }
  }

  get type() {
    return this._type;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "marker") {
      this.marker = newValue;
    }

    if (attrName === "type") {
      this.type = newValue;
    }
  }
}

customElements.define("rotation-controls", RotationControls);
