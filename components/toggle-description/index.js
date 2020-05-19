const descriptionIconTemplate = document.createElement("template"); 
descriptionIconTemplate.innerHTML = /* html */ `
  <style>
    a {
      cursor: pointer;
    }
    svg {
      transition: transform 0.2s;
      width: 40px;
      height: 40px;
    }
    text {
      transition: 0.2s;
      fill: white;
    }
    a:hover text{
      fill: var(--orange);
    }
  </style>
  <a id="anchor">
  <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
        <circle cx="113" cy="132" r="143" style="fill:rgb(23,58,123);"/>
    </g>
    <g transform="matrix(1.87178,0,0,1.7082,-68.4225,59.423)">
        <text x="141.542px" y="218.157px" style="font-size:288px;">i</text>
    </g>
</svg>
  </a>`;

class ToggleDescription extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(descriptionIconTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("toggleInstructions"));
  }
}

customElements.define("toggle-description", ToggleDescription);
