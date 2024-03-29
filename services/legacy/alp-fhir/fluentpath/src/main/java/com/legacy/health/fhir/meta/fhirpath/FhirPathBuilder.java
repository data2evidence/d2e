package com.legacy.health.fhir.meta.fhirpath;

import java.util.List;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathLexer;
import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathParser;

public class FhirPathBuilder {

	public UnionElement union(FhirPathElement left, FhirPathElement right) {
		return new UnionElement().left(left).right(right);
	}

	public EqualityElement equality(FhirPathElement left, FhirPathElement right, String operation) {
		return (EqualityElement) new EqualityElement().left(left).right(right).operation(operation);
	}

	public InEqualityElement inequality(FhirPathElement left, FhirPathElement right, String operation) {
		return (InEqualityElement) new InEqualityElement().left(left).right(right).operation(operation);
	}

	public AdditiveElement add(FhirPathElement left, FhirPathElement right, String operation) {
		return (AdditiveElement) new AdditiveElement().left(left).right(right).operation(operation);
	}

	public MultiplicativeElement multiply(FhirPathElement left, FhirPathElement right, String operation) {
		return (MultiplicativeElement) new MultiplicativeElement().left(left).right(right).operation(operation);
	}

	public IdentifierPathElement identifier(String id) {
		return (IdentifierPathElement) new IdentifierPathElement().id(id);
	}

	// public IdentifierPathElement path(String id, IdentifierPathElement child){
	// return (IdentifierPathElement) new
	// IdentifierPathElement().id(id).child(child);
	// }

	public FunctionElement funtion(String id, List<FhirPathElement> params) {
		return (FunctionElement) new FunctionElement().addParams(params).id(id);
	}

	public ParenthizedElement parenthize(FhirPathElement inner) {
		return new ParenthizedElement().inner(inner);
	}

	public StringLiteralElement string(String value) {
		return new StringLiteralElement().value(value);
	}

	public NumberLiteralElement number(String value) {
		return new NumberLiteralElement().value(value);
	}

	public IndexerElement indexer(FhirPathElement expression) {
		return new IndexerElement().index(expression);
	}

	public static FhirPathElement parseExpression(String expression) {
		ANTLRInputStream in = new ANTLRInputStream(expression);
		FhirPathLexer lexer = new FhirPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FhirPathParser parser = new FhirPathParser(tokens);
		ParseTree tree = parser.expression();
		FhirPathVisitor visitor = new FhirPathVisitor();
		FhirPathElement element = visitor.visit(tree);
		return element;
	}
}
