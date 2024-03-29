// Generated from FluentPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fluentpath.antlr;

import org.antlr.v4.runtime.tree.AbstractParseTreeVisitor;

/**
 * This class provides an empty implementation of {@link FluentPathVisitor},
 * which can be extended to create a visitor which only needs to handle a subset
 * of the available methods.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 *            operations with no return type.
 */
public class FluentPathBaseVisitor<T> extends AbstractParseTreeVisitor<T> implements FluentPathVisitor<T> {
	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public T visitNavigationExpression(FluentPathParser.NavigationExpressionContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public T visitUnionExpression(FluentPathParser.UnionExpressionContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public T visitQualifiedIdentifier(FluentPathParser.QualifiedIdentifierContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public T visitCastFunction(FluentPathParser.CastFunctionContext ctx) {
		return visitChildren(ctx);
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>
	 * The default implementation returns the result of calling
	 * {@link #visitChildren} on {@code ctx}.
	 * </p>
	 */
	@Override
	public T visitIdentifier(FluentPathParser.IdentifierContext ctx) {
		return visitChildren(ctx);
	}
}