const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("admin", () => {
  context("best-profession", () => {
    it("should fail to find the best profession given invalid date", () => {
      chai
        .request(app)
        .get("/admin/best-profession?start=abce&end=2020-10-15")
        .set("profile_id", 7)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message)
            .to.have.property("errors")
            .and.to.be.an("array");
        });
    });

    it("should retrieve the best profession that earned the most money in the query time range", () => {
      chai
        .request(app)
        .get("/admin/best-profession?start=2020-08-15&end=2020-10-15")
        .set("profile_id", 7)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property("name")
            .and.to.be.equal("Programmer");
          expect(res.body).to.have.property("price");
        });
    });
  });

  context("best-clients", () => {
    it("should fail to find the best clients given start date greater than end date", () => {
      chai
        .request(app)
        .get("/admin/best-clients?start=2020-08-15&end=2020-08-10")
        .set("profile_id", 5)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message)
            .to.have.property("errors")
            .and.to.be.an("array");
        });
    });

    it("should retrieve the best clients that paid the most money in the query time range", () => {
      chai
        .request(app)
        .get("/admin/best-clients?start=2020-08-15&end=2020-10-15")
        .set("profile_id", 5)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.to.be.greaterThan(0);
        });
    });
  });
});
