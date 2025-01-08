#!/usr/bin/env zx
// pivot/analyze env to ensure consistency
// Seed:
// cp -v internal/docs/env-vars.yml .env-vars.yml
// Writes:
// .env-vars.yml - update with sample values
// .env-pivot.yml - show values for all environments
// .env-pivot.creds.ALPDEV.yml - DATABASE_CREDENTIALS>ALPDEV
// .env-pivot.creds.postgres-cdm-minerva.yml - DATABASE_CREDENTIALS>postgres-cdm-minerva
// .env-pivot.creds.OMOP.yml - DATABASE_CREDENTIALS>OMOP
// Remove values & update git internal env doc with:
// cat .env-vars.yml | yq '.*.envNames.* = "xxx"' | yq 'sort_keys(..) | (... | select(type == "!!seq")) |= sort' | tee internal/docs/env-vars.yml

// inputs
const envName = $.env.ENV_NAME || "local"
console.info(`envName=${envName}`)
const resetDocEnvNameBool = $.env.RESET_DOC_ENV_NAME_BOOL === "true" ? true : false

// vars
const gitBaseDir = (await $`git rev-parse --show-toplevel`).stdout.trim()

const credsKey = "DATABASE_CREDENTIALS"
const docPath = `.env-vars.yml`
const envInPath = `.env.${envName}.yml`
const pvtOutPath = `.env-pivot.yml`
const srcDocPath = `internal/docs/env-vars.yml`

if ((!fs.existsSync(docPath)) && fs.existsSync(srcDocPath)) {
	fs.copyFile(srcDocPath, docPath, (err) => {
		if (err) throw err;
		console.log(`. ${srcDocPath} was copied to ${docPath} as seed`);
	});
}

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
let pvtOut = readYmlFile(pvtOutPath)

const envKeys = Object.keys(envIn)

// update env doc yml
// .env.doc.yml - update with sample values
//////////////////////////////////////////////////////////////////////

let docInOut = readYmlFile(docPath)

if (resetDocEnvNameBool) {
	envKeys.map(envKey => delete docInOut[envKey].envNames)
}

// let envKey = envKeys[0] // debug
// envKey = "AZURE__IDP__AUTHORITY_URL" // debug
// envKey = "AZURE__IDP__CLIENT_SECRET" // debug
envKeys.map(envKey => {
	// console.debug(`envKey = ${envKey}`)
	docInOut[envKey] = cleanObj(docInOut[envKey])
	docInOut[envKey].envNames = cleanObj(docInOut[envKey].envNames)
	docInOut[envKey].type = cleanStr(docInOut[envKey].type, "string")
	docInOut[envKey].comment = cleanStr(docInOut[envKey].comment)

	// show sample data if <100 chars
	if ((docInOut[envKey].type === "string") || docInOut[envKey].type === "boolean" || (envIn[envKey].length < 100)) {
		docInOut[envKey].envNames[envName] = envIn[envKey]
	} else {
		docInOut[envKey].envNames[envName] = `see pivot`
	}
})
writeYmlFile(docPath, docInOut)

// write env yml pivot
// .env.pivot.yml - show values for all environments
//////////////////////////////////////////////////////////////////////
// let envKey = envKeys[0]
envKeys.map(envKey => {
	if (envKey !== credsKey) {
		// let key = envOut[envKey]
		pvtOut[envKey] = cleanObj(pvtOut[envKey])
		pvtOut[envKey].envNames = cleanObj(pvtOut[envKey].envNames)

		pvtOut[envKey].comment = docInOut[envKey].comment
		pvtOut[envKey].type = docInOut[envKey].type
		pvtOut[envKey].envNames[envName] = envIn[envKey]
	}
})
writeYmlFile(pvtOutPath, pvtOut)

// write db creds yml pivots
// .env.pivot.creds.ALPDEV.yml - DATABASE_CREDENTIALS>ALPDEV
// .env.pivot.creds.postgres-cdm-minerva.yml - DATABASE_CREDENTIALS>postgres-cdm-minerva
// .env.pivot.creds.OMOP.yml - DATABASE_CREDENTIALS>OMOP
//////////////////////////////////////////////////////////////////////
if (envKeys.includes(credsKey)) {
	const credsStr = envIn[credsKey]
	if (credsStr.length === 0) {
		echo(`ALERT: ${credsKey} is blank`)
	} else {
		const creds = YAML.parse(credsStr)
		// i = 0 // debug
		for (const i in creds) {
			let credsOutPath = `.env-pivot.creds.${creds[i].name}.yml`
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
}
