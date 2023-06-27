import supertest from 'supertest';
import {app} from '../src/index';
import { expect } from 'chai';


const api = supertest(app);


describe("AUTH Tests", () => {
    it("POST-ERROR - email or password incorrect", done => {
        const loginData = {
            email: "shop@correo.com",
            password: "1232454254"
        }
        api.post("/api/auth/login/")
        .send(loginData)
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.deep.equal({
                message: "Email o contraseña incorrecto"
            });
            done();
        })
    })
})




