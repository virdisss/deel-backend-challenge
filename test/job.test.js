const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("jobs", () => {
  context("unpaid", () => {
    it("should retrieve all unpaid jobs for a client/contractor with active contracts", () => {
      chai
        .request(app)
        .get("/jobs/unpaid")
        .set("profile_id", 1)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.contain.keys(
            "paid",
            "paymentDate",
            "Contract"
          );
        });
    });
  });

  context("/:job_id/pay", () => {
    it("should process a client payment to a contractor", () => {
      chai
        .request(app)
        .post("/jobs/2/pay")
        .set("profile_id", 1)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.contain.keys("paid", "paymentDate", "Contract");
          expect(res.body.paid).to.be.true;
        });
    });
  });
});
