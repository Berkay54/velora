# Velora Atelier

DABLABS tarafından hazırlanan restoran ve pastane web sitesi. Tam ekran hero videosu, videodaki sayfa geçişleriyle senkron değişen metinler ve filtrelenebilir bir ürün koleksiyonu içerir.

## Geliştirme

Node.js 22.12 veya üzeri gerekir.

```sh
npm ci
npm run dev
```

## Üretim

```sh
npm run build
npm run preview
```

Statik yayın dosyaları `dist/` klasörüne oluşturulur. Yayın sunucusunda bu klasör kök dizin olarak kullanılmalıdır.

## Yapı

- `src/Hero.tsx`: Video oynatma, sahne zamanlamaları ve metin geçişleri.
- `src/Hero.css`: Tam ekran hero ve mobil yerleşim.
- `src/App.tsx`: Navigasyon, koleksiyon ve film penceresi.
- `public/media/`: Sitede kullanılan video ve görseller.

React, TypeScript ve Vite ile geliştirilmiştir. Video kontrolleri, klavye erişimi ve azaltılmış hareket tercihi desteklenir.
