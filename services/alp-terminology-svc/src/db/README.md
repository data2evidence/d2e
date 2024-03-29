## Database

Note: Attach to container before running yarn commands to ensure required env vars are present.

Before generating a new migration script, do create/update entity classes `*.entity.ts` and run

```
yarn migration:generate <migration-name>
```

It creates a file with 2 functions `up` and `down`. Write the migration script in `up` and the rollback script in `down` functions.

Once the new migration script is created, you can run `yarn migrate` to execute the script defined in `up` function.

If you would like to rollback the latest migration, run `yarn rollback`. And it will execute the script defined in `down` function.
