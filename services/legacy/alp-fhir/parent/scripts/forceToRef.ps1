param(
[parameter(Position=0)]
[string]$ref,
[parameter(Position=1)]
[string]$as
)

$BASEDIR=$PSScriptRoot
$error = $true

$repositories = "parent", "meta","xml","json","queryengine","catalog","sql","hana","postgresql","fluentpath","elm","calculationview","fhir"
ForEach( $repo in $repositories)
{
    cd $BASEDIR/../../$repo/
    git fetch
    git checkout -B $as -f $ref
    git branch --set-upstream-to $ref
    git status
}

if(!$error) {
Write-Host "Error running checkout"
exit 1
}
