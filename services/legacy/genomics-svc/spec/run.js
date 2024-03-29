global.__base = __dirname + '/../dist/';

let extensions = require(__base + 'extensions');
let xsenv = require('@sap/xsenv');
let hdb = require(__base + 'hdb-promise');
let uaa = require('./uaa');

if (!process.env.VCAP_SERVICES) {
    process.env.VCAP_SERVICES = JSON.stringify(require(__dirname + '/../default-env.json')['VCAP_SERVICES']);
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
let Jasmine = require('jasmine');
let reporters = require('jasmine-reporters');
let JasmineConsoleReporter = require('jasmine-console-reporter');
let jasmine = new Jasmine();

const user = process.env.SHPCICD_USER_PREFIX ? process.env.SHPCICD_USER_PREFIX + 'CHP_U_SEARCH_200' : 'CHP_U_SEARCH_200';
const password = 'Initial1'

// context helper functions

global.initContext = async function (request) {
    await cleanUp();
    const config = await xsOptions;
    request.headers = {
        Authorization: `Bearer ${config.hana.session.XS_APPLICATIONUSER}` // forward the JWT to the context for internal request authentication
    }
    request.user = {
        id: user
    }
    context = await extensions.createContext(request, await hdb.connect(config.hana).then(connection => connection.setVolatile(true)));
}

global.initDefaultContext = async function () {
    await initContext({method: 'POST', body: {validationPlugin: 'internal.validate'}});
}

global.cleanUp = async function () {
    if (context) {
        await context.connection.rollback();
        await context.close();
        context = null;
    }
}

const xsOptions = async function () {
    let options = xsenv.getServices({xsuaa: {tag: 'xsuaa'}, hana: {tag: 'hana'}});
    options.hana.autoCommit = false;
    options.hana.isolationLevel = hdb.constants.isolation.SERIALIZABLE;
    options.hana.session = {
        XS_APPLICATIONUSER: await uaa.getJWT(options.xsuaa, user, password)
    }
    return options;
}();
global.context = null;

// set up reporters

const consoleReporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    timeUnit: 'ms',
    timeThreshold: { ok: 500, warn: 1000, ouch: 3000 },
    activity: false,
    emoji: false,
    beep: false
});
jasmine.addReporter(consoleReporter);

const junitReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname,
    consolidateAll: true
});
jasmine.addReporter(junitReporter);

// configure and start tests

jasmine.loadConfigFile(__dirname + '/../spec/support/jasmine.json');
jasmine.execute();
module.exports = jasmine;
