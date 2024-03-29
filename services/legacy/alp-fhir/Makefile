build:
	cd parent && mvn install -DskipTests -f "./pom.xml"
	cd meta && mvn install -DskipTests -f "./pom.xml"
	cd json && mvn install -DskipTests -f "./pom.xml"
	cd xml && mvn install -DskipTests -f "./pom.xml"
	cd fluentpath && mvn install -DskipTests -f "./pom.xml"
	cd queryengine && mvn install -DskipTests -f "./pom.xml"
	cd sql && mvn install -DskipTests -f "./pom.xml"
	cd hana && mvn install -DskipTests -f "./pom.xml"
	cd fhir && mvn install -DskipTests -f "./pom.xml"

run:
	cd fhir && java -jar target/fhir-0.1.13.jar

.PHONY: build run
