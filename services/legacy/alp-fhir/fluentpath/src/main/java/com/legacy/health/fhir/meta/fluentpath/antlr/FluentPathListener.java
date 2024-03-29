// Generated from FluentPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fluentpath.antlr;

import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link FluentPathParser}.
 */
public interface FluentPathListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the {@code navigationExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterNavigationExpression(FluentPathParser.NavigationExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code navigationExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitNavigationExpression(FluentPathParser.NavigationExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterUnionExpression(FluentPathParser.UnionExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitUnionExpression(FluentPathParser.UnionExpressionContext ctx);

	/**
	 * Enter a parse tree produced by {@link FluentPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Exit a parse tree produced by {@link FluentPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Enter a parse tree produced by {@link FluentPathParser#castFunction}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterCastFunction(FluentPathParser.CastFunctionContext ctx);

	/**
	 * Exit a parse tree produced by {@link FluentPathParser#castFunction}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitCastFunction(FluentPathParser.CastFunctionContext ctx);

	/**
	 * Enter a parse tree produced by {@link FluentPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterIdentifier(FluentPathParser.IdentifierContext ctx);

	/**
	 * Exit a parse tree produced by {@link FluentPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitIdentifier(FluentPathParser.IdentifierContext ctx);
}