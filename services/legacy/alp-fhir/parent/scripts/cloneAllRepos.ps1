<<<<<<< HEAD
$response = Invoke-WebRequest -Uri "https://<hostname>/api/v3/orgs/fhir/repos?page=1&per_page=100" -UserAgent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30" 
$repos = ConvertFrom-Json -InputObject $response.content
foreach ($repo in $repos) {
    git clone $repo.ssh_url
}
=======
param(
[parameter(Position=0)]
[string]$urlType='https'
)
$response = Invoke-WebRequest -Uri "https://<hostname>/api/v3/orgs/fhir/repos?page=1&per_page=100" -UserAgent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30" 
$repos = ConvertFrom-Json -InputObject $response.content
$BASEDIR=$PSScriptRoot
cd $PSScriptRoot/../../
foreach ($repo in $repos) {
    if(!($repo.name -eq "parent")){
        if($urlType -eq 'https'){
            git clone $repo.clone_url
        } else {
            if($urlType -eq 'ssl'){
                git clone $repo.ssh_url
            }
            else {
                Write-Error "Unknown urlType, should be https or ssl";
                exit 1
            }
        }
    }
}
cd $PSScriptRoot
>>>>>>> origin/develop
