const whitelist = [
  '127.0.0.1',
  'localhost',
  '::1',
  '76.76.21.9',
  '76.76.21.22',
  '185.128.227.192'
];

const ipWhitelist = (req, res, next) => {
  let clientIp = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress;

  if (Array.isArray(clientIp)) {
    clientIp = clientIp[0];
  }

  if (typeof clientIp === 'string') {
    clientIp = clientIp.split(',')[0].trim();
  }

  clientIp = clientIp.replace(/^::ffff:/, '');

  console.log('Client IP:', clientIp);

  if (clientIp === '::1' || clientIp === 'localhost' || clientIp === '127.0.0.1') {
    return next();
  }

  if (whitelist.includes(clientIp)) {
    return next();
  }

  try {
    const dns = require('dns');
    dns.lookup('gda.luckystore.id', (err, address) => {
      if (!err && clientIp === address) {
        return next();
      }
    });
  } catch (error) {
    console.error('DNS lookup error:', error);
  }

  return res.status(403).json({
    error: 'Access denied',
    message: 'Your IP address is not whitelisted',
    ip: clientIp
  });
};

module.exports = ipWhitelist; 