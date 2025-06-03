const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Basit Rate Limiter (her IP'ye 1 dk'da 60 istek limiti)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 60, // Her IP'ye 60 istek
  message: 'Çok fazla istek gönderdiniz, lütfen biraz bekleyin.',
});
app.use(limiter);

// Varsayılan parametreler
const DEFAULT_VERSION = '7.0.3';
const DEFAULT_XTID = 'cmedhionkhpnakcndndgjdbohmhepckk';

// Sunulacak HTML sayfalarının uzantısız halleri
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

// 1) Her uzantısız sayfayı .html ile eşleştir
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v || DEFAULT_VERSION;
    const xtid = req.query.xtid || DEFAULT_XTID;
    const filePath = path.join(__dirname, `${page}.html`);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // Dosya yoksa 404'e yönlendir
        return res.status(404).sendFile(path.join(__dirname, '404.html'));
      }
      // Dynamic değişken yerleştirme
      const modifiedData = data
        .replace(/{{VERSION}}/g, version)
        .replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// 2) Anasayfa (root)
app.get('/', (req, res) => {
  const version = req.query.v || DEFAULT_VERSION;
  const xtid = req.query.xtid || DEFAULT_XTID;
  const filePath = path.join(__dirname, 'index.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Sunucu hatası.');
    }
    const modifiedData = data
      .replace(/{{VERSION}}/g, version)
      .replace(/{{XTID}}/g, xtid);
    res.send(modifiedData);
  });
});

// 3) Statik dosyalar (css, js, resim)
app.use(express.static(path.join(__dirname), {
  extensions: ['html']
}));

// 4) 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 5) Server başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
