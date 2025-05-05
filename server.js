const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Public klasörünü favicon, sitemap gibi statik dosyalar için ayarla
app.use(express.static(path.join(__dirname, 'public')));

// ✅ HTML, CSS, JS gibi diğer dosyalar için kök dizini de sun
app.use(express.static(path.join(__dirname)));

// Anasayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Default parametreler
const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

// Parametreli yönlendirme yapılacak sayfalar
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

// Sayfa yönlendirmeleri
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    // Otomatik yönlendirme
    if (!version || !xtid) {
      return res.redirect(`/${page}?v=${DEFAULT_VERSION}&xtid=${DEFAULT_XTID}`);
    }

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

// ❗ sitemap.xml özel olarak route edilmek istenirse (isteğe bağlı)
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// 404 fallback
app.get('*', (req, res) => {
  res.status(404).send('Sayfa bulunamadı.');
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
