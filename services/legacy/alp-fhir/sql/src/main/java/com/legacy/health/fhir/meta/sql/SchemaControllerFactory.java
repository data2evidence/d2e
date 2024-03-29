package com.legacy.health.fhir.meta.sql;

public class SchemaControllerFactory {

    /*
     * public static RelationSchemaController createSchemaController(String schema,
     * String providerFactoryName) {
     * System.out.println("providerFactoryName: " + providerFactoryName);
     * String factoryName = providerFactoryName;
     * try {
     * Class<?> cls = Class.forName(factoryName);
     * Object obj = cls.newInstance();
     * if (obj instanceof SQLProviderFactory) {
     * return createSchemaController(schema, (SQLProviderFactory) obj);
     * }
     * } catch (ClassNotFoundException e) {
     * // TODO Auto-generated catch block
     * e.printStackTrace();
     * } catch (InstantiationException e) {
     * // TODO Auto-generated catch block
     * e.printStackTrace();
     * } catch (IllegalAccessException e) {
     * // TODO Auto-generated catch block
     * e.printStackTrace();
     * }
     * return createSchemaController(schema, (SQLProviderFactory) null);
     * }
     */

    /*
     * public static RelationSchemaController createSchemaController(String schema,
     * SQLProviderFactory providerFactory) {
     * RelationSchemaController controller =
     * RelationSchemaController.createRelationSchemaController(schema);
     * if (providerFactory != null) {
     * controller.setSQLProviderFactory(providerFactory);
     * }
     * return controller;
     * }
     */

    public static RelationSchemaController createSchemaController(String schema, String driverName) {
        return new SchemaControllerImpl(schema, driverName);// createSchemaController(schema,
                                                            // SQLProviderFactory.createInstance(driverName));
    }

}
