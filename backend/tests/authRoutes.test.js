require('dotenv').config({ path: '.env' });
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const { User } = require('../models')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

afterAll(async () => {
  // remove all users we created
  await User.deleteMany({})
  // close mongoose
  await mongoose.connection.close()
})


beforeEach(async () => {
  await User.deleteMany({})
})

test('Sign up a new user successfully', async () => {
  const res = await request(app)
    .post('/signup')
    .send({
      email: 'testuser@example.com',
      password: 'testpass123',
      display_name: 'Test User',
      username: 'testuser'
    })

  expect(res.statusCode).toBe(201)

  const user = await User.findOne({ email: 'testuser@example.com' })
  expect(user).toBeTruthy()
  expect(user.username).toBe('testuser')
})

test('Login succeeds with correct credentials', async () => {
  // Manually create a user with hashed password
  const bcrypt = require('bcrypt')
  const hashed = await bcrypt.hash('secret123', 10)
  await User.create({
    email: 'login@test.com',
    password: hashed,
    username: 'loginuser',
    display_name: 'Login User'
  })

  const res = await request(app)
    .post('/login')
    .send({ email: 'login@test.com', password: 'secret123' })

  expect(res.statusCode).toBe(200)
})

test('Login fails with incorrect password', async () => {
  const bcrypt = require('bcrypt')
  const hashed = await bcrypt.hash('correctpass', 10)
  await User.create({
    email: 'fail@test.com',
    password: hashed,
    username: 'failuser',
    display_name: 'Fail User'
  })

  const res = await request(app)
    .post('/login')
    .send({ email: 'fail@test.com', password: 'wrongpass' })

  expect(res.statusCode).toBe(401)
  expect(res.body.message).toBe('Incorrect password')
})
