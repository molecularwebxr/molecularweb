var localize = locI18next.init(i18next);

var appHeader = document.querySelector("app-header");

var english = appHeader.shadowRoot.querySelector("#en");
var spanish = appHeader.shadowRoot.querySelector("#es");
var french = appHeader.shadowRoot.querySelector("#fr");
var italian = appHeader.shadowRoot.querySelector("#it");
var portuguese = appHeader.shadowRoot.querySelector("#pt");
var german = appHeader.shadowRoot.querySelector("#de");
var thai = appHeader.shadowRoot.querySelector("#th");
// var kazakh = appHeader.shadowRoot.querySelector("#kk");
var russian = appHeader.shadowRoot.querySelector("#ru");

var english2 = appHeader.shadowRoot.querySelector("#en_");
var spanish2 = appHeader.shadowRoot.querySelector("#es_");
var french2 = appHeader.shadowRoot.querySelector("#fr_");
var italian2 = appHeader.shadowRoot.querySelector("#it_");
var portuguese2 = appHeader.shadowRoot.querySelector("#pt_");
var german2 = appHeader.shadowRoot.querySelector("#de_");
var thai2 = appHeader.shadowRoot.querySelector("#th_");
// var kazakh2 = appHeader.shadowRoot.querySelector("#kk_");
var russian2 = appHeader.shadowRoot.querySelector("#ru_");

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init(
    {
      fallbackLng: "en",
      ns: "translation",
      defaultNS: "translation",
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        crossDomain: true,
      },
      detection: {
        // order and from where user language should be detected
        order: ["localStorage", "navigator", "querystring"],

        // keys or params to lookup language from
        lookupQuerystring: "lng",
      },
    },
    function (err, t) {
      updateContent();
    }
  );

function updateContent() {
  localStorage.setItem("i18nextLng", i18next.language);
  localize(".content");
  localize(".contact-us");
  localize("#title");
  localize("#privacy");
  localize(".activity-title");
}

function handleLanguageChange(e) {
  var id = e.target.id;
  var lang = id.length === 3 ? id.slice(0, -1) : id;
  e.preventDefault();
  i18next.changeLanguage(lang);

  if (appHeader.langMenuActive) {
    appHeader.mobileMenuLang.classList.remove("active");
      appHeader.langMenuActive = false;
  }
}

i18next.on("languageChanged", function () {
  updateContent();
});

english.addEventListener("click", handleLanguageChange);
spanish.addEventListener("click", handleLanguageChange);
french.addEventListener("click", handleLanguageChange);
italian.addEventListener("click", handleLanguageChange);
portuguese.addEventListener("click", handleLanguageChange);
german.addEventListener("click", handleLanguageChange);
thai.addEventListener("click", handleLanguageChange);
// kazakh.addEventListener("click", handleLanguageChange);
russian.addEventListener("click", handleLanguageChange);

english2.addEventListener("click", handleLanguageChange);
spanish2.addEventListener("click", handleLanguageChange);
french2.addEventListener("click", handleLanguageChange);
italian2.addEventListener("click", handleLanguageChange);
portuguese2.addEventListener("click", handleLanguageChange);
german2.addEventListener("click", handleLanguageChange);
thai2.addEventListener("click", handleLanguageChange);
// kazakh2.addEventListener("click", handleLanguageChange);
russian2.addEventListener("click", handleLanguageChange);
