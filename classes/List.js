class List {
  constructor(container, cards) {
    this.container = container;
    this.cards = cards;
  }
  addCard(elem) {
    this.container.appendChild(elem);
  }
  render() {
    this.cards.forEach(elem => this.addCard(elem));
  }
}