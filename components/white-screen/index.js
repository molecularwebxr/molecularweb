const WhiteIconTemplate = /* html */ `
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
    </g>
    </svg>
    <p>
       <intl-message key="app.whitescreen">
    </p>
  </a>`;

class WhiteScreen extends HTMLElement {
 constructor() {
   super();

   this.handleClick = this.handleClick.bind(this);

   let shadow = this.attachShadow({ mode: "open" });
   shadow.innerHTML = WhiteIconTemplate;

   this.buttonElement = this.shadowRoot.querySelector("a");
   this.buttonElement.addEventListener("click", this.handleClick);
 }

 handleClick() {
   this.dispatchEvent(new CustomEvent("white-screen"));
 }
}

customElements.define("white-screen", WhiteScreen);