const descriptionIconTemplate = document.createElement("template"); 
descriptionIconTemplate.innerHTML = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      align-items:center;
    }
    svg {
      transition: transform 0.2s;
      width: 25px;
      height: 25px;
    }
    #circle {
      fill: rgba(255, 255, 255, 0.5);
    }
    path {
      transition: 0.2s;
      fill: var(--primary);
    }
    a:hover #circle{
      fill: var(--secondary);
    }
  </style>
  <a id="anchor">
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
          <circle cx="113" cy="132" r="143" id="circle"/>
      </g>
      <g id="advice" transform="matrix(16.75,0,0,15.3,256,256)">
          <g transform="matrix(1,0,0,1,-10,-10)">
              <path d="M9.9,0C9.3,0 8.8,0.6 8.8,1.2C8.8,1.9 9.4,2.4 10,2.4C10.6,2.4 11.2,1.8 11.2,1.2C11.2,0.6 10.7,0 9.9,0C10,0 9.9,0 9.9,0Z" />
              <path d="M10,4.6C9.3,4.6 8.8,5.2 8.8,5.8L8.8,18.7C8.8,19.4 9.3,19.9 10,19.9C10.7,19.9 11.2,19.4 11.2,18.7L11.2,5.9C11.2,5.2 10.7,4.6 10,4.6Z" />
          </g>
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
    this.dispatchEvent(new CustomEvent("toggleDescription"));
  }
}

customElements.define("toggle-description", ToggleDescription);
