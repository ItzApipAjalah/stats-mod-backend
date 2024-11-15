const whitelist = [
  '127.0.0.1',
  'localhost',
  '::1',
  '76.76.21.9',
  '76.76.21.22',
  '185.128.227.192'
];

const allowedDomains = [
  'stats-web-pi.vercel.app',
  'kizuserver.xyz',
  'gda.luckystore.id'
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
  const host = req.headers.host;

  console.log('Client IP:', clientIp);
  console.log('Origin:', origin);
  console.log('Host:', host);

  // Check IP whitelist first
  if (whitelist.includes(clientIp)) {
    return next();
  }

  // Check exact domain matches
  if (origin) {
    try {
      const url = new URL(origin);
      if (allowedDomains.includes(url.hostname)) {
        return next();
      }
    } catch (error) {
      console.error('URL parsing error:', error);
    }
  }

  // Check host header for Vercel deployment
  if (host && allowedDomains.includes(host)) {
    return next();
  }

  // Development environment check
  if (process.env.NODE_ENV === 'development' && 
      (clientIp === '::1' || clientIp === 'localhost' || clientIp === '127.0.0.1')) {
    return next();
  }

  return res.status(403).json({
    error: 'Access denied',
    message: 'Access not allowed from this origin',
    ip: clientIp,
    origin: origin || 'No origin',
    host: host || 'No host'
  });
};

module.exports = ipWhitelist; 