// Generated from FhirPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fhirpath.antlr;

import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link FhirPathParser}.
 */
public interface FhirPathListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the {@code indexerExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterIndexerExpression(FhirPathParser.IndexerExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code indexerExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitIndexerExpression(FhirPathParser.IndexerExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code polarityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterPolarityExpression(FhirPathParser.PolarityExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code polarityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitPolarityExpression(FhirPathParser.PolarityExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code additiveExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterAdditiveExpression(FhirPathParser.AdditiveExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code additiveExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitAdditiveExpression(FhirPathParser.AdditiveExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code multiplicativeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterMultiplicativeExpression(FhirPathParser.MultiplicativeExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code multiplicativeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitMultiplicativeExpression(FhirPathParser.MultiplicativeExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterUnionExpression(FhirPathParser.UnionExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code unionExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitUnionExpression(FhirPathParser.UnionExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code orExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterOrExpression(FhirPathParser.OrExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code orExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitOrExpression(FhirPathParser.OrExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code andExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterAndExpression(FhirPathParser.AndExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code andExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitAndExpression(FhirPathParser.AndExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code membershipExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterMembershipExpression(FhirPathParser.MembershipExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code membershipExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitMembershipExpression(FhirPathParser.MembershipExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code inequalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterInequalityExpression(FhirPathParser.InequalityExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code inequalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitInequalityExpression(FhirPathParser.InequalityExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code invocationExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterInvocationExpression(FhirPathParser.InvocationExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code invocationExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitInvocationExpression(FhirPathParser.InvocationExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code equalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterEqualityExpression(FhirPathParser.EqualityExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code equalityExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitEqualityExpression(FhirPathParser.EqualityExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code impliesExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterImpliesExpression(FhirPathParser.ImpliesExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code impliesExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitImpliesExpression(FhirPathParser.ImpliesExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code termExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterTermExpression(FhirPathParser.TermExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code termExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitTermExpression(FhirPathParser.TermExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code typeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterTypeExpression(FhirPathParser.TypeExpressionContext ctx);

	/**
	 * Exit a parse tree produced by the {@code typeExpression}
	 * labeled alternative in {@link FhirPathParser#expression}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitTypeExpression(FhirPathParser.TypeExpressionContext ctx);

	/**
	 * Enter a parse tree produced by the {@code invocationTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterInvocationTerm(FhirPathParser.InvocationTermContext ctx);

	/**
	 * Exit a parse tree produced by the {@code invocationTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitInvocationTerm(FhirPathParser.InvocationTermContext ctx);

	/**
	 * Enter a parse tree produced by the {@code literalTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterLiteralTerm(FhirPathParser.LiteralTermContext ctx);

	/**
	 * Exit a parse tree produced by the {@code literalTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitLiteralTerm(FhirPathParser.LiteralTermContext ctx);

	/**
	 * Enter a parse tree produced by the {@code externalConstantTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterExternalConstantTerm(FhirPathParser.ExternalConstantTermContext ctx);

	/**
	 * Exit a parse tree produced by the {@code externalConstantTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitExternalConstantTerm(FhirPathParser.ExternalConstantTermContext ctx);

	/**
	 * Enter a parse tree produced by the {@code parenthesizedTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterParenthesizedTerm(FhirPathParser.ParenthesizedTermContext ctx);

	/**
	 * Exit a parse tree produced by the {@code parenthesizedTerm}
	 * labeled alternative in {@link FhirPathParser#term}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitParenthesizedTerm(FhirPathParser.ParenthesizedTermContext ctx);

	/**
	 * Enter a parse tree produced by the {@code nullLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterNullLiteral(FhirPathParser.NullLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code nullLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitNullLiteral(FhirPathParser.NullLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code booleanLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterBooleanLiteral(FhirPathParser.BooleanLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code booleanLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitBooleanLiteral(FhirPathParser.BooleanLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code stringLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterStringLiteral(FhirPathParser.StringLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code stringLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitStringLiteral(FhirPathParser.StringLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code numberLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterNumberLiteral(FhirPathParser.NumberLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code numberLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitNumberLiteral(FhirPathParser.NumberLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code dateTimeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterDateTimeLiteral(FhirPathParser.DateTimeLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code dateTimeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitDateTimeLiteral(FhirPathParser.DateTimeLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code timeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterTimeLiteral(FhirPathParser.TimeLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code timeLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitTimeLiteral(FhirPathParser.TimeLiteralContext ctx);

	/**
	 * Enter a parse tree produced by the {@code quantityLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterQuantityLiteral(FhirPathParser.QuantityLiteralContext ctx);

	/**
	 * Exit a parse tree produced by the {@code quantityLiteral}
	 * labeled alternative in {@link FhirPathParser#literal}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitQuantityLiteral(FhirPathParser.QuantityLiteralContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#externalConstant}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterExternalConstant(FhirPathParser.ExternalConstantContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#externalConstant}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitExternalConstant(FhirPathParser.ExternalConstantContext ctx);

	/**
	 * Enter a parse tree produced by the {@code memberInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterMemberInvocation(FhirPathParser.MemberInvocationContext ctx);

	/**
	 * Exit a parse tree produced by the {@code memberInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitMemberInvocation(FhirPathParser.MemberInvocationContext ctx);

	/**
	 * Enter a parse tree produced by the {@code functionInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterFunctionInvocation(FhirPathParser.FunctionInvocationContext ctx);

	/**
	 * Exit a parse tree produced by the {@code functionInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitFunctionInvocation(FhirPathParser.FunctionInvocationContext ctx);

	/**
	 * Enter a parse tree produced by the {@code thisInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterThisInvocation(FhirPathParser.ThisInvocationContext ctx);

	/**
	 * Exit a parse tree produced by the {@code thisInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitThisInvocation(FhirPathParser.ThisInvocationContext ctx);

	/**
	 * Enter a parse tree produced by the {@code indexInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterIndexInvocation(FhirPathParser.IndexInvocationContext ctx);

	/**
	 * Exit a parse tree produced by the {@code indexInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitIndexInvocation(FhirPathParser.IndexInvocationContext ctx);

	/**
	 * Enter a parse tree produced by the {@code totalInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterTotalInvocation(FhirPathParser.TotalInvocationContext ctx);

	/**
	 * Exit a parse tree produced by the {@code totalInvocation}
	 * labeled alternative in {@link FhirPathParser#invocation}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitTotalInvocation(FhirPathParser.TotalInvocationContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#function}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterFunction(FhirPathParser.FunctionContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#function}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitFunction(FhirPathParser.FunctionContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#paramList}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterParamList(FhirPathParser.ParamListContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#paramList}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitParamList(FhirPathParser.ParamListContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#quantity}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterQuantity(FhirPathParser.QuantityContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#quantity}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitQuantity(FhirPathParser.QuantityContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#unit}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterUnit(FhirPathParser.UnitContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#unit}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitUnit(FhirPathParser.UnitContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#dateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterDateTimePrecision(FhirPathParser.DateTimePrecisionContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#dateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitDateTimePrecision(FhirPathParser.DateTimePrecisionContext ctx);

	/**
	 * Enter a parse tree produced by
	 * {@link FhirPathParser#pluralDateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterPluralDateTimePrecision(FhirPathParser.PluralDateTimePrecisionContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#pluralDateTimePrecision}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitPluralDateTimePrecision(FhirPathParser.PluralDateTimePrecisionContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#typeSpecifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterTypeSpecifier(FhirPathParser.TypeSpecifierContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#typeSpecifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitTypeSpecifier(FhirPathParser.TypeSpecifierContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterQualifiedIdentifier(FhirPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#qualifiedIdentifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitQualifiedIdentifier(FhirPathParser.QualifiedIdentifierContext ctx);

	/**
	 * Enter a parse tree produced by {@link FhirPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void enterIdentifier(FhirPathParser.IdentifierContext ctx);

	/**
	 * Exit a parse tree produced by {@link FhirPathParser#identifier}.
	 * 
	 * @param ctx the parse tree
	 */
	void exitIdentifier(FhirPathParser.IdentifierContext ctx);
}