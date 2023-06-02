import supertest from 'supertest';
import {app, server} from '../src/index'
import { expect } from 'chai';

const api = supertest(app);

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDc2MDdlMmMwYWVjZTY1MjgyYjU1ZTAiLCJ1c2VybmFtZSI6IlRlc3RVc2VyIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE2ODU3MTUxMjUsImV4cCI6MTY4NTcyOTUyNX0.JxV5JbOoAHieaVyyax1Dm4wK6-Y2-ycl1K4lBqzaOjo"

describe("Users Tests", () => {

    it('users are returned as json', done => {
        api.get("/api/user")
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    });

    it("POST - new user" , done => {
        const userData = {
            email: "testTDDUser@correo.com",
            username: "TestUser",
            password: "12345678",
            roles: ["user"]
        }

        api.post('/api/user/create')
        .send(userData)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .end(err => {
            err && done(err);
            done();
        })
    })

    it("Profile - respond with json containing a single profile", done => {
        api.get("/api/user/profile/")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type",/json/)
        .expect(200)
        .end(err => {
            err && done(err);
            done();
        })
    })

    it("Profile - respond with code 403 forbidden, invalid token", done => {
        api.get("/api/user/profile/")
        .set("Authorization", `Bearer ${token}badtoken`)
        .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.deep.equal({
                message: "Token de autenticacion no valido"
            });
            done();
        })
    })
})



// afterAll(() => {
//     server.close();
// })