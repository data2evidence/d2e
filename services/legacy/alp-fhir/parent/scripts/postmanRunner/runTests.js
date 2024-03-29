var newman = require('newman'); // require newman in your project
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
var hdb    = require('hdb');
var client = hdb.createClient({
host     : '<hostname>',
port     : '<port>',
user     : 'SYSTEM',
password : ''
});
client.on('error', function (err) {
    console.error('Network connection error', err);
});
client.connect(function (err) {
if (err) {
    return console.error('Connect error', err);
}
});


var schemas = []
function getEnv() {
    let newManEnv = require(envPath);
    let newEnv = JSON.parse(JSON.stringify(newManEnv))
    newEnv.values.forEach(function (value) {
        if(value.key.indexOf("endpoint") != -1){
            value.value=uuidv4();
            schemas.push(value.value);
        }
    });
    return newEnv;
}

var dropSchemaPromise = function(schema) {
    return new Promise(function(resolve,reject) {
        client.exec('DROP SCHEMA "' + schema.toUpperCase() + '" CASCADE', function (err, rows) {
            if (err) {
            } else {
                console.log('Dropped schema ' +schema);
            }
            resolve();
        });
    });
}


let testResults = {};

var runCollection = function(scenarioDir,file,env) {
    return new Promise(function(resolve, reject) {
        var filePath = path.join(scenarioDir,file);
        console.log("----" + filePath);
        oldDir = process.cwd();
        process.chdir(scenarioDir);
        newman.run({
            collection: require(filePath),
            environment: env,
            timeoutRequest: 600000,
            timeout: 500000,
            timeoutScript:500000,
            reporters: ['cli','junit']
        }).on('start', function (err, args) { // on start of run, log to console
            console.log("Run Collection " + filePath);
        }).on('done', function (err, summary) {
            if (err) {
                process.chdir(oldDir);
                console.error('collection run encountered an fatal error.' + JSON.stringify(err));
                console.error('collection run encountered an fatal error.' + JSON.stringify(summary));
                reportError(scenarioDir, file, err);
                reject();
            } else if (summary.run.failures && summary.run.failures.length > 0) {
                process.chdir(oldDir);
                console.error('collection run encountered an error');
                summary.run.failures.forEach(function (value) {
                    value.parent="Deleted"
                });
                reportError(scenarioDir, file, summary.run.failures);
                reject();
            }
            else {
                process.chdir(oldDir);
                console.log('collection run completed.');
                reportError(scenarioDir, file,null);
                resolve();
            }})
            .on('request',function(resp) {
                console.log("response available" + JSON.stringify(resp));
            })
            .on('exception',function(resp) {
                console.log("exception" + resp);
            });
    });
};

var runScenario = function(scenarioDir) {
    var collectionPromises = [];
    let env = getEnv();
    console.log("Run Scenario " + scenarioDir + " with env: " + JSON.stringify(env));
    files = fs.readdirSync(scenarioDir).filter( function (name) {
        return !fs.lstatSync(path.join(scenarioDir, name)).isDirectory();
    }).sort(function (a, b) {
        return a < b ? -1 : 1;
    });
    files.forEach(file => {
        collectionPromises.push([scenarioDir,file]);
    });
    final=[];
    return collectionPromises.reduce((promise, item) => {
        return promise
            .then((result) => {
                console.log(`item ${item}`);
                return runCollection(item[0],item[1],env).then(result => final.push(result));
            })
            .catch(console.error);
    }, Promise.resolve());
};

var reportError = function(scenario,file,error){
    if(!(scenario in testResults)) {
        testResults[scenario] = {};
    }
    testResults[scenario].overall = error ? true : false || testResults[scenario].overall ;
    if(!(file in testResults[scenario])) {
        testResults[scenario][file] = []
    }
    testResults[scenario][file].push(error);
};

const isDirectory = source => fs.lstatSync(source).isDirectory();

const isNotReportDir = name => name !== "newman";

let rootDir = __dirname + "/../../../fhir/resources/postman/scenarios";
var envPath =  __dirname + "/../../../fhir/resources/postman/fhir.postman_environment.json";
if(process.argv.length > 1) {

    let path = process.argv[2].replace(/\\/g, "/");
    rootDir = path +"/resources/postman/scenarios";
    envPath =  path + "/resources/postman/fhir.postman_environment.json";
}
console.log("Open " + rootDir);
scenarioDirs = fs.readdirSync(rootDir).filter(isNotReportDir).map(name => path.join(rootDir, name)).filter(isDirectory);
console.log(colors.bold(colors.underline("Starting test Run\n")));
scenarioDirs.forEach(scenario => console.log("Found new Scenario: "+scenario+"\n\n"));
let scenPromises = [];


scenarioDirs.forEach(function(scenario) {
    scenPromises.push(runScenario(scenario));
});

Promise.all(scenPromises).then(function() {
    report();
    dropSchemas();
},function() {
    report();
    dropSchemas();
    process.exit(1);
}).catch(function() {
    report();
    dropSchemas();
    process.exit(1);
});


var dropSchemas = function() {
    dropPromises=[]
    schemas.forEach(function(schema) {
        dropPromises.push(dropSchemaPromise(schema));
    })
    Promise.all(dropPromises)
    .then(function() {
        console.log("disconnecting")
        client.disconnect();
        client.destroy();
    })
}


var report = function() {
    let errors = 0;
    let total = 0;
    console.log(colors.bold(colors.underline("\n\nResult\n")));
    Object.keys(testResults).forEach(function (scenario) {
        total += 1;
        if (testResults[scenario].overall) {
            errors += 1;
            console.log(colors.red("ERROR: "+scenario));  //cyan
            Object.keys(testResults[scenario]).forEach(function (file) {
                if (file !== 'overall') {
                    if (!testResults[scenario][file]) {
                        console.log(colors.green("\t" + file + ": Ok"));
                    } else {
                        console.log(colors.red("\t" + file + ": Error: " + JSON.stringify(testResults[scenario][file])));
                    }
                }
            });
        } else {
            console.log(colors.green("OK: "+scenario));  //cyan
        }
    });

    if (errors) {
        console.log(colors.red("Error running tests"));
    } else {
        console.log(colors.green("Running tests finished successful"));
    }
}
