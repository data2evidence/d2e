param(
    [bool]$runInstallOnSubModules=$true,
    [parameter(HelpMessage = 'BaseFolder of all subrepos, defaults to $PSScriptRoot/../../')]
    [string]$fhirbasedir="$PSScriptRoot/../../fhir/"
)

$FHIRDIR=$fhirbasedir


#Stop-Job -Name fhir
#$job = Start-Job -InputObject $FHIRDIR -Name fhir -ScriptBlock { cd $Input ; mvn spring-boot:run }
#Write-Host "Try to start server via mvn spring-boot:run"
#while($true) {
#    $output = Receive-Job -Job $job
#    $body = $output -join "`r`n"
#    Write-Host $body
#    if($body -like '*BUILD FAILURE*') {
#        Write-Error "Error starting, aborting"
#        Write-Host "Stopping background job..."
#        Stop-Job -Name fhir
#        exit
#    }
#    if($body -like '*APPLICATION FAILED TO START*') {
#        Write-Error "Error starting, aborting"
#        Write-Host "Stopping background job..."
#        Stop-Job -Name fhir
#        exit
#    }
#    if($body -like '*Started Application*') {
#        break
#    }
#    Write-Host "Wait 10 more seconds for start"
#    Start-Sleep -s 10
#}
cd $PSScriptRoot/postmanRunner/
npm install;
$error = $false
try
{
    node runTests.js "$FHIRDIR"

    if (!$?)
    {
        $error = $true
    }
} catch {
    $error = $true
}
#$output = Receive-Job -Job $job
#$output -join "`r`n" | Out-File -filepath log.txt
#Write-Host "Stopping background job... server output is written to log.txt"
#Stop-Job -Name fhir
#if($error) {
#    exit 1
#}
cd $PSScriptRoot
