# FHIR Inspired Logical Data Model 

The D4L platform will be a cloud native healthcare compliant and secure data (sharing) and application platform. As a **data platform**, the D4L Platform will enable personalized medicine, by connecting previously isolated data silos to gain deeper insights on patients. 

For the data platform, we are targeting a data pipeline which allows the customer to ingest data from various sources and formats (e.g. structured & and unstructured), to cleanse, enrich and integrate this data into an integrated data store, and to offer analytical capabilities on this integrated data. In addition to analytical scenarios, the D4L Platform shall also provide support for transactional applications in the healthcare domain, which can easily be integrated into the analytical data pipeline.

This document discusses how this data platform / Data Pipeline could be realized on a conceptual level with high conceptual integrity based on FHIR inspired Logigal data model.

The Document focus on the meta model level, e.g. less about the FHIR concepts like a Patient or Observation, but on the meta model which is used to define such concepts, like StructureDefinition, DataElement, DataType. 



## The Resource Meta Model
FHIR like other model driven concepts defines a multi level Model and Meta Model. 
### Instance/Row/Resource
On the highest level is the concrete Instance/Entity/Row/Resource. E.g. the Patient 'John Smith' living in Boston, or the weight Observation made on first of April.
### Class/Table/StructureDefinition
The next level allows to define what makes an instance valid toward a type. E.g. That a Patient has 1..n names, 1..n addresses and a gender.
### Meta Model (Meta Class/ Data Definition Language/ Meta Structure Definition)
This level allows to define types. E.g. that a Table contains multiple columns, a class has methods and attributes...
### Meta Meta Model 
In theory the "Meta-Meta" Model loop could indefinite, but in reality from a certain level, as definition language is used to define itself. E.g. in FHIR a StructureDefinition is used to define a Structure Definition. 

### The Fhir Meta Model
The main concepts of the Fhir meta model are the structure definition, the data elements and data types. 

E.g. The StructureDefinition 'Patient' defines what makes a valid Patient Resource, a StructureDefinition references Data Elements(like gender, name) which provides a "concrete" logical piece of data. A Data Element has a Data Type, there are base types like string, code, boolean and complex ones like HumanName, Quantity.... . The Data Types itself are modeled as Structure Definitions and therefore complex data types contains data element again. In this way complex composition can be defined (currently not discussed here is inheritance and extensions). 

![](./images/metamodel.png) 

In a simplified (format and content) the necessary artifacts to model a patients could be build.

First we need the simple data types like string and date.

	StructureDefinition:
		id: string
		kind: simple

	StructureDefinition:
		id: Date
		kind simple

The simple data types are than used to build up the more complex ones like address
	
	StructureDefinition:
		id: Address
		kind: complex
		elements:
			DataElement:
				id: Address.line
				type: string
				min: 0
				max: *
			DataElemement: 
				id: Address.street
				type: string
				min: 0
				max: 1
			DataElement:
				id: Address.city
				type: string
				min: 0
				max: 1

With that we have now expression power to model a simple Resource 'Patient'
	
	StructureDefinition:
		id: Patient
		kind: Resource
		elements: 
			DataElement:
				id: Patient.id
				type: string
				min: 0
				max: 1
			DataElement:
				id: Patient.firstName
				type: string
				min: 0
				max: 1
			DataElement:
				id: Patient.lastName
				type: string
				min: 0
				max: 1
			DataElement:
				id: Patient.dateOfBirth
				type: date
				min: 0
				max: 1
			DataElement:
				id: Patient.address
				type: Address
				min: 0
				max: *

An valid instance of type Patient (in pseudo yaml) could then look like

	Patient:
		id: abce-1234
		firstName: Max
		lastName: Musterman
		dateOfBirth: 10-10-2000
		address: [
			-: 
				street: Mainstreet 100
				city: Capital City
		] 

### Non FHIR Resources
A nice side effect of the simplicity of the FHIR Meta Model that it also can be applied to other resource types on the abstract level. As an example we take NHS Practice Data which can be downloaded as CSV.

	CCGName,PracticeCode,PracticeName,PracticeAddress,PracticePostCode
	NHS BARNSLEY CCG,C85001,Drs Sen & Ramtahal,The Goldthorpe Centre Goldthorpe Green Goldthorpe Rotherham ,S63 9EH
	NHS HARTLEPOOL AND STOCKTON-ON-TEES CCG,A81040,Marsh House Medical Centre,Abbey Health Centre Finchale Avenue Billingham  ,TS232DG

Luckily we can reuse the existing types and only needs to model a new structure definition.

	StructureDefinition:
		id: NHSPractice
		kind: Resource
		elements:
			DataElement:
				id: NHSPractice.CCGName
				type: string
				min: 0
				max: 1
			DataElement:
				id: NHSPractice.PracticeCode
				type: string
				min: 0
				max: 1
			DataElement:
				id: NHSPractice.PracticeName
				type: string
				min: 0
				max: 1
			DataElement:
				id: NHSPractice.Address
				type: string
				min: 0
				max: 1

An instance of a NHSPractice StructureDefinition could look like:

	NHSPractice:
		CCGName: NHS BARNSLEY CCG
		PracticeCode: C85001
		PracticeName: Drs Sen & Ramtahal
		PracticeAddress: The Goldthorpe Centre Goldthorpe Green Goldthorpe Rotherham 
		PracticePostCode: S63 9EH
		
In the next section it will be described how these concepts can be used to build a data flow architecture with high conceptual integrity. 

## Data Flow Architecture
The Diagram below shows a high level picture of the Data Platform Target Architecture. 
In this the data enters the D4L Platform from different data source, and will be transformed through different stages to end up in formats and persistencies which can be used by data stakeholder to perform their scenarios. 
![](./images/dataplatform.png)

When now view the above architecture from the perspective of Data Flows, the D4L Platform is a Data Node which can consumes Data from and in various sources and formats. and is capable to make this data into various target persistence and formats. 

Within a data node mainly two kind of transformations can take place. On the one hand the "technical" de/-serialization from and to different formats of one and the same logical resource type. The diagram below shows this conceptual wise for a data node.


![](./images/serialization_datanode.png)
 
In the upper "flow" for this data node it can "pull" de-serialized data from a csv file and serialize it into a relational model, but from the logical perspective the same "Resource" and Resource Type is used. 
In the lower "flow"  also the same resource is first pushed over http in JSON format and later on consumer by pulling over http delivered in XML format.

In the NHSPractice example we already have seen one such transformation from the CSV format into the YAML like format. Both are modeling the same Practice and uses the same Abstract Structure Definition. The lowercase might be a simple "FHIR Server" - where on sender send a Patient resource in JSON format and another http client consumes the Patient Data in XML Format. But both times it is the same "logical" Patient. 

The second form of transformation is the semantical transformation from one StructureDefinition format into another. 
![](./images/mapping_datanode.png)

In the upper transformatin (Type A -> Type D) a Resource of Type NHSPractice will be transformed into a Resource of FHIR Organization. E.g. internally the address field will be transformed into an Data Element of Type Address.

In the lower transformation (Type B & Type C -> Type E) Resources of Type FHIR Patient and Type FHIR Observation will be transformed (e.g. through join, partitioning and Aggregation) into Resources of Type E which contains for example the the average Wheight by age of patients (This could f.e. be realized of another set of Observations, or a spefic Structure Definition Type).

In general there are often combinations of these transformations. E.g. loading NHSPatients from CSV and to transform them on the one hand into FHIR Observations and store it into a relational model.  

Having these concepts in mind on a very abstract level the whole D4L Platform is a Data Node which pull/get pushed data from different source types/serialization-formats and transform them for consumption into different target types/serialization-formats.


![](./images/transformation_healthplatform.png)

Important for understanding and consitency is that all inbound / outbound types and actions are "based" on a common (machine readable) meta model.

### Node Chaining and Node (De-)Composition
As we are talking about a Data Flow / Data Pipeline usally not only one data node build the pipeline. Multiple Nodes can be chained together to transform incoming sources step by step the target format. 

![](./images/dataflow.png)
The flow in the diagram above shows one such node chain. Where stepwise a Resource of a certain patient profile is pushed into the chain over HTTP in JSON Format. It will then first be transformed into AVRO format and serialized into a Kafka Topic. From there a Data Node will pick it up and writes it into S3 without transformation in the format or "semantic" area. The next node takes again the data from S3 in Avro format but transforms it from Profile A to Profile B and stores it back in S3 within Avro format. As last step a node waits for http requests and than reads the Data from S3 in Avro Format and respond the request with an XML Serialization of the resource of Profile B. 

A data node itself can be decomposed into multiple internal data nodes, which further reduces the complexity of every single node. Having finer granular nodes would make it also possible to compose/reuse them in different contexts.  


* Complex Data Flow

### In Process / MicroService Data Node composition 
As discussed Data Nodes can be composed. This can happens on different "technology" Layers. Based on our targeted Microservice Architecture the higher level Data Nodes will come as independent (Micro)services - but within one microservice the decomposition of the Data Flow can continue. 

#### MicroService Data Node Composition
The main units of the D4L Platform will me independent (Micro-)services, this is also true for the data node services. 
Following the same high level interface (following the different views on the FHIR Logical Data Model) different Services will be implemented (e.g. a Postgres Data Node, a Structure Validator Node, S3 Data Node).

These different services can be composed (technology is open). It makes sense to determine canonical formats the different services can use to communicate with each other. E.g. Structures based on the FHIR Logical Data Model send over Http using Avro or Json Serialization. 

The diagram below shows one data flow through data node microservices. Services in the normalized form will consume and/or produce serializations into the canonical format (here FHIR compliant models through avro over http). 
![](./images/normalized_microservice_datanodes.png)

This normalized composition/orchestration migth have drawbacks in performance and throughput within the data flow. Later in the document the concept of layer bridging is introduced to provide a potential solution for this kind of problems.

#### In Process Data Node Composition
Within a microservice data node (running in one process) the flow usually can be further divided into multiple data nodes and based on that the inner components might be reused (important the service on the microservice level, reusing on "in process" layer would be voluntary). 
In the microservice example above there are two microservices which consumes structures over HTTP and Avro, the one writes into Kafka the other ones into Elastic. 
This might make it attractive to reuse the HTTP over AVRO Mapping. 

![](./images/normalized_inprocess_datanodes.png)

In the diagram above there is a zoom into the two microservices and their composition out of inprocess data nodes. On the component level the Http/Avro into the process internal canonical format is reused. In this way the microservice owner can more focus on his specialized transformation from a canonical format into it's speciality. Also other functionality e.g. transformation (AVRO->JAVA), validation could be offered in a reusable form. 

One downside of this is for sure that usuallly  that the reuse libraries are only available in few/one language and a certain level of dependency is introduced with the microservice, therefore e.g. validation and simple transformation should also be available as external microservice (to - be checked for performance)

### Layer Bridging 
On the abstract level transformation from one serialization format to another happens through first bring the input serialization into the "normalized" format and from the "normalized" format into the target serialization. For several reasons that is not always the best options, for example on the one side there could be performance reasons that the transformation into and from the "normalized" format is just to slow. Another reason could be that there is out of the box "transformation" available from the source into the target format/serialization. E.g. ElasticSearch stores Json Documents, or Avro Messages can easily be transformed into Parquet Format. For these kind of scenarios layer bridgin is a valid approach.  

### In Process Layer Bridging
In case of an in process data flow f.e. using the JVM based components - without layer bridging data from the StructureProvider (which reads structure from the input source serialization) will be deserialized into a POJO Java Model - and the StructureConsumer (which "writes" the structures into the output target serialization).
For example in a scenario with a JsonStructureProvider and an ElasticStructureConsumer the Json Objects would first be transformed into default Structure Objects and from there they will be provided to the ElasticStructureConsumer, which will deserialize the Structure again into a Json Object to index it into elastic search. 
With Layer Bridging the Consumer and Provider "agrees" on a serialization format and the serialization into the target format can happen without "intermediate" steps. In the case of the JsonStructureProvider and the ElasticStructureConsumer this would mean that the ElasticStructureConsumer could accept JsonStructures directly and than the deep transformation might not need to take place. The ElasticStructureConsumer can directly consume the Json Format and sends it to ElasticSearch.  
![](./images/bridging_inprocess_datanodes.png)
Within the diagram above the upper Data Node shows the normalized data flow. The Input Node receives Json over http and transforms it into an internal representation (Java Pojo's) this internal representation will than be consumed by the outgoing node, where it transfers it back to Json before it will index the document within Elastic Search. 
This transformation into the intermediate normalized format consumes processing and memory resources, and could possibly be reduced by using layer in process layer bridging.

This is shown in the lower data flow there the input and output nodes "negotiate" that Json is a format both components can speak - here than the transport from the input into the output format can directly happens through json.   

### Microservice Layer Bridging
Bridging not only make sense within one process, but also to bridge nodes over microservices. For the "end" sender and consumer in a longer pipeline only the "interfaces" have to be stable, how many nodes are in between is not relavant for them. 
 
![](./images/bridging_microservice_datanodes.png)

The diagram above shows in the top pipeline the "normalized" pipeline from above. The communication mainly works very fine granular over the canonical data model. Here especially direct http communication between notes might not be necessary and slows down the pipeline. 
The pipeline in the middle shows these additional http transforms bridged within one microservice. Here especially on the Kafka Consumer sight it make sense to write optimized Kafka Consumers for the targeted technolgy (here e.g. Elastic). This bridging is mainly made for performance, whereas the last pipeline bridges services even further by direct loading data from the "sending" http client into elastic search. This setup could for example be used for smaller tenants / developer accounts.

For the decissions whether to bridge microservice data nodes is "independent" of the "logical" meta data concept. By nature communication between two microservice happens through some serialization format, usually following the concept here would not introduce "more" microservice hopps, which also otherwise would be choosen. 

The bridging on the microservice level can be supported by "In Process" Data Node composition and bridging. 

## (De-)/Serialization
As already described in a previous chapter in general there are two main forms of transformation, one which transform for the same abstract model, from one concrete serialization into another concrete serialization.
This section describes this form of transformation in more details. 

On the first "thought" providing serveral implementations/serialization of the Fhir Meta Model and concepts mainly deal with transforming a "Patient" Resource which comes for example in Json format into a set of "Inserts" into Patient related tables, or to transform it to Avro or XML, but to holisticically also other aspects of the "Specification" have to be considered.  

![](./images/holistic_serialization.png)

## Structure Mapping


## Expressions and Queries
The consistent usage of the Logical Metamodel also allows to express higher level logic like calculation or queries based on a common meta model. In this way once a certain operation / query feature is available for all resources / data elements based on this meta model.

One importan consideration to achieve is that the result of meta model based expressin or query is itself conformant to the meta model and therefore can be used in further operations and queries. 

Concrete this means when performing an "plus" operation on two value elements, the result is again a value element, which could be used within a structure. 

Similar the result of a query against structure definitions within a database results in a new structure definition in this way queries and query results can be chained to produce views or data marts.
 
### Query Engine
This section provides a simple example to get a better understanding of the "recursive" typing within the query engine. 
Assume that the task is to create some view on your Patient and Body Wheight Observation data to optimize analytics. The data stakeholder is interested in a view which contains the patient gender, patient city, and for body wheight observation the weight and the time of the observation.
For this we need the internal "input" Structure Definitions for Patient (all definitions here are very strong simplifications of the original defintions of these resources).
  
	StructureDefinition:
		id: Patient
		kind: Resource
		elements:
			DataElement:
				id: Patient.id
				type: string
				min: 1
				max: 1
			DataElement:
				id: Patient.gender
				type: string
				min: 0
				max: 1
			DataElement:
				id: Patient.address
				type: Address
				min: 0
				max: *

and Observations 

	StructureDefinition
		id: Observation
		kind: Resource
		elements:
			DataElement:
				id: Observation.id
				type: string
				min: 1
				max: 1
			DataElement:
				id: Observation.code
				type: string
				min: 1
				max: 1
			DataElement:
				id: Observation.subject
				description: the reference to the patient resource 
				type: reference
				min: 0
				max: 1
			DataElement
				id: Observation.date
				type: date
				min: 0
				max: 1
			DataElement
				id: valueQuantity
				type: decimal
				min: 0
				max: 1


Based on this structure definition the goal is to perform a query on the data base which returns a data in a view like this.

| Patient.id  | Patient.gender | Patient.address.city | Observation.valueQuantity | Observation.date
| ------------- | ------------- |---------------------|-|-|
| 1 | male  |       London      |  123.3| 10.10.2017 |
| 1 | male  |       London      |  121.3| 11.10.2017 |
| 2 | female |       New York      |  119.3| 09.10.2017 |

This could be (with some other header names expressed in following structure definition

	StructureDefinition:
		id: PatientWeightOverTime
		kind: Resource //maybe an own "kind" could help e.g. view?
		elements:
			DataElement
				id: PatientWeightOverTime.id
				type: string
				min: 1
				max: 1
			DataElement
				id: PatientWeightOverTime.gender
				type: string
				min: 0
				max: 1
			DataElement
				id: PatientWeightOverTime.city
				type: string
				min: 0
				max: 1
			DataElement
				id: PatientWeightOverTime.value
				type: decimal
				min: 0
				max: 1
			DataElement
				id: PatientWeightOverTime.date
				type: date
				min: 0
				max: 1

This structure definition could be used for "next" calculations within the same process, or when registered be used by tools which accesses data based on this structure. 

An "pseudo" Query to create this data could look like:

	Query:
		name: PatientWeightOverTime
		from: Patient
		with: 
			type: Observation
			link: Observation.subject
		filter:
			eq:
				left: Observation.code
				right: "Weight Measure"
		out:
			Patient.id as id
			Patient.gender as gender
			Patient.address.city as city
			Observation.valueQuantity as value
			Observation.date as date


## Mappings

## Functionality Push Down

## Data Node Lifecycle
Data Node will have a lifecycle including following stages:
* "Infrastructure" Created
* "StructureDefinitions" deployed
* Initial Data Loaded
* Active state
* Update StructureDefinitions
* Terminate

### Infrastructure Created
Data nodes requires some infrastructure 

## Data Node Discovery

## Data Mart Generation

## Authorizations

## Service and Resource Definitions

### Tenant
Tenants are separated entities, usually a customer will have 1..n tenants. Tenants can be for different phases (e.g. Development, Production).

### Content Repository
#### FHIR Meta Data
#### Custom Structure Definitions

### DataService
Data Service are the technical services which provides data (e.g. persistence,transformations). They can be instantiated into data nodes. 
Similar to AWS RDS is the relational data service, concrete instances (e.g. a Postgres DB) can be created. 

Tenants will subscribe to data service and than can use this service to instantiate data nodes. 


### DataNode

### DataFlow

## Current Poc

![](./images/blockdiagram_poc.png) 

Test CI Pipeline
 
