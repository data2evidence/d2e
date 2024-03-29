package com.legacy.health.fhir.meta.fhirpath;

import com.legacy.health.fhir.meta.fhirpath.node.CollectionNode;

public abstract class InvocableElement implements FhirPathElement {

	protected InvocableElement successor;
	protected InvocableElement predecessor;

	protected String id;

	public InvocableElement id(String id) {
		this.id = id;
		return this;
	}

	public String id() {
		return id;
	}

	public InvocableElement successor() {
		return successor;
	}

	public InvocableElement predeccesor() {
		return predecessor;
	}

	public InvocableElement predecessor(InvocableElement predecessor) {
		this.predecessor = predecessor;
		return this;
	}

	public InvocableElement appendSuccessor(InvocableElement successor) {
		if (this.successor != null) {
			this.successor.appendSuccessor(successor);
		} else {
			this.successor = successor;
			this.successor.predecessor(this);
		}
		return this;
	}

	public CollectionNode evaluate(CollectionNode ctx) {
		CollectionNode own = ownEvaluation(ctx);
		if (successor != null) {
			return successor.evaluate(own);
		}
		return own;
	}

	protected abstract CollectionNode ownEvaluation(CollectionNode ctx);

}
