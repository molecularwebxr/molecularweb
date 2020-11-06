const ArrowAnchorContent = /* html */`
  <style>
    a {
      cursor: pointer;
      position: absolute;
      bottom: 0.5rem;
      right: 2rem;
    }
    svg {
      transition: transform 0.2s;
    }
    #arrow-path {
      transition: 0.2s;
      fill: var(--primary);
    }
    #circle {
      transition: 0.2s;
      fill: var(--secondary);
    }
    a:hover #arrow-path{
      fill: #FFFFFF;
    }
    a:hover #circle{
      fill: var(--primary);
    }
    a:hover svg {
      transform: translateX(6px);
    }
    @media screen and (max-width: 450px) {
      svg {
        width: 25px;
        height: 25px;
      }
    }
  </style>
  <a id="anchor">
    <svg width="36" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect id="circle" width="40" height="40" rx="20"/>
      <path id="arrow-path" d="M25.3709 19.3206L18.3927 11.7842C17.9997 11.3598 17.3297 11.3563 16.9323 11.7765L16.6429 12.0826C16.2811 12.4652 16.278 13.0627 16.6357 13.4491L22.0723 19.3206C22.4273 19.704 22.4273 20.296 22.0723 20.6794L16.6571 26.5277C16.3049 26.9081 16.3018 27.4947 16.65 27.8788L16.9335 28.1914C17.3276 28.6261 18.0095 28.6297 18.4081 28.1992L25.3709 20.6794C25.7259 20.296 25.7259 19.704 25.3709 19.3206Z"/>
    </svg>
  </a>`;

class ArrowAnchor extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = ArrowAnchorContent;

  }

  connectedCallback() {
    if(this.hasAttribute("url")){
      this.shadowRoot.querySelector("#anchor").setAttribute("href", this.getAttribute("url"));
    }
  }
}

customElements.define("arrow-anchor", ArrowAnchor);
