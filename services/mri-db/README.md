MRI-HDI
==================
Enable HDI Server: 

Execute SQL command in System DB:

DO
BEGIN
  DECLARE dbName NVARCHAR(25) = 'HXE'; --- Replace with tenant db name
  BEGIN
      DECLARE diserverCount INT = 0;
      SELECT COUNT(*) INTO diserverCount FROM SYS_DATABASES.M_SERVICES WHERE SERVICE_NAME = 'diserver' AND DATABASE_NAME = :dbName AND ACTIVE_STATUS = 'YES';
      IF diserverCount = 0 THEN
        EXEC 'ALTER DATABASE ' || :dbName || ' ADD ''diserver''';
      END IF;
  END;
END;


Example usage via hdi.js:

    export HDI__HOST=<HANA_SERVER>
    export HDI__PORT=39015
    export HDI___SYS_DI__USER=SYSTEM
    export HDI___SYS_DI__PASSWORD=Toor1234

    hdi create-container -X SYSTEM MRI
    export HDI__MRI__USER=SYSTEM
    export HDI__MRI__PASSWORD=Toor1234
    
    hdi write -r MRI src/ cfg/
    hdi status MRI
    
    hdi make MRI @ src/ cfg/
    hdi status MRI

    hdi grant-container-schema-privilege MRI SELECT SYSTEM
    hdi grant-container-schema-privilege MRI EXECUTE SYSTEM
    hdi grant-container-schema-privilege MRI "CREATE ANY" SYSTEM

    hdi grant-container-schema-privilege MRI SELECT SYSTEM


    Drop container:

    export HDI__HOST=<HANA_SERVER>; 
    export HDI__PORT=30015; 
    export HDI___SYS_DI__USER=SYSTEM; 
    export HDI___SYS_DI__PASSWORD=Toor1234; 
    hdi drop-container --force MRI4


    hdi create-container -X SYSTEM MRI4; export HDI__MRI4__USER=SYSTEM; export HDI__MRI4__PASSWORD=Toor1234
    hdi write -r MRI4 src/ cfg/; hdi make MRI4 @ src/ cfg/

    hdi grant-container-schema-privilege MRI4 SELECT SYSTEM; hdi grant-container-schema-privilege MRI4 EXECUTE SYSTEM


## Deploy to HANA Instance

- Run 
```
npm i
```
- Fill up env variables in `setup.sh`
- To deploy container, run 
```
npm run deploy
```
- Import csv data to `<SCHEMA>."omop::concept"` by downloading csv file


- To drop container, run 
```
npm run drop
```