class Api {
  constructor ({ baseUrl }) {
    this.baseUrl = baseUrl;
  }
  
  getPersons () {
    return fetch(`${this.baseUrl}/data.json`)
      .then(res => {
        if (res.ok) return res.json();
        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }
}