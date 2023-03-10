const request = require('supertest')
const createApp = require('./../src/app')
const { models } = require('./../src/db/sequelize')
const { upSeed, downSeed } = require('./utils/umzug')

describe('test for /auth path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async () => {
        app = createApp()

        server = app.listen(9000)
        api = request(app)
        await upSeed()
    })

    describe('POST /login', () => {
        test('should return a 401', async () => {
            const inputData = {
                email: "emailfake@gmail.com",
                password: "gfxkjhfte1234"
            }

            const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData)
            expect(statusCode).toBe(401)
        })

        test('should return a 200', async () => {
            const user = await models.User.findByPk('1')
            const inputData = {
                email: user.email,
                password: "admin123"
            }

            const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData)
            expect(statusCode).toBe(200)
            expect(body.access_token).toBeTruthy()
            expect(body.user.email).toEqual(user.email)
        })
    })

    afterAll(async () => {
        await downSeed()
        server.close()
    })
})