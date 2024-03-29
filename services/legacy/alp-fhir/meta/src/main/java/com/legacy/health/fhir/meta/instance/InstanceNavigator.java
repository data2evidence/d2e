package com.legacy.health.fhir.meta.instance;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import com.legacy.health.fhir.meta.entity.DataElement;

public class InstanceNavigator {

    public static List<Element> getElementsByDataElement(ElementContainer container, DataElement element) {
        List<Element> ret = new ArrayList<>();
        List<Element> elements = container.getElements();
        for (int i = 0; i < elements.size(); i++) {
            if (elements.get(i).getDefinition().equals(element)) {
                ret.add(elements.get(i));
                continue;
            }
            if (elements.get(i) instanceof ElementContainer) {
                ret.addAll(getElementsByDataElement((ElementContainer) elements.get(i), element));
            }
        }
        return ret;
    }

    protected static Element getElementById(ElementContainer container, String id) {
        Element ret = null;
        List<Element> children = container.getElements();
        for (Iterator<Element> iterator = children.iterator(); iterator.hasNext();) {
            Element element = iterator.next();
            if (element.getDefinition().getShortName().equals(id)) {
                return element;
            }
        }
        return ret;
    }

    public static Element getElementByPath(ElementContainer container, Path path) {
        String[] segments = path.getSegments();
        Element ret = getElementByPath(container, segments);
        return ret;
    }

    public static Element getElementByPath(ElementContainer container, String path) {
        String[] segments = path.split("\\.");
        String[] ignoredFirstSegment = Arrays.copyOfRange(segments, 1, segments.length);
        Element ret = getElementByPath(container, ignoredFirstSegment);
        return ret;
    }

    private static Element getElementByPath(ElementContainer container, String[] segments) {
        Element ret = getElementById(container, segments[0]);
        if (ret == null) {
            return ret;
        }
        for (int i = 1; i < segments.length; i++) {
            String segment = segments[i];
            if (!(ret instanceof ElementContainer)) {
                break;
            }
            ret = getElementById((ElementContainer) ret, segment);
            if (ret == null) {
                break;
            }
        }
        return ret;
    }

}
