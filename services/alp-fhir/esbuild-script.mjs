/* global console */
/* global process */
/* eslint no-console: "off" */
/*eslint no-process-exit: "off"*/

import esbuild from 'esbuild';
import pkg from 'glob';
const { glob } = pkg;
import packageJson from './package.json' assert { type: 'json' };
// for (const k in process.env) {
//   define[`process.env.${k}`] = JSON.stringify(process.env[k])
// }
// const define = {}
// Find all TypeScript files in your source directory
const entryPoints = glob.sync('./src/bots/**/*.ts').filter((file) => !file.endsWith('test.ts'));

const botLayerDeps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies || {})
]

// Define the esbuild options
const esbuildOptions = {
  entryPoints: entryPoints,
  bundle: true, // Bundle imported functions
  outdir: './dist', // Output directory for compiled files
  platform: 'node', // or 'node', depending on your target platform
  loader: {
    '.ts': 'ts', // Load TypeScript files
  },
  resolveExtensions: ['.ts'],
  external: botLayerDeps,
  format: 'cjs', // Set output format as ECMAScript modules
  target: 'es2020', // Set the target ECMAScript version
  tsconfig: 'tsconfig.json',
  footer: { js: 'Object.assign(exports, module.exports);' }, // Required for VM Context Bots
  define: {
    'process.env.DUCKDB_PATH': `"/home/docker/app"`,
    'process.env.FHIR_SCHEMA_FILE_NAME': '"fhir.schema.json"',
    'process.env.FHIR_SCHEMA_PATH': '"/home/docker/app/medplum/packages/definitions/dist/fhir/r4"',
    'process.env.CACHEDB__HOST': '"alp-cachedb"',
    'process.env.CACHEDB__PORT': '"41191"',
    'process.env.IDP__ALP_SVC__CLIENT_ID': '"v4onv25mm3a1af6rh49f6"',
    'process.env.IDP__ALP_SVC__CLIENT_SECRET': '"FALi5oCuah9ddgD9V1ZeMxmTnSOkVkTY"',
    'process.env.ALP_GATEWAY_OAUTH__URL': '"https://alp-minerva-gateway-1.alp.local:41100/oauth/token"'
  }
};

// Build using esbuild
esbuild
  .build(esbuildOptions)
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((error) => {
    console.error('Build failed:', JSON.stringify(error, null, 2));
    process.exit(1);
  });