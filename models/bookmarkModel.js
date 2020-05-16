const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const bookmarkCollection = mongoose.model("bookmarksdb", bookmarkSchema);

const Bookmarks = {
  createBookmark: function (newBookmark) {
    return bookmarkCollection
      .create(newBookmark)
      .then((createdBookmark) => {
        return createdBookmark;
      })
      .catch((err) => {
        return err;
      });
  },
  getAllBookmarks: function () {
    return bookmarkCollection
      .find()
      .then((allBookmarks) => {
        return allBookmarks;
      })
      .catch((err) => {
        return err;
      });
  },
  getBookmarksByTitle: function (title) {
    return bookmarkCollection
      .find({ title: title })
      .then((bookmarksResult) => {
        return bookmarksResult;
      })
      .catch((err) => {
        return err;
      });
  },
  deleteBookmark: function (id) {
    return bookmarkCollection
      .deleteOne({ id: id })
      .then((deleteResult) => {
        return deleteResult;
      })
      .catch((err) => {
        return err;
      });
  },
  updateBookmark: function (id, newBookmark) {
    return bookmarkCollection
      .updateOne({ id: id }, newBookmark)
      .then((updateResult) => {
        return updateResult;
      })
      .catch((err) => {
        return err;
      });
  },
};

module.exports = { Bookmarks };
