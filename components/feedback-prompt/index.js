const feedbackPromptTemplate = document.createElement("template");
feedbackPromptTemplate.innerHTML = /* html */ `
  <style>
  p {
    margin:0;
  }

  .survey {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    background: linear-gradient(168.33deg, #4432B0 0%, #5C45EB 100%);
    padding: 24px 32px;
    width: max-content;
    box-sizing: border-box;
    border-radius: 12px;
    display: flex;
    align-items: center;
    transform: translate(-50%, -100px);
    animation: fadeInDown 3s 2s forwards ease-out;
  }

  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translate(-50%, -100px);
    }

    100% { 
      opacity: 1;
      transform: translate(-50%, 8px);
    }
  }

  .text-container {
    display: flex;
    align-items: center;
  }

  p.icon-survey {
    font-size: 24px;
    margin-right: 8px;
  }

  .medium-text-bold {
    font-family: 'Roboto', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .btn-container {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }

  .btn-primary {
    margin: 0 4px;
    padding: 5px 24px;
    background: #9BF99F;
    border-radius: 6px;
    color: #5C45EB;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
  }

  .btn-primary:active,
  .btn-dismiss:active {
    transform: scale(.95);
  }

  .btn-dismiss {
    margin: 0 4px;
    padding: 5px 24px;
    background: #FFFFFF;
    border-radius: 6px;
    color: #5C45EB;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .survey.out {
    transform: translate(-50%, 8px);
    animation: fadeOut .2s forwards ease-in;
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translate(-50%, 8px);
    }

    100% { 
      opacity: 1;
      transform: translate(-50%, -100px);
    }
  }

  @media screen and (max-width: 900px) {
      .medium-text-bold {
        font-size: 16px;
      }

      p.icon-survey {
        font-size: 20px;
      }

      .btn-primary,
      .btn-dismiss {
        font-size: 14px;
      }
    }

    @media screen and (max-width: 750px) {
      .survey {
        padding: 16px 24px;
      }

      p.icon-survey {
        font-size: 18px;
      }

      .btn-primary,
      .btn-dismiss {
        padding: 5px 16px;
      }
    }

    @media screen and (max-width: 750px) {
      .survey {
        padding: 16px 20px;
      }

      .medium-text-bold {
        font-size: 14px;
      }

      p.icon-survey {
        font-size: 16px;
      }

      .btn-primary,
      .btn-dismiss {
        font-size: 12px;
        padding: 5px 14px;
      }
    }

    @media screen and (max-width: 600px) {
      .survey {
        flex-direction: column;
      }

      .btn-container {
        margin: 10px 0 0 0;
      }
      
    }

    @media screen and (max-width: 420px) {
      .survey {
        padding: 14px 16px;
      }
      .medium-text-bold {
        font-size: 14px;
        font-weight: 500;
      }

      p.icon-survey {
        font-size: 14px;
        margin-right: 4px;
      }

      .btn-primary,
      .btn-dismiss {
        font-weight: 500;
      }
    }

    @media screen and (max-width: 380px) {
      .survey {
        padding: 14px 12px;
      }
    }

    @media screen and (max-width: 350px) {
      .medium-text-bold {
        font-size: 12px;
        font-weight: 500;
      }

      p.icon-survey {
        font-size: 12px;
        margin-right: 3px;
      }

      .btn-primary,
      .btn-dismiss {
        font-size: 10px;
      }
    }
  </style>
  <div class="survey" id="survey-container">
    <div class="text-container">
      <p class="icon-survey">👋</p>
      <p class="medium-text-bold">
        <intl-message key="app.feedbackMsg"></intl-message>
      </p>
    </div>
    <div class="btn-container">
      <a class="btn-primary" id="ok-button" href="/pages/feedback.html" target="_blank">
        <span>🙂 </span><intl-message key="app.sure"></intl-message>
      </a>
      <div class="btn-dismiss" id="dismiss">
        <intl-message key="app.dismiss"></intl-message>
      </div>
    </div>
  </div>`;

class FeedbackPrompt extends HTMLElement {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(feedbackPromptTemplate.content.cloneNode(true));

    this.okButton = this.shadowRoot.querySelector("#ok-button");
    this.okButton.addEventListener("click", this.handleClick);

    this.dismissButton = this.shadowRoot.querySelector("#dismiss");
    this.dismissButton.addEventListener("click", this.handleClick);

    this.container = this.shadowRoot.querySelector("#survey-container");
  }

  handleClick() {
    this.container.classList.add("out");
  }
}

customElements.define("feedback-prompt", FeedbackPrompt);
