package com.legacy.health.fhir.meta.fhirpath;

import java.util.ArrayList;
import java.util.List;

import org.antlr.v4.runtime.tree.TerminalNode;

import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathBaseVisitor;
import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathParser;
import com.legacy.health.fhir.meta.fhirpath.antlr.FhirPathParser.ParamListContext;

public class FhirPathVisitor extends FhirPathBaseVisitor<FhirPathElement> {

	protected FhirPathBuilder fb = new FhirPathBuilder();

	@Override
	public FhirPathElement visitUnionExpression(FhirPathParser.UnionExpressionContext ctx) {
		FhirPathElement left = this.visit(ctx.getChild(0));
		FhirPathElement right = this.visit(ctx.getChild(2));
		return fb.union(left, right);
	}

	@Override
	public FhirPathElement visitAdditiveExpression(FhirPathParser.AdditiveExpressionContext ctx) {
		FhirPathElement left = this.visit(ctx.getChild(0));
		FhirPathElement right = this.visit(ctx.getChild(2));
		TerminalNode op = (TerminalNode) ctx.getChild(1);
		String operation = op.getText();
		AdditiveElement ae = fb.add(left, right, operation);
		if ("&".equals(ctx.getChild(1).getText())) {
			ae.concat();
		}
		return ae;
	}

	@Override
	public FhirPathElement visitMultiplicativeExpression(FhirPathParser.MultiplicativeExpressionContext ctx) {
		FhirPathElement left = this.visit(ctx.getChild(0));
		FhirPathElement right = this.visit(ctx.getChild(2));
		TerminalNode op = (TerminalNode) ctx.getChild(1);
		String operation = op.getText();
		MultiplicativeElement ae = fb.multiply(left, right, operation);
		return ae;
	}

	@Override
	public FhirPathElement visitInvocationExpression(FhirPathParser.InvocationExpressionContext ctx) {
		InvocableElement parent = (InvocableElement) this.visit(ctx.getChild(0));
		InvocableElement child = (InvocableElement) this.visit(ctx.getChild(2));
		parent.appendSuccessor(child);
		return parent;
	}

	@Override
	public FhirPathElement visitIdentifier(FhirPathParser.IdentifierContext ctx) {
		String id = ctx.getText();
		return fb.identifier(id);
	}

	@Override
	public FhirPathElement visitFunction(FhirPathParser.FunctionContext ctx) {
		IdentifierPathElement functionId = (IdentifierPathElement) this.visit(ctx.getChild(0));
		List<FhirPathElement> params = new ArrayList<FhirPathElement>();
		if (ctx.getChild(2) instanceof ParamListContext) {
			ParamListContext pCtx = (ParamListContext) ctx.getChild(2);
			int childCount = pCtx.getChildCount();
			for (int i = 0; i < childCount; i = i + 2) {
				params.add(this.visit(pCtx.getChild(i)));
			}
		}
		return fb.funtion(functionId.id(), params);
	}

	@Override
	public FhirPathElement visitStringLiteral(FhirPathParser.StringLiteralContext ctx) {
		String value = ctx.getText();
		if (value.startsWith("'")) {
			value = value.substring(1);
		}
		if (value.endsWith("'")) {
			value = value.substring(0, value.length() - 1);
		}
		return fb.string(value);
	}

	@Override
	public FhirPathElement visitNumberLiteral(FhirPathParser.NumberLiteralContext ctx) {
		String value = ctx.getText();
		return fb.number(value);
	}

	@Override
	public FhirPathElement visitParenthesizedTerm(FhirPathParser.ParenthesizedTermContext ctx) {
		FhirPathElement inner = this.visit(ctx.getChild(1));
		return fb.parenthize(inner);
	}

	@Override
	public FhirPathElement visitIndexerExpression(FhirPathParser.IndexerExpressionContext ctx) {
		InvocableElement pre = (InvocableElement) visit(ctx.getChild(0));
		InvocableElement num = (InvocableElement) visit(ctx.getChild(2));
		IndexerElement el = fb.indexer(num);
		pre.appendSuccessor(el);
		return pre;
	}

	@Override
	public FhirPathElement visitEqualityExpression(FhirPathParser.EqualityExpressionContext ctx) {
		FhirPathElement left = this.visit(ctx.getChild(0));
		TerminalNode op = (TerminalNode) ctx.getChild(1);
		String operation = op.getText();
		FhirPathElement right = this.visit(ctx.getChild(2));
		return fb.equality(left, right, operation);
	}

	@Override
	public FhirPathElement visitInequalityExpression(FhirPathParser.InequalityExpressionContext ctx) {
		FhirPathElement left = this.visit(ctx.getChild(0));
		TerminalNode op = (TerminalNode) ctx.getChild(1);
		String operation = op.getText();
		FhirPathElement right = this.visit(ctx.getChild(2));
		return fb.inequality(left, right, operation);
	}

}
