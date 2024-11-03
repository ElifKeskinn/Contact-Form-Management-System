const request = require('supertest');
const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const app = require('../mongoDb.js'); 

jest.mock('mongodb');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
  verify: jest.fn(() => ({ userId: 'mockedUserId' })),
}));

describe('API Tests', () => {
  let mockCollection;
  let mockDb;
  let mockClient;

  beforeAll(() => {
    // Mock MongoClient and collection
    mockCollection = { 
      find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
      insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
      findOne: jest.fn().mockResolvedValue(null),
      findOneAndUpdate: jest.fn().mockResolvedValue({ value: {} }),
      findOneAndDelete: jest.fn().mockResolvedValue({ value: {} })
    };
    mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
    mockClient = { db: jest.fn().mockReturnValue(mockDb), connect: jest.fn(), close: jest.fn() };

    MongoClient.connect.mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('GET /api/greeting should return greeting message', async () => {
    const response = await request(app).get('/api/greeting').query({ name: 'Elif' });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Elif!');
  });

  test('POST /api/user/login should return token and user info', async () => {
    mockCollection.findOne.mockResolvedValue({ _id: new ObjectId(), username: 'test', password: 'password' });
    const response = await request(app)
      .post('/api/user/login')
      .send({ username: 'test', password: 'password' });

      expect(response.status).toBe(200);

      expect(response.body.data.token).toBe('mockedToken');
      });

  test('GET /api/user/test should fetch users', async () => {
    mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ username: 'test' }]) });
    const response = await request(app).get('/api/user/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: [{ username: 'test' }] });
  });

  // Diğer endpoint testleri eklenecek
});
