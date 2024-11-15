const whitelist = [
  '127.0.0.1',
  'localhost',
  '::1',
  '76.76.21.9',
  '76.76.21.22',
  '185.128.227.192'
];

const ipWhitelist = async (req, res, next) => {
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

  const origin = req.headers.origin || req.headers.referer;
  console.log('Client IP:', clientIp);
  console.log('Origin:', origin);

  if (clientIp === '::1' || clientIp === 'localhost' || clientIp === '127.0.0.1') {
    return next();
  }

  if (whitelist.includes(clientIp)) {
    return next();
  }

  if (origin) {
    try {
      const url = new URL(origin);
      if (url.hostname.endsWith('.vercel.app') || 
          url.hostname === 'kizuserver.xyz' || 
          url.hostname === 'gda.luckystore.id') {
        return next();
      }
    } catch (error) {
      console.error('URL parsing error:', error);
    }
  }

  return res.status(403).json({
    error: 'Access denied',
    message: 'Your IP address is not whitelisted',
    ip: clientIp,
    origin: origin || 'No origin'
  });
};

module.exports = ipWhitelist; 