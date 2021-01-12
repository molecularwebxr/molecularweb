const SwapCamContent = /* html */`
  <style>
    a {
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
      height: 41px;
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
      a:hover #circle{
        fill: #FFFFFF;
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

      a:hover #circle{
        fill: #FFFFFF;
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
      <g transform="matrix(0.755859,0,0,0.755859,62.5,62.2476)">
          <path class="camera-path" d="M256,275C214.828,275 181.332,241.508 181.332,200.332C181.332,159.16 214.828,125.668 256,125.668C297.172,125.668 330.668,159.16 330.668,200.332C330.668,241.508 297.172,275 256,275ZM256,157.668C232.469,157.668 213.332,176.801 213.332,200.332C213.332,223.863 232.469,243 256,243C279.531,243 298.668,223.863 298.668,200.332C298.668,176.801 279.531,157.668 256,157.668Z" />
      </g>
      <g transform="matrix(0.755859,0,0,0.755859,62.5,62.2476)">
          <path class="camera-path" d="M261.332,451C114.793,451 0,392.441 0,317.668C0,297.527 3.328,282.316 20.352,264.246C26.434,257.805 36.543,257.527 42.988,263.566C49.406,269.625 49.727,279.758 43.668,286.199C33.684,296.762 32,303.332 32,317.668C32,366.605 124.16,419 261.332,419C270.164,419 277.332,426.168 277.332,435C277.332,443.832 270.164,451 261.332,451Z" />
      </g>
      <g transform="matrix(0.755859,0,0,0.755859,62.5,62.2476)">
          <path class="camera-path" d="M304.746,448.141C296.684,448.141 289.75,442.063 288.852,433.848C287.914,425.059 294.25,417.188 303.063,416.227C408.895,404.836 480,358.84 480,323C480,304.824 476.586,298.828 466.711,284.129C461.781,276.793 463.723,266.852 471.082,261.922C478.398,256.973 488.363,258.938 493.289,266.297C504.918,283.641 512,296.098 512,323C512,382.648 425.559,435.234 306.477,448.035C305.898,448.098 305.324,448.141 304.746,448.141Z" />
      </g>
      <g transform="matrix(0.755859,0,0,0.755859,62.5,62.2476)">
          <path class="camera-path" d="M400,339L112,339C85.523,339 64,317.477 64,291L64,131C64,104.523 85.523,83 112,83L160.789,83L182.465,39.629C188.82,26.914 201.621,19 215.852,19L296.148,19C310.379,19 323.18,26.914 329.535,39.629L351.211,83L400,83C426.477,83 448,104.523 448,131L448,291C448,317.477 426.477,339 400,339ZM112,115C103.168,115 96,122.168 96,131L96,291C96,299.832 103.168,307 112,307L400,307C408.832,307 416,299.832 416,291L416,131C416,122.168 408.832,115 400,115L341.332,115C335.273,115 329.727,111.566 327.02,106.148L300.906,53.945C300.012,52.129 298.176,51 296.148,51L215.852,51C213.824,51 211.988,52.129 211.07,53.945L184.98,106.148C182.273,111.566 176.727,115 170.668,115L112,115Z" />
      </g>
      <g transform="matrix(0.755859,0,0,0.755859,62.5,62.2476)">
          <path class="camera-path" d="M208,493.668C203.309,493.668 198.656,491.617 195.5,487.672C189.973,480.762 191.082,470.711 197.996,465.188L235.711,435L197.996,404.813C191.105,399.289 189.996,389.238 195.5,382.328C201.004,375.438 211.051,374.309 217.984,379.832L271.316,422.5C275.113,425.551 277.332,430.137 277.332,435C277.332,439.863 275.113,444.449 271.34,447.48L218.004,490.148C215.039,492.516 211.52,493.668 208,493.668Z" />
      </g>
    </svg>
    <p>Swap Camera</p>
  </a>`;


class SwapCam extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = SwapCamContent;

  }
}

customElements.define("swap-camera", SwapCam);
