

export class GrammarWalker {

  constructor(grammar) {
    if (!(grammar instanceof Grammar)) {
      throw new Error('Expected an instance of a grammar');
    }

    this._grammar = grammar;
  }

  walk() {
    return '';
  }
}
