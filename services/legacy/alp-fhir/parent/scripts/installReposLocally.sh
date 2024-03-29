<<<<<<< HEAD
#!/usr/bin/env bash

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
(cd $BASEDIR/../../parent/ && mvn install $1)
(cd $BASEDIR/../../meta/ && mvn install $1)
(cd $BASEDIR/../../xml/ && mvn install  $1)
(cd $BASEDIR/../../json/ && mvn install  $1)
(cd $BASEDIR/../../queryengine/ && mvn install  $1)
(cd $BASEDIR/../../catalog/ && mvn install  $1)
(cd $BASEDIR/../../sql/ && mvn install  $1)
(cd $BASEDIR/../../hana/ && mvn install  $1)
(cd $BASEDIR/../../elm/ && mvn install  $1)
(cd $BASEDIR/../../fhir/ && mvn install  $1)

=======
#!/usr/bin/env bash

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
(cd $BASEDIR/../../parent/ && mvn install $1)
(cd $BASEDIR/../../meta/ && mvn install $1)
(cd $BASEDIR/../../xml/ && mvn install  $1)
(cd $BASEDIR/../../json/ && mvn install  $1)
(cd $BASEDIR/../../queryengine/ && mvn install  $1)
(cd $BASEDIR/../../catalog/ && mvn install  $1)
(cd $BASEDIR/../../sql/ && mvn install  $1)
(cd $BASEDIR/../../hana/ && mvn install  $1)
(cd $BASEDIR/../../elm/ && mvn install  $1)
(cd $BASEDIR/../../fhir/ && mvn install  $1)
(cd $BASEDIR/../../postgresql/ && mvn install  $1)
>>>>>>> origin/develop
