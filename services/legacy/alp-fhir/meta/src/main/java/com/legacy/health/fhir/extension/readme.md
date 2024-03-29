# Extension Framework

## How to create new Extension

Creating a new extension for an existing extension point is pretty simply

 - Add the library containing the extentionpoint to your dependencies
 - Create a new class implementing the Interface defined by the ExtensionPoint you want to implement.
   e.g.
   - Extension is defined via Interface TestExtension [TestExtension.java](src\test\java\com\legacy\health\fhir\extension\TestExtension.java)
   - Implementation implements this Interface [TestExtensionPointImpl1.java](src\test\java\com\legacy\health\fhir\extension\TestExtensionPointImpl1.java)
 - If your newly created Extension should be active by default as soon as it is in the classpath, add the annotation ```@ActiveByDefault```
    
## How to consume available extensions

- Include the meta framework into your ```pom.xml``` dependencies
- Include the library containing the Extensionpoint to your ```pom.xml``` dependencies
- Include all libraries with contain Extension implemenations you want to use to your ```pom.xml```
- In your code call the ExtensionProvider with the appropiate Extensionpoint to get instances of all implementations available in the classpath, e.g.

    ```List<TestExtension> extensionsForExtensionPoint = ExtensionProvider.getExtensionsForExtensionPoint(TestExtension.ExtensionPoint());```

## How to enable/disable available extensions

- If an extension is marked with ```@ActiveByDefault``` adding it to the classpath is enough to retrieve it via extension provider
- If you want to enable an extension that is not Active by default 
    - create ```extension.properties``` in your classpath, and add \<your Extension canonical class name\>=true, e.g.

    ```com.legacy.health.fhir.meta.sql.mart.SQLMartController=true```
    - restart the server 
- If you want to disable an extension that is  Active by default 
    - create ```extension.properties``` in your classpath, and add \<your Extension canonical class name\>=true, e.g.

    ```com.legacy.health.fhir.meta.sql.mart.SQLMartController=false```
    - restart the server     
    
    
## How to create new extension points

- Create an empty annotation representing your extension, you can see how it works by looking at the existing ones, e.g [FeatureSwitchManager.java](src\main\java\com\legacy\health\fhir\extension\extensionpoints\annotations\FeatureSwitchManager.java). You shoudl use the following settings:
    - @Target(ElementType.TYPE) //can use in method only.
    - @Retention(RetentionPolicy.RUNTIME)
    - @Inherited
    - @Documented
- Create an interface describing the functions every extension implementing your new Extension point should provide, e.g [FeatureSwitchManagerExtension.java](src\main\java\com\legacy\health\fhir\extension\FeatureSwitchManagerExtension.java). All implementations will implement this interface
    - Annotate the interface with the annotation created in the first step
    - Add all methods required by implementations
    - Add a method providing the ExtensionPoint class required by the Extension provider, like:
    
    ```
    public static ExtensionPoint<YourAnnotationClass,YourInterfaceClass> YourExtensionPointName(){
             return new ExtensionPoint<>(YourAnnotationClass.class,YourInterfaceClass.class);
          }
     ```
 
 # Feature framework
 
 ## How to create a new feature toggle
 
 Currently nothing required, just choose a meaningful name
 
 ## How to ask if a feature with known name is active
 
 There are two possibilities, to ask if a feature is active
  - one available in the fhir main repostitory which can be used based on whole methods
  - one available everwhere where the meta package is included
  
 ### FHIR solution using method scope
 
 - Add the following annotation to your method
 
     ```@FeatureToggleCheck(value = "<Your Feature Name>",activeByDefault = <true/false>) ```

 - During runtime, if the method anotated with this annotation is reached one of the following applies
    - The feature is set to active --> the method runs 
    - The feature is set to deactive -> an exception is thrown and the method is not executed
    - The feature is not set -> The activeByDefault is decides on the bahivour
     
 ### Default way using the meta package 
 
 ```
  ExtensionProvider.isFeatureActive("<Your Feature Name>",<true/false> /*active by default*/);
 ```
 
or

 ```
         FeatureSwitchManagerExtension switchManager = getExtensionsForExtensionPoint(FeatureSwitchManagerExtension.FeatureSwitchManager()).get(0);
         switchManager.isActive(featureName,defaultValue);
 ```
 
  
 ## How to turn on/off features
 
 Turning features on and of is possible as for extensions
 
 - If you want to enable a feature that is not Active by default 
     - create ```extension.properties``` in your classpath, and add \<your feature name\>=true, e.g.
 
        ```FHIR_READ_RESSOURCE=true```
     - restart the server 
 - If you want to disable a feature that is  Active by default 
     - create ```extension.properties``` in your classpath, and add \<your feature name\>=true, e.g.
 
         ```FHIR_READ_RESSOURCE=false```
     - restart the server     
     
     
 
 