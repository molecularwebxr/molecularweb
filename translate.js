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
    },
    function (err, t) {
      localize = locI18next.init(i18next);

      localize(".menu");

      console.log(
        `detected user language: "${
          i18next.language
        }"  --> loaded languages: "${i18next.languages.join(", ")}"`
      );
    }
  );
