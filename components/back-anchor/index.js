const BackAnchorContent = /* html */`
  <style>
    a {
      cursor: pointer;
      position: absolute;
      bottom: 3px;
      left: 3px;
      z-index: 1;
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

    @media (max-width: 440px) {
      svg {
        width: 30px;
        height: 30px;
      }
    }

    @media screen and (max-height: 450px) and (orientation: landscape) {
      svg {
        width: 30px;
        height: 30px;
      }
    }

  </style>
  <a href="/index.html">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect id="circle" x="40" y="40" width="40" height="40" rx="20" transform="rotate(-180 40 40)" />
      <path id="arrow-path" d="M14.6291 20.6794L21.6073 28.2158C22.0003 28.6402 22.6703 28.6437 23.0677 28.2235L23.3571 27.9174C23.7189 27.5348 23.722 26.9373 23.3643 26.5509L17.9277 20.6794C17.5727 20.296 17.5727 19.704 17.9277 19.3206L23.3429 13.4723C23.6951 13.0919 23.6982 12.5053 23.35 12.1212L23.0665 11.8086C22.6724 11.3739 21.9905 11.3703 21.5919 11.8008L14.6291 19.3206C14.2741 19.704 14.2741 20.296 14.6291 20.6794Z" />
    </svg>
  </a>`;

class BackAnchor extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = BackAnchorContent;

  }
}

customElements.define("back-anchor", BackAnchor);
