const WhiteIconTemplate = document.createElement("template")
WhiteIconTemplate.innerHTML = /* html */ `
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
     fill: white;
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
     </svg>
   </a>
 </div>`;

class WhiteScreen extends HTMLElement {
 constructor() {
   super();

   this.handleClick = this.handleClick.bind(this);

   this.attachShadow({ mode: "open" });
   this.shadowRoot.appendChild(WhiteIconTemplate.content.cloneNode(true));

   this.buttonElement = this.shadowRoot.querySelector("a");
   this.buttonElement.addEventListener("click", this.handleClick);
 }

 handleClick() {
   this.dispatchEvent(new CustomEvent("white-screen"));
 }
}

customElements.define("white-screen", WhiteScreen);
