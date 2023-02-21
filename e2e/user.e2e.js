const request = require('supertest')
const createApp = require('./../src/app')

describe('test for /users path', () => {

    let app = null
    let server = null
    let api = null

    beforeEach(() => {
        app = createApp()

        server = app.listen(9000)
        api = request(app)
    })

    describe('GET /users', () => {
        // tests for /users
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
    })

    describe('PUT /users', () => {
        // tests for /users
    })

    afterEach(() => {
        server.close()
    })
})