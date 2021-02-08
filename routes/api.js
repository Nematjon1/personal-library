/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { ObjectID } = require('mongodb');

const filterer = (arr, obj) => {
    arr.filter(a => !!a[1]).map(a => obj[a[0]] = a[1])
}

module.exports = function (app, myDataBase) {

    app.route('/api/books')
        .get(function (req, res){
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
            const collection = myDataBase.collection("books");

            collection.find({}).toArray((err, data) => {
                if(err) {
                    return res.json({"error": "Server error, please try later"})
                } else if(!!data) {
                    return res.status(200).json(data);
                }
            });

        })
        
        .post(function (req, res){
        let title = req.body.title;
        //response will contain new book object including atleast _id and title
        if(!title) {
            return res.send("missing required field title");
        } else {
            const collection = myDataBase.collection("books");

            collection.insertOne({
                "title":title,
                "commentcount":0,
                "__v":1,
                "comments":[]
            }, (err, data) => {
                if(err) {
                    return res.json({"error": "Server error, please try later"})
                } else if(data) {
                    return res.status(200).json(data.ops[0]);
                }
            });
        }
        })
        
        .delete(function(req, res){
        //if successful response will be 'complete delete successful'
            const collection = myDataBase.collection("books");
            collection.remove({}, (err, data) => {
                if(err) {
                    return res.status(404).json({error: "Cannot remove books"});
                } else if(data) {
                    return res.status(200).send("complete delete successful");
                }
            })
        });



    app.route('/api/books/:id')
        .get(function (req, res){
        let bookId = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        const collection = myDataBase.collection("books");
        if(!ObjectID.isValid(bookId)) {
            return res.status(404).send("Invalid book Id");
        }
        collection.find({"_id": new ObjectID(bookId)}).toArray((err, data) => {
            if(!!err) {
                return res.status(404).send("no book exists");
            } else if (!!data) {
                return res.status(200).json(data);
            }
        })
        })
        
        .post(function(req, res){
        let bookId = req.params.id;
        let comment = req.body.comment;
        //json res format same as .get

        if(!ObjectID.isValid(bookId)) {
            return res.status(404).send("Invalid book Id");
        }
        if(!comment) {
            return res.status(404).send("missing required field comment");
        }
        const collection = myDataBase.collection("books");
        collection.findOneAndUpdate({"_id": new ObjectID(bookId)}, {
            $push: {
                comments: comment
            },
            $inc: {
                commentcount: 1
            }
        }, {returnNewDocument: true}, (err, data) => {
            if(!!err) {
                return res.status(404).send("no book exists");
            } else if (!!data) {
                return res.status(200).json(data.value);
            }
        })
        })
        
        .delete(function(req, res){
        let bookId = req.params.id;
        //if successful response will be 'delete successful'
        if(!ObjectID.isValid(bookId)) {
            return res.status(404).send("Invalid book Id");
        }
        const collection = myDataBase.collection("books");

        collection.deleteOne({_id: new ObjectID(bookId)}, (err, data) => {
            if(err) {
                return res.status(404).send("no book exists")
            } else if (data) {
                return res.status(200).send("delete successful")
            }
        })
        });
  
};
const SampleBook = {
    "_id":"6020bf081ddf7906daee8381",
    "title":"stars in our dream",
    "commentcount":2,
    "__v":2
};

const obj = {"title":"TEST WWW","commentcount":0,"__v":1,"comments":[],"_id":"60212eb78290960249a6d6af"}
