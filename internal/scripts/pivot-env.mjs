#!/usr/bin/env zx
//generate env yaml pivot & update internal/docs/env-vars.yml

//inputs
const envName = $.env.ENV_NAME || "local"
console.info(`envName=${envName}`)

//vars
const gitBaseDir = (await $`git rev-parse --show-toplevel`).stdout.trim()

const credsKey = "DATABASE_CREDENTIALS"
const docOutPath = `${gitBaseDir}/internal/docs/env-vars.yml`
const envInPath = `${gitBaseDir}/.env.${envName}.yml`
const envOutPath = `${gitBaseDir}/.env.pivot.yml`

// functions

// filePath=envOutYmlPath // debug
function readYmlFile(filePath) {
	if (fs.existsSync(filePath)) {
		try {
			return YAML.parse(fs.readFileSync(filePath, 'utf8')) || {}
		} catch (error) {
			console.warn(`ERROR attempting to read ${filePath}: ${error.message}`);
		}
	}
	else {
		return {}
	}
}

function writeYmlFile(filePath, object) {
	try {
		console.log(`write ${filePath}`)
		fs.writeFileSync(filePath, YAML.stringify(object));
	} catch (error) {
		console.error(`ERROR attempting to write ${filePath}: ${error.message}`);
	}
}

// action
cd(gitBaseDir)
const envIn = readYmlFile(envInPath)
let envOut = readYmlFile(envOutPath)
const envKeys = Object.keys(envIn)

// write env yml pivot
// let envKey = envKeys[0]
envKeys.map(envKey => {
	if (envKey !== credsKey) {
		if (envOut[envKey] === undefined) {
			envOut[envKey] = {}
		}
		envOut[envKey][envName] = envIn[envKey]
	}
})
writeYmlFile(envOutPath, envOut)

// write db creds yml pivot
if (envKeys.includes(credsKey)) {
	const creds = YAML.parse(envIn[credsKey])
	// i = 0 // debug
	for (const i in creds) {
		let credsOutPath = `${gitBaseDir}/.env.pivot.creds.${creds[i].name}.yml`
		let credsOut = readYmlFile(credsOutPath)
		const credKeys = Object.keys(creds[i])
		// credKey = credKeys[0] // debug
		credsOut[envName] = {}
		credKeys.map(credKey => {
			credsOut[envName][credKey] = creds[i][credKey]
		})
		writeYmlFile(credsOutPath, credsOut)
		// await $`code ${credsOutPath}`
	}
}