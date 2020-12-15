// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 404;

  res.status(404);

  console.log(err);

  res.send({
    status,
    message: err.message
  });
};
