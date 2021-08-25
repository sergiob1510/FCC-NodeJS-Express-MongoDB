require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser : true }, { useUnifiedTopology : true });


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({name: 'Juan Carlo', age: 121, favoriteFoods: ['chorizo', 'choripan']});
  person.save((err, data) => {
    if (err) return console.log(err);
    return done(null, data);
  });
};

const arrayOfPeople = [
  {name: 'Bichoto', age: '4', favoriteFoods: ['Se come todo', 'Golocan']},
  {name: 'JC el fantasma', age: '225', favoriteFoods: ['Morcilla', 'Chinchulin', 'Chorizo colorado']},
  {name: 'Juancito', age: '25', favoriteFoods: ['La novia de los amigos', 'El chorizo']}
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.log(err);
    return done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, person) => {
    if (err) return console.log(err);
    return done(null, person);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.log(err);
    return done(null, person);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id : personId }, (err, person) => {
    if (err) return console.log(err);
    return done(null, person);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({ _id : personId }, (err, person) => {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => {
      if (err) return console.log(err);
      return done(null, updatedPerson);
    });
  });
  };

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({ name : personName }, { age : ageToSet }, { new: true}, (err, person) => {
    if (err) return console.log(err);
    return done(null, person);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({ _id : personId }, (err, deletedPerson) => {
    if (err) return console.log(err);
    return done(null, deletedPerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name : nameToRemove }, (err, deletedPeople) => {
    if (err) return console.log(err);
    return done(null, deletedPeople);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find( { favoriteFoods : foodToSearch } )
  .sort( {name : 1 })
  .limit(2)
  .select({ name:1, favoriteFoods: 1})
  .exec((err, docs) => {
  if (err) return console.log(err);
  return done(null, docs);
  });
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
