const request = require('supertest')
const { app } = require('../server');
const { store } = require('../services/spot-service')
const { connect, getUri, closeDb } = require('../db')

const baseSpot = { name: '1', available: false }

beforeAll(async () => {
    const uri = await getUri()
    await connect({ uri })
})

afterAll(async () => {
    await closeDb()
})

describe('POST /spots', () => {
    test('should store a new spot', async () => {
        const response = await request(app)
          .post('/spots')
          .send(baseSpot)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
      
        expect(response.body).toEqual({
          ...baseSpot,
          _id: '1',
        })
      })
    test('should store a new spot', async () => {
        const response = await request(app)
        .post('/spots')
        .send(baseSpot)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)

        const { _id, ...spotStored } = response.body

        expect(spotStored).toEqual(baseSpot)
        expect(_id).toBeTruthy()
    })
})
