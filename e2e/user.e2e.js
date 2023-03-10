const request = require('supertest')
const createApp = require('./../src/app')
const { models } = require('./../src/db/sequelize')
const { upSeed, downSeed } = require('./utils/umzug')

describe('test for /users path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async () => {
        app = createApp()

        server = app.listen(9000)
        api = request(app)
        await upSeed()
    })

    describe('GET /users', () => {
        // tests for /users
        test('should return a user', async () => {
            // Arrage
            //const inputId = '1'
            const user = await models.User.findByPk('1')

            // Act
            const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`)

            // Assert
            expect(statusCode).toEqual(200)
            expect(body.id).toEqual(user.id)
            expect(body.email).toEqual(user.email)
        })
    })

    describe('POST /users', () => {
        // tests for /users
        test('should return a 400 Bad request with password invalid', async () => {
            // Arrange
            const inputData = {
                email: "nicolas@mail.com",
                password: "-----"
            }

            // Act
            const { statusCode, body } = await api.post('/api/v1/users').send(inputData)

            // Assert
            expect(statusCode).toBe(400)
            expect(body.message).toMatch(/password/)
        })

        test('should return a 400 Bad request with email invalid', async () => {
            const inputData = {
                email: "-----",
                password: "gfxkjhfte1234"
            }

            const { statusCode, body } = await api.post('/api/v1/users').send(inputData)
            expect(statusCode).toBe(400)
            expect(body.message).toMatch(/email/)
        })

        test('should return a new user', async () => {
            const inputData = {
                email: "pruebas@mail.com",
                password: "pruebas123"
            }

            const { statusCode, body } = await api.post('/api/v1/users').send(inputData)
            expect(statusCode).toBe(201)
            // check DB
            const user = await models.User.findByPk(body.id)
            expect(user).toBeTruthy()
            expect(user.role).toEqual('admin')
            expect(user.email).toEqual(inputData.email)
        })
    })

    describe('PUT /users', () => {
        // tests for /users
    })

    afterAll(async () => {
        await downSeed()
        server.close()
    })
})