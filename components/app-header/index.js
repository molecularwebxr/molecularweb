const headerTemplate = document.createElement("template");
headerTemplate.innerHTML = /* html */ `
  <style>
  header {
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
    padding: 1rem 4rem;
    background-color: #FFFFFF;
  }

  a {
    text-decoration: none;
  }

  figure {
    margin: 0;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
  }
  
  .menu {
    width: 35rem;
    align-items: center;
    justify-content: space-between;
  }

  .menu-link {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 18px;
    color: var(--primary);
    will-change: color;
    transition: 0.2s;
    cursor: pointer;
  }

  .menu-link:hover,
  .language:hover .menu-link,
  .mobile-menu-link:hover {
    color: var(--secondary);
  }

  .language {
    position: relative;
  }

  .language-menu {
    background-color: white;
    color: var(--primary);
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 1rem;
    list-style-type: none;
    padding: 0.5rem;
    width: 6rem;
    visibility: hidden;
    position: absolute;
    cursor: pointer;
    left: 50%;
    top: 7px;
    transform: translate(-45%, 0);
    z-index: 1;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .language-menu li {
    margin: 0.5rem 0.2rem;
    transition: color 0.2s;
  }

  .language-menu li:hover {
    color: var(--secondary);
  }

  .language:hover .language-menu {
    visibility: visible;
  }

  .hamburger-menu {
    display: none;
    width: 25px;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    transition: all 0.5s;
  }

  .hamburger-menu.active {
    position: fixed;
    right: 2rem;
  }

  .mobile-menu {
    display: none;
    height: 100vh;
    width: 75vw;
    position: fixed;
    overflow-x: hidden;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(100vw);
    transition: 0.5s;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(156.2deg, #173A7B 0%, #5C45EB 101.87%);
  }

  .mobile-menu.active {
    transform: translateX(25vw);
  }

  .mobile-menu-content {
    flex: 1 0 auto;
    align-items: center;
    position: relative;
  }

  .mobile-menu-content figure {
    margin-top: 10vh;
  }

  .mobile-menu-links {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12rem;
  }

  .mobile-menu-link {
    color: #FFFFFF;
    text-align: center;
    font-weight: 500;
    font-size: 32px;
    margin: 0.5rem 0;
    cursor: pointer;
    will-change: color;
    transition: 0.2s;
  }

  .mobile-menu-footer {
    flex-shrink: 0;
    font-family: "Roboto", sans-serif;
    font-size: 10px;
    color: #FFFFFF;
    text-align: center;
  }

  .overlay {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
    visibility: hidden;
    transition: 0.5s;
  }

  .overlay.active {
    opacity: 1;
    visibility: visible;
    z-index: 1;
  }

  .bar {
    width: 25px;
    height: 3px;
    background-color: var(--primary);
    margin: 2px;
    border-radius: 2px;
    transition: 0.5s;
  }

  .hamburger-menu.active .bar {
    background-color: #FFFFFF;
  }

  @keyframes bar1in {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(7px);
    }
    100% {
      transform: translateY(7px) rotate(45deg);
    }
  }

  @keyframes bar2in {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes bar3in {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7px);
    }
    100% {
      transform: translateY(-7px) rotate(-45deg);
    }
  }

  @keyframes bar1out {
    0% {
      transform: translateY(7px) rotate(45deg);
    }
    50% {
      transform: translateY(7px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes bar2out {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes bar3out {
    0% {
      transform: translateY(-7px) rotate(-45deg);
    }
    50% {
      transform: translateY(-7px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @media screen and (max-width: 800px) {
    .hamburger-menu {
      display: flex;
    }
    .menu {
      display: none;
    }
    .mobile-menu {
      display: flex;
    }
    header {
      padding: 1rem 2rem;
    }
  }
  @media screen and (max-width: 450px) {
    .mobile-menu-links.lang-menu {
      margin-top: 4rem;
    }
  }
  </style>
  <div id="overlay" class="overlay"></div>
  <header class="row">
    <figure>
      <a href="/index.html">
        <molecule-icon></molecule-icon>
      </a>
    </figure>
    <div class="menu row">
      <a class="menu-link" href="/pages/about.html">
        <intl-message key="menu.about"></intl-message>
      </a>

      <a class="menu-link" href="/pages/contact.html">
        <intl-message key="menu.getInTouch"></intl-message>
      </a>

      <a
        href="/pages/feedback.html"
        class="menu-link"
      >
        <intl-message key="menu.feedback"></intl-message>
      </a>

      <a
        href="/assets/markers/allmarkers.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-link"
      >
        <intl-message key="menu.markers"></intl-message>
      </a>

      <a
        class="menu-link"
        id="instructions"
      >
        <intl-message key="menu.instructions"></intl-message>
      </a>

      <div class="language">
        <a class="menu-link language">
          <intl-message key="menu.language"></intl-message>
        </a>

        <ul class="language-menu">
          <li id="en">English</li>
          <li id="fr">Français</li>
          <li id="de">Deutsche</li>
          <li id="it">Italiano</li>
          <li id="es">Español</li>
          <li id="pt">Português</li>
          <li id="th">ไทย</li>
        </ul>
      </div>
    </div>

    <div id="hamburger" class="hamburger-menu">
      <div id="bar1" class="bar"></div>
      <div id="bar2" class="bar"></div>
      <div id="bar3" class="bar"></div>
    </div>
  </header>

  <div id="mobile-menu" class="mobile-menu column">
    <div class="mobile-menu-content column">
      <figure>
        <a href="/index.html">
          <molecule-icon medium no-strokes />
        </a>
      </figure>
      <div class="mobile-menu-links column">
        <a class="mobile-menu-link"
           href="/pages/about.html"
        >
          <intl-message key="menu.about"></intl-message>
        </a>

        <a class="mobile-menu-link"
           href="/pages/contact.html"
        >
          <intl-message key="menu.getInTouch"></intl-message>
        </a>

        <a
          class="mobile-menu-link"
          href="/pages/feedback.html"
        >
          <intl-message key="menu.feedback"></intl-message>
        </a>

        <a
          href="/assets/markers/allmarkers.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="mobile-menu-link"
        >
          <intl-message key="menu.markers"></intl-message>
        </a>

        <a
          id="instructions-mobile"
          class="mobile-menu-link"
        >
          <intl-message key="menu.instructions"></intl-message>
        </a>

        <a class="mobile-menu-link" id="lang-option">
          <intl-message key="menu.language"></intl-message>
        </a>
      </div>
    </div>
    
    <p class="mobile-menu-footer">
      <intl-message key="app.policy"></intl-message>
    </p>
  </div>
  
  <div id="mobile-menu-lang" class="mobile-menu column">
    <div class="mobile-menu-content column">
      <figure>
        <a href="/index.html">
          <molecule-icon medium no-strokes />
        </a>
      </figure>
      <div class="mobile-menu-links lang-menu column">
        <a class="mobile-menu-link" id="en_">
          English
        </a>

        <a class="mobile-menu-link" id="es_">
          Español
        </a>

        <a class="mobile-menu-link" id="fr_">
          Français
        </a>

        <a class="mobile-menu-link" id="it_">
          Italiano
        </a>

        <a class="mobile-menu-link" id="pt_">
          Português
        </a>

        <a class="mobile-menu-link" id="de_">
          Deutsche
        </a>

        <a class="mobile-menu-link" id="th_">
          ไทย
        </a>
      </div>
    </div>
    
    <p class="mobile-menu-footer">
      <intl-message key="app.policy"></intl-message>
    </p>
  </div>

  `;

class AppHeader extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleLangMenu = this.handleLangMenu.bind(this);
    this.handleInstructions = this.handleInstructions.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    this.bar1 = this.shadowRoot.querySelector("#bar1");
    this.bar2 = this.shadowRoot.querySelector("#bar2");
    this.bar3 = this.shadowRoot.querySelector("#bar3");
    this.hamburger = this.shadowRoot.querySelector("#hamburger");
    this.mobileMenu = this.shadowRoot.querySelector("#mobile-menu");
    this.mobileMenuLang = this.shadowRoot.querySelector("#mobile-menu-lang");
    this.langBtn = this.shadowRoot.querySelector("#lang-option");
    this.overlay = this.shadowRoot.querySelector("#overlay");
    this.instructions = this.shadowRoot.querySelector("#instructions");
    this.instructionsMobile = this.shadowRoot.querySelector("#instructions-mobile");

    this.menuActive = false;
    this.langMenuActive = false;

    this.hamburger.addEventListener("click", this.handleClick);
    this.langBtn.addEventListener("click", this.handleLangMenu);
    this.instructions.addEventListener("click", this.handleInstructions);
    this.instructionsMobile.addEventListener("click", this.handleInstructions);
  }

  handleClick(event) {
    if (this.langMenuActive) {
      this.mobileMenuLang.classList.remove("active");
      this.langMenuActive = false;
      return;
    }

    this.hamburger.classList.toggle("active");
    this.mobileMenu.classList.toggle("active");
    this.overlay.classList.toggle("active");
    if (this.menuActive) {
      this.bar1.style.animation = "bar1out .5s forwards";
      this.bar2.style.animation = "bar2out .5s forwards";
      this.bar3.style.animation = "bar3out .5s forwards";
      this.menuActive = false;
    } else {
      this.menuActive = true;
      this.bar1.style.animation = "bar1in .5s forwards";
      this.bar2.style.animation = "bar2in .5s forwards";
      this.bar3.style.animation = "bar3in .5s forwards";
    }
  }

  handleLangMenu(event) {
    this.mobileMenuLang.classList.add("active");
    this.langMenuActive = true;
  }

  handleInstructions(event) {
    this.dispatchEvent(new CustomEvent("displayInstructions"));
  }
}

customElements.define("app-header", AppHeader);
