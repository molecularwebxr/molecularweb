 const resetIconTemplate = document.createElement("template")
 resetIconTemplate.innerHTML = /* html */ `
  <style>
    .container {
      position: relative;
    }

    a {
      cursor: pointer;
    }

    svg {
      width: 40px;
      height: 41px;
    }

    #circle {
      fill: #FFFFFF;
      transition: 0.2s;
    }

    path {
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

    @media screen and (max-width: 440px) {
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
            <circle cx="113" cy="132" r="143" id="circle" />
        </g>
        <g id="reload" transform="matrix(20,0,0,20,256,256)">
            <g transform="matrix(1,0,0,1,-12.5,-12.5)">
                <path d="M12.5,21C12.5,21 12.5,21 12.5,21C8.385,21 5,17.614 5,13.5C5,11.759 5.606,10.072 6.713,8.729C6.808,8.614 6.949,8.547 7.099,8.547C7.373,8.547 7.599,8.773 7.599,9.047C7.599,9.164 7.558,9.276 7.484,9.366C6.525,10.53 6,11.992 6,13.5C6,17.066 8.934,20 12.5,20C16.066,20 19,17.066 19,13.5C19,9.934 16.066,7 12.5,7L9.5,7C9.226,7 9,6.774 9,6.5C9,6.226 9.226,6 9.5,6L12.5,6C16.614,6 20,9.386 20,13.5C20,17.614 16.614,21 12.5,21Z" />
                <path d="M11.5,9C11.367,9 11.24,8.948 11.146,8.854L9.146,6.854C9.052,6.76 8.999,6.633 8.999,6.5C8.999,6.225 9.225,5.999 9.5,5.999C9.633,5.999 9.76,6.052 9.854,6.146L11.854,8.146C11.948,8.24 12.001,8.367 12.001,8.5C12.001,8.774 11.775,9 11.501,9C11.501,9 11.5,9 11.5,9Z" />
                <path d="M9.5,7C9.5,7 9.499,7 9.499,7C9.225,7 8.999,6.774 8.999,6.5C8.999,6.367 9.052,6.24 9.146,6.146L11.146,4.146C11.24,4.052 11.367,3.999 11.5,3.999C11.775,3.999 12.001,4.225 12.001,4.5C12.001,4.633 11.948,4.76 11.854,4.854L9.854,6.854C9.76,6.948 9.633,7 9.5,7Z" />
            </g>
        </g>
      </svg>
      <div class="tooltip">
        <p><intl-message key="app.reset"></p>
        <div class="triangle"></div>
      </div>
    </a>
  </div>`;

class ResetActivity extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(resetIconTemplate.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector("a");

    this.buttonElement.addEventListener("click", this.handleClick);
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent("resetActivity"));
  }
}

customElements.define("reset-activity", ResetActivity);
