import {Grammar} from "./grammar";
import {GrammarWalker} from "./grammar-walker";

describe('GrammarWalker', () => {

  it('can walk a basic grammar to produce 3 letters', () => {
    const grammar = Grammar.constructFromBNF(`<root> ::= <LETTER> <LETTER> <LETTER>`)
      .attachPredefinedProductions();


    const grammarWalker = new GrammarWalker(grammar);

    const result = grammarWalker.walk();

    expect(result.length).toEqual(3);
    expect(result).toBe(/[a-z]{3}/);
  });

});
