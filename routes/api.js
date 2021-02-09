/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../model/book.js')

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      // console.log(req.body)

      try {
        const allBooks = await Book.find({})

        return res.json(allBooks)
      } catch(e) {
        return res.json(e)
      }

    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      try {
        if(!title) {
          return res.json('missing required field title')
        }

        const bookToSave = new Book({
          title: title,
          comments: []
        })

        await bookToSave.save()
        return res.json({
          title: bookToSave.title,
          _id: bookToSave._id
        })
      } catch(e) {
        return res.json(e)
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'

        try {
       await Book.deleteMany()

        return res.json('complete delete successful')
      } catch(e) {
        return res.json(e)
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      try {
        const bookToBeFound = await Book.findById(bookid)

        if(!bookToBeFound) {
          return res.json('no book exists')
        }

        return res.json({
            title: bookToBeFound.title,
            _id: bookToBeFound._id,
            comments: bookToBeFound.comments
        })
      } catch(e) {
        return res.json('no book exists')
      }

    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      try {
        if(!comment) {
          return res.json('missing required field comment')
        }    

        const bookToBeUpdated = await Book.findByIdAndUpdate(
          bookid,
          {$push: {comments: {comment}}},
          {new: true}
        )
        
        if(!bookToBeUpdated) {
          return res.json('no book exists')
        }

        let commentToBeSent = [];
        bookToBeUpdated.comments.forEach(commentToBeSaved => {

           commentToBeSent.push(commentToBeSaved.comment)
        })
        
        return res.json({
          title: bookToBeUpdated.title,
          _id: bookToBeUpdated._id,
          comments: commentToBeSent,
          commentcount: bookToBeUpdated.comments.length
        })
      } catch (e) {
        return res.json('no book exists')
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const bookToBeDeleted = await Book.findByIdAndDelete(bookid)

        if(!bookToBeDeleted) {
          return res.json('no book exists')
        }

        return res.json('delete successful')
      } catch(e) {
        return res.json('no book exists')
      }
    });
  
};
