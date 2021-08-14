import request from "supertest";
import server from "../src/server";
import { expect } from "chai";

describe("GET /login", () => {
    it("should return 200 OK", () => {
        return request(server).get("/login")
            .expect(200);
    });
});


describe("GET /forgot", () => {
    it("should return 200 OK", () => {
        return request(server).get("/forgot")
            .expect(200);
    });
});

describe("GET /signup", () => {
    it("should return 200 OK", () => {
        return request(server).get("/signup")
            .expect(200);
    });
});

describe("GET /reset", () => {
    it("should return 302 Found for redirection", () => {
        return request(server).get("/reset/1")
            .expect(302);
    });
});

describe("POST /login", () => {
    it("should return some defined error message with valid parameters", (done) => {
        return request(server).post("/login")
            .field("email", "john@me.com")
            .field("password", "Hunter2")
            .expect(302)
            .end(function(err, res) {
                expect(res.error).not.to.be.undefined;
                done();
            });

    });
});
