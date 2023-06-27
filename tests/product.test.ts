import supertest from 'supertest';
import {app} from '../src/index'
import { expect } from 'chai';
import { before } from 'mocha';
import fs from 'fs'

// Lee la imagen y conviértela en una cadena base64
const imagePath = 'tests/img/durazno.jpg'; // Ruta real de la imagen en tu sistema
const imageBase64 = fs.readFileSync(imagePath);
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

let categoryId = "646ce64cbd017d078b5648fe";

let productId = "";


before(async() => {
    const token = await api.post("/api/auth/login").send(shop);
    shopToken = token.body.token;  
    
    const shopInfo = await api.get("/api/auth/revalidate").set("Authorization", `Bearer ${shopToken}`);
    shopObject = shopInfo.body;  
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

    it('GET-ERROR products by shop - shopid  incorrect format', done => {
        api.get("/api/product/shop/"+shopObject.uid.slice(0, -1))
        .set("Authorization", `Bearer ${shopObject.token}`)
        .set("Accept", "application/json")
        .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.deep.equal({
                message: "Id del comercio incorrecto"
            });
            done();
        })
    });

    it('GET search product - products are returned as json', done => {
        api.get("/api/product/search?q=oreo")
        .set("Authorization", `Bearer ${shopObject.token}`)
        .set("Accept", "application/json")
        .expect("Content-Type",/json/)
        .expect(200, done);
    });

    it("POST new product - return de object created" , (done) => {
        
        api.post("/api/product/create")
            .field("title","testProduct")
            .field("description","test product test")
            .field("price", "2000")
            .field("stock", "2000")
            .field("shop", shopObject.uid)
            .attach("image", imagePath)
            .field("category", categoryId)
            .set("Content-Type",'multipart/form-data')
            .set("Authorization", `Bearer ${shopObject.token}`)
            .expect("Content-Type",/json/)
            .end((err, response) => {
                err && done(err);
                productId = response.body._id;
                done();
            })
        
    })

    it("PUT  test product - return de object updated" , (done) => {
        
        api.put("/api/product/update/"+productId)
            .field("title","testProduct2")
            .field("description","test product test")
            .field("price", "2000")
            .field("stock", "2000")
            .field("shop", shopObject.uid)
            .field("category", categoryId)
            .set("Content-Type",'multipart/form-data')
            .set("Authorization", `Bearer ${shopObject.token}`)
            .expect("Content-Type",/json/)
            .expect(201)
            .end((err, response) => {
                err && done(err);
                productId = response.body._id;
                done();
            })
    })

    it("PUT-ERROR test product - return error category format incorret" , (done) => {
        
        const incorrectCategory  = categoryId + "error"
        api.put("/api/product/update/"+productId)
            .field("title","testProduct2")
            .field("description","test product test")
            .field("price", "2000")
            .field("stock", "2000")
            .field("shop", shopObject.uid)
            .field("category", incorrectCategory)
            .set("Content-Type",'multipart/form-data')
            .set("Authorization", `Bearer ${shopObject.token}`)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.deep.equal({
                    message: `id: ${incorrectCategory} formato incorrecto`
                });
                done();
            })
    })

    it("PUT-ERROR test product - return error category id not found" , (done) => {
        const incorrectCategory = "646ce64cbd017d078b5648fa"
        api.put("/api/product/update/"+productId)
            .field("title","testProduct2")
            .field("description","test product test")
            .field("price", "2000")
            .field("stock", "2000")
            .field("shop", shopObject.uid)
            .field("category", incorrectCategory)
            .set("Content-Type",'multipart/form-data')
            .set("Authorization", `Bearer ${shopObject.token}`)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.deep.equal({
                    message: `Categoria con el id: ${incorrectCategory} no encontrado`
                });
                done();
            })
    })
    it("DELETE - test Product" , done => {
        api.delete(`/api/product/delete/${productId}`)
            .set("Authorization", `Bearer ${shopToken}`)
            .expect(200)
            .end(err => {
                err && done(err);
                done();
            })
    })


    it("PUT-ERROR test product - return error product not found" , (done) => {
        
        api.put("/api/product/update/"+productId)
            .field("title","testProduct2")
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
                    message: "Producto no encontrado"
                });
                done();
            })
    })



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

