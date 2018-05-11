const {Grammar, NonTerminal, Terminal} = require("./grammar");


describe('Grammar', () => {

  it('can parse a grammar with basic productions', () => {

    const bnf = `
      <root> ::= <one> <two> <three>
      <one> ::= "1"
      <two> ::= "2"
      <three> ::= "3"
    `;

    const grammar = Grammar.constructFromBNF(bnf);

    expect(Object.keys(grammar.productions).length).toEqual(4);
    expect(grammar.rootProductionName).toEqual('<root>');
  });

  it('can parse a grammar with terminals in a production', () => {
    const bnf = `
      <root> ::= <one> | <two>
      <one> ::= "1"
      <two> ::= "2"
    `;

    const grammar = Grammar.constructFromBNF(bnf);

    expect(Object.keys(grammar.productions).length).toEqual(3);
    expect(grammar.productions['<one>']).toBeDefined();
    expect(grammar.productions['<one>'].rules).toBeDefined();
    expect(grammar.productions['<one>'].rules.length).toEqual(1);
    expect(grammar.productions['<one>'].rules[0].symbols.length).toEqual(1);
    expect(grammar.productions['<one>'].rules[0].symbols[0]).toBeInstanceOf(Terminal);
  });

  it('can parse a grammar that uses rules', () => {

    const bnf = `
      <root> ::= <one> | <two>
      <one> ::= "1"
      <two> ::= "2"
    `;

    const grammar = Grammar.constructFromBNF(bnf);

    expect(Object.keys(grammar.productions).length).toEqual(3);
    expect(grammar.productions['<root>'].rules.length).toEqual(2);
    expect(grammar.productions['<root>'].rules[0].symbols[0]).toBeInstanceOf(NonTerminal);
    expect(grammar.productions['<root>'].rules[1].symbols[0]).toBeInstanceOf(NonTerminal);
  });

  it('throws an exception if a line doesnt declare a name and rule', () => {

    const bnf = `
      <grammar> <one> <two> <three>
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/form <name> ::= rules/);
  });

  it('throws an exception if there are duplicate named rules', () => {

    const bnf = `
      <grammar> ::= ""
      <grammar> ::= "1"
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/Duplicate production/);
  });

  it('throws an exception if a rule has no symbols', () => {

    const bnf = `
      <grammar> ::=
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/Empty production found/);
  });

  it('throws an exception if a rule is just whitespace', () => {

    const bnf = `
      <grammar> ::=    
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/Empty rule part before/);
  });

  it('throws an exception if a choice section is empty', () => {

    const bnf = `
      <grammar> ::= "one" || "two"
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/Empty rule part before/);
  });

  it('throws an exception if a choice section is whitespace', () => {

    const bnf = `
      <grammar> ::= "one" | | "two"
    `;

    expect(() => Grammar.constructFromBNF(bnf)).toThrowError(/Empty rule part before/);
  });

  it('can attach predefined productions after creation', () => {
    const bnf = '<root>::="123"';
    const grammar = Grammar.constructFromBNF(bnf);
    grammar.attachPredefinedProductions();

    expect(Object.keys(grammar.productions).length).toEqual(4);
  });

  it('can parse repeated statements correctly', () => {
    const bnf = `
        <root>::=<one><one><one>
        <one>::="1"
    `;
    const grammar = Grammar.constructFromBNF(bnf);

    expect(grammar.productions['<root>'].rules[0].symbols.length).toEqual(3);
    expect(grammar.productions['<root>'].rules[0].symbols[2].value).toEqual('<one>');
  });

  it('can parse *', () => {
    const bnf = `
        <root>::=<one>*
        <one>::="1"
    `;
    const grammar = Grammar.constructFromBNF(bnf);

    expect(grammar.productions['<root>'].rules.length).toEqual(2);
    expect(grammar.productions['<root>'].rules[0].symbols.length).toEqual(1)
    expect(grammar.productions['<root>'].rules[2].symbols.length).toEqual(2)
  });
});
