const SwapCamContent = /* html */`
  <style>
    a {
      cursor: pointer;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }
    svg {
      transition: transform 0.2s;
    }
    .path {
      transition: 0.2s;
      fill: var(--primary);
    }
    #circle {
      transition: 0.2s;
      fill: var(--secondary);
    }
    a:active .path{
      fill: #FFFFFF;
    }
    a:active #circle{
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
  <a>
  <svg width="40" height="40" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g id="circle" transform="matrix(-1,7.65714e-16,-7.65714e-16,-1,80,80)">
        <path d="M80,60C80,48.962 71.038,40 60,40C48.962,40 40,48.962 40,60C40,71.038 48.962,80 60,80C71.038,80 80,71.038 80,60Z"/>
    </g>
    <g id="camera" transform="matrix(0.5625,0,0,0.5625,20,20)">
        <g transform="matrix(1,0,0,1,-24,-24)">
            <rect x="0" y="0" width="48" height="48" style="fill:none;fill-rule:nonzero;"/>
            <path class="path" d="M40,8L33.66,8L30,4L18,4L14.34,8L8,8C5.79,8 4,9.79 4,12L4,36C4,38.21 5.79,40 8,40L40,40C42.21,40 44,38.21 44,36L44,12C44,9.79 42.21,8 40,8ZM30,31L30,26L18,26L18,31L11,24L18,17L18,22L30,22L30,17L37,24L30,31Z" />
        </g>
    </g>
</svg>

  </a>`;

class SwapCam extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = SwapCamContent;

  }
}

customElements.define("swap-camera", SwapCam);
