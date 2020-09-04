const StopTempContent = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      transition: transform 0.2s;
      width: 28px;
      height: 29px;
    }
    #circle {
      fill: #FFFFFF;
      transition: 0.2s;
    }
    .path {
      fill: var(--primarydark);
    }
    a:hover #circle{
      fill: var(--secondary);
    }
    @media (max-width: 440px) {
      svg {
        width: 24px;
        height: 25px;
      }
    }
    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 24px;
        height: 25px;
      }
    }
  </style>
  <a id="anchor">
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
          <circle id="circle" cx="113" cy="132" r="143" />
      </g>
      <g class="path" transform="matrix(0.808824,0,0,0.986547,48.9412,-21.713)">
        <path d="M392,192.3C392,179.992 379.812,170 364.8,170L147.2,170C132.188,170 120,179.992 120,192.3L120,370.7C120,383.008 132.188,393 147.2,393L364.8,393C379.812,393 392,383.008 392,370.7L392,192.3Z" />
    </g>
    </svg>
  </a>`;

class StopTemp extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = StopTempContent;

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("stopTemp"));
  }
}

customElements.define("stop-temp", StopTemp);
