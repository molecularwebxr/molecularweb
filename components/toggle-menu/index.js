const menuIconTemplate = document.createElement("template");
menuIconTemplate.innerHTML = /* html */ `
  <style>
    .container {
      position: relative;
    }

    a {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      width: 40px;
      height: 40px;
    }

    #circle {
      transition: 0.2s;
      fill: white;
    }

    .icon-path {
      fill: var(--primarydark);
    }

    a:hover #circle {
      fill: var(--secondary);
    }

    a:hover .tooltip {
      visibility: visible;
      opacity: 1;
    }

    .tooltip {
      right: calc(100% + 22px);
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      background-color: var(--primarylight);
      visibility: hidden;
      opacity: 0;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition: 0.2s;
      white-space: nowrap;
    }

    .tooltip p {
      font-family: "Roboto";
      color: #ffffff;
      font-size: 1rem;
      text-align: left;
      margin: 0;
    }

    .triangle {
      position: absolute;
      top: 50%;
      right: -10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid var(--primarylight);
      transform: translateY(-50%);
    }

    @media screen and (max-width: 900px) {
      a:hover .tooltip {
        display: none;
      }
    }

    @media (max-width: 440px) {
      svg {
        width: 30px;
        height: 30px;
      }
    }

    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 28px;
        height: 28px;
      }
    }
  </style>
  <div class="container">
    <a id="anchor">
      <svg width="100%" height="100%" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.79021,0,0,1.79021,53.7063,19.6923)">
            <circle cx="113" cy="132" r="143" id="circle"/>
        </g>
        <g id="menu-icon" transform="matrix(22.2222,0,0,22.2222,256,256)">
          <g transform="matrix(1,0,0,1,-9,-9)">
            <g transform="matrix(-1,0,0,1,8.93514,2.10478)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(-1,0,0,1,8.99997,9.00003)">
                <circle class="icon-path" cx="0" cy="0" r="3.111" />
            </g>
            <g transform="matrix(-1,0,0,1,8.93514,15.7659)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(4.37114e-08,-1,-1,-4.37114e-08,15.7657,8.93526)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(4.37114e-08,-1,-1,-4.37114e-08,2.10469,8.93526)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(-0.707107,-0.707107,-0.707107,0.707107,13.7652,4.10571)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(-0.707107,-0.707107,-0.707107,0.707107,4.10512,13.7651)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(0.707107,-0.707107,-0.707107,-0.707107,13.765,13.7652)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
            <g transform="matrix(0.707107,-0.707107,-0.707107,-0.707107,4.10535,4.10525)">
                <circle class="icon-path" cx="0" cy="0" r="1.66" />
            </g>
          </g>
        </g>
      </svg>
      <div class="tooltip">
        <p><intl-message key="menu.language"></p>
        <div class="triangle"></div>
      </div>
    </a>
  </div>`;

class ToggleMenu extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(menuIconTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("toggleMenu"));
  }
}

customElements.define("toggle-menu", ToggleMenu);
