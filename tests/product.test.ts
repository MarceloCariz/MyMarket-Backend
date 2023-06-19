import supertest from 'supertest';
import {app, server} from '../src/index'
import { expect } from 'chai';
import { before } from 'mocha';

const api = supertest(app);

const shop = {
    email:"shop@correo.com",
    password: "12345678"
}

const admin = {
    email:"admin@correo.com",
    password: "12345678"
}

let shopToken = "";
let shopObject = {
    uid: "",
    username: "",
    roles: "",
    token: ""
}
let idUser = "";
let adminToken = "";
let categoryId = "646ce64cbd017d078b5648fe";


before(async() => {
    const token = await api.post("/api/auth/login").send(shop);
    shopToken = token.body.token;  
    const shopInfo = await api.get("/api/auth/revalidate").set("Authorization", `Bearer ${shopToken}`);
    shopObject = shopInfo.body;  
    const tokenAdmin = await api.post("/api/auth/login").send(admin);
    adminToken = tokenAdmin.body.token;  
});

describe("Products Tests", () => {
    
    it('GET all products - products are returned as json', done => {
        api.get("/api/product/all")
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    });


    it('GET products by shop - products are returned as json', done => {
        api.get("/api/product/shop/"+shopObject.uid)
        .set("Authorization", `Bearer ${shopObject.token}`)
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    });

    it('GET search product - products are returned as json', done => {
        api.get("/api/product/search?q=oreo")
        .set("Authorization", `Bearer ${shopObject.token}`)
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    });


    it("POST new product - return error, empty image field" , (done) => {
        
        api.post("/api/product/create")
            .field("title","testProduct")
            .field("description","test product test")
            .field("price", "2000")
            .field("stock", "2000")
            .field("shop", shopObject.uid)
            .field("category", categoryId)
            .set("Content-Type",'multipart/form-data')
            .set("Authorization", `Bearer ${shopObject.token}`)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.deep.equal({
                    message: "Imagen no encontrada"
                });
                done();
            })
        
    })
})

