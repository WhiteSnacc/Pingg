# Pingg!

Forum komunitas berbasis topik yang dibangun dengan Vite, React, TypeScript,
Tailwind CSS v4, dan Supabase Auth.

## Menjalankan aplikasi

```sh
npm install
cp .env.example .env
npm run dev
```

Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` di `.env` dengan kredensial
proyek Supabase. File `.env` tidak disertakan di Git. Tanpa konfigurasi tersebut,
feed tetap berjalan dengan mock data dan halaman auth menampilkan pesan bahwa
Supabase belum dikonfigurasi.

## Pemeriksaan

```sh
npm run build
npm run lint
```

## Rute

- `/` — feed dan urutan postingan
- `/communities` — jelajah komunitas
- `/p/:subpingg` — feed Subpingg
- `/post/:id` — detail postingan dan komentar
- `/login` dan `/register` — Supabase Auth
- `/inbox`, `/profile`, dan `/settings` — halaman akun

Data forum sementara berada di `src/data/mock.ts`; ganti dengan query Supabase
saat skema tabel sudah tersedia.
