/*jshint esversion: 9 */

(async () => {

  const loadHtml = function (file) {
    return new Promise((resolve) => {
      fetch(`/${file}.html`)
        .then(res => {
          if (res.status !== 200)
            throw new Error(`File [${file}] does not exists.`);
          return res.text();
        }).then(html => {
          app.html = html;
          resolve();
        }).catch(ex => {
          console.log(`Error load html: ${file}`, ex);
          resolve();
        });
    });
  };

  await loadHtml('app');

  loadModule('/vue/main.vue', window.options)
    .then(component => {
      window.app = component;
    });

})();
