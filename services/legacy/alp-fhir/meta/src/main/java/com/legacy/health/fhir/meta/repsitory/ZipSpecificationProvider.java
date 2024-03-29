package com.legacy.health.fhir.meta.repsitory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.legacy.health.fhir.meta.FhirException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipInputStream;
import org.apache.commons.io.IOUtils;

public class ZipSpecificationProvider implements SpecificationStreamProvider {

    private static Log log = LogFactory.getLog(ZipSpecificationProvider.class);

    protected Map<String, InputStream> entries;
    protected File zipFile;

    private InputStream cloneInputStream(final ZipInputStream input) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        IOUtils.copy(input, outputStream);
        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    public void processZipInputStream(ZipInputStream zipInputStream) throws IOException, FhirException {
        entries = new HashMap<>();
        entries.put("profiles-types.json", null);
        entries.put("profiles-resources.json", null);
        entries.put("search-parameters.json", null);

        ZipEntry entry;
        int count = 0;
        while ((entry = zipInputStream.getNextEntry()) != null) {
            String key = null;
            if (entry.getName().equals("profiles-types.json"))
                key = "profiles-types.json";
            else if (entry.getName().equals("profiles-resources.json"))
                key = "profiles-resources.json";
            else if (entry.getName().equals("search-parameters.json"))
                key = "search-parameters.json";
            if (key != null) {
                entries.put(key, cloneInputStream(zipInputStream));
                count++;
            }
            if (count == 3)
                break;
        }

        if (count < 3) {
            // Do we need to specify the file names which are missing?
            throw new FhirException("Some files missing", null);
        }
    }

    public void setZipFilePath(File zipFile) {
        this.zipFile = zipFile;
    }

    private InputStream getInputStream(String fileName, String errorMessage) throws FhirException {
        try {
            if (entries == null) {
                ZipFile zFile = new ZipFile(zipFile);
                ZipEntry entry = zFile.getEntry(fileName);
                return zFile.getInputStream(entry);
            } else
                return entries.get(fileName);
        } catch (IOException e) {
            throw new FhirException(errorMessage, e);
        }
    }

    @Override
    public InputStream provideTypes() throws FhirException {
        return getInputStream("profiles-types.json", "Error while reading types");
    }

    @Override
    public InputStream provideResourceDefinitions() throws FhirException {
        return getInputStream("profiles-resources.json", "Error while reading resources");
    }

    @Override
    public InputStream provideSearchParameters() throws FhirException {
        return getInputStream("search-parameters.json", "Error while reading search parameters");
    }

}