
class Person {

  constructor (params, callbacks) {
    this.name = params.name;
    this.id = params.id;
    this.friends = params.friends;
    this.personElem = null;
    this.template = params.template;
    
    this.openPersonRelations = callbacks.openPersonRelations.bind(this);
  }

  create () {
    const newCard = this.template.cloneNode(true);

    const newCardName = newCard.querySelector('.contacts-list__name');
    newCardName.textContent = this.name;

    this.personElem = newCard;

    this._setEventListeners();

    return newCard;
  }
  
  _setEventListeners () {
    const personLink = this.personElem;
    
    personLink.addEventListener('click', () => this.openPersonRelations(this.id));
  }
}