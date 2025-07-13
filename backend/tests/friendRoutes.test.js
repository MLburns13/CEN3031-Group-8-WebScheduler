require('dotenv').config({ path: '.env.test' });
const request = require('supertest')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const app = require('../server') // if your express app is exported separately
const { User } = require('../models')

// Setup mock server and DB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
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

let userA, userB

beforeEach(async () => {
  await User.deleteMany({})

  userA = await User.create({
    email: 'a@test.com',
    password: 'hashedpassword',
    username: 'usera',
    display_name: 'User A'
  })

  userB = await User.create({
    email: 'b@test.com',
    password: 'hashedpassword',
    username: 'userb',
    display_name: 'User B'
  })
})

test('send friend request successfully', async () => {
  const res = await request(app)
    .post('/api/friends/request')
    .send({ fromUserId: userA._id, toUserId: userB._id })

  expect(res.statusCode).toBe(200)
  expect(res.body.msg).toBe('Friend request sent.')

  const updatedB = await User.findById(userB._id)
  expect(updatedB.friendRequests).toContainEqual(userA._id)
})

test('accept friend request', async () => {
  // simulate friend request
  userB.friendRequests.push(userA._id)
  await userB.save()

  const res = await request(app)
    .post('/api/friends/accept')
    .send({ userId: userB._id, requesterId: userA._id })

  expect(res.statusCode).toBe(200)
  expect(res.body.msg).toBe('Friend request accepted')

  const updatedA = await User.findById(userA._id)
  const updatedB = await User.findById(userB._id)

  expect(updatedA.friendsList).toContainEqual(userB._id)
  expect(updatedB.friendsList).toContainEqual(userA._id)
})
