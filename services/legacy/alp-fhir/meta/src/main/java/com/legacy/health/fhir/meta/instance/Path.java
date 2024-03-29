package com.legacy.health.fhir.meta.instance;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Path {

    public final static String indexPattern = "([a-zA-Z]+)\\[(\\d+)]";
    protected String path;
    protected ArrayList<String> segments = new ArrayList<>();
    protected String referencePath = null;

    public Path withPath(String path) {
        this.path = path;
        String[] segs = path.split("\\.");
        Pattern p = Pattern.compile(indexPattern);
        int i = 0;
        for (String seg : segs) {
            if (i > 0) {
                Matcher m = p.matcher(seg);
                if (m.matches()) {
                    createReferencePath(path);
                    segments.add(m.group(1));
                } else {
                    segments.add(seg);
                }
            } else {
                segments.add(seg);
            }

            i++;
        }
        return this;
    }

    protected void createReferencePath(String path) {
        int first = path.indexOf(".");
        int last = path.lastIndexOf(".");
        referencePath = path.substring(first + 1, last);
    }

    public boolean hasReferencePath() {
        return referencePath != null;
    }

    public String getReferencePath() {
        return referencePath;
    }

    public String toJSON() {
        return path;
    }

    public String toString() {
        String sep = "";
        StringBuilder ret = new StringBuilder();
        for (String string : segments) {
            ret.append(sep).append(string);
            sep = ".";
        }
        return ret.toString();
    }

    public String[] getSegments() {
        return segments.toArray(new String[segments.size()]);
    }
}
