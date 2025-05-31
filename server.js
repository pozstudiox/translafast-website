const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

// .html uzantısı olmadan kullanılacak sayfalar:
const pages = [
  'uninstall',
  'support',
  'teşekkürler',
  'sss',
  'privacy',
  'kvkk',
  'logs',
  'index',
  'api',
  'destek',
  '404',
  'languages',
  'coming-soon',
  'about',
  'apps',
  'now-lives',
  'learn-12-4-1', //UPDATELERDE DEĞİŞECEK!!
  //'hacker',
  'suspicious-activity-observed',
  'fire_wall'
];

// Helmet: güvenlik header'ları
app.use(helmet());

// Body parser limitleri
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));

// User-Agent ve Bot filtresi
app.use((req, res, next) => {
  const ua = req.headers['user-agent'];
  if (!ua || ua.length < 10 || /curl|bot|python|fetch|wget|scrapy|requests|spider|scan/i.test(ua)) {
    return fs.readFile(path.join(__dirname, 'suspicious-activity-observed.html'), 'utf8', (err, data) => {
      if (err) return res.status(403).send('Access Denied!');
      res.status(403).send(data);
    });
  }
  next();
});

// Rate limit: DDoS ve botları yavaşlat
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 100 istek (bu sayıyı daha düşük de yapabilirsin)
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    fs.readFile(path.join(__dirname, 'suspicious-activity-observed.html'), 'utf8', (err, data) => {
      if (err) return res.status(429).send('Too many requests');
      res.status(429).send(data);
    });
  }
});
app.use(generalLimiter);

// Timeout (10 sn)
app.use((req, res, next) => {
  res.setTimeout(10 * 1000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});

// .html ile gelirse, uzantısız haline yönlendir
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    const search = Object.entries(req.query).map(([k, v]) => `${k}=${v}`).join('&');
    const redirectUrl = `/${page}` + (search ? `?${search}` : '');
    res.redirect(301, redirectUrl);
  });
});

// Normal sayfa gösterimi, uzantısız
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v || DEFAULT_VERSION;
    const xtid = req.query.xtid || DEFAULT_XTID;

    // Query parametreleri yoksa otomatik ekle ve yönlendir
    if (!req.query.v || !req.query.xtid) {
      return res.redirect(`/${page}?v=${version}&xtid=${xtid}`);
    }

    // HTML dosyasını oku ve değişkenleri yerleştir
    fs.readFile(path.join(__dirname, `${page}.html`), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Sunucu hatası.');
      }
      const modifiedData = data
        .replace('{{VERSION}}', version)
        .replace('{{XTID}}', xtid);

      res.send(modifiedData);
    });
  });
});

// Anasayfa (index)
app.get('/', (req, res) => {
  const version = req.query.v || DEFAULT_VERSION;
  const xtid = req.query.xtid || DEFAULT_XTID;

  if (!req.query.v || !req.query.xtid) {
    return res.redirect(`/?v=${version}&xtid=${xtid}`);
  }

  fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Sunucu hatası.');
    }
    const modifiedData = data
      .replace('{{VERSION}}', version)
      .replace('{{XTID}}', xtid);
    res.send(modifiedData);
  });
});

// Statik dosyalar (CSS, JS, img vs.)
app.use(express.static(path.join(__dirname)));

// 404 - bulunamayan sayfa
app.use((req, res) => {
  const version = req.query.v || DEFAULT_VERSION;
  const xtid = req.query.xtid || DEFAULT_XTID;

  fs.readFile(path.join(__dirname, '404.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('404 sayfası yüklenemedi.');
    }
    const modifiedData = data
      .replace('{{VERSION}}', version)
      .replace('{{XTID}}', xtid);

    res.status(404).send(modifiedData);
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
