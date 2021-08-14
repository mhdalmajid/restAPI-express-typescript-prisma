import request from "supertest";
import server from "../src/server";
import { expect} from "chai";

describe("GET /contact", () => {
    it("should return 200 OK", (done) => {
        request(server).get("/contact")
            .expect(200, done);
    });
});


// describe("POST /contact", () => {
//     it("should return false from assert when no message is found", (done) => {
//         request(server).post("/contact")
//             .field("name", "John Doe")
//             .field("email", "john@me.com")
//             .end(function(err, res) {
//                 expect(res.error).to.be.false;
//                 done();
//             })
//             .expect(302);

//     });
// });