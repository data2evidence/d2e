grammar FluentPath;

expression
        : qualifiedIdentifier                                        					#navigationExpression
        | qualifiedIdentifier ('|' qualifiedIdentifier)*                                 	#unionExpression
        ;


qualifiedIdentifier
        : identifier ('.' identifier)*('.'castFunction)*
        ;

castFunction	
		: 'as('identifier')'
		;
identifier
        : IDENTIFIER
        ;


/****************************************************************
    Lexical rules
*****************************************************************/

IDENTIFIER
        : ([A-Za-z] | '_')([A-Za-z0-9] | '_')*            // Added _ to support CQL (FHIR could constrain it out)
        ;


// Pipe whitespace to the HIDDEN channel to support retrieving source text through the parser.
WS
        : [ \r\n\t]+ -> channel(HIDDEN)
        ;
