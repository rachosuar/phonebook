require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/contact");
const { application } = require("express");

morgan.token("person", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(express.static("build"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
app.use(express.json());
app.use(cors());

app.get("/api/persons", (request, response, next) => {
  Contact.find({})
    .then((contact) => {
      response.json(contact);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      console.log(contact);
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});
app.get("/info", (request, response) => {
  const date = new Date();
  const count = Contact.countDocuments({}).exec((err, count) => {
    response.send(`<h4>Phonebook has info for ${count} persons <h4>
  <h4>${date}<h4>`);
  });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // if (!Contact.find({ name: body.name })) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((contact) => {
      console.log(contact);
      if (contact) {
        response.status(204).end();
      } else {
        return response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, {
    new: true,
    runValidators: true,
  })
    .then((updatedContact) => response.json(updatedContact))
    .catch((err) => next(err));
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
