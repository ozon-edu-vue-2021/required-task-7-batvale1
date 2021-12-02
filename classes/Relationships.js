class Relationships {
  
  constructor (element, lists) {
    this.elem = element;
    this.friendsList = element.querySelector('.friends');
    this.notFriendsList = element.querySelector('.not-friends');
    this.popularList = element.querySelector('.popular-people');
    this.personNameElem = element.querySelector('.details-view__person-name');
    this.backBtn = element.querySelector('.back');
    this.friendsCards = [];
    this.notFriendsCards = [];
    this.popularCards = [];
    this.personName = '';
    this._visibleClass = 'details-view_visible';
  }
  
  render() {
    this.backBtn.addEventListener('click', this._close.bind(this));
    
    this.friendsList.innerHTML = '';
    this.notFriendsList.innerHTML = '';
    this.popularList.innerHTML = '';
    this.personNameElem.textContent = this.personName;
    
    this.friendsCards.forEach(item => this.friendsList.appendChild(item));
    this.notFriendsCards.forEach(item => this.notFriendsList.appendChild(item));
    this.popularCards.forEach(item => this.popularList.appendChild(item));
    
    this._open();
  }
  
  
  _open () {
    this.elem.classList.add(this._visibleClass);
  }
  
  _close () {
    this.elem.classList.remove(this._visibleClass);
    this.backBtn.removeEventListener('click', this._close.bind(this));
  }
}