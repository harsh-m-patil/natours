module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // called as next(err)
};
