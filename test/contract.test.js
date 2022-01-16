const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("contracts", () => {
  context("/", () => {
    it("should retrieve a list of non terminated contracts", () => {
      chai
        .request(app)
        .get("/contracts")
        .set("profile_id", 7)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array").to.have.length.greaterThan(0);
          expect(res.body[0]).to.contain.keys("id", "terms", "status");
          expect(res.body[0].status).to.not.be.equal("terminated");
        });
    });

    context("/:id", () => {
      it("should retrieve a user's contract (profile calling) given a valid contract id", () => {
        chai
          .request(app)
          .get("/contracts/3")
          .set("profile_id", 2)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body)
              .to.contain.keys("id", "terms", "status")
              .to.have.property("status")
              .and.to.be.equal("in_progress");
          });
      });
    });
  });
});
