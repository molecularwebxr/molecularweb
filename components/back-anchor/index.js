const BackAnchorContent = /* html */`
  <style>
    a {
      cursor: pointer;
      position: absolute;
      bottom: 0.5rem;
      left: 1.5rem;
      z-index: 1;
    }
    svg {
      transition: transform 0.2s;
      width: 40px;
      height: 40px;
    }
    #arrow-path {
      transition: 0.2s;
      will-change: fill;
      fill: white;
    }
    a:hover #arrow-path{
      fill: var(--orange);
    }
    @media screen and (max-width: 500px) {
      a {
        left: 0.5rem;
      }
    }
  </style>
  <a id="anchor" href="/index.html">
    <svg width="100%" height="100%" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g id="Artboard1" transform="matrix(4.54545,0,0,5.55556,-95.4545,-38.8889)">
        <g clip-path="url(#_clip1)">
          <g transform="matrix(1.22222,0,0,0.75,-1,-3.5)">
              <ellipse cx="22.5" cy="20" rx="4.5" ry="6" style="fill:rgb(23,58,123);"/>
          </g>
          <g transform="matrix(0.260741,0,0,0.213333,24.5202,8.62)">
              <path id="arrow-path" d="M14.608,23.25C15.379,24.029 15.379,25.284 14.608,26.063L13.907,26.771C13.605,27.076 13.115,27.076 12.813,26.771L0.227,14.053C-0.076,13.748 -0.076,13.252 0.227,12.947L12.813,0.229C13.115,-0.076 13.605,-0.076 13.907,0.229L14.608,0.937C15.379,1.716 15.379,2.971 14.608,3.75L5.506,12.947C5.204,13.252 5.204,13.748 5.506,14.053L14.608,23.25Z" />
          </g>
        </g>
      </g>
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
