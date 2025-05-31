const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Anasayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Default değerler
const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

// Parametre kontrolü yapılacak HTML sayfaları
const pages = [
  'uninstall.html',
  'support.html',
  'teşekkürler.html',
  'sss.html',
  'privacy.html',
  'kvkk.html',
  'logs.html',
  'index.html',
  'api.html',
  'destek.html',
  '404.html',
  'languages.html',
  'coming-soon.html',
  'about.html',
  'apps.html',
  'now-lives.html'
];

// HTML sayfaları için yönlendirme ve parametre işle
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    // Eğer v veya xtid yoksa otomatik parametreli URL'ye yönlendir
    if (!version || !xtid) {
      return res.redirect(`/${page}?v=${DEFAULT_VERSION}&xtid=${DEFAULT_XTID}`);
    }

    // HTML dosyasını oku ve değişkenleri yerleştir
    fs.readFile(path.join(__dirname, page), 'utf8', (err, data) => {
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

// Statik dosyalar (CSS, JS, img vs.)
app.use(express.static(path.join(__dirname)));

// Özel 404 sayfası
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
