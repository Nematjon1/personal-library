const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  comments: [ {
    comment: {
      type: String,
      trim: true
    },
   }
  ],
  commentcount: {
    type: Number,
  },
})

bookSchema.pre('validate', function (next) {
  this.commentcount = this.comments.length
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
