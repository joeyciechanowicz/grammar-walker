const {Grammar} = require("./src/grammar");
const {GrammarWalker} = require("./src/grammar-walker");

// <symbol>*
const bnf1 = `
  <root> ::= <root> <symbol> | ""
  <symbol> ::= "1"
`;

// <symbol>?
const bnf2 = `
  <root> ::= <symbol> | ""
  <symbol> ::= "1"
`;

// <symbol>+ -> <symbol> <symbol>*
const bnf3 = `
  <root> ::= <symbol> <root_a>
  <root_a> ::= <root_a> <symbol> | ""
  <symbol> ::= "1"
`;

const grammar = Grammar.constructFromBNF(bnf3);
const walker = new GrammarWalker(grammar);

for (let i = 0; i < 100; i++) {
  console.log(walker.walk());
}
