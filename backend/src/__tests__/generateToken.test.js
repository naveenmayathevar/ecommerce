const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

process.env.JWT_SECRET = 'testsecret';

describe('generateToken', () => {
  test('returns a string', () => {
    const token = generateToken('user123');
    expect(typeof token).toBe('string');
  });

  test('contains the user id in payload', () => {
    const token = generateToken('user123');
    const decoded = jwt.verify(token, 'testsecret');
    expect(decoded.id).toBe('user123');
  });

  test('expires in 30 days', () => {
    const token = generateToken('user123');
    const decoded = jwt.verify(token, 'testsecret');
    const diff = decoded.exp - decoded.iat;
    expect(diff).toBe(30 * 24 * 60 * 60);
  });
});