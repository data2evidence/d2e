package com.legacy.health.fhir.meta.fluentpath;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import com.legacy.health.fhir.meta.entity.StructureDefinition;
import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathLexer;
import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathParser;

public class FluentPathController {

	public PathCheckResult checkStructureDefinition(StructureDefinition definition, String fluentPath) {
		ANTLRInputStream in = new ANTLRInputStream(fluentPath);
		FluentPathLexer lexer = new FluentPathLexer(in);
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		FluentPathParser parser = new FluentPathParser(tokens);
		ParseTree tree = parser.expression();
		PathVisitor visitor = new PathVisitor();
		PathElement element = visitor.visit(tree);
		return element.checkStructureDefinition(definition);

	}
}
