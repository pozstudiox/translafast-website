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
  'apps.html',
  'learn-12-4-1.html' // örnek ekledim, gerçek dosyalar burada olmalı
];

// 1) Eğer istek uzantısızsa, aynı ada .html uzantısı varsa yönlendir
app.get('/:page', (req, res, next) => {
  const page = req.params.page;

  if (!page.endsWith('.html')) {
    const possibleFile = page + '.html';
    const fullPath = path.join(__dirname, possibleFile);

    // Dosyanın varlığını kontrol et
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (!err) {
        // Dosya varsa query varsa al, yoksa boş string
        const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
        return res.redirect(`/${possibleFile}${query}`);
      } else {
        // Dosya yoksa bir sonraki middleware geç
        next();
      }
    });
  } else {
    // Zaten .html uzantılıysa devam et
    next();
  }
});

// 2) Anasayfa kesin index.html gönder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3) Sayfa bazlı parametre kontrolü ve içerik değiştirme
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    if (!version || !xtid) {
      return res.redirect(`/${page}?v=${DEFAULT_VERSION}&xtid=${DEFAULT_XTID}`);
    }

    fs.readFile(path.join(__dirname, page), 'utf8', (err, data) => {
      if (err) {
        console.error('Dosya okunamadı:', page, err);
        return res.status(500).send('Sunucu hatası.');
      }

      const modifiedData = data.replace(/{{VERSION}}/g, version).replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// 4) Statik dosyaları sun
app.use(express.static(path.join(__dirname)));

// 5) 404 - Bulunamayan sayfa
app.use((req, res) => {
  res.status(404).send('Sayfa bulunamadı.');
});

// 6) Server başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
