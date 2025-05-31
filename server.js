const express = require('express');
const path = require('path');
const fs = require('fs');
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
  'now-lives'
];

// .html ile gelirse, uzantısız haline yönlendir
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    // Query parametreleri koruyarak yönlendir
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
  // Kök sayfa için de parametreleri kontrol et
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

// 404 - bulunamayan sayfa (her URL için çalışır)
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
