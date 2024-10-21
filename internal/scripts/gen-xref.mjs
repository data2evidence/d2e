#!/usr/bin/env zx
//generate env yaml crossreference & update internal/docs/env-vars.yml

//inputs
const envName = $.env.ENV_NAME || "local"

//vars
const gitBaseDir = (await $`git rev-parse --show-toplevel`).stdout.trim()

const docOutPath = `${gitBaseDir}/internal/docs/env-vars.yml`
const envInPath = `${gitBaseDir}/.env.${envName}.yml`
const envOutPath = `${gitBaseDir}/.env.xref.yml`

// functions
// let filePath = envInPath
function readYmlFile(filePath) {
	try {
		return YAML.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		console.error(`Error attempting to write ${filePath}: ${error.message}`);
	}
}

function writeYmlFile(filePath, object) {
	try {
		fs.writeFileSync(filePath, YAML.stringify(object));
	} catch (error) {
		console.error(`Error attempting to read ${filePath}: ${error.message}`);
	}
}

// action
cd(gitBaseDir)
const envIn = readYmlFile(envInPath)
await $`touch ${envOutPath}`
const envOut0 = readYmlFile(envOutPath)
const envOut = envOut0 === null ? {} : envOut0

const keys = Object.keys(envIn)
let key = keys[0]

keys.map(key => {
	envOut[key] = {
		[envName]: envIn[key]
	}
})

writeYmlFile(envOutPath, envOut)

