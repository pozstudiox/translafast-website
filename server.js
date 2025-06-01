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

// Anasayfa olarak kesinlikle index.html gönder
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

// HTML sayfaları için dinamik parametre kontrolü ve içeriği değiştirerek gönderme
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const version = req.query.v;
    const xtid = req.query.xtid;

    // v veya xtid yoksa otomatik parametreli URL'ye yönlendir
    if (!version || !xtid) {
      return res.redirect(`/${page}?v=${DEFAULT_VERSION}&xtid=${DEFAULT_XTID}`);
    }

    // Dosyayı oku ve {{VERSION}}, {{XTID}} yerlerini değiştir
    const filePath = path.join(__dirname, page);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Dosya okunamadı:', filePath, err);
        return res.status(500).send('Sunucu hatası.');
      }

      // Basit metin değişimi (iki kere replace gerekebilir)
      let modifiedData = data.replace(/{{VERSION}}/g, version).replace(/{{XTID}}/g, xtid);
      res.send(modifiedData);
    });
  });
});

// CSS, JS, resim gibi statik dosyaları kök dizinden servis et
app.use(express.static(path.join(__dirname)));

// 404 handler — sayfa bulunamadığında özel sayfa sunabiliriz
app.use((req, res) => {
  res.status(404).send('Sayfa bulunamadı.');
});

// Server başlat
app.listen(PORT, () => {
  console.log(`🌐 Sunucu çalışıyor: http://localhost:${PORT}`);
});
