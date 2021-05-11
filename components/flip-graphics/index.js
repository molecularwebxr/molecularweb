const FlipGraphicsContent = /* html */ `
  <style>
    a {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    p {
      font-family: "Roboto";
      color: #ffffff;
      font-size: 1rem;
      text-align: left;
      transition: 0.2s;
      margin: 0 0 0 0.5rem;
    }

    svg {
      transition: transform 0.2s;
      width: 40px;
      height: 40px;
    }

    #circle {
      fill: white;
      transition: 0.2s;
    }

    .flip-path {
      fill: var(--primarydark);
    }

    a:hover #circle {
      fill: var(--secondary)
    }

    a:hover p {
      color: var(--secondary);
    }

    @media (max-width: 440px) {
      svg {
        width: 30px;
        height: 30px;
      }

      p {
        font-size: 0.8rem;
      }
    }

    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 28px;
        height: 28px;
      }

      p {
        font-size: 0.75rem;
      }
    }
  </style>
  <a id="anchor">
    <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
        <circle id="circle" cx="113" cy="132" r="143" />
      </g>
      <g id="flip" transform="matrix(12.4138,0,0,12.4138,256,256)">
        <g transform="matrix(1,0,0,1,-14.5,-14.5)">
            <path class="flip-path" d="M6.431,8.883C6.517,8.938 6.618,8.968 6.72,8.968C7.013,8.968 7.254,8.727 7.254,8.434L7.254,7L21.746,7L21.746,8.434C21.746,8.727 21.987,8.968 22.28,8.968C22.382,8.968 22.483,8.938 22.569,8.883L25.579,6.949C25.731,6.851 25.824,6.681 25.824,6.5C25.824,6.318 25.731,6.149 25.579,6.051L22.569,4.117C22.483,4.062 22.382,4.032 22.28,4.032C21.987,4.032 21.746,4.273 21.746,4.566L21.746,6L7.254,6L7.254,4.566C7.254,4.273 7.013,4.032 6.72,4.032C6.618,4.032 6.517,4.062 6.431,4.117L3.421,6.051C3.269,6.149 3.176,6.318 3.176,6.5C3.176,6.681 3.269,6.851 3.421,6.949L6.431,8.883ZM26.767,24.459L17.62,13.025C17.447,12.809 17.186,12.683 16.91,12.683C16.411,12.683 16,13.094 16,13.593L16,25C16,25.549 16.451,26 17,26L26.027,26C26.547,26 26.975,25.572 26.975,25.052C26.975,24.836 26.902,24.627 26.767,24.459ZM11.38,13.025L2.233,24.459C2.098,24.627 2.025,24.836 2.025,25.052C2.025,25.572 2.453,26 2.973,26L12,26C12.549,26 13,25.549 13,25L13,13.593C13,13.094 12.589,12.683 12.09,12.683C11.814,12.683 11.553,12.809 11.38,13.025Z" />
        </g>
      </g>
    </svg>
    <p>
      <intl-message key="app.flipMolecule">
    </p>
  </a>`;

class FlipGraphics extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = FlipGraphicsContent;

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("flipGraphics"));
  }
}

customElements.define("flip-graphics", FlipGraphics);
