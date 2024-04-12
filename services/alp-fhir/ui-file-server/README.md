# local-ui-file-server

## History

When docker-compose was implemented for local development, UI files such as those for portal, superadmin and patient analytics retrieved files from the develop CDN. 

The develop CDN was populated with files from whatever was deployed to develop via Jenkins. 

This resulted in occasional invalid deployments to develop causing the inability to use local UI (since they used the same files from develop CDN).

## Purpose

This service is only used in local development as the replacement endpoint for the CDN. It uses files build via `alp-approuter/Dockerfile` so that when built, developers can have UI files from their current branch served locally.

## Notes

- a docker volume is used to share the UI files from `approuter`'s container to `local-ui-file-server`'s container. 
  - Files are synced from container to volume if and only if a volume had to be created
  - Hence, the volume is always removed prior to running `npm run start:mercury` to ensure the latest `approuter` UI files are present in the volume
  - A requirement to remove volumes is that containers using the volume must be removed, hence removal of `approuter` and `local-ui-file-server` is also performed prior to running `npm run start:mercury`
- In most cases, files are proxied via `approuter` or `gateway` before reaching the browser. However some links in the browser directly use the CDN (e.g. for icons) and use the key `publicUrl` present in `services/alp-approuter/src/hostMetadata.ts`