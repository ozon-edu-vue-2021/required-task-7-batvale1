class Contact {
  constructor (params) {
    this.name = params.name;
    this.template = params.template;
  }

  create () {
    const newCard = this.template.cloneNode(true);
  
    const newCardName = newCard.querySelector('.contacts-list__name');
    newCardName.textContent = this.name;
  
    return newCard;
  }
}