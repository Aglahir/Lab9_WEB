require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const uuid = require("uuid");
const morgan = require("morgan");
const validateToken = require("./middleware/validateToken");
const mongoose = require("mongoose");
const { Bookmarks } = require("./models/bookmarkModel");
const config = require("./config");

const json = body_parser.json();

const port = config.PORT;

let app = express();
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(validateToken);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);

  new Promise((resolve, reject) => {
    const settings = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    mongoose.connect(config.DATABASE_URL, settings, (err) => {
      if (err) {
        console.log("Mongo connection error");
        return reject(err);
      } else {
        console.log("Mongo started successfully");

        return resolve();
      }
    });
  }).catch((err) => {
    console.log("Mongo connection error");
    console.log(err);
  });
});

app.get("/bookmarks", (req, res) => {
  Bookmarks.getAllBookmarks()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage = "Something wrong with the Database";
      return res.status(500).end();
    });
});

app.get("/bookmark", (req, res) => {
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Title missing";
    return res.status(406).end();
  }

  Bookmarks.getBookmarksByTitle(title)
    .then((result) => {
      if (result.length == 0) {
        res.statusMessage = "Title Not Found";
        return res.status(404).end();
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.statusMessage = "Something wrong with the Database";
      return res.status(500).end();
    });
});

app.post("/bookmark", json, (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  if (!title || !description || !url || !rating) {
    res.statusMessage = "Missing fields";
    return res.status(406).end();
  }

  let newObj = {
    id: uuid.v4(),
    title: title,
    description: description,
    url: url,
    rating: rating,
  };

  Bookmarks.createBookmark(newObj)
    .then((result) => {
      if (result.errmsg) {
        res.statusMessage = "Duplicated Bookmark";
        return res.status(409).end();
      } else {
        return res.status(201).json(result);
      }
    })
    .catch((err) => {
      res.statusMessage = "Something wrong with the Database";
      return res.status(500).end();
    });
});

app.delete("/bookmark/:id", (req, res) => {
  let id = req.params.id;

  Bookmarks.deleteBookmark(id)
    .then((result) => {
      if (result.errmsg || result.deletedCount == 0) {
        res.statusMessage = "Bookmark not found";
        return res.status(404).end();
      } else {
        return res.status(200).end();
      }
    })
    .catch((err) => {
      res.statusMessage = "Something wrong with the Database";
      return res.status(500).end();
    });
});

app.patch("/bookmark/:id", json, (req, res) => {
  let idParam = req.params.id;
  let idBody = req.body.id;

  if (!idParam) {
    res.statusMessage = "Missing ID parameter";
    return res.status(406).end();
  }

  // I am assuming is not always needed the body one
  if (idBody) {
    if (idBody !== idParam) {
      res.statusMessage = "Parameter and body field IDs must match";
      return res.status(409).end();
    }
  }

  let title = req.body.title;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;

  let output = {};

  if (title) {
    output["title"] = title;
  }
  if (description) {
    output["description"] = description;
  }
  if (url) {
    output["url"] = url;
  }
  if (rating) {
    output["rating"] = rating;
  }

  Bookmarks.updateBookmark(idParam, output)
    .then((result) => {
      if (result.errmsg) {
        res.statusMessage = "Bookmark not found or fields did not changed";
        return res.status(404).end();
      } else {
        return res.status(202).json(output);
      }
    })
    .catch((err) => {
      res.statusMessage = "Something wrong with the Database";
      return res.status(500).end();
    });
});
