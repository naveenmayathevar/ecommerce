jest.mock('../models/user');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

process.env.JWT_SECRET = 'testsecret';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('protect middleware', () => {
  test('returns 401 when no token is provided', async () => {
    const req = { headers: {} };
    const res = mockRes();
    await protect(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
  });

  test('returns 401 when token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = mockRes();
    await protect(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('calls next() and sets req.user when token is valid', async () => {
    const fakeUser = { _id: 'abc', name: 'Test User' };
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser)
    });
    const token = jwt.sign({ id: 'abc' }, 'testsecret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(fakeUser);
  });
});