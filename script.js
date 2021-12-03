(function () {
  let personsGroupedData;
  const PERSONAL_INFO_MAX_COUNT= 3;
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
    const friendsCards = getPersonsCards(personsGroupedData.friends[id].slice(0, PERSONAL_INFO_MAX_COUNT));
    const notFriendsCards = getPersonsCards(personsGroupedData.notFriends[id].slice(0, PERSONAL_INFO_MAX_COUNT));
    const popularPeopleCards = getPersonsCards(personsGroupedData.popularPeople);
    
    const relationShips = new Relationships(relationshipsSelector);
    relationShips.friendsCards = friendsCards;
    relationShips.notFriendsCards = notFriendsCards;
    relationShips.popularCards = popularPeopleCards;
    relationShips.personName = personsGroupedData.persons[id].name;
    
    relationShips.render();
  }
  
  function transformPersonData (persons) {
    // для отдельного человека получаем
    // 1) не друзей
    // 2) друзей
    // 3) популярность тех, на кого подписаны popularPeople
    
    const popularity = {};
    const result = persons.reduce((acc, item, _, selfArr) => {
      acc.notFriends[item.id] = selfArr.reduce((acc, x) => {
        if (!item.friends.includes(x.id)) {
          acc.push(x.id);
        } else {
          if (popularity[x.id]) {
            popularity[x.id] += 1;
          } else {
            popularity[x.id] = 1;
          }
        }
        
        return acc;
      }, []);
      
      acc.friends[item.id] = item.friends;
      acc.persons[item.id] = { id: item.id, name: item.name };

      return acc;
    }, {
      notFriends: {},
      popularPeople: {},
      friends: {},
      persons: {}
    });

    // значения популярности и людей с ней
    result.popularPeople = Object.entries(popularity)
      .reduce((acc, item) => {
        const [personId, popularityCount]  = item;
        if (acc[popularityCount]) {
          acc[popularityCount].push(result.persons[personId]);
        } else {
          acc[popularityCount] = [result.persons[personId]]
        }

        return acc;
      }, {})

    
    
    // сортировка значений популярности
    result.popularPeople = Object.entries(result.popularPeople)
      // сортировка по популярности групп людей с одной и той же популярностью
      .sort((a, b) => b[0] - a[0])
      .reduce((acc, item) => {
        const [_, people] = item;

        // сортировка имени по алфавиту в пределах одной и той же популярности
        // people.sort((a, b) => a.name.localeCompare(b.name))
        acc.push(...people);
        
        return acc;
      }, [])
      .slice(0, PERSONAL_INFO_MAX_COUNT);
  
    result.popularPeople = result.popularPeople.sort((a, b) => a.name.localeCompare(b.name)).map(item => item.id);
    
    return result;
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
      personsGroupedData = transformPersonData(persons);
      
      peopleList.cards = createPersons(Object.values(personsGroupedData.persons));
      peopleList.render();
    });
})();