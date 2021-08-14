import request from "supertest";
import server from "../src/server";

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(server).get("/reset")
            .expect(404, done);
    });
});
