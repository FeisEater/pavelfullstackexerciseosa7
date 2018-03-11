const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb } = require('./test_helper')

beforeAll(async () => {
  await User.remove({})

  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('POST', async () => {
    test('a valid user can be added ', async () => {
        const usersInDatabase = await usersInDb()
        const newUser = {
            username: "newuser",
            name: "New User",
            adult: false,
            password: "password"
        }
      
        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        const usersAfter = await usersInDb()
        expect(usersAfter.length).toBe(usersInDatabase.length + 1)
        expect(usersAfter).toContainEqual({
            username: "newuser",
            name: "New User",
            adult: false
        })
    })
      
    test('cant add new user with existing username', async () => {
        const usersInDatabase = await usersInDb()
        const newUser = {
            username: usersInDatabase[0].username,
            name: "New User2",
            adult: false,
            password: "password"
        }
      
        await api
          .post('/api/users')
          .send(newUser)
          .expect(400, {
              error: 'username must be unique'
          })
          .expect('Content-Type', /application\/json/)
      
        const usersAfter = await usersInDb()
        expect(usersAfter.length).toBe(usersInDatabase.length)
        expect(usersAfter).not.toContainEqual({
            username: usersInDatabase[0].username,
            name: "New User2",
            adult: false
        })
    })
    
    test('cant add user if short password', async () => {
        const usersInDatabase = await usersInDb()
        const newUser = {
            username: "newuser3",
            name: "New Us3r",
            adult: false,
            password: "a"
        }
      
        await api
          .post('/api/users')
          .send(newUser)
          .expect(400, {
              error: 'password must be at least 3 characters long'
          })
          .expect('Content-Type', /application\/json/)
  
        const usersAfter = await usersInDb()
        expect(usersAfter.length).toBe(usersInDatabase.length)
        expect(usersAfter).not.toContainEqual({
            username: "newuser3",
            name: "New Us3r",
            adult: false,
            blogs: []
        })
    })
    
    test('user with no adult field is adult by default', async () => {
        const usersInDatabase = await usersInDb()
        const newUser = {
            username: "newuser4",
            name: "New User4",
            password: "password"
        }
      
        await api
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        const usersAfter = await usersInDb()
        expect(usersAfter.length).toBe(usersInDatabase.length + 1)
        expect(usersAfter).toContainEqual({
            username: "newuser4",
            name: "New User4",
            adult: true
        })
    })
})

afterAll(() => {
  server.close()
})
