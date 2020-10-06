var localize = locI18next.init(i18next);

var english = document.querySelector("app-header").shadowRoot.querySelector("#en");
var spanish = document.querySelector("app-header").shadowRoot.querySelector("#es");
var french = document.querySelector("app-header").shadowRoot.querySelector("#fr");
var italian = document.querySelector("app-header").shadowRoot.querySelector("#it");
var portuguese = document.querySelector("app-header").shadowRoot.querySelector("#pt");

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
  localize(".activity-title");
}

function handleLanguageChange(e) {
  var lang = e.target.id;
  e.preventDefault();
  i18next.changeLanguage(lang);
}

i18next.on("languageChanged", function(){
  updateContent();
});

english.addEventListener("click", handleLanguageChange);
spanish.addEventListener("click", handleLanguageChange);
french.addEventListener("click", handleLanguageChange);
italian.addEventListener("click", handleLanguageChange);
portuguese.addEventListener("click", handleLanguageChange);
