package com.legacy.health.fhir.meta.fluentpath;

import org.antlr.v4.runtime.tree.ParseTree;

import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathBaseVisitor;
import com.legacy.health.fhir.meta.fluentpath.antlr.FluentPathParser;

public class PathVisitor extends FluentPathBaseVisitor<PathElement> {
	protected PathBuilder pb = new PathBuilder();

	@Override
	public PathElement visitQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx) {
		QualifiedIdentifier ret = pb.qi();
		for (ParseTree path : ctx.children) {
			if (path instanceof FluentPathParser.IdentifierContext) {
				Identifier id = (Identifier) this.visit((FluentPathParser.IdentifierContext) path);
				ret.addIdentifier(id);
			}
		}
		return ret;
	}

	@Override
	public PathElement visitUnionExpression(FluentPathParser.UnionExpressionContext ctx) {
		Union ret = pb.union();
		for (ParseTree path : ctx.children) {
			if (path instanceof FluentPathParser.QualifiedIdentifierContext) {
				PathElement element = this.visit(path);
				ret.addChild(element);
			}
		}
		return ret;
	}

	@Override
	public PathElement visitIdentifier(FluentPathParser.IdentifierContext ctx) {
		Identifier ret = pb.identifier(ctx.getText());
		return ret;
	}
}
