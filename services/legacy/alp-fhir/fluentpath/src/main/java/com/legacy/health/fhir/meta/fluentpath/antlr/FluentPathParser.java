// Generated from FluentPath.g4 by ANTLR 4.5.3
package com.legacy.health.fhir.meta.fluentpath.antlr;

import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({ "all", "warnings", "unchecked", "unused", "cast" })
public class FluentPathParser extends Parser {
	static {
		RuntimeMetaData.checkVersion("4.5.3", RuntimeMetaData.VERSION);
	}

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache = new PredictionContextCache();
	public static final int T__0 = 1, T__1 = 2, T__2 = 3, T__3 = 4, IDENTIFIER = 5, WS = 6;
	public static final int RULE_expression = 0, RULE_qualifiedIdentifier = 1, RULE_castFunction = 2,
			RULE_identifier = 3;
	public static final String[] ruleNames = {
			"expression", "qualifiedIdentifier", "castFunction", "identifier"
	};

	private static final String[] _LITERAL_NAMES = {
			null, "'|'", "'.'", "'as('", "')'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
			null, null, null, null, null, "IDENTIFIER", "WS"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() {
		return "FluentPath.g4";
	}

	@Override
	public String[] getRuleNames() {
		return ruleNames;
	}

	@Override
	public String getSerializedATN() {
		return _serializedATN;
	}

	@Override
	public ATN getATN() {
		return _ATN;
	}

	public FluentPathParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this, _ATN, _decisionToDFA, _sharedContextCache);
	}

	public static class ExpressionContext extends ParserRuleContext {
		public ExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}

		@Override
		public int getRuleIndex() {
			return RULE_expression;
		}

		public ExpressionContext() {
		}

		public void copyFrom(ExpressionContext ctx) {
			super.copyFrom(ctx);
		}
	}

	public static class NavigationExpressionContext extends ExpressionContext {
		public QualifiedIdentifierContext qualifiedIdentifier() {
			return getRuleContext(QualifiedIdentifierContext.class, 0);
		}

		public NavigationExpressionContext(ExpressionContext ctx) {
			copyFrom(ctx);
		}

		@Override
		public void enterRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).enterNavigationExpression(this);
		}

		@Override
		public void exitRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).exitNavigationExpression(this);
		}

		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if (visitor instanceof FluentPathVisitor)
				return ((FluentPathVisitor<? extends T>) visitor).visitNavigationExpression(this);
			else
				return visitor.visitChildren(this);
		}
	}

	public static class UnionExpressionContext extends ExpressionContext {
		public List<QualifiedIdentifierContext> qualifiedIdentifier() {
			return getRuleContexts(QualifiedIdentifierContext.class);
		}

		public QualifiedIdentifierContext qualifiedIdentifier(int i) {
			return getRuleContext(QualifiedIdentifierContext.class, i);
		}

		public UnionExpressionContext(ExpressionContext ctx) {
			copyFrom(ctx);
		}

		@Override
		public void enterRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).enterUnionExpression(this);
		}

		@Override
		public void exitRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).exitUnionExpression(this);
		}

		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if (visitor instanceof FluentPathVisitor)
				return ((FluentPathVisitor<? extends T>) visitor).visitUnionExpression(this);
			else
				return visitor.visitChildren(this);
		}
	}

	public final ExpressionContext expression() throws RecognitionException {
		ExpressionContext _localctx = new ExpressionContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_expression);
		int _la;
		try {
			setState(17);
			_errHandler.sync(this);
			switch (getInterpreter().adaptivePredict(_input, 1, _ctx)) {
				case 1:
					_localctx = new NavigationExpressionContext(_localctx);
					enterOuterAlt(_localctx, 1); {
					setState(8);
					qualifiedIdentifier();
				}
					break;
				case 2:
					_localctx = new UnionExpressionContext(_localctx);
					enterOuterAlt(_localctx, 2); {
					setState(9);
					qualifiedIdentifier();
					setState(14);
					_errHandler.sync(this);
					_la = _input.LA(1);
					while (_la == T__0) {
						{
							{
								setState(10);
								match(T__0);
								setState(11);
								qualifiedIdentifier();
							}
						}
						setState(16);
						_errHandler.sync(this);
						_la = _input.LA(1);
					}
				}
					break;
			}
		} catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		} finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QualifiedIdentifierContext extends ParserRuleContext {
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}

		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class, i);
		}

		public List<CastFunctionContext> castFunction() {
			return getRuleContexts(CastFunctionContext.class);
		}

		public CastFunctionContext castFunction(int i) {
			return getRuleContext(CastFunctionContext.class, i);
		}

		public QualifiedIdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}

		@Override
		public int getRuleIndex() {
			return RULE_qualifiedIdentifier;
		}

		@Override
		public void enterRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).enterQualifiedIdentifier(this);
		}

		@Override
		public void exitRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).exitQualifiedIdentifier(this);
		}

		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if (visitor instanceof FluentPathVisitor)
				return ((FluentPathVisitor<? extends T>) visitor).visitQualifiedIdentifier(this);
			else
				return visitor.visitChildren(this);
		}
	}

	public final QualifiedIdentifierContext qualifiedIdentifier() throws RecognitionException {
		QualifiedIdentifierContext _localctx = new QualifiedIdentifierContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_qualifiedIdentifier);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
				setState(19);
				identifier();
				setState(24);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input, 2, _ctx);
				while (_alt != 2 && _alt != org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER) {
					if (_alt == 1) {
						{
							{
								setState(20);
								match(T__1);
								setState(21);
								identifier();
							}
						}
					}
					setState(26);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input, 2, _ctx);
				}
				setState(31);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la == T__1) {
					{
						{
							setState(27);
							match(T__1);
							setState(28);
							castFunction();
						}
					}
					setState(33);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
			}
		} catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		} finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CastFunctionContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class, 0);
		}

		public CastFunctionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}

		@Override
		public int getRuleIndex() {
			return RULE_castFunction;
		}

		@Override
		public void enterRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).enterCastFunction(this);
		}

		@Override
		public void exitRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).exitCastFunction(this);
		}

		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if (visitor instanceof FluentPathVisitor)
				return ((FluentPathVisitor<? extends T>) visitor).visitCastFunction(this);
			else
				return visitor.visitChildren(this);
		}
	}

	public final CastFunctionContext castFunction() throws RecognitionException {
		CastFunctionContext _localctx = new CastFunctionContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_castFunction);
		try {
			enterOuterAlt(_localctx, 1);
			{
				setState(34);
				match(T__2);
				setState(35);
				identifier();
				setState(36);
				match(T__3);
			}
		} catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		} finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentifierContext extends ParserRuleContext {
		public TerminalNode IDENTIFIER() {
			return getToken(FluentPathParser.IDENTIFIER, 0);
		}

		public IdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}

		@Override
		public int getRuleIndex() {
			return RULE_identifier;
		}

		@Override
		public void enterRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).enterIdentifier(this);
		}

		@Override
		public void exitRule(ParseTreeListener listener) {
			if (listener instanceof FluentPathListener)
				((FluentPathListener) listener).exitIdentifier(this);
		}

		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if (visitor instanceof FluentPathVisitor)
				return ((FluentPathVisitor<? extends T>) visitor).visitIdentifier(this);
			else
				return visitor.visitChildren(this);
		}
	}

	public final IdentifierContext identifier() throws RecognitionException {
		IdentifierContext _localctx = new IdentifierContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_identifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
				setState(38);
				match(IDENTIFIER);
			}
		} catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		} finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN = "\3\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd\3\b+\4\2\t\2\4\3\t"
			+
			"\3\4\4\t\4\4\5\t\5\3\2\3\2\3\2\3\2\7\2\17\n\2\f\2\16\2\22\13\2\5\2\24" +
			"\n\2\3\3\3\3\3\3\7\3\31\n\3\f\3\16\3\34\13\3\3\3\3\3\7\3 \n\3\f\3\16\3" +
			"#\13\3\3\4\3\4\3\4\3\4\3\5\3\5\3\5\2\2\6\2\4\6\b\2\2*\2\23\3\2\2\2\4\25" +
			"\3\2\2\2\6$\3\2\2\2\b(\3\2\2\2\n\24\5\4\3\2\13\20\5\4\3\2\f\r\7\3\2\2" +
			"\r\17\5\4\3\2\16\f\3\2\2\2\17\22\3\2\2\2\20\16\3\2\2\2\20\21\3\2\2\2\21" +
			"\24\3\2\2\2\22\20\3\2\2\2\23\n\3\2\2\2\23\13\3\2\2\2\24\3\3\2\2\2\25\32" +
			"\5\b\5\2\26\27\7\4\2\2\27\31\5\b\5\2\30\26\3\2\2\2\31\34\3\2\2\2\32\30" +
			"\3\2\2\2\32\33\3\2\2\2\33!\3\2\2\2\34\32\3\2\2\2\35\36\7\4\2\2\36 \5\6" +
			"\4\2\37\35\3\2\2\2 #\3\2\2\2!\37\3\2\2\2!\"\3\2\2\2\"\5\3\2\2\2#!\3\2" +
			"\2\2$%\7\5\2\2%&\5\b\5\2&\'\7\6\2\2\'\7\3\2\2\2()\7\7\2\2)\t\3\2\2\2\6" +
			"\20\23\32!";
	public static final ATN _ATN = new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}