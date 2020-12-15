module.exports = (req, res, next) => {

  const err = new Error('Not found');
  console.log(err);
  res.status(err.status);

  err.status = 404;
  next(err);
};
