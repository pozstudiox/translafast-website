const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Basit Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: 'Çok fazla istek gönderdiniz, lütfen bekleyin.',
});
app.use(limiter);

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
  'learn-12-4-1'
];

// 1. Eğer .html uzantılı sayfa istenirse, .html'siz haline redirect et
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    // Query stringi koru
    const params = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(301, `/${page}${params}`);
  });
});

// 2. Her sayfa için hem parametre kontrolü hem template işlemi
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    // Eğer parametre eksikse redirect et
    if (!version || !xtid) {
      // Query stringi oluştur
      const params = [];
      if (!version) params.push(`v=${DEFAULT_VERSION}`);
      if (!xtid) params.push(`xtid=${DEFAULT_XTID}`);
      // Eski parametreler varsa ekle
      const currentParams = [];
      if (version) currentParams.push(`v=${version}`);
      if (xtid) currentParams.push(`xtid=${xtid}`);
      // Redirectle
      return res.redirect(
        `/${page}?${[...currentParams, ...params].join('&')}`
      );
    }

    // Dosyayı oku ve değişkenleri doldur
    fs.readFile(path.join(__dirname, `${page}.html`), 'utf8', (err, data) => {
      if (err) {
        // 404'e yönlendir
        return res.status(404).sendFile(path.join(__dirname, '404.html'));
      }
      const modifiedData = data
        .replace(/{{VERSION}}/g, version)
        .replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// 3. Root (anasayfa) için de aynı yapı
app.get('/', (req, res) => {
  res.redirect('/index');
});

// 4. Statik dosyalar
app.use(express.static(path.join(__dirname)));

// 5. 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
