<#
  .SYNOPSIS
  Helper script for various tasks related to the repository
  .PARAMETER action
  Which action to execute, one of ("set-parent-snaptshot-version,set-parent-milestone-version")
  .PARAMETER version
  If action = set-parent-X-version  which version should be used to update
  .PARAMETER push
  If action = set-parent-X-version  push and open a PR on every repo
  .PARAMETER merge
  If action = set-parent-X-version  try to merge the PR
  #>
param(
[parameter(Mandatory=$true, HelpMessage = 'Which action to execute, one of ("set-parent-snaptshot-version","set-parent-milestone-version")')]
[ValidateSet("set-parent-snaptshot-version","set-parent-milestone-version")]
[string]$action,
[parameter(HelpMessage = 'BaseFolder of all subrepos, defaults to $PSScriptRoot/../../')]
[string]$basedir="$PSScriptRoot/../../",


[string]$version,
[bool]$push=$false,
[bool]$merge=$false
)


$organization = "fhir"
$branchToMerge = "feature/botVersionChange2"

$repositories = "meta","xml","json","queryengine","catalog","sql","hana","postgresql","fluentpath","elm","calculationview","fhir"


function Get-GitHub-API-Token {
    $apiTokensFilePath = "$PSScriptRoot\ApiTokens.properties"
    if (Test-Path $apiTokensFilePath)
    {
        $AppProps = convertfrom-stringdata (get-content "$apiTokensFilePath" -raw)
        return $AppProps
    }
    else
    {
        Write-Warning "$apiTokensFilePath does not exist, skipping import"
        Write-Warning 'Please provide a valid github token'
    }
}


function Merge-PullRequest($org,$repo,$number) {
    $props = Get-GitHub-API-Token
    $token=$props."gitHubApiToken"
    $headers = @{"Authorization"="token $token"}   
    $url = "https://<hostname>/api/v3/repos/$org/$repo/pulls/$number/merge"
    Invoke-WebRequest $url -Method Put -Headers $headers
}

function Wait-CI-Build($org,$repo,$ref) {
    $props = Get-GitHub-API-Token
    $token=$props."gitHubApiToken"
    $headers = @{"Authorization"="token $token"}   
    $url = "https://<hostname>/api/v3/repos/$org/$repo/statuses/$ref"
    Write-Host "Waiting for CI: $repo/$ref"
    Start-Sleep -Seconds 20
    $errorCount =0
    while($true) {
        $response = Invoke-WebRequest $url -Method Get -Headers $headers
        $prInfo = ConvertFrom-Json -InputObject $response.content
        $found = $false
        foreach ($status in $prInfo) {
            $context = $status.context
            $state = $status.state
            if($context -like "*nova:*") {
                $found = $true
                if ($state -eq "success") {
                    return $true
                } 
                if ($state -eq "pending") {
                    Write-Host "Waiting for CI: $repo/$ref"
                    Start-Sleep -Seconds 10
                } else {
                    return $false
                }
            }

        }
        $errorCount +=1
        if(!$found -and $errorCount >2) {
            return $false
        }
    }
}

function Wait_For_Pr($org,$repo,$number) {
    $props = Get-GitHub-API-Token
    $token=$props."gitHubApiToken"
    $headers = @{"Authorization"="token $token"}   
    $url = "https://<hostname>/api/v3/repos/$org/$repo/pulls/$number"
    $response = Invoke-WebRequest $url -Method Get -Headers $headers
    $prInfo = ConvertFrom-Json -InputObject $response.content
    $url = $prInfo.statuses_url
    Write-Host "Waiting for PR: $repo/$number"
    Start-Sleep -Seconds 10
    while($true) {
        $response = Invoke-WebRequest $url -Method Get -Headers $headers
        $prInfo = ConvertFrom-Json -InputObject $response.content
        $found = $false
        $errorCount = 0
        foreach ($status in $prInfo) {
            $context = $status.context
            $state = $status.state
            if($context -like "*nova:PR*") {
                $found = $true
                if ($state -eq "success") {
                    return $true
                } 
                if ($state -eq "pending") {
                    Write-Host "Waiting for PR: $repo/$number"
                    Start-Sleep -Seconds 10
                } else {
                    Write-Host "Status was $state"
                    return $false
                }
            }
        }
        $errorCount +=1
        if(!$found -and $errorCount >2) {
            Write-Host "Not Found the Job"
            return $false
        } else {
            Start-Sleep -Seconds 5
        }
    }
}


function Open-GitHub-PullRequest ($org,$repo, $base,$head) {
    $props = Get-GitHub-API-Token
    $token=$props."gitHubApiToken"
    $headers = @{"Authorization"="token $token"}      
    $hashTable = @{"title"="Set version of parent"; "head"=$head; "base"=$base}
    $data = $hashTable | ConvertTo-Json
    $url = "https://<hostname>/api/v3/repos/$org/$repo/pulls"
    Write-Host "Create PR for repo $repo"
    $response = Invoke-WebRequest $url -Method Post -Body $data -Headers $headers
    $prInfo = ConvertFrom-Json -InputObject $response.content
    $number = $prInfo.number
    return $number
}

function Set-Parent-Version ($snap){
    if(!$version)
    {
        Write-Error "-version parameter missing, cannot set version"
        exit
    }
    $prNumbers =  @{ }
    $mergeError=$false;
    ForEach( $repo in $repositories) {
        if($push) {
            Invoke-Command {
                cd $basedir/$repo/;
                git fetch;
                git checkout -f origin/develop
            }
        }
        Invoke-Command {
            Set-Location $basedir/$repo/;
            if($snap) {
                mvn versions:update-parent -U "-DparentVersion=$version" "-DallowSnapshots=true"
            } else {
                mvn versions:update-parent -U "-DparentVersion=$version"
            }
        }
        if($push -or $merge) {
            Invoke-Command {
                cd $basedir/$repo/;
                git add pom.xml;
                git commit -m "Changed parent version to: $version";
                git push -f origin HEAD:refs/heads/$branchToMerge;
            } 
           $number = Open-GitHub-PullRequest "$organization" $repo "develop" $branchToMerge      
           Write-Host "Opened PR $number in $repo" 
           $prNumbers.Add($repo,$number)
        }
        if($merge -and !$mergeError){
            while($true){
                $number=$prNumbers.$repo
                $ok = Wait_For_Pr "$organization" $repo $number
                if(!$ok) {
                    Write-Error "Something went wrong with pull request $number in $repo, aborting merge"
                    $mergeError=$true
                    break
                }
                Merge-PullRequest  "$organization" $repo $number
                $ok =Wait-CI-Build "$organization" $repo "develop"
                if(!$ok) {
                    Write-Error "Something went wrong with CI build develop in $repo, aborting merge"
                    $mergeError=$true
                    break
                }
                break
            }
        }
    }
}



switch ($action) {
    "set-parent-snaptshot-version" { Set-Parent-Version $true }
    "set-parent-milestone-version" {Set-Parent-Version $false}
    "Default" {}
}
