exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  "mongodb+srv://admin:admin@webclass-qgmrz.mongodb.net/bookmarksdb?retryWrites=true&w=majority";
exports.TOKEN = process.env.TOKEN || "password1234";
exports.PORT = process.env.PORT || 3030;
