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

  const origin = req.headers.origin || req.headers.referer || req.headers.host;
  console.log('Client IP:', clientIp);
  console.log('Origin:', origin);
  console.log('Host:', req.headers.host);
  console.log('All Headers:', req.headers);

  if (clientIp === '::1' || clientIp === 'localhost' || clientIp === '127.0.0.1') {
    return next();
  }

  if (whitelist.includes(clientIp)) {
    return next();
  }

  const allowedDomains = [
    'vercel.app',
    'kizuserver.xyz',
    'gda.luckystore.id'
  ];

  const isAllowedDomain = allowedDomains.some(domain => {
    return (origin && origin.includes(domain)) || 
           (req.headers.host && req.headers.host.includes(domain));
  });

  if (isAllowedDomain) {
    return next();
  }

  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  return res.status(403).json({
    error: 'Access denied',
    message: 'Your IP address is not whitelisted',
    ip: clientIp,
    origin: origin || 'No origin',
    host: req.headers.host || 'No host'
  });
};

module.exports = ipWhitelist; 