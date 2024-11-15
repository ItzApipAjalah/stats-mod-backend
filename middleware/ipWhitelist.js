const whitelist = [
  '127.0.0.1',
  'localhost',
  '::1',
  '76.76.21.9',
  '76.76.21.22',
  '185.128.227.192'
];

const ipWhitelist = (req, res, next) => {
  let clientIp = req.ip || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress || 
                 req.connection.socket.remoteAddress;

  clientIp = clientIp.replace(/^::ffff:/, '');

  if (clientIp === '::1' || clientIp === 'localhost' || clientIp === '127.0.0.1') {
    return next();
  }

  if (whitelist.includes(clientIp)) {
    return next();
  }

  try {
    const hostname = require('dns').lookupSync('gda.luckystore.id').address;
    if (clientIp === hostname) {
      return next();
    }
  } catch (error) {
    console.error('DNS lookup error:', error);
  }

  return res.status(403).json({
    error: 'Access denied',
    message: 'Your IP address is not whitelisted'
  });
};

module.exports = ipWhitelist; 