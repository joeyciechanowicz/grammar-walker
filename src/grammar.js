const spacesRegex = /^\s*$/;
const whiteSpaceRegex = /\s+/;

class Grammar {

  constructor(rootProductionName, productions) {
    this._rootProductionName = rootProductionName;
    this._productions = productions;
  }

  get rootProductionName() {
    return this._rootProductionName;
  }

  get productions() {
    return this._productions;
  }

  attachPredefinedProductions() {
    this._productions[EOL.name] = EOL;
    this._productions[LETTER.name] = LETTER;
    this._productions[NUMBER.name] = NUMBER;
    return this;
  }

  /***
   *
   * @param bnf a bnf grammar as text
   */
  static constructFromBNF(bnf) {
    const productionLines = bnf.split(/\r?\n|\r/);

    let rootProductionName = null;
    let productions = {};

    for (let i = 0; i < productionLines.length; i++) {
      if (spacesRegex.exec(productionLines[i])) {
        continue;
      }

      const rule = Production.construct(productionLines[i], i + 1);
      if (rootProductionName === null) {
        rootProductionName = rule.name;
      }

      if (productions[rule.name]) {
        throw new Error(`Duplicate production '${rule.name}'`);
      }

      productions[rule.name] = rule;
    }

    return new Grammar(rootProductionName, productions);
  }
}

class Production {
  constructor(name, rules) {
    this._name = name;
    this._rules = rules;
  }

  get rules() {
    return this._rules;
  }

  get name() {
    return this._name;
  }

  static construct(line, lineNumber) {
    const nameAndSymbols = line.split('::=');
    if (nameAndSymbols.length !== 2) {
      throw new Error(`Expected production in the form <name> ::= rules. Line: ${lineNumber}`);
    }

    const name = nameAndSymbols[0].trim();
    const symbols = nameAndSymbols[1];

    if (symbols.length === 0) {
      throw new Error(`Empty production found on line: ${lineNumber}. "${line}"`);
    }

    const rules = [];

    let currentRule = [];
    let currentSymbol = '';
    let isInNonTerminal = false;
    let isInTerminal = false;
    let i;

    for (i = 0; i < symbols.length; i++) {
      switch (symbols[i]) {
        case '\\':
          currentSymbol += symbols[i + 1];
          i += 2;
          break;
        case '|':
          if (currentRule.length === 0) {
            throw new Error(`Empty rule part before ${lineNumber}:${i}`);
          }
          rules.push(new Rule(currentRule));
          currentRule = [];
          currentSymbol = '';
          isInNonTerminal = false;
          break;
        case '<':
          isInNonTerminal = true;
          currentSymbol += '<';
          break;
        case '>':
          isInNonTerminal = false;
          currentSymbol += '>';
          currentRule.push(new NonTerminal(currentSymbol));
          currentSymbol = '';
          break;
        case '"':
          if (isInTerminal) {
            currentRule.push(new Terminal(currentSymbol));
            isInTerminal = false;
            currentSymbol = '';
          } else {
            isInTerminal = true;
          }
          break;
        case ' ':
          if (isInTerminal) {
            currentSymbol += ' ';
          } else if (isInNonTerminal) {
            throw new Error('Non-terminals can only contain letters and dashes');
          }
          break;
        default:
          currentSymbol += symbols[i];
          break;
      }
    }

    if (currentRule.length === 0) {
      throw new Error(`Empty rule part before ${lineNumber}:${i}`);
    }
    rules.push(new Rule(currentRule));

    return new Production(name, rules);
  }
}

class Rule {
  constructor(symbols) {
    this._symbols = symbols;
  }

  get symbols() {
    return this._symbols;
  }
}

class Symbol {
  constructor(value) {
    this.value = value;
  }
}

// Characters
class Terminal extends Symbol {
}

class NonTerminal extends Symbol {
}

const EOL = Production.construct('<EOL>::="\r\n"');
const LETTER = Production.construct('<LETTER>::="A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"|"a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|"n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"');
const NUMBER = Production.construct('<NUMBER>::="0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"');

module.exports.Grammar = Grammar;
module.exports.Production = Production;
module.exports.Rule = Rule;
module.exports.Symbol = Symbol;
module.exports.Terminal = Terminal;
module.exports.NonTerminal = NonTerminal;
