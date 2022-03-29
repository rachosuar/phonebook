const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const id = process.argv[5];

const url = `mongodb+srv://racho:${password}@cluster0.0aqmh.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(url).then(console.log("Conected to db"));

const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  id,
  name,
  number,
});

Contact.find({}).then((result) => {
  result.forEach((contact) => {
    console.log(`${contact.name} -- ${contact.number}`);
  });
  mongoose.connection.close();
});

// contact.save().then((result) => {
//   console.log(`added ${name} number ${number} to the phonebook `);
//   mongoose.connection.close();
// });
