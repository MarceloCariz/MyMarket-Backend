import supertest from 'supertest';
import {app, server} from '../src/index'
import { expect } from 'chai';

const api = supertest(app);

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDZiN2UyMDljZjU1ZmI4NDliYWJjZTciLCJ1c2VybmFtZSI6Ik1hcmNlbG8iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTY4NTM3NDM3NCwiZXhwIjoxNjg1Mzg4Nzc0fQ.eff8O8Kfaky-WWGa8cLddOE6cZeFOdeWnKKxN-mMI-4"

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