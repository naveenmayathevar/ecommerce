const getTestMessage = (req, res) => {
  res.json({ message: 'Test da works ✅' });
};

module.exports = { getTestMessage};
