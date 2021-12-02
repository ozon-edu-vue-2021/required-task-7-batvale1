(function () {
  let personsGroupedData;
  const personalInfoMaxCount = 3;
  const peopleListSelector = document.querySelector('.contacts-list');
  const relationshipsSelector = document.querySelector('.details-view');
  const api = new Api({ baseUrl: './' });
  const peopleList = new List(peopleListSelector, []);
  const templatePerson = document.getElementById('person-template').content.querySelector('.contacts-lists__item');
  const templateContactItem = document.getElementById('contact').content.querySelector('.contact__item');
  
  function getPersonsCards (personsIds) {
    return personsIds.map(id => {
      return new Contact({
        name: personsGroupedData.persons[id].name,
        template: templateContactItem
      }).create();
    });
  }
  
  function openPersonRelations (id) {
    const friendsCards = getPersonsCards(personsGroupedData.friends[id].slice(0, personalInfoMaxCount));
    const notFriendsCards = getPersonsCards(personsGroupedData.notFriends[id].slice(0, personalInfoMaxCount));
    const popularPeopleCards = getPersonsCards(personsGroupedData.popularPeople.slice(0, personalInfoMaxCount));
    
    const relationShips = new Relationships(relationshipsSelector);
    relationShips.friendsCards = friendsCards;
    relationShips.notFriendsCards = notFriendsCards;
    relationShips.popularCards = popularPeopleCards;
    relationShips.personName = personsGroupedData.persons[id].name;
    
    console.log(friendsCards);
    
    relationShips.render();
  }
  
  function transformPersonData (persons) {
    // для отдельного человека получаем
    // 1) не друзей
    // 2) друзей
    // 3) популярность тех, на кого подписаны popularPeople
    
    personsGroupedData = persons.reduce((acc, item, _, selfArr) => {
      acc.notFriends[item.id] = selfArr.filter(x => !item.friends.includes(x.id)).map(item => item.id);
      acc.friends[item.id] = item.friends;
      acc.persons[item.id] = { id: item.id, name: item.name };

      item.friends.forEach(friendId => {
        if (acc.popularPeople[friendId]) {
          acc.popularPeople[friendId] += 1;
        } else {
          acc.popularPeople[friendId] = 1;
        }
      })

      return acc;
    }, {
      notFriends: {},
      popularPeople: {},
      friends: {},
      persons: {}
    });

    // значения популярности и людей с ней
    personsGroupedData.popularPeople = Object.entries(personsGroupedData.popularPeople)
      .reduce((acc, item) => {
        const [personId, popularityCount]  = item;
        if (acc[popularityCount]) {
          acc[popularityCount].push(personsGroupedData.persons[personId]);
        } else {
          acc[popularityCount] = [personsGroupedData.persons[personId]]
        }

        return acc;
      }, {})

    // сортировка значений популярности
    personsGroupedData.popularPeople = Object.entries(personsGroupedData.popularPeople)
      .map(item => {
        const [popularity, people] = item;

        // сортировка имени по алфавиту в пределах одной и той же популярности
        people.sort((a, b) => a.name.localeCompare(b.name))
        return [popularity, people]
      })
      // сортировка по популярности групп людей с одной и той же популярностью
      .sort((a, b) => b[0] - a[0])


    // приведение к плоской структуре
    personsGroupedData.popularPeople = personsGroupedData.popularPeople.reduce((acc, item) => {
      acc.push(...item[1].map(person => person.id))

      return acc;
    },[]);
  }
  
  function createPersons (persons) {
    return persons.map(person => {
      const personData = {
        name: person.name,
        id: person.id,
        template: templatePerson,
      }
      const personCallbacks = {
        openPersonRelations: openPersonRelations
      }
  
      return new Person(personData, personCallbacks).create()
    });
  }
  
  api.getPersons()
    .then((persons) => {
      transformPersonData(persons);
      
      peopleList.cards = createPersons(Object.values(personsGroupedData.persons));
      peopleList.render();
    });
})();