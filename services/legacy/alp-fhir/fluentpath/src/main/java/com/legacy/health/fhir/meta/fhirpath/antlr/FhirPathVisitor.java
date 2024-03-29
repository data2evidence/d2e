// Generated from FhirPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fhirpath.antlr;

import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link FhirPathParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 *            operations with no return type.
 */
public interface FhirPathVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by the {@code indexerExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIndexerExpression(FhirPathParser.IndexerExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code polarityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPolarityExpression(FhirPathParser.PolarityExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code additiveExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAdditiveExpression(FhirPathParser.AdditiveExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code multiplicativeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMultiplicativeExpression(FhirPathParser.MultiplicativeExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitUnionExpression(FhirPathParser.UnionExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code orExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitOrExpression(FhirPathParser.OrExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code andExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAndExpression(FhirPathParser.AndExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code membershipExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMembershipExpression(FhirPathParser.MembershipExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code inequalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInequalityExpression(FhirPathParser.InequalityExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code invocationExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInvocationExpression(FhirPathParser.InvocationExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code equalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEqualityExpression(FhirPathParser.EqualityExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code impliesExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitImpliesExpression(FhirPathParser.ImpliesExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code termExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTermExpression(FhirPathParser.TermExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code typeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTypeExpression(FhirPathParser.TypeExpressionContext ctx);

	/**
	 * Visit a parse tree produced by the {@code invocationTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInvocationTerm(FhirPathParser.InvocationTermContext ctx);

	/**
	 * Visit a parse tree produced by the {@code literalTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLiteralTerm(FhirPathParser.LiteralTermContext ctx);

	/**
	 * Visit a parse tree produced by the {@code externalConstantTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExternalConstantTerm(FhirPathParser.ExternalConstantTermContext ctx);

	/**
	 * Visit a parse tree produced by the {@code parenthesizedTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParenthesizedTerm(FhirPathParser.ParenthesizedTermContext ctx);

	/**
	 * Visit a parse tree produced by the {@code nullLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNullLiteral(FhirPathParser.NullLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code booleanLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBooleanLiteral(FhirPathParser.BooleanLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code stringLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitStringLiteral(FhirPathParser.StringLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code numberLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNumberLiteral(FhirPathParser.NumberLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code dateTimeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDateTimeLiteral(FhirPathParser.DateTimeLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code timeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTimeLiteral(FhirPathParser.TimeLiteralContext ctx);

	/**
	 * Visit a parse tree produced by the {@code quantityLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQuantityLiteral(FhirPathParser.QuantityLiteralContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#externalConstant}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExternalConstant(FhirPathParser.ExternalConstantContext ctx);

	/**
	 * Visit a parse tree produced by the {@code memberInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMemberInvocation(FhirPathParser.MemberInvocationContext ctx);

	/**
	 * Visit a parse tree produced by the {@code functionInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunctionInvocation(FhirPathParser.FunctionInvocationContext ctx);

	/**
	 * Visit a parse tree produced by the {@code thisInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitThisInvocation(FhirPathParser.ThisInvocationContext ctx);

	/**
	 * Visit a parse tree produced by the {@code indexInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIndexInvocation(FhirPathParser.IndexInvocationContext ctx);

	/**
	 * Visit a parse tree produced by the {@code totalInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTotalInvocation(FhirPathParser.TotalInvocationContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#function}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunction(FhirPathParser.FunctionContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#paramList}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParamList(FhirPathParser.ParamListContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#quantity}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQuantity(FhirPathParser.QuantityContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#unit}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitUnit(FhirPathParser.UnitContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#dateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDateTimePrecision(FhirPathParser.DateTimePrecisionContext ctx);

	/**
	 * Visit a parse tree produced by
	 * {@link FhirPathParser#pluralDateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPluralDateTimePrecision(FhirPathParser.PluralDateTimePrecisionContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#typeSpecifier}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTypeSpecifier(FhirPathParser.TypeSpecifierContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQualifiedIdentifier(FhirPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Visit a parse tree produced by {@link FhirPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIdentifier(FhirPathParser.IdentifierContext ctx);
}