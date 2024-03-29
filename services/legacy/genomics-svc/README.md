# Genomics Services

Node.js 12 application

## Setup

Add `default-services.json` with the following value:
```
{
  "hana": {
    "tags": ["hana"]
  }
}
```

In this directory, run
```
npm install
npm run build
```
to install all dependencies and build all artifacts.

Afterwards, `dist` directory will contain the application code to be
distributed. The code can be run by executing
```
npm start
```
which will start the application server based on the built code. Changes in
the `src` directory will not be considered until `npm run build` is executed
again.

## Test

To run the *jasmine* tests, execute
```
npm test
```
which will also trigger a build if necessary and execute all test case
specifications in the `spec` folder.
