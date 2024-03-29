# fhir
FHIR is a Spring Boot Application which realizes a generic FHIR Server on top of relational Databases like Hana or Postgres



## Development Setup
### Prerequisites
- Available Postgres Database (9.6)
  - For local installation with docker <br>
  `$docker run --name mypostgres -e POSTGRES_PASSWORD=toor1234 -p 5432:5432 -d postgres` 
- Available HANA Database
- Java 1.8 SDK
- Maven

# Setup
There is no central "build" for all components available, but all projects have to be build with mvn install.

## Configure the databases
The current test requires two databases, one postgresql and a hana database connection. 

To enable the test please adapt following files to your environment:
### Hana Database
[com.legacy.health.fhir.hana/src/test/resources/test.properties](com.legacy.health.fhir.hana/src/test/resources/test.properties)

    datasource.driver=com.sap.db.jdbc.Driver
	datasource.url=jdbc:sap://[host]:[port]/
	datasource.username=[user]
	datasource.password=[password]

### Postgres Database
[com.legacy.health.fhir.sql/src/test/resources/test.properties](com.legacy.health.fhir.sql/src/test/resources/test.properties)
  
    datasource.driver=org.postgresql.Driver
    datasource.url=jdbc:postgresql://[host]:[port]/postgres
    datasource.username=[user]
    datasource.password=[password]

### FHIR Springboot Application 
[com.legacy.health.fhir/src/main/resources/application.properties](com.legacy.health.fhir/src/main/resources/application.properties)
Here either a HANA or a Postgres database can be configured
    
    spring.datasource.url=[database url]
    spring.datasource.username=[user]
    spring.datasource.password=[password]
    spring.datasource.driver-class-name=[driver class]
    
    
    server.compression.enabled=true
    server.compression.mime-types=application/json,application/json+fhir
    
    spring.http.multipart.max-file-size=20MB
    spring.http.multipart.max-request-size=20MB
    
    sap.sql.path=spec.zip

## Building the application
### Building the full version, with dependency to a hana database

On the root level of this repo execute:

    mvn package

To trigger the build and packing of the application, if suceeds this results in an executable  jar.

### Building the version without dependency to hana
On the root level of this repo execute:

    mvn package -Dno-hana=true

To trigger the build and packing of the application, if suceeds this results in an executable  jar.

> The trigger to build without hana is the 'no-hana' property in the environment, independent of the values it might have.


## Starting the server applications
The result will be a jar file with the name :
com.legacy.health.fhir-0.0.1-SNAPSHOT.jar which will be located in the `./com.legacy.health.fhir/target` directory.



In addition a **application.properties** file in the same folder can be created in case to deviate from the settings maintained above:
	
	 spring.datasource.url=[database url]
    spring.datasource.username=[user]
    spring.datasource.password=[password]
    spring.datasource.driver-class-name=[driver class]
    
    
    server.compression.enabled=true
    server.compression.mime-types=application/json,application/json+fhir
    
    spring.http.multipart.max-file-size=20MB
    spring.http.multipart.max-request-size=20MB
    
    sap.sql.path=spec.zip


The application can than be started with:	

	java -jar com.legacy.health.fhir-0.0.1-SNAPSHOT.jar

# Trying the application

## Postman collections
The postman collections in [resources/postman](resources/postman) contains a set of postman requests which can be used to try the fhir server.

Especially the setup calls have to be executed in order to create a FHIR Endpoint, as one FHIR server can serve multiple FHIR Endpoints, with different sets of capabilities.  

In order to execute the calls the collections have to be imported into Postman and an evironment with at least the the following three variables must be maintained:
[protocol] - either http/https
[host] - hostname, e.g, localhost
[port] - port the application listen on, e.g. 8080  

Default the application listens on port: 8080

## Playground Data
Within [resources/testdata](resources/testdata) there are zip files with Test Resources stored. 
SYNTHEA.zip - contains arround 1300 Patients and overall ~120.000 Resources
SMART.zip contains arround 100 Patients which are useful to try with the different Smart Health Applications.

Both datasets are taken from:
https://github.com/smart-on-fhir/generated-sample-data

# Validating with Project Crucible
[Project Crucible](https://projectcrucible.org/) provides open testing/validation of FHIR Servers. You can see the current validation state of the FHIR implementation here:
https://projectcrucible.org/servers/59ff379104ebd058bd000000 

For this the server must be available in public internet, therefore it is advices to test your server locally.

## Testing locally 
The testing component of crucible is available within this repo
https://github.com/fhir-crucible/plan_executor 
This is a ruby application - and for windows some hacks were required to get them running.

Take care that before you start test you have initialized your FHIR endpoint and configured it with a CapabilityStatement which contains the tested resource types.
 
# Security Implementation for XSA enabled for the following scenarios:

1. [POST] {project}/fhir/{type} ( create resources )
2. [PUT] {project}/fhir/{type}/{id} ( create resources )
3. [GET] {project}/fhir/{type}/{id} ( read resources )
4. [GET] {project}/fhir/metadata ( capability read )
5. [POST] {project}/fhir/ ( Bundle resource creation )
6. [POST] {project}/fhir/load ( load resource from stream )

