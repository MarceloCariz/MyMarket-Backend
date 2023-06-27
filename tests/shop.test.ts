import supertest from 'supertest';
import {app} from '../src/index'



const api = supertest(app);


describe("SHOPS Tests", () => {
    it("GET - shops are returned in json", done => {
        api.get("/api/shop/")
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    })
})