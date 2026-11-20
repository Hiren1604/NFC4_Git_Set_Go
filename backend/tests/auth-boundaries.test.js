const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
jest.mock('../models/User', () => ({ findOne: jest.fn(), create: jest.fn(), findById: jest.fn() }));
const User = require('../models/User');
const { readConfig } = require('../config/env');
const { generateToken, protect } = require('../middleware/auth');
const app = express();
app.use(express.json());
app.use('/auth', require('../routes/auth'));
app.get('/protected', protect, (req, res) => res.json({ id: req.user._id }));
const originalSecret = process.env.JWT_SECRET;
beforeEach(() => { jest.clearAllMocks(); process.env.JWT_SECRET = 'test-only-secret-'.repeat(4); });
afterAll(() => { if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret; });
test('rejects public admin registration before database access', async () => {
  const response = await request(app).post('/auth/register').send({ name: 'Example Admin', email: 'admin@example.com', password: 'test-password', phone: '1234567890', role: 'admin' });
  expect(response.status).toBe(400);
  expect(User.findOne).not.toHaveBeenCalled();
  expect(User.create).not.toHaveBeenCalled();
});
test('configuration has no database or signing-secret fallback', () => {
  expect(() => readConfig({})).toThrow('MONGODB_URI');
  expect(() => readConfig({ MONGODB_URI: 'mongodb://localhost/test' })).toThrow('JWT_SECRET');
  expect(() => readConfig({ MONGODB_URI: 'mongodb://localhost/test', JWT_SECRET: 'x'.repeat(32), PORT: '0' })).toThrow('PORT');
});
test('signs with the configured secret and fails without it', () => {
  const token = generateToken('user-123');
  expect(jwt.verify(token, process.env.JWT_SECRET).id).toBe('user-123');
  delete process.env.JWT_SECRET;
  expect(() => generateToken('user-123')).toThrow('JWT_SECRET');
});
test('rejects missing and fabricated tokens without querying users', async () => {
  expect((await request(app).get('/protected')).status).toBe(401);
  expect((await request(app).get('/protected').set('Authorization', 'Bearer demo-token')).status).toBe(401);
  expect(User.findById).not.toHaveBeenCalled();
});
test('rejects deactivated accounts with otherwise valid tokens', async () => {
  User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ isActive: false }) });
  const response = await request(app).get('/protected').set('Authorization', `Bearer ${generateToken('user-123')}`);
  expect(response.status).toBe(401);
});
