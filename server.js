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
  'api.html'
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

    // Eğer v ve xtid varsa HTML dosyasını aç, {{VERSION}} ve {{XTID}} değiştir
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

// Şimdi css, js, img gibi diğer tüm dosyaları normal static olarak sunalım
app.use(express.static(path.join(__dirname)));

// 404 - Diğer tüm istekler
app.get('*', (req, res) => {
  res.status(404).send('Sayfa bulunamadı.');
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
