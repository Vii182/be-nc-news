
const handleCustomErrors = ((err, req, res, next) => {
    if (err.status){
      return res.status(err.status).send({ msg: err.msg });
    }
    next(err)
  });

const handle404Errors = (err, req, res, next) => {
    res.status(404).send({ msg: 'Route not found' });
};

const handle500Errors = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ msg: 'Internal server error' });
};

module.exports = { handleCustomErrors, handle404Errors, handle500Errors };