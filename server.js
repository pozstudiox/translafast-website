const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

const pages = [
  'uninstall',
  'support',
  'teşekkürler',
  'sss',
  'privacy',
  'kvkk',
  'logs',
  // 'index', // Artık index'i ayrı handle edeceğiz
  'api',
  'destek',
  '404',
  'languages',
  'coming-soon',
  'about',
  'apps',
  'learn-12-4-1',
  'suspicious-activity-observed'
];

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  handler: (req, res) => {
    res.status(429).redirect('/suspicious-activity-observed');
  }
});
app.use(limiter);

// Herhangi bir /index.html ya da /index isteğinde köke yönlendir
app.get(['/index', '/index.html'], (req, res) => {
  // Parametreleri köke aktar
  const params = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(301, `/${params}`);
});

// Anasayfa (/)
app.get('/', (req, res) => {
  const version = req.query.v || DEFAULT_VERSION;
  const xtid = req.query.xtid || DEFAULT_XTID;

  fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Sunucu hatası.');
    }
    const modifiedData = data
      .replace(/{{VERSION}}/g, version)
      .replace(/{{XTID}}/g, xtid);
    res.send(modifiedData);
  });
});

// .html uzantılı istekleri .html'siz sayfalara yönlendir
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    const params = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(301, `/${page}${params}`);
  });
});

// Sayfaları dinamik parametre ile sun
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    if (page === 'suspicious-activity-observed') {
      return res.sendFile(path.join(__dirname, 'suspicious-activity-observed.html'));
    }
    const version = req.query.v;
    const xtid = req.query.xtid;

    if (!version || !xtid) {
      const params = [];
      if (!version) params.push(`v=${DEFAULT_VERSION}`);
      if (!xtid) params.push(`xtid=${DEFAULT_XTID}`);
      const currentParams = [];
      if (version) currentParams.push(`v=${version}`);
      if (xtid) currentParams.push(`xtid=${xtid}`);
      return res.redirect(
        `/${page}?${[...currentParams, ...params].join('&')}`
      );
    }

    fs.readFile(path.join(__dirname, `${page}.html`), 'utf8', (err, data) => {
      if (err) {
        return res.status(404).sendFile(path.join(__dirname, '404.html'));
      }
      const modifiedData = data
        .replace(/{{VERSION}}/g, version)
        .replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// Statik dosyalar
app.use(express.static(path.join(__dirname)));

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
