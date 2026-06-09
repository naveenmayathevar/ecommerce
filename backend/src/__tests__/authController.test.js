jest.mock('../models/user');
const User = require('../models/user');
const { registerUser, loginUser } = require('../controllers/authController');

process.env.JWT_SECRET = 'testsecret';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
describe('registerUser', () => {
  test('returns 400 if fields are missing', async () => {
    const req = { body: { name: 'Alice' } };
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please fill all fields' });
  });

  test('returns 400 if user already exists', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'a@b.com' });
    const req = { body: { name: 'Alice', email: 'a@b.com', password: '123' } };
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  test('returns 201 on successful registration', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue({
      _id: '1', name: 'Alice', email: 'a@b.com'
    });
    const req = { body: { name: 'Alice', email: 'a@b.com', password: '123' } };
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('loginUser', () => {
  test('returns 401 with wrong credentials', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'wrong' } };
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('returns user and token on valid login', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: '1', name: 'Alice', email: 'a@b.com', isAdmin: false,
      matchPassword: jest.fn().mockResolvedValue(true)
    });
    const req = { body: { email: 'a@b.com', password: '123' } };
    const res = mockRes();
    await loginUser(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
  });
});