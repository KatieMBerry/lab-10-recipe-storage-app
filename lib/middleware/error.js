// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(404);

  console.log(status);

  res.send({
    status: 404,
    message: err.message
  });
};
