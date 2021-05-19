var localize = locI18next.init(i18next);

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

i18next.on("languageChanged", function () {
  updateContent();
});

function updateContent() {
  localize("#header");
  localize("#instructions");
  localize("#description");
  localize("#selection-menu");
  localize("#title");
  localize("#selection-menu");
  localize("#mk-menu");
  localize("#jme-overlay");
  localize("#interaction-container");
}
