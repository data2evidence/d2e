<<<<<<< HEAD
param(
[parameter(Position=0)]
[string]$mvnOpts
)
$BASEDIR=$PSScriptRoot
Invoke-Command {cd $BASEDIR/../../parent/;mvn install $mvnOpts}
Invoke-Command {cd $BASEDIR/../../meta/;mvn install $mvnOpts}
Invoke-Command {cd $BASEDIR/../../xml/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../json/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../queryengine/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../catalog/; mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../sql/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../hana/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../elm/;mvn install  $mvnOpts}
Invoke-Command {cd $BASEDIR/../../fhir/;mvn install  $mvnOpts}
=======
param(
[parameter(Position=0)]
[string]$mvnOpts=""
)

$BASEDIR=$PSScriptRoot
$error = $true

$repositories = "parent", "meta","xml","json","queryengine","catalog","sql","hana","postgresql","fluentpath","elm","calculationview","fhir"
ForEach( $repo in $repositories)
{
    cd $BASEDIR/../../$repo/; mvn -P it install $mvnOpts; $error = $error -and $?
}

if(!$error) {
    Write-Host "Error running install"
    exit 1
}
>>>>>>> origin/develop
