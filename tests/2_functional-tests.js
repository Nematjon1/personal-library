/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
// const emitter = require('../test-runner.js')

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  

  suite('Routing tests', function() {

    let id;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Best Book Ever'
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.title, 'Best Book Ever')
          assert.isNotNull(res.body._id)
          id=res.body._id
          done()
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field title')
          done()
        })
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Should contain commentcount')
          assert.property(res.body[0], 'title', 'Should have title')
          assert.property(res.body[0], '_id', 'Should have _id')
          done()
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/60074cd')
        .end((err, res) => {
          assert.equal(res.body, 'no book exists')
          assert.equal(res.status, 200)
          done()
        })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body._id, id)
          assert.equal(res.body.title, 'Best Book Ever')
          done()
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({
          _id: id,
          comment: 'Awesome!'
        })
        .end((err,res) => {
          assert.equal(res.body._id, id)
          assert.equal(res.body.comments.slice(-1), 'Awesome!')
          assert.equal(res.status, 200)
          done()
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({
          _id: id,
        })
        .end((err,res) => {
          assert.equal(res.body, 'missing required field comment')
          assert.equal(res.status, 200)
          done()
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
         chai.request(server)
        .post('/api/books/23242324')
        .send({
          _id: '23242324',
          comment: 'What?'
        })
        .end((err,res) => {
          assert.equal(res.body, 'no book exists')
          assert.equal(res.status, 200)
          done()
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${id}`)
        .end((err, res) => {
          assert.equal(res.body,'delete successful')
          assert.equal(res.status, 200)
          done()
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/addfsdf')
        .end((err, res) => {
          assert.equal(res.body, 'no book exists')
          assert.equal(res.status, 200)
          done()
        })
      });

    });

  });

});
