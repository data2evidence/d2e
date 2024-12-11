#!/usr/bin/env zx
// Load Athena Vocab
// if GOOGLE_DRIVE_DATA_DIR is set then attempt to copy latest zip from google drive
// otherwise use zip from $ZIP_DIR

echo(`${__filename.split("/").slice(-3).join("/")} ...`)
// $.verbose = true

// const
const containerDir = '/app/vocab'

// vars
const gitBaseDir = (await $`git rev-parse --show-toplevel`).stdout.trim()
const cacheDir = `${gitBaseDir}/cache/vocab`

// inputs
const zipDir = $.env.zipDir || `${gitBaseDir}/cache/zip`
const zipGlob = $.env.zipGlob || '*vocab*'

if ($.env.GOOGLE_DRIVE_DATA_DIR) {
	const googleDriveDataDir = $.env.GOOGLE_DRIVE_DATA_DIR
	echo(`. INFO googleDriveDataDir=${googleDriveDataDir}`)
	const cloudStorageDir = `${os.homedir()}/Library/CloudStorage`
	const googleDriveBaseDir =
		fs.readdirSync(cloudStorageDir).filter(p => p.includes('GoogleDrive')).map(n => `${cloudStorageDir}/${n}`)[0]
	const googleDrivePathGlob = `${googleDriveBaseDir}/My Drive/${googleDriveDataDir}/${zipGlob}`
	const srcZipPath = (await glob(googleDrivePathGlob))[0]
	fs.copyFileSync(srcZipPath, `${zipDir}/path.basename(srcZipPath)`)
} else {
	echo(". INFO GOOGLE_DRIVE_DATA_DIR unset")
}

const zipPathGlob = `${zipDir}/${zipGlob}`
const zipPath = (await glob(zipPathGlob))[0]
if (zipPath) {
	echo(`. INFO zipPath=${zipPath}`)
} else {
	throw new Error(`. ERROR zipPathGlob=${zipPathGlob} not found`)
}

cd(cacheDir)
echo(`. INFO unzip ${zipPath}`)
await $`unzip -o ${zipPath} -d .`
await $`wc -l *.csv | sort -nr`

echo(`. INFO Truncate`)
await $`docker exec -t alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "truncate cdmvocab.concept, cdmvocab.concept_ancestor, cdmvocab.concept_class, cdmvocab.concept_relationship, cdmvocab.concept_synonym, cdmvocab.domain, cdmvocab.drug_strength, cdmvocab.relationship, cdmvocab.vocabulary;" || true`

const fileNames = fs.readdirSync(cacheDir).filter(n => n.includes('.csv'))
const filesObj = fileNames.flatMap(fileName => [
	{
		name: `${path.parse(fileName).name.toUpperCase()}`,
		path: `${containerDir}/${fileName}`,
		truncate: "True",
		table_name: `${path.parse(fileName).name.toLowerCase()}`,
	}
])
const optionsStr = JSON.stringify({
	chunksize: "50000",
	database_code: "alpdev_pg",
	delimiter: `\t`,
	encoding: "utf_8",
	header: "true",
	schema_name: "cdmvocab",
	files: filesObj
})

echo(`. INFO Load tables`)
await $`docker exec -t alp-dataflow-gen-worker prefect deployment run data_load_plugin/data_load_plugin --param options=${optionsStr}`
sleep(3000)

echo(`. INFO validation`)
// await $`open https://localhost:41100/portal/systemadmin/jobs/deployments`
await $`open http://localhost:41120/runs`
await question('Success? Press any key to continue')

echo(`. INFO validation`)
await `docker exec -t alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alpdev_pg --command "SELECT table_name, row_count FROM (SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_relationship UNION SELECT 'concept_ancestor' AS table_name, count(*) AS row_count FROM cdmvocab.concept_ancestor UNION SELECT 'concept_relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept UNION SELECT 'relationship' AS table_name, COUNT(*) AS row_count FROM cdmvocab.relationship UNION SELECT 'concept_synonym' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_synonym UNION SELECT 'vocabulary' AS table_name, COUNT(*) AS row_count FROM cdmvocab.vocabulary UNION SELECT 'domain' AS table_name, COUNT(*) AS row_count FROM cdmvocab.domain UNION SELECT 'drug_strength' AS table_name, COUNT(*) AS row_count FROM cdmvocab.drug_strength UNION SELECT 'concept_class' AS table_name, COUNT(*) AS row_count FROM cdmvocab.concept_class) temp ORDER BY row_count DESC;"`