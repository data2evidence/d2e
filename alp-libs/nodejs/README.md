## NPM Libs



### Publish NPM libs to the github packages registry (GPR)

When there is a change made to any of the following libs: `alp-base-utils, alp-config-utils, alp-metadata`
its version has to be incremented as well, only then it can be published in the GPR. GPR will not accept libs to be overwritten by the same version. It will fail. Therefore,

1. Increment the version of the corresponding package.json. Ex: `alp-base-utils/package.json` -> `version` property

2. Increment the version as well in the package.json of the depending services / libs of `alp-base-utils`.
For ex:  `alp-config-utils/package.json` -> `dependencies` property ->  version value of `@alp/alp-base-utils`

3. Commit & Push to github. The github actions (`node-libs-publish.yaml`) will ensure the newer version is published in the package registry

4. Ensure the github actions such as docker push and the Jenkins docker build are passing. Otherwise Just retrigger them manually, once the github actions `node-libs-publish.yaml` are completed successfully. So that the docker build will pull the new version of the libs from GPR.


## Working with NPM libs from local

## Generate Personal Access token & granting appropriate scopes

To perform the below actions a token is required to be generated:

1. Create a personal access token by referring [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

2. Grant appropriate scopes by referring [here](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries)



### Get all packages belonging to the org:
curl -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>" https://api.github.com/orgs/alp/packages?package_type=npm


### Get versions of packages:
curl   -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>"   https://api.github.com/orgs/alp/packages/npm/alp-metadata/versions

curl   -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>"   https://api.github.com/orgs/alp/packages/npm/alp-config-utils/versions

curl   -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>"   https://api.github.com/orgs/alp/packages/npm/alp-base-utils/versions


### DELETE a specific version:
curl -X DELETE -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>" https://api.github.com/orgs/alp/packages/npm/alp-metadata/versions/22696758

curl -X DELETE -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>" https://api.github.com/orgs/alp/packages/npm/alp-metadata/versions/22696758

curl -X DELETE -H "Accept: application/vnd.github+json" -H "Authorization: token \<GITHUB-PAT\>" https://api.github.com/orgs/alp/packages/npm/alp-config-utils/versions/22696906
