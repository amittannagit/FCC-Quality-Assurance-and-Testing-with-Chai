const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require("chai-http");
const server = require("../server"); // Import the Express app
const Browser = require("zombie"); // Import Zombie.js

chai.use(chaiHttp); // Use the chai-http plugin

// Set the base URL for Zombie.js browser
Browser.site = "http://0.0.0.0:3000"; // Update with your project URL

suite("Functional Tests", function() {
  // Increase timeout for asynchronous operations
  this.timeout(5000);

  suite("Integration tests with chai-http", function() {
    test("GET /hello with no name", function(done) {
      chai.request(server)
        .get("/hello")
        .end(function(err, res) {
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.text, "hello Guest", 'response should be "hello Guest"');
          done();
        });
    });

    test("GET /hello with your name", function(done) {
      chai.request(server)
        .get("/hello?name=xy_z") // Replace 'xy_z' with your name
        .end(function(err, res) {
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.text, "hello xy_z", 'response should be "hello xy_z"'); // Replace 'xy_z' with your name
          done();
        });
    });

    test('PUT /travellers with surname "Colombo"', function(done) {
      chai.request(server)
        .put("/travellers")
        .send({ surname: "Colombo" })
        .end(function(err, res) {
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.type, "application/json", "Response should be json");
          assert.equal(res.body.name, "Cristoforo", 'res.body.name should be "Cristoforo"');
          assert.equal(res.body.surname, "Colombo", 'res.body.surname should be "Colombo"');
          done();
        });
    });

    test('PUT /travellers with surname "da Verrazzano"', function(done) {
      chai.request(server)
        .put("/travellers")
        .send({ surname: "da Verrazzano" })
        .end(function(err, res) {
          assert.equal(res.status, 200, "response status should be 200");
          assert.equal(res.type, "application/json", "Response should be json");
          assert.equal(res.body.name, "Giovanni", 'res.body.name should be "Giovanni"');
          assert.equal(res.body.surname, "da Verrazzano", 'res.body.surname should be "da Verrazzano"');
          done();
        });
    });
  });

  suite("e2e Testing with Zombie.js", function() {
    const browser = new Browser();

    // Setup to visit the initial page before running tests
    suiteSetup(function(done) {
      browser.visit("/", done); // Correctly pass done
    });

    // Test form submission with surname "Polo"
    test('submit "surname" : "Polo"', function(done) {
      browser.fill("surname", "Polo").then(() => {
        browser.pressButton("submit").then(() => {
          browser.assert.success(); // Check if the request was successful (status 200)
          browser.assert.text("span#name", "Marco"); // Check the name
          browser.assert.text("span#surname", "Polo"); // Check the surname
          browser.assert.elements("span#dates", 1); // Check that there is one element with id "dates"
          done();
        }).catch(done);
      }).catch(done);
    });

    // Test form submission with surname "Colombo"
    test('submit "surname" : "Colombo"', function(done) {
      browser.fill("surname", "Colombo").then(() => {
        browser.pressButton("submit").then(() => {
          browser.assert.success(); // Check if the request was successful (status 200)
          browser.assert.text("span#name", "Cristoforo"); // Check the name
          browser.assert.text("span#surname", "Colombo"); // Check the surname
          browser.assert.elements("span#dates", 1); // Check that there is one element with id "dates"
          done();
        }).catch(done);
      }).catch(done);
    });

    // Test form submission with surname "Vespucci"
    test('submit "surname" : "Vespucci"', function(done) {
      browser.fill("surname", "Vespucci").then(() => {
        browser.pressButton("submit").then(() => {
          browser.assert.success(); // Check if the request was successful (status 200)
          browser.assert.text("span#name", "Amerigo"); // Check the name
          browser.assert.text("span#surname", "Vespucci"); // Check the surname
          browser.assert.elements("span#dates", 1); // Check that there is one element with id "dates"
          done();
        }).catch(done);
      }).catch(done);
    });
  });
});
