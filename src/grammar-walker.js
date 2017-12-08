import {Grammar, NonTerminal, Terminal} from "./grammar";

const defaultConfig = {};

export class GrammarWalker {

  constructor(grammar) {
    if (!(grammar instanceof Grammar)) {
      throw new Error('Expected an instance of a grammar');
    }

    this._grammar = grammar;
  }

  walk() {
    return this._walkProduction(this._grammar.rootProductionName);
  }

  _walkProduction(productionName) {
    const production = this._grammar.productions[productionName];

    if (production.rules.length === 0) {
      return this._evaluateRule(production.rules[0]);
    }

    const ruleIndex = this._nextInt(production.rules.length);

    return this._evaluateRule(production.rules[ruleIndex]);
  }

  _evaluateRule(rule) {
    if (rule.symbols.length === 1) {
      return this._evaluateSymbol(rule.symbols[0]);
    }

    return rule.symbols.map(x => this._evaluateSymbol(x))
      .join('');
  }

  _evaluateSymbol(symbol) {
    if (symbol instanceof NonTerminal) {
      return this._walkProduction(symbol.value);
    }
    return symbol.value;
  }

  _nextInt(max) {
    return Math.floor(Math.random() * max);
  }
}
