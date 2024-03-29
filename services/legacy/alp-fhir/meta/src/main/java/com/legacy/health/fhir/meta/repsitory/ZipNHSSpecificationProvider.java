package com.legacy.health.fhir.meta.repsitory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import com.legacy.health.fhir.meta.FhirException;

public class ZipNHSSpecificationProvider implements SpecificationStreamProvider {

	protected File zipFile;

	public void setZipFilePath(File zipFile) {
		this.zipFile = zipFile;
	}

	public InputStream provideTypes() throws FhirException {
		try {
			ZipFile zFile = new ZipFile(zipFile);
			ZipEntry entry = zFile.getEntry("profiles-types.json");
			return zFile.getInputStream(entry);
		} catch (IOException e) {
			throw new FhirException("Error while reading types", e);
		}
	}

	public InputStream provideResourceDefinitions() throws FhirException {
		try {
			ZipFile zFile = new ZipFile(zipFile);
			ZipEntry entry = zFile.getEntry("NHSPracticeBundle.profile.json");
			return zFile.getInputStream(entry);
		} catch (IOException e) {
			throw new FhirException("Error while reading resources", e);
		}
	}

	@Override
	public InputStream provideSearchParameters() {
		// TODO Auto-generated method stub
		return null;
	}

}
