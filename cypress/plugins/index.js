// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const cucumber = require('cypress-cucumber-preprocessor').default;
const browserify = require('@cypress/browserify-preprocessor');
const {exec} = require('child_process');

const delay = ms => new Promise(res => setTimeout(res, ms));
const executeCommandPromiseAndWait = cmd =>
    new Promise((resolve, reject) =>
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            delay(1000).then(() => resolve(null));
        })
    );

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const options = browserify.defaultOptions;
    options.browserifyOptions.extensions.unshift('.ts');
    options.browserifyOptions.plugin.unshift(['tsify', {project: './cypress/tsconfig.json'}]);

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--allow-running-insecure-content');
            return launchOptions;
        }
        return launchOptions;
    });

  on('file:preprocessor', cucumber(options));

  on('task', {
    createUser(user) {
      return executeCommandPromiseAndWait(`npx lerna run create-user --stream -- -- --credsUser ../../../backend_server/src/admin_api/for_e2e/${user}/e2eUser.json`)
    },
  });

  on('task', {
    deleteUser(username) {
      return executeCommandPromiseAndWait(`npx lerna run delete-user --stream -- -- --username "${username}"`)
    }
  });

  on('task', {
    deleteChat(usernames) {
      return executeCommandPromiseAndWait(`npx lerna run delete-chat --stream -- -- --username1 "${usernames.username1}" --username2 "${usernames.username2}"`)
    }
  });

  on('task', {
    deleteEvent(name) {
      return executeCommandPromiseAndWait(`npx lerna run delete-event --stream -- -- --eventName "${name}"`)
    }
  })
}
