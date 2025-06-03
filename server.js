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
  'index',
  'api',
  'destek',
  '404',
  'languages',
  'coming-soon',
  'about',
  'apps',
  'learn-12-4-1',
  'suspicious-activity-observed' // Bunu da ekliyoruz
];

// DDoS/rate limit ihlalinde özel sayfaya yönlendiren rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 60, // Her IP'ye 60 istek hakkı
  handler: (req, res) => {
    res.status(429).redirect('/suspicious-activity-observed');
  }
});
app.use(limiter);

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
    const version = req.query.v;
    const xtid = req.query.xtid;

    // Sadece suspicious-activity-observed sayfası parametre gerektirmez
    if (page === 'suspicious-activity-observed') {
      return res.sendFile(path.join(__dirname, 'suspicious-activity-observed.html'));
    }

    // Parametre yoksa otomatik ekle
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

// Root (anasayfa)
app.get('/', (req, res) => {
  res.redirect('/index');
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
