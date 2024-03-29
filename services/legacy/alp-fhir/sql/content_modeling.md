# Building Content Model and Integration
The FHIR Based Content Infrastructure allows to build Content types based on FHIR StructureDefinitions, which than can be used/make use within/of the FHIR Infrastructure. In Addition FHIR Content types can also used for Generating Java Code which provides higher level access on the Resource.

Here the example FHIR Permissions Model is used to explain the different steps.

    {
    "group-id": "A", 
    "rest-permissions": [
    {
      "type": "resource",
      "id": "Observation",
      "grant": ["write","read"]
    }, {
      "type": "compartment",
      "id": "Patient",
      "grant": ["read"]
    }
    ],
    "instance-permissions": [
    {
    "type": "resource",
    "id" : "Patient",
    "meaning": "instance | related | dependents | authoredby", 
    "path": "Patient.id",
    "value": "$attr.socialSecurityNumber"
    }
    ]
    
    }

The JSON above shows the conceptual JSON which now shall be transformed into a FHIR Structure. 

Within the content infrastructure editing the types takes place in main resources of the sql repository: alp-data-node/services/alp-fhir/sql/src/main/resources/content 

There the structure definitions are defined. 
We will start by creating a JSON file with name Permission.json and fill it with the basic properties:

    {
    	"resourceType": "StructureDefinition",
    	"id": "Permission",
    	"url": "http://data4life-asia.care/health/fhir/StructureDefinition/Permission",
    	"kind": "resource",
    	"name": "Permission",
    	"test":{
    		"div":"<div>Defines the permissions for a group</div>"
    		},
    	"type": "Permission"
    }

Next we add neccessary profile meta data- to identify this resource as Content:

    {
    	"resourceType": "StructureDefinition",
    	"id": "Permission",
    	"url": "http://data4life-asia.care/health/fhir/StructureDefinition/Permission",
    	"kind": "resource",
    	"name": "Permission",
    	"test":{
    		"div":"<div>Defines the permissions for a group</div>"
    		},
    	"type": "Permission",
		"meta": {
			"profile": [
				"http://data4life-asia.care/health/fhir/profile/StructureDefinition"
			]		
		}
    }

The profile url "http://data4life-asia.care/health/fhir/profile/StructureDefinition" is a marker for the Content infrastructure, e.g. how to resolve the reference. 

In the next step the different Attribues can be added into the snapshot section, starting with the two basic ones:

     {
    	"resourceType": "StructureDefinition",
    	"id": "Permission",
    	"url": "http://data4life-asia.care/health/fhir/StructureDefinition/Permission",
    	"kind": "resource",
    	"name": "Permission",
    	"test":{
    		"div":"<div>Defines the permissions for a group</div>"
    		},
    	"type": "Permission",
		"meta": {
			"profile": [
				"http://data4life-asia.care/health/fhir/profile/StructureDefinition"
			]		
		},
		"snapshot": {
			"element": [
				{
		 			"id": "Permission",
					"path": "Permission",
					"min": 0,
					"max": "*"
				},
				{
					"id": "Permission.id",
					"short": "Logical id of this artifact",
        			"definition": "The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.",
        			"comment": "The only time that a resource does not have an id is when it is being submitted to the server using a create operation.",
        			"min": 0,
        			"max": "1",
        			"base": {
          				"path": "Resource.id",
          				"min": 0,
          				"max": "1"
        			},
        			"type": [
          				{
            				"code": "id"
          				}
       			 	],
        			"isSummary": true
				}
			]
		}
    }

All Resources defines their root and an id property. 
Next we add the group attribute - which identifies for which group this permissions are defined. 

    {
    	"id": "Permision.group",
    	"path": "Scenario.group",
    	"short": "The permissions are defined for this group",
    	"definition": "The permissions are defined for this group",
    	"min": 1,
    	"max": "1",
    	"type": [	
    		{
    			"code": "id"
		    }
    	]
    }

Beside the property name (which is used for code generation also the type.code and the cardinality is important - as they decide also on a correspoding Java Type and whether there is single or list based access.
(Here other modeling could also make sense, e.g. reuse the Group Resource of FHIR - than the group would be a reference. Also could be checked wether it make sense to allow one PermissionDefinition for multiple groups, for multiple groups simply set max capability to "*".
Not yet supported in the generator, but from model perspective one could also use Identifier as type for the group - but as described complex types are not supported yet.
For FHIR i would propose to separate between id and group in contrast to the logical json above. 
## Rest Permissions

Next topic are the rest permissions - which will be modelled as backbone element in FHIR - which will result in an inner class. (There is no support currently in FHIR to build own explicit DataTypes).

    {
    	"id": "Permission.restPermission",
    	"path":"Permission.restPermission",
    	"short":"Describe the rest permissions for this group",
    	"description":"Describe the rest permissions for this group",
    	"min":1,
    	"max":"*",
    	"type":[
    		{
    			"code":"BackboneElement"
    		}
    	]
    }

The children of this Backbone Element will be added directly after this element definition. (Overall independent of the logical nesting - the element definitions in a StructureDefinition are flat).

The **'type'** element determines whether a rest permission is for the concrete resource type or a compartement (which includes also related artifacts). 

    {
    	"id": "Permission.restPermission.type",
    	"path":"Permission.restPermission.type",
    	"short":"resource | compartement",
    	"description":"Describes the scope of this permission",
    	"min":1,
    	"max":"1",
    	"type":[
    		{
    			"code":"code"
    		}
    	]
    }

We will use the "code" type - as we in a later release could add bindings to a ValueSet here - and enable (better) automated validation of a resource. 

The **'definition'** element will link to a structure definition, now to a resource type, but later maybe also to profiles. This definition links to the FHIR Resource Type/Profile the permissions are set for.  

	{
    	"id": "Permission.restPermission.definition",
    	"path":"Permission.restPermission.definition",
    	"short":"FHIR Resource Type which for which permissions are set",
    	"description":"FHIR Resource Type which for which permissions are set",
    	"min":1,
    	"max":"1",
    	"type":[
    		{
    			"code":"Reference",
				"targetProfile": "http://hl7.org/fhir/StructureDefinition/StructureDefinition"
    		}
    	]
    }

With the "targetProfile" Attribute one can define what kind of references are supported. When resolving this reference through the generated code - this results in a StructureDefinition instance.

Last element for the REST Permissinons is the Grant **'attribute'**, which again will be modelled as code.
   
	{
		"id": "Permission.restPermission.grant",
		"path":"Permission.restPermission.grant",
		"short":"read | create | update | delete",
		"description":"Describes the scope of this permission",
		"min":1,
		"max":"*",
		"type":[
			{
			"code":"code"
			}
		]
	}
Here we set 'max' to '*' to allow granting multiple things.

## Instance Permissions
The instance based permissions are also modelled Backbone Element

    {
    	"id": "Permission.instancePermission",
    	"path":"Permission.instancePermission",
    	"short":"Describe the instance permissions for this group",
    	"description":"Describe the instance permissions for this group",
    	"min":1,
    	"max":"*",
    	"type":[
    		{
    			"code":"BackboneElement"
    		}
    	]
    }

The **'type'**,**'definition'** and **'grant'** attributes are similar as for the rest permissions.

    {
    	"id": "Permission.instancePermission.type",
    	"path":"Permission.restPermission.type",
    	"short":"resource | compartement",
    	"description":"Describes the scope of this permission",
    	"min":1,
    	"max":"1",
    	"type":[
    		{
    			"code":"code"
    		}
    	]
    },
	{
    	"id": "Permission.instancePermission.definition",
    	"path":"Permission.instancePermission.definition",
    	"short":"FHIR Resource Type which for which permissions are set",
    	"description":"FHIR Resource Type which for which permissions are set",
    	"min":1,
    	"max":"1",
    	"type":[
    		{
    			"code":"Reference",
				"targetProfile": "http://hl7.org/fhir/StructureDefinition/StructureDefinition"
    		}
    	]
    },
	{
		"id": "Permission.instancePermission.grant",
		"path":"Permission.instancePermission.grant",
		"short":"read | create | update | delete",
		"description":"Describes the scope of this permission",
		"min":1,
		"max":"*",
		"type":[
			{
			"code":"code"
			}
		]
	}

The **'constraintType'** attribute determines which "mechanism" shall be used to evaluate the instance level permission. 

	{
		"id": "Permission.instancePermission.constraintType",
		"path":"Permission.instancetPermission.constraintType",
		"short":"elementMap | fhirpath",
		"description":"Describes how the permission shall be evaluated",
		"min":1,
		"max":"1",
		"type":[
			{
			"code":"code"
			}
		]
	}

For FP0 the fhirpath type has lower priority (as we would first have to come up with a mapping to sql here).


For the 'elementMap' constraint type the **'element'** attribute defines the data element within the above linked resource which is used as filter criteria - it should be a simple FhirPath path.

	{
		"id": "Permission.instancePermission.element",
		"path":"Permission.instancePermission.element",
		"short":"Defines the element within the resource which has to be equal the value",
		"description":"Defines the element within the resource which has to be equal the value",
		"min":1,
		"max":"1",
		"type":[
			{
			"code":"string"
			}
		]
	}

For the 'elementMap' constraint type the **'value'** attribute defines the context value an object shall be equal to the element.

	{
		"id": "Permission.instancePermission.value",
		"path":"Permission.instancePermission.value",
		"short":"Defines the value within the resource which has to be equal the element",
		"description":"Defines the value within the resource which has to be equal the element",
		"min":1,
		"max":"1",
		"type":[
			{
			"code":"string"
			}
		]
	}

What exactly can "come" into the value (how to access user attributes) is not part of this discussion.

For the 'fhirpath' constraint type the **'expression'** attribute defines a boolean fhir path expression with the resource as root context - when this expression results to true access will be granted.
 
	{
		"id": "Permission.instancePermission.expression",
		"path":"Permission.instancePermission.expression",
		"short":"Boolean FHIRPath Expression which determines granting access",
		"description":"Boolean FHIRPath Expression which determines granting access",
		"min":1,
		"max":"1",
		"type":[
			{
			"code":"string"
			}
		]
	}
 

# Supported Datatypes for Generation
The most accurate list you find in the code here: alp-data-node/services/alp-fhir/sql/src/main/java/com/legacy/health/fhir/content/TypeUtils.java#L54 (switch(type)). 

As of writing:
* string
* code
* id
* boolean
* Reference
* BackboneElement

# Types of targetProfiles

* "http://hl7.org/fhir/StructureDefinition/StructureDefinition" : Results in linking the StructureDefinition.java instance in the generated java code.
* Structure Definition with a profile of "http://data4life-asia.care/health/fhir/profile/StructureDefinition" - the generator assumes that there is a specific Java class available (etiher generated or handwritten (Tabledefinition) which will be referenced from this generated class
* Other Elements (e.g. CapabilityStatement) - the generator will reference the Structure.java class.


# Generating the code
In order to work with the Permissions corresponding java code should be generated. This Code provides Beans like access to the Resources and takes care for resolving references. Currrently mainly read scenarios are supported. 

The code generator is currently very primitve and not very flexible:
* All generate code ends up in the content.model package (alp-data-node/services/alp-fhir/sql/src/main/java/com/legacy/health/fhir/content/model) 
* All Imports are preterdemined
* Is executed as unit test and per default generate to sys.out, and have to be modified to generate into the file system.

The "entry point for generation" is the [ClassGeneratorTest](alp-data-node/services/alp-fhir/sql/src/test/java/com/legacy/health/fhir/content/ClassGeneratorTest.java "ClassGeneratorTest") 

## Add the new resource type to the list withinthe generateModel testcase

	@Test
	public void generateModel() throws IOException{
		StructureDefinition2ClassGenerator gen =new StructureDefinition2ClassGenerator();
		gen.init();
		generate(gen, "ScenarioDefinition");
		generate(gen, "CatalogDefinition");
		generate(gen, "Scenario");
		generate(gen, "TableContent");
		generate(gen, "Permission");
	}

## Change the attribue [generateCode](alp-data-node/services/alp-fhir/sql/src/test/java/com/legacy/health/fhir/content/ClassGeneratorTest.java#L32) to true

	static boolean generateCode=true;

Please keep in mind -before pushing the code - to change the flag back to false.

## Set the attribute [targetDirectory](alp-data-node/services/alp-fhir/sql/src/test/java/com/legacy/health/fhir/content/ClassGeneratorTest.java#L33) to the path of your main/java/com.legacy.health.fhir.content.model package

	static String targetDirectory = "C:/fhir/ws/sql/src/main/java/com/legacy/health/fhir/content/model/";

And then run the unit test to generate the coding. When the Structure Definition was not correct, usually the generated code will have errors, (for me common e.g. that i write "reference" instead of "Reference".

# Linking the Permission StructureDefinition into the content Capability Statement
In order to store and retrieve resources of type Permission, the definition must be registered within the [capability statement][alp-data-node/services/alp-fhir/sql/src/main/resources/content/content_capabilitystatement.json] which defines the Capabilities fo the content store.

	{
	    "resourceType":"CapabilityStatement",
	    "id":"content",
	 ...
	    "rest": [
	        {
	            "mode":"server",
	            "resource": [
	                {
	                    "type":"CapabilityStatement",
	                    "interaction": [
	                        {
	                            "code":"search-type"
	                        }
	                    ],
	                    "searchParam": [
	                        {
	                            "name":"identifier",
	                            "type":"token"
	                        }
	                    ]
	                }
					...
	                {
	                    "type":"ScenarioDefinition",
	                    "interaction": [
	                        
	                    ],
	                    "searchInclude": [
	                        
	                    ],
	                    "searchParam": [
	                        
	                    ]
	                },
					{
	                    "type":"Permission",
	                    "interaction": [
	                        
	                    ],
	                    "searchInclude": [
	                        
	                    ],
	                    "searchParam": [
	                        
	                    ]
	                }
	            ],
				...        
	    ]
	}

As you can see above, currently interactions and searches are not modeled, which would have to be done. 

# Linking the model to others.
Important for the usage is the possibility to link the different content types to each other. 
In the case of Permissions this is mostly relevant for the ScenarioDefinition (which defines a reusable scenario) as well as the Scenario(which describes a concrete instance of a scenario). 
Permissions within a ScenarioDefinition shalln be available for all deployments of this definition. For a concrete scenario additional permissions could be added.

In order to do that we will first change the ScenarioDefinition.json file by adding a new element into the deployment Backbone element: 

	{
		"id": "ScenarioDefinition.deployment.permission",
		"path": "ScenarioDefinition.deployment.permission",
		"short": "Permissions and Group mappings for this deployment",
		"min": "1",
		"max": "*",
		"type": [
			{
				"code": "Reference",
				"targetProfile": "http://data4life-asia.care/health/fhir/StructureDefinition/Permission"
			}
		]
	}

The permissions will be linked as Reference with the TargetProfile binding to the Permission. 

The same we do for the Scenario, but this time on the root level:

	{
        "id": "Scenario.permission",
        "path": "Scenario.permission",
        "short": "The permissions of this scenario",
        "definition": "The permissions of this scenario, in addition to the one provides through the Scenario Definition",
        "min": 0,
        "max": "*",
        "type": [
          	{
            	"code": "Reference",
            	"targetProfile": "http://data4life-asia.care/health/fhir/StructureDefinition/Permission"
          	}
        ]
    }

When now the unit test is reexecuted - the ScenarioDefinition and Scenario classes will contain references to the Permission class. As well as the fromJson() function includes the deserialization of the reference. 

# A first permission resource
Next step is to create the concrete permissions and to link them in to a scenariodefinition. We will us a basic patient centric permission as example.

	{
		"resourceType":"Permission",
		"id":"HCIMPatientGroupPermission",
		"group":"HCIMPatientGroup",
		"restPermission":[
			{	
				"type":"compartement",
				"definition":{
					"reference":"http://hl7.org/fhir/StructureDefinition/Patient"
				},
				"grant":[
					"read"			
				]
			}
		],
		"instancePermission":[
			{
				"type":"compartement",
				"definition":{
					"reference":"http://hl7.org/fhir/StructureDefinition/Patient"			
				},
				"grant":[
					"read"
				],
				"constraintType":"elementMap",
				"element":"Patient.identifier.value",
				"value":"$attr.socialSecurityNumber"
			}
		]
	}

The resource will be stored under [src/test/resource/content](alp-data-node/services/alp-fhir/sql/src/test/resources/content) as HCIMPatientGroupPermission.json.

Within the ScenarioDefinition resource for the [HCIM Scenario](alp-data-node/services/alp-fhir/sql/src/test/resources/content/hcim.json) we would have add the reference to the HCIMPatientGroup.

	{
		"id":"hcimscenario",
		"resourceType":"ScenarioDefinition",
		"category":"catalog",
		"capabilities":{
			"reference":"bgz2017-servercapabilities"
		},
		"permission":[
			{
				"reference":"HCIMPatientGroupPermission"
			}
		]
		"deployment":[
			{
				"scope":"base",
				"persistency":[
					...
				],
				"catalog":[
					...
				]
			}...	
		],
		"parameter":[
			...
		]
	}

# Integration into content repository unit test
With this done we now can use this to integrate the Permission into codings, like the [content repository unit tests](alp-data-node/services/alp-fhir/sql/src/test/java/com/legacy/health/fhir/content/ContentRepositoryTest.java).

In there is the "testGetResource" which contains the process.
First the resource have to be stored:

	@Test
	public void testGetResource() throws Exception {
		// test data for create
		Structure resource = prepareStructure("content/hcim.json");
		createResoure(resource);
		Structure scenarioStructure = resource;
		resource = prepareStructure("content/bgz_server.json");
		createResoure(resource);
		...
		resource = prepareStructure("content/HCIMPatientGroupPermission.json");
		createResoure(resource);
		...
	}

The prepareStructure would be responsible for parsing the json file. createResource uses the generic persistency to store the structure:

	private Structure createResoure(Structure patientStructure) throws FhirException {
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		TransactionContext transactionContext = fhirResourceImpl.startTransaction(true, requestCtx);
		Structure resource = fhirResourceImpl.createResource(patientStructure, requestCtx, transactionContext);
		return resource;
	}

As you can see from FHIR perspective a content resource behaves "normal".

Based on that the ContentRepository could be configured and linked to the generic persistency:

		GenericFHIRResoureRepository fhirResourceImpl = new GenericFHIRResoureRepository();
		StructureDefinition sd = repo.getStructureDefinitionById(scenarioStructure.getResourceType());
		RequestContext requestCtx = new RequestContext();
		requestCtx.setEndPoint(SCHEMA);
		requestCtx.setMetaRepo(repo);
		requestCtx.setResourceType(sd.getId());
		requestCtx.setRequest(request);
		requestCtx.setConnectionDetails(getProperties(TEST_CONNECTION_FILENAME));
		ContentRepository repository = new ContentRepository();
		repository.setRequestContext(requestCtx);
		repository.setInnerRepository(fhirResourceImpl);

And based on an id a content resource could be loaded:

		ScenarioDefinition definition = new ScenarioDefinition();
		definition.setId(scenarioStructure.getId());
		definition.setContentRepository(repository);

and the getters could be used for navigation, whereas the content repository infrastructure takes care for loading content on demand.

		List<Permission>permissions = definition.getDeployment().get(0).getPermission();
		assertEquals(1,permissions.size());
		assertEquals("HCIMPatientGroup",permissions.get(0).getGroup());


# Bring it into FHIR + Postman
In order to allow the definitions and resources used within the FHIR server and to support content upload it must be loaded into zip files.

## content_definition.zip
The content definition zip contains the content structure definitions and is used to create the generic persistence in the FHIR server during intialization of the server.

It currently contains the following files taken from sql/src/main/resources/content folder:
ScenarioDefinition.json
Scenario.json
CatalogDefinition.json
TableContent.json
Tabledefinition.StructureDefinition.json

We have to add now the **Permission.json** file created before.

The zip file with the name content_definition.zip has to be stored in the same folder

With that step, when starting the FHIR server and perform the GET {{protocol}}://{{host}}:{{port}}/fhir/init request the content persistency will be created with storage for Permission resources.

## Adding to content.zip for uploading as HCIM Scenario.
As we plan to ship our content in some archive and to upload it we would have to add our content permissions within a content.zip file.

The zip file will contain all the files under alp-data-node/services/alp-fhir/sql/src/test/java/com/legacy/health/fhir/content 
And we will add HCIMPatientGroupPermission.json there as well (or as time of reading - this will be done;-)

The created zip file we will store under the fhir resources located here alp-data-node/services/alp-fhir/fhir/resources/testdata 

## Adding Request to Postman script

Using following [collection](alp-data-node/services/alp-fhir/fhir/resources/postman-not_in_integration_test/002 MVP Cyle.postman_collection.json)

### Initializing FHIR
First when executing the GET {{protocol}}://{{host}}:{{port}}/fhir/init request the resulting capability statement shall have the section Permission.

(in the background it creates a generic endpoint "content" within the server. )

### Uploading scenario content
Now POST {{protocol}}://{{host}}:{{port}}/fhir/content/upload with the content.zip file in the testdata folder. The content will be deployed to the system.

### Getting Available Scenario descriptions:
When now perform GET {{protocol}}://{{host}}:{{port}}/fhir/content/ScenarioDefinition the returned scenario shall hold on permission. 

### Getting Available Permission
Similar the available Permissions can be requested, this can be done with {{protocol}}://{{host}}:{{port}}/fhir/content/fhir/Permission it should show one permission.

Currently there is no code in the fhir code which make use of the permission resource, therefore we can't show "more" here.

# Catalog Mapping in FHIR #

This document describes the mapping functionality within FHIR based on the examples of the HCIM scenario.
The Codesnippet below shows the frame for one Catalog Definition.
    
	{
		"resourceType":"CatalogDefinition",
		"id":"patient_catalog",
		"target":{
			"reference":"http://hl7.org/fhir/StructureDefinition/Patient"
		},
		"table":[
			...
		],
		"mapping":[
			...	
		]
	}

The basic structure of this resource is the following:

| DataElement       | Type          | Description  |
| ------------- |:-------------| -----|
| CatalogDefinition.resourceType      | string | always 'CatalogDefinition' |
| CatalogDefinition.id      | id      |   id of the catalog, which is for example referenced from Scenario definitions |
| CatalogDefinition.target | Reference      |   Reference to a FHIR StructureDefinition which which defines the target ResourceType of the catalog |
| CatalogDefinition.table| BackboneElement| Array of Table references, which are involved in the Mapping from the relational model into the target FHIR Resource.|
| CatalogDefinition.mapping| BackboneElement| Array of Mapping definitions which are performed to map the data from the tables into a FHIR Resource |

## Example Mapping Scenario 1

Let's assume we have three tables which we wants to Map to a FHIR Patient Resource
1. HCIMPatient
2. HCIMIdentifier
3. HCIMPatientAddress

A single Patient can have 1 row within the Patient Table, 0..* entries in the Identifier and 0..* PatientAddress Tables.

### HCIMPatient Table Example

| _ReferenceNumber        | Gender     | FirstName  | LastName |
| ------------- |-------------| -----|-----| 
| 1      | M | Peter | Moore|
| 2      | F |   Petra | Miller|

### HCIMIdentifier Example
| _ReferenceNumber        | _PatientRecordKey     | System  | Code | use|
| ------------- |-------------| -----|-----| 
| 11      | 1 | bsn | 12345| official|
| 22      | 1 |   legacy | ABCD| - |
| 33      | 2 |   Petra | 54321| official|

### HCIMPatientAddress Table Example
| _ReferenceNumber        | _BelongsTo     | Street  | City | Postalcode | Country|
| ------------- |-------------| -----|-----| 
| 44      | 1 | TestStreet 12 | Mannheim| 68161| DE|

For all this tables StructureDefinitions shall be available, which e.g. are generated directly from a DB Schema.

From the Rest API search shall be supported by the id or by an identifier.

### CatalogDefinition for the scenario.
The first snippet below just defines the ResourceType and set the id for the catalog.

    {
		"resourceType":"CatalogDefinintion"
		"id":"patient-example-catalog1",
		...
	}

Within the CatalogDefinitionTable.table array first the tables must be listed which provide data for the query and/or mapping operation.

    {
		"resourceType":"CatalogDefinintion"
		"id":"patient-example-catalog1",
		"table":[
			{
				"id":"Patient",
				"definition":{
					"reference":"HCIMPatient"
				},
				"cardinality":"1",
				"referenceColumn":{
					"type":"column",
					"name":"_RecordKey"
				}
			},
			....
		]
	}

| DataElement       | Type          | Description  |
| ------------- |-------------| -----|
| CatalogDefinition.table.id | id | Logical id for this table, which will be used witin the mappings to reference this entry.|
| CatalogDefinition.table.definition | Reference | Reference to a StructureDefinition of the Table, which describes all the columns and types of this table |
| CatalogDefinition.table.cardinality | string | Indicates how many rows of this table can contribute to on FHIR Resource (1..*). |
|CatalogDefinition.referenceColumn|Backbone Element| Defines the column in the table which links a single row as part of Patient |
|CatalogDefinition.referenceColumn.type|String| currently only column is supported, which indicates that the link is possible through a single column |
|CatalogDefinition.referenceColumn.name|String| Name of the column within the Table which is used for the link |

At the moment the "simplistic" reference column mechanism makes it necessary that each of the tables have 1 clear column which holds the id to the resource, but which name can be used is flexible.

Overall the table sections looks like this:

    {
		"resourceType":"CatalogDefinintion"
		"id":"patient-example-catalog1",
		"table":[
			{
				"id":"Patient",
				"definition":{
					"reference":"HCIMPatient"
				},
				"cardinality":"1",
				"referenceColumn":{
					"type":"column",
					"name":"_RecordKey"
				}
			},
			{
				"id":"PatientIdentifier",
				"definition":{
					"reference":"HCIMPatientIdentifier"
				},
				"cardinality":"*",
				"referenceColumn":{
					"type":"column",
					"name":"_PatientRecordKey"
				}
			},
			{
				"id":"PatientAddress",
				"definition":{
					"reference":"HCIMPatientAddress"
				},
				"cardinality":"*",
				"referenceColumn":{
					"type":"column",
					"name":"_BelongsTo"
				}
			}
		]
	}

As described above this allows for Patient resources which are consisting out of one row from the HCIMPatient Table (identfied through the _RecordKey column), 0..* rows from the HCIMIdentifer table (identified through the _PatientRecordKey) and 0..* rows from the HCIMPatientAddress Table (identified through the "_BelongsTo" Column.

#### Mapping Entries to support searching with the query engine.
As mentioned above for the Scenarion the FHIR RestAPI shall support searching by the Id, or by an Identifier (Token). 
To enable this a mapping has to be defined between the FHIR DataElement and a column value within the Tables (e.g. how an identifier in the URL is translated into a select statement.)

Overall entries in the mapping section can have two responsiblities, they can be used for building the query and/or be used to define a mapping for rendering at the end the FHIR Resource from the entries. 


    {
		"resourceType":"CatalogDefinintion"
		"id":"patient-example-catalog1",
		"table":[
			...
		],
		"mapping":[
			{
				"dataelement":"Patient.id",
				"tableid":"Patient",
				"type":"column",
				"column":"_RecordKey",
				"searchable":true
			},
			{
				"dataelement":"Patient.identifier.value",
				"tableid":"PatientIdentifier",
				"type":"column",
				"condition":"false",
				"column":"PatientIdentificationNumber",
				"searchable":true
			},
			{
				"dataelement":"Patient.identifier.system",
				"tableid":"PatientIdentifier",
				"type":"column",
				"column":"ID_System_OID",
				"condition":"false",
				"searchable":true
			},
			...
		]
	}

Overall Mapping Element can have more elements than shown here, but these will be shown/described later:


| DataElement       | Type          | Description  |
| ------------- |-------------| -----|
| CatalogDefinition.mapping.dataelement | string |  A path which describes an element within the Resource (logical path) |
| CatalogDefinition.mapping.tableid | string |  In which (logical id) table the column to be found which is used for searching  |
| CatalogDefinition.mapping.type | string |  The type of the Mapping - for search mappings always 'column'  |
