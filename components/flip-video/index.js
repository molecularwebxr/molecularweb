const FlipVideoContent = /* html */ `
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
      fill: #FFFFFF;
      transition: 0.2s;
    }

    .camera-path {
      fill: var(--primarydark);
    }

    a:hover #circle{
      fill: var(--secondary);
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
        <g class="camera-path" transform="matrix(6.66667,0,0,6.66667,256,256)">
          <g transform="matrix(1,0,0,1,-24,-24)">
              <rect x="0" y="0" width="48" height="48" style="fill:none;fill-rule:nonzero;"/>
              <path d="M40,8L33.66,8L30,4L18,4L14.34,8L8,8C5.79,8 4,9.79 4,12L4,36C4,38.21 5.79,40 8,40L40,40C42.21,40 44,38.21 44,36L44,12C44,9.79 42.21,8 40,8ZM30,31L30,26L18,26L18,31L11,24L18,17L18,22L30,22L30,17L37,24L30,31Z" style="fill-rule:nonzero;"/>
          </g>
      </g>
    </svg>
    <p>
      <intl-message key="app.mirrorVideo">
    </p>
  </a>`;

class FlipVideo extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = FlipVideoContent;

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("flipCamera"));
  }
}

customElements.define("flip-video", FlipVideo);
