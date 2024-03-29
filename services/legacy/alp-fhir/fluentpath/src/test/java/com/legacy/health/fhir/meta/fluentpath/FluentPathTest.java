package com.legacy.health.fhir.meta.fluentpath;

import static org.junit.Assert.*;

import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

import org.junit.Before;
import org.junit.Test;

import com.legacy.health.fhir.meta.fluentpath.antlr.*;

public class FluentPathTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testSimpleNavigation() {
		String testee = "Account.test";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		System.out.println(tree.toStringTree(parser));
	}

	// @Test
	// public void testComplexExpression() {
	// String testee = "MedicationRequest.medication.as(Reference) |
	// MedicationAdministration.medication.as(Reference) |
	// MedicationStatement.medication.as(Reference) |
	// MedicationDispense.medication.as(Reference)";
	// ANTLRInputStream in = new ANTLRInputStream(testee);
	// FluentPathLexer lexer = new FluentPathLexer(in);
	// CommonTokenStream tokens = new CommonTokenStream(lexer);
	// FluentPathParser parser = new FluentPathParser(tokens);
	// ParseTree tree = parser.expression();
	// System.out.println(tree.toStringTree(parser));
	// }

	@Test
	public void testSimpleWalker() {
		String testee = "Account.test.foo";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		ParseTreeWalker walker = new ParseTreeWalker();
		walker.walk(new ParserListener(), tree);
		System.out.println("done");
	}

	@Test
	public void testSimpleVisitor() {
		String testee = "Account.test.foo";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		PathVisitor visitor = new PathVisitor();
		PathElement element = visitor.visit(tree);
		System.out.println("done");
	}

	@Test
	public void testUnion() {
		String testee = "Practitioner.name.given | Patient.name.given";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		PathVisitor visitor = new PathVisitor();
		PathElement element = visitor.visit(tree);
		System.out.println(element);
	}

	@Test
	public void testMultipleUnion() {
		String testee = "RelatedPerson.address.city | Practitioner.address.city | Person.address.city | Patient.address.city";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		PathVisitor visitor = new PathVisitor();
		PathElement element = visitor.visit(tree);
		assertNotNull(element);
	}

	@Test
	public void testAs() {
		String testee = "FamilyMemberHistory.condition.code | DeviceRequest.code.as(CodeableConcept) | AllergyIntolerance.code | Condition.code";
		ANTLRInputStream in = new ANTLRInputStream(testee);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		PathVisitor visitor = new PathVisitor();
		PathElement element = visitor.visit(tree);
		assertNotNull(element);
	}

}
