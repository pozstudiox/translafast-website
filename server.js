const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Default parametreler
const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

// Sunulacak HTML sayfaları listesi
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
  'apps.html'
];

// 1) Uzantısız sayfa isteği gelirse .html uzantısını ekleyip yönlendir
app.get('/:page', (req, res, next) => {
  const page = req.params.page;

  // Eğer istek .html uzantısı içermiyorsa ve sayfa listesinde varsa
  if (!page.endsWith('.html') && pages.includes(page + '.html')) {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(`/${page}.html${query}`);
  }
  next();
});

// 2) Anasayfa kesin index.html gönder
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

// 3) Sayfalar için dinamik parametre kontrolü ve içerik değişimi
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    if (!version || !xtid) {
      return res.redirect(`/${page}?v=${DEFAULT_VERSION}&xtid=${DEFAULT_XTID}`);
    }

    const filePath = path.join(__dirname, page);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Dosya okunamadı:', filePath, err);
        return res.status(500).send('Sunucu hatası.');
      }

      // Tüm {{VERSION}} ve {{XTID}} yerlerini değiştir
      const modifiedData = data.replace(/{{VERSION}}/g, version).replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// 4) Statik dosyaları sun
app.use(express.static(path.join(__dirname)));

// 5) 404 sayfası
app.use((req, res) => {
  res.status(404).send('Sayfa bulunamadı.');
});

// 6) Server başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
