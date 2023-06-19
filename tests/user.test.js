"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api = (0, supertest_1.default)(index_1.app);
const user = {
    email: "test@correo.com",
    password: "12345678"
};
const admin = {
    email: "admin@correo.com",
    password: "12345678"
};
let userToken = "";
let idUser = "";
let adminToken = "";
(0, mocha_1.before)(async () => {
    const token = await api.post("/api/auth/login").send(user);
    userToken = token.body.token;
    const tokenAdmin = await api.post("/api/auth/login").send(admin);
    adminToken = tokenAdmin.body.token;
});
describe("Users Tests", () => {
    it('GET - users are returned as json', done => {
        api.get("/api/user")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
    it("POST - new user", (done) => {
        const userData = {
            email: "testTDDUser@correo.com",
            username: "TestUser",
            password: "12345678",
            roles: ["user"]
        };
        api.post('/api/user/create')
            .send(userData)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, response) => {
            err && done(err);
            idUser = response.body._id;
            done();
        });
    });
    it("UPDATE - profile user", (done) => {
        const userData = {
            name: "UserSupertest",
            lastName: "TestUser",
            address: "direccion from test",
        };
        api.put('/api/user/update/profile')
            .set("Authorization", `Bearer ${userToken}`)
            .send(userData)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, response) => {
            err && done(err);
            done();
        });
    });
    it("DELETE - test user", done => {
        api.delete("/api/user/delete/" + idUser)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(201)
            .end(err => {
            err && done(err);
            done();
        });
    });
    it("DELETE - user does not exist", done => {
        api.delete("/api/user/delete/6443asdasdad")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(404)
            .end((err, res) => {
            (0, chai_1.expect)(res.body).to.deep.equal({
                message: "Usuario no encontrado"
            });
            done();
        });
    });
    it("DELETE - without admin token", done => {
        api.delete("/api/user/delete/" + idUser)
            .expect(401)
            .end((err, res) => {
            (0, chai_1.expect)(res.body).to.deep.equal({
                message: "No se proporciono un token de autorizacion"
            });
            done();
        });
    });
    it("Profile - respond with json containing a single profile", done => {
        api.get("/api/user/profile/")
            .set("Authorization", `Bearer ${userToken}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end(err => {
            err && done(err);
            done();
        });
    });
    it("Profile - respond with code 403 forbidden, invalid token", done => {
        api.get("/api/user/profile/")
            .set("Authorization", `Bearer ${userToken}badtoken`)
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(403);
            (0, chai_1.expect)(res.body).to.deep.equal({
                message: "Token de autenticacion no valido"
            });
            done();
        });
    });
});
//# sourceMappingURL=user.test.js.map