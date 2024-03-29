# Multi-Target Application Creation for the FHIR Project

This repo is responsible for packaging the FHIR server into an XSA- or CF-native `.mtar`.

# Build Locally

## Prerequisites

Download the `.jar` file of [MTA Build Tool](). Choose the same version as the `mta-version` value in [`.xmake.cfg`](.xmake.cfg).

## How to Build

In the following example the MTA Build Tool is in your _home_ folder under `bin` with the name `MTABUILDER.JAR`. It was tested on Mac.

With a different location for the `jar` file, the example should also work on Windows.

```bash
java -jar ~/bin/MTABUILDER.JAR --build-target=XSA --extension=config/xsa/build.mtaext build
```

## Build Output

A new file called `fhir-assembly.mtar` will be created in the root folder of this repo.