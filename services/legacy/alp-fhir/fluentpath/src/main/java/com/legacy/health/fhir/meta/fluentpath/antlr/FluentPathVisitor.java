// Generated from FluentPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fluentpath.antlr;

import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link FluentPathParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 *            operations with no return type.
 */
public interface FluentPathVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by the {@code navigationExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNavigationExpression(FluentPathParser.NavigationExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FluentPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitUnionExpression(FluentPathParser.UnionExpressionContext ctx);

	/**
	 * Visit a parse tree produced by {@link FluentPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Visit a parse tree produced by {@link FluentPathParser#castFunction}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCastFunction(FluentPathParser.CastFunctionContext ctx);

	/**
	 * Visit a parse tree produced by {@link FluentPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIdentifier(FluentPathParser.IdentifierContext ctx);
}