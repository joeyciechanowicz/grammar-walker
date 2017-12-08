import {Grammar} from "./grammar";
import {GrammarWalker} from "./grammar-walker";

describe('GrammarWalker', () => {

  it('can walk a basic grammar with one production', () => {
    const grammar = Grammar.constructFromBNF(`<root> ::= "1" "2" "3"`);
    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(3);
    expect(result).toEqual('123');
  });

  it('can walk a basic grammar with predefined productions', () => {
    const grammar = Grammar.constructFromBNF(`<root> ::= <LETTER> <LETTER> <LETTER>`)
      .attachPredefinedProductions();


    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(3);
    expect(result).toEqual(expect.stringMatching(/[a-zA-Z][a-zA-Z][a-zA-Z]/));
  });

  it('can walk a grammar that contains multiple productions', () => {
    const grammar = Grammar.constructFromBNF(`
        <root> ::= <one> <two> <three>
        <one> ::= "1"
        <two> ::= "2"
        <three> ::= "3"
        `);

    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(3);
    expect(result).toEqual('123');
  });

  it('can walk grammars with choice', () => {
    const grammar = Grammar.constructFromBNF(`
        <root> ::= <one> | <two> 
        <one> ::= "1"
        <two> ::= "2"
        `)
      .attachPredefinedProductions();


    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(1);
    expect(result).toEqual(expect.stringMatching(/1|2/));
  });

  it('can walk grammars with recursion', () => {
    const grammar = Grammar.constructFromBNF(`
        <root> ::= <one> 
        <one> ::= <one> "1" | "1" <two>
        <two> ::= "2"
        `)
      .attachPredefinedProductions();


    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(2);
    expect(result).toEqual(expect.stringMatching(/1(1|2)/));
  });

});
