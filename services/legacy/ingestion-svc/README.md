# ingestion-svc

Insert donated data into `fhir_data`

### Local

- Look at `.env.example` for environment variables used and replicate them in your local with local `.env` file to start local development.
  | Variable | Where to find |
  | --------------------------------- | -------------------------------------------------------------------------------------------------------- |
  | `PHDP_DD_DECRYPTION_PRIVATE_KEYS` | Use the value from the property `SYS__PHDP_DD_DECRYPTION__PRIVATE_PKEYS` from vault (rp/dev/sys-d4l/SYS) |

- To build and develop `ingestion-svc` locally, follow the steps

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn dev

# buildstart
$ yarn buildstart
```

## Test

```bash
# unit and integration tests
$ yarn test
```

### API's Supported

**POST**

#### POSTGRES

- Insert records into table `d4l_dd_studies_bi_events`: `POST /data-donation/bi-events`
- Insert records into table `d4l_dd_s4h` : `POST /data-donation/s4h`
- Insert records into table `d4l_dd_studies` if json is valid else into table `d4l_dd_studies_with_error`: `POST /data-donation/:studyId`
