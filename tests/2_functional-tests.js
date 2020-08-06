/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
const chaiDateString = require("chai-date-string");
const expect = chai.expect;
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          const expected = {
            issue_title: "Title",
            issue_text: "text",
            created_by: "Functional Test - Every field filled in",
            assigned_to: "Chai and Mocha",
            open: true,
            status_text: "In QA"
          };
           assert.isOk(res.body._id);
          assert.property(res.body, "created_on")
          assert.property(res.body, "updated_on")
          assert.equal(res.body.issue_title, expected.issue_title);
          assert.equal(res.body.issue_text, expected.issue_text);
          assert.equal(res.body.created_by, expected.created_by);
          assert.equal(res.body.assigned_to, expected.assigned_to);
          assert.equal(res.body.open, expected.open);
          assert.equal(res.body.status_text, expected.status_text);
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Required fields filled in",
          assigned_to: "",
          status_text: ""
        })
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          const expected = {
            issue_title: "Title",
            issue_text: "text",
            created_by: "Functional Test - Required fields filled in",
            assigned_to: "",
            open: true,
            status_text: ""
          };
          assert.isOk(res.body._id);//
          assert.property(res.body, "created_on")
          assert.property(res.body, "updated_on")
          assert.equal(res.body.issue_title, expected.issue_title);
          assert.equal(res.body.issue_text, expected.issue_text);
          assert.equal(res.body.created_by, expected.created_by);
          assert.equal(res.body.assigned_to, expected.assigned_to);
          assert.equal(res.body.open, expected.open);
          assert.equal(res.body.status_text, expected.status_text);
          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "",
          assigned_to: "",
          status_text: ""
        })
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          assert.equal(res.text, "Missing required fields");
          done();
        });
    });

    suite("PUT /api/issues/{project} => text", function() {
      test("No body", function(done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: "",
            issue_title: "",
            issue_text: "",
            created_by: "",
            assigned_to: "",
            status_text: "",
           
          })
          .end(function(err, res) {
          
            if (err) {
            console.log("Expected failure to create issue to update: ")
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.text, "no updated field sent");
            done();
          });
      });

      test("One field to update", function(done) {
        // Create a minimum required entry in the DB to update
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Update one test",
            issue_text: "testing update of one field",
            created_by: "test suite"
          })
          // Save the id, update that entry and then check if it happened
          .end(function(err, res) {
            if (err) {
              console.log("failed to create issue to update: ")
              return done(err);
            }
            // Save the id
            const id_to_update = res.body._id;
          console.log("created issue to update (one): ", id_to_update)
            // Do update request with the id
            chai
              .request(server)
              .put("/api/issues/test")
              .send({
                _id: id_to_update,
                assigned_to: "a dev"
              })

              .end(function(err, res) {
                if (err) {
                  console.log('error from update request')
                  return done(err);
                }

                assert.equal(res.status, 200);
                assert.equal(res.text, "successfully updated");
                done();
              });
          });
      });

      test("Multiple fields to update", function(done) {
        // Create a minimum required entry in the DB to update
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Update multiple test",
            issue_text: "testing update of multiple fields",
            created_by: "test suite"
          })
          // Save the id, update that entry and then check if it happened
          .end(function(err, res) {
            

            if (err) {
              console.log("failed to create issue to update: ")
              return done(err);
            }
            // Save the id
            const id_to_update = res.body._id;
          console.log("Created issue to update (multi): ",res.body._id)
            // Do update request with the id
            chai
              .request(server)
              .put("/api/issues/test")
              .send({
                _id: id_to_update,
                assigned_to: "a dev",
                status_text: "waiting for feedback"
              })

              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                assert.equal(res.status, 200);
                assert.equal(res.text, "successfully updated");
                done();
              });
          });
      });
    });

    suite(
      "GET /api/issues/{project} => Array of objects with issue data",
      function() {
        test("No filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({})
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              done();
            });
        });

        test("One filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({ issue_title: "Title" }) // .query({name: 'foo', limit: 10}) // /search?name=foo&limit=10
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              const resultArray = res.body;
              // assertions
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              resultArray.forEach(result => {
                assert.equal(result.issue_title, "Title");
              });
              done();
            });
        });

        test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
          //  issue_title: "Title", issue_text: "text"
          chai
            .request(server)
            .get("/api/issues/test")
            .query({ issue_title: "Title", issue_text: "text" }) // .query({name: 'foo', limit: 10}) // /search?name=foo&limit=10
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              const resultArray = res.body;
              // assertions
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              resultArray.forEach(result => {
                assert.equal(result.issue_title, "Title");
              });
              resultArray.forEach(result => {
                assert.equal(result.issue_text, "text");
              });
              done();
            });
        });
      }
    );

    suite("DELETE /api/issues/{project} => text", function() {
      test("No _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({ _id: "" })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.text, "_id error");
            done();
          });
      });

      test("Valid _id", function(done) {
        // Create an entry in the DB to delete
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "deletion test",
            issue_text: "testing delete with a valid _id",
            created_by: "test suite"
          })
          // Save the id then Delete that entry and then check if it happened
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            // Save the id
            const id_to_delete = res.body._id;
            // Do delete request with the id
            chai
              .request(server)
              .delete("/api/issues/test")
              .send({_id: id_to_delete})
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.success, "deleted " + id_to_delete);
                done();
              });
          });
      });
    });
  });
});
