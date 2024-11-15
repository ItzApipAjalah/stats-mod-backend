const tokenAuth = (req, res, next) => {
  const token = req.headers['x-api-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API token is required'
    });
  }

  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API token'
    });
  }

  next();
};

module.exports = tokenAuth; 