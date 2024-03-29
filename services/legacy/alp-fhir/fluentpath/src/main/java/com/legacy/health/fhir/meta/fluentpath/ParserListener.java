package com.legacy.health.fhir.meta.fluentpath;

import java.util.Stack;

import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathBaseListener;
import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathParser;

public class ParserListener extends FluentPathBaseListener {

	protected PathBuilder builder = new PathBuilder();
	protected Stack<PathElement> stack = new Stack<PathElement>();

	@Override
	public void enterNavigationExpression(FluentPathParser.NavigationExpressionContext ctx) {
		System.out.println("Enter Navigation:" + ctx.getText());
	}

	@Override
	public void enterQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx) {
		System.out.println("Enter Qualified Identifier:");
	}

	@Override
	public void enterIdentifier(FluentPathParser.IdentifierContext ctx) {
		System.out.println("Enter Identifier:" + ctx.getText());
	}
}
