const ArrowAnchorContent = `
  <style>
    a {
      cursor: pointer;
      position: absolute;
      bottom: 0;
      right: 2rem;
    }
    #arrow-path {
      transition: 0.2s;
      will-change: fill;
    }
    a:hover #arrow-path{
      fill: #2660A4;
    }
  </style>
  <a id="anchor">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    id="Layer_1"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    style="enable-background: new 0 0 512 512;"
    xml:space="preserve"
    width="25"
    height="25"
    >
      <path
        d="M508.875,248.458l-160-160c-4.167-4.167-10.917-4.167-15.083,0c-4.167,4.167-4.167,10.917,0,15.083l141.792,141.792    H10.667C4.771,245.333,0,250.104,0,256s4.771,10.667,10.667,10.667h464.917L333.792,408.458c-4.167,4.167-4.167,10.917,0,15.083    c2.083,2.083,4.813,3.125,7.542,3.125c2.729,0,5.458-1.042,7.542-3.125l160-160C513.042,259.375,513.042,252.625,508.875,248.458z    "
        data-original="#000000"
        class="active-path"
        data-old_color="#000000"
        fill="#F19953"
        id="arrow-path"
      />
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
