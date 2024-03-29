package com.legacy.health.fhir.meta.queryengine;

import java.util.Iterator;
import java.util.List;

public class QueryWalker {

	public void walkQueryElements(QueryElement element, QueryElementConsumer consumer) {
		consumer.consumeQueryElement(element);
		List<QueryElement> children = element.getQueryElements();
		if (children == null)
			return;
		for (Iterator<QueryElement> iterator = children.iterator(); iterator.hasNext();) {
			QueryElement queryElement = iterator.next();
			walkQueryElements(queryElement, consumer);
		}
	}
}
