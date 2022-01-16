const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("balance", () => {
  context("/deposit/:userId", () => {
    it("should fail to deposit money into the account given a non numeric value as amount", () => {
      chai
        .request(app)
        .post("/balances/deposit/2")
        .send({ amount: "asdr" })
        .set("profile_id", 2)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message)
            .to.have.property("errors")
            .and.to.be.an("array")
            .and.length.to.be.greaterThan(0);
        });
    });

    it("should deposit money into the client's account/balance when given a valid amount", () => {
      const baseAmount = 231.11;

      chai
        .request(app)
        .post("/balances/deposit/2")
        .send({ amount: 50 })
        .set("profile_id", 2)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.balance).to.be.equal(baseAmount + 50);
        });
    });
  });
});
