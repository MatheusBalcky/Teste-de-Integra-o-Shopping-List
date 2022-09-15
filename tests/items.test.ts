import { prisma } from '../src/database';
import supertest from 'supertest';
import app from '../src/app'

const itemExample = {
  title: 'iPhone',
  url: 'https://www.apple.com/br/iphone-14-pro/',
  description: 'Celular brabo',
  amount: 1400000
}

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});




describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async () =>{

    const result = await supertest(app).post("/items").send(itemExample);

    expect(result.status).toEqual(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () =>{
    
    await supertest(app).post("/items").send(itemExample);
    const resultConflict = await supertest(app).post("/items").send(itemExample);

    expect(resultConflict.status).toEqual(409);
  });

});

describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array', async () =>{
    const result = await supertest(app).get("/items");

    expect(result.status).toBe(200)
    expect(result.body).toBeInstanceOf(Array)
  });

});

describe('Testa GET /items/:id ', () => {

  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {

    const result = await supertest(app).post("/items").send(itemExample);
    const resultItemById = await supertest(app).get(`/items/${result.body.id}`);
    
    expect(resultItemById.status).toBe(200);
    expect(resultItemById.body).toEqual(result.body);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {

    const result = await supertest(app).get("/items/999999");
    
    expect(result.status).toBe(404);
  });

});






afterAll( async () => {
  await prisma.$disconnect();
});