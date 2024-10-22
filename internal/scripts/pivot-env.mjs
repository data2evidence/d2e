#!/usr/bin/env zx
//generate env yaml pivot & update internal/docs/env-vars.yml
// .env.doc.yml - update with sample values
// .env.pivot.yml - show values for all environments
// .env.pivot.creds.ALPDEV.yml - DATABASE_CREDENTIALS>ALPDEV
// .env.pivot.creds.postgres-cdm-minerva.yml - DATABASE_CREDENTIALS>postgres-cdm-minerva
// .env.pivot.creds.OMOP.yml - DATABASE_CREDENTIALS>OMOP

//inputs
const envName = $.env.ENV_NAME || "local"
console.info(`envName=${envName}`)
const resetDocEnvNameBool = $.env.RESET_DOC_ENV_NAME_BOOL === "true" ? true : false

//vars
const gitBaseDir = (await $`git rev-parse --show-toplevel`).stdout.trim()

const credsKey = "DATABASE_CREDENTIALS"
const envInPath = `${gitBaseDir}/.env.${envName}.yml`
const envOutPath = `${gitBaseDir}/.env.pivot.yml`
const docOutPath = `${gitBaseDir}/.env.doc.yml`

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
		let doc = YAML.stringify(object)
		fs.writeFileSync(filePath, doc);
	} catch (error) {
		console.error(`ERROR attempting to write ${filePath}: ${error.message}`);
	}
}

function cleanObj(obj) {
	if (obj) {
		return obj
	} else {
		return {}
	}
}

function cleanStr(str, def) {
	if (str) {
		return str
	}
	else if (def) {
		return def
	}
	else {
		return null
	}
}

function cleanBool(bool) {
	if (bool) {
		return bool
	} else {
		return false
	}
}

//////////////////////////////////////////////////////////////////////
// action
//////////////////////////////////////////////////////////////////////
cd(gitBaseDir)
const envIn = readYmlFile(envInPath)
let envOut = readYmlFile(envOutPath)

const envKeys = Object.keys(envIn)

// update env doc yml
// .env.doc.yml - update with sample values
//////////////////////////////////////////////////////////////////////
let docOut = readYmlFile(docOutPath)

if (resetDocEnvNameBool) {
	envKeys.map(envKey => delete docOut[envKey].envNames)
}

// let envKey = envKeys[0] // debug
// envKey = "AZURE__IDP__AUTHORITY_URL" // debug
// envKey = "AZURE__IDP__CLIENT_SECRET" // debug
envKeys.map(envKey => {
	// console.debug(`envKey = ${envKey}`)
	docOut[envKey] = cleanObj(docOut[envKey])
	docOut[envKey].envNames = cleanObj(docOut[envKey].envNames)
	docOut[envKey].type = cleanStr(docOut[envKey].type, "string")
	docOut[envKey].comment = cleanStr(docOut[envKey].comment)
	docOut[envKey].scriptAuto = cleanBool(docOut[envKey].scriptAuto)

	if ((docOut[envKey].type === "string") || docOut[envKey].type === "boolean" || (envIn[envKey].length < 100)) {
		docOut[envKey].envNames[envName] = envIn[envKey]
	} else {
		docOut[envKey].envNames[envName] = `see pivot`
	}
})
writeYmlFile(docOutPath, docOut)


// write env yml pivot
// .env.pivot.yml - show values for all environments
//////////////////////////////////////////////////////////////////////
// let envKey = envKeys[0]
envKeys.map(envKey => {
	if (envKey !== credsKey) {
		// let key = envOut[envKey]
		envOut[envKey] = cleanObj(envOut[envKey])
		envOut[envKey].envNames = cleanObj(envOut[envKey].envNames)

		envOut[envKey].comment = docOut[envKey].comment
		envOut[envKey].type = docOut[envKey].type
		envOut[envKey].envNames[envName] = envIn[envKey]
	}
})
writeYmlFile(envOutPath, envOut)

// write db creds yml pivots
// .env.pivot.creds.ALPDEV.yml - DATABASE_CREDENTIALS>ALPDEV
// .env.pivot.creds.postgres-cdm-minerva.yml - DATABASE_CREDENTIALS>postgres-cdm-minerva
// .env.pivot.creds.OMOP.yml - DATABASE_CREDENTIALS>OMOP
//////////////////////////////////////////////////////////////////////
if (envKeys.includes(credsKey)) {
	const creds = YAML.parse(envIn[credsKey])
	// i = 0 // debug
	for (const i in creds) {
		let credsOutPath = `${gitBaseDir}/.env.pivot.creds.${creds[i].name}.yml`
		let credsOut = readYmlFile(credsOutPath)
		const credKeys = Object.keys(creds[i])
		// credKey = credKeys[0] // debug
		credKeys.map(credKey => {
			credsOut[credKey] = cleanObj(credsOut[credKey])
			credsOut[credKey][envName] = creds[i][credKey]
		})
		writeYmlFile(credsOutPath, credsOut)
		// await $`code ${credsOutPath}`
	}
}
