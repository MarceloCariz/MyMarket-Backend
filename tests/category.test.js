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
const admin = {
    email: "admin@correo.com",
    password: "12345678"
};
let adminToken = "";
let categoryId = "";
(0, mocha_1.before)(async () => {
    const tokenAdmin = await api.post("/api/auth/login").send(admin);
    adminToken = tokenAdmin.body.token;
});
describe("Category Tests", () => {
    it('GET all categories - return a json with all categories', done => {
        api.get("/api/category")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
    it("POST - new category", (done) => {
        const categoryData = {
            categoryName: "categoryTest"
        };
        api.post('/api/category/create')
            .send(categoryData)
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .end((err, response) => {
            err && done(err);
            categoryId = response.body._id;
            done();
        });
    });
    it("POST - Validate category exist and return error message", (done) => {
        const categoryData = {
            categoryName: "categoryTest"
        };
        api.post('/api/category/create')
            .send(categoryData)
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .end((err, res) => {
            (0, chai_1.expect)(res.body).to.deep.equal({
                message: "La categoría ya existe"
            });
            done();
        });
    });
    it("POST - Validate is categoryName is empty and return error message 'not found categoryName'", (done) => {
        const categoryData = {
        // categoryName: ""
        };
        api.post('/api/category/create')
            .send(categoryData)
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .end((err, res) => {
            (0, chai_1.expect)(res.body).to.deep.equal([
                {
                    field: [
                        "body",
                        "categoryName"
                    ],
                    message: "Required"
                }
            ]);
            done();
        });
    });
    it("UPDATE - category name", (done) => {
        const newData = {
            categoryName: "TestCategory"
        };
        api.put(`/api/category/update/${categoryId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newData)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, response) => {
            err && done(err);
            done();
        });
    });
    it("DELETE - test category", done => {
        api.delete(`/api/category/delete/${categoryId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(201)
            .end(err => {
            err && done(err);
            done();
        });
    });
    it("DELETE - category does not exist return error message", done => {
        api.delete(`/api/category/delete/648345sdddw2`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(404)
            .end((err, res) => {
            (0, chai_1.expect)(res.body).to.deep.equal({
                message: "La categoría no existe"
            });
            done();
        });
    });
});
//# sourceMappingURL=category.test.js.map