const AppFooterContent = /* html */ `
  <style>
    footer {
      height: 15rem;
      padding: 0 10vw;
      background-color: var(--blue);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content:center;
      position: relative;
    }

    a {
      text-decoration: none;
    }

    .footer-top{
      display: flex;
      align-items: center;
      justify-content:center;
      width: 100%;
    }

    .logos {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: row;
      width: 70%;
    }

    .contact-info {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      border-left: 1px solid white;
      height: 7rem;
      padding: 1rem 0 1rem 3.5rem;
    }

    .contact-us {
      font-family: "Montserrat", sans-serif;
      font-weight: bold;
      font-size: 20px;
      color: white;
      letter-spacing: 1px;
      margin: 1rem 0 1.25rem 0;
    }

    .contact-name {
      font-family: "Montserrat", sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: white;
      margin: 0;
    }

    .contact-email {
      font-family: "Roboto", sans-serif;
      font-size: 12px;
      color: white;
      margin: 0 0 1rem 0;;
    }

    .privacy-policy {
      font-family: "Roboto", sans-serif;
      font-size: 12px;
      color: var(--azure);
      text-align: center;
      position: absolute;
      bottom: 0.1rem;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100%;
      text-align: center;
    }

    @media screen and (max-width: 1200px) {
      .contact-info {
        padding-left: 2rem;
      }
    }

    @media screen and (max-width: 1050px) {
      .footer-top {
        justify-content: space-between;
      }
      .logos {
        justify-content: space-between;
      }
    }
    @media screen and (max-width: 1000px) {
      .contact-info {
        padding-left: 1.25rem;
      }
    }
    @media screen and (max-width: 900px) {
      footer {
        height: 13rem;
        justify-content: flex-start;
      }
      .footer-top {
        margin-top: 1rem
      }

      .contact-info {
        padding-left: 2.5rem;
      }

      .contact-us {
        font-size: 18px;
        margin: 1rem 0;
      }

      .contact-name {
        font-size: 14px;
      }

      .contact-email {
        font-size: 12px;
      }

      .logos {
        justify-content: space-between;
        margin-right: 2.5rem
      }

      img {
        height: 30px;
      }
    }
    @media screen and (max-width: 900px) {
      .logos {
        margin-right: 1rem
      }
      .contact-info {
        padding-left: 1rem;
      }
    }
    @media screen and (max-width: 750px) {
      .logos {
        flex-direction: column;
        align-items: flex-start;
        margin-left: 1rem
      }
      .logos a:nth-of-type(2n) {
        margin: 1rem 0
      }
      .contact-info {
        border: none;
      }
      .privacy-policy {
        font-size: 10px;
      }
    }

    @media screen and (max-width: 500px) {
      .privacy-policy {
        font-size: 8px;
      }
    }

    @media screen and (max-width: 500px) {
      footer {
        height: 11.5rem;
      }

      img {
        height: 25px;
      }
      .contact-us {
        font-size: 16px;
        margin: 0.8rem 0;
      }

      .contact-name {
        font-size: 12px;
      }

      .contact-email {
        font-size: 10px;
      }
    }
    @media screen and (max-width: 450px) {
      .logos {
        margin-left: 0;
      }

      .contact-info {
        padding-left: 0.5rem;
      }
    }
    @media screen and (max-width: 350px) {
      img {
        height: 25px;
      }
      .privacy-policy {
        font-size: 7px;
      }
      .contact-us {
        font-size: 14px;
        margin: 0.8rem 0;
      }

      .contact-name {
        font-size: 10px;
      }

      .contact-email {
        font-size: 8px;
      }
    }
  </style>
  <footer>
    <div class="footer-top">
      <div class="logos">
        <a href="https://www.epfl.ch" target="_blank">
          <img src="/assets/img/epfl.png" alt="epfl logo" height="40" />  
        </a>
        <a href="http://www.snf.ch" target="_blank">
          <img src="/assets/img/snf.png" alt="snf logo" height="40" />  
        </a>
        <a href="https://www.epfl.ch/labs/lbm/" target="_blank">
          <img src="/assets/img/lbm.jpg" alt="lbm logo" height="40" />  
        </a>
      </div>
      <div class="contact-info">
        <p class="contact-us">
          Contact us
        </p>
        <a href="http://labriataphd.altervista.org/" target="_blank">
          <p class="contact-name">
            Luciano Abriata
          </p>
        </a>
        <p class="contact-email">
          luciano.abriata@epfl.ch
        </p>
        <a href="https://www.fjcr.pro/" target="_blank">
          <p class="contact-name">
            Fabio Cortés
          </p>
        <a>
        <p class="contact-email">
          fabio.cortesrodriguez@epfl.ch
        </p>
      </div>
    </div>
    <p class="privacy-policy">
      Privacy Policy | Copyright © 2020 Laboratory for biomolecular modeling, EPFL. All rights reserved.
    </p>
  </footer>`;

class AppFooter extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = AppFooterContent;
  }
}

customElements.define("app-footer", AppFooter);
