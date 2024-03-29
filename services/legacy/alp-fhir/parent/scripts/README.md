# Repo Cloner

Script to clone all repositories in the fhir org

## Usage:

- clone parent repository: fhir/parent.git
- open Powershell
- execute ./parent/scripts/cloneAllRepos.ps1

## Params:
 - urlType
    - https (Default if not provided): Clone via https url
    - ssl: Clone via ssl

# Version Helper

Added helper script to update versions of the parent pom for all repos

## Usage

- Add your Github credentials to the ApiTokens.properties (onyl if you want to push/merge)
- Execute:

```
.\parent\scripts\updateParent.ps1 -action set-parent-snaptshot-version -version 0.0.12 -push $true -merge $true
```

- version=the version to update the parent to

**BE CAREFULL IF YOU SPECIFY push or merge THE SCRIPT WILL DO A FORCE CHECKOUT DESTROYING YOUR LOCAL CHANGES IF NOT COMMITED**

- push = Code will be pushed and PRs will be opened
- merge = Try to merge the PRs in order if green

## Add additional repo 

Modify https://<hostname>/fhir/parent/blob/develop/scripts/updateVersions.ps1#L30 this list, and add repositories in the correct merge order

# Repo Installer

## Usage
./parent/scripts/installReposLocally.ps1 "<MavenOpts>

will execute an maven install on all subrepos, MavenOpts can be passed, e.g skipTests
