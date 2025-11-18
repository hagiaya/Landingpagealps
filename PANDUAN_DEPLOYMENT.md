# Panduan Deployment dan Pembaruan Proyek

Dokumen ini menjelaskan cara melakukan deployment awal dan cara memperbarui situs yang sudah live di Netlify.

---

## 1. Pengaturan Awal di Netlify (Hanya Dilakukan Sekali)

Langkah-langkah ini hanya perlu dilakukan saat pertama kali menghubungkan proyek ke Netlify.

1.  **Hubungkan Repositori ke Netlify:**
    *   Login ke [app.netlify.com](https://app.netlify.com).
    *   Klik **"Add new site"** > **"Import an existing project"**.
    *   Pilih repositori GitHub Anda (`hagiaya/Landingpagealps`).
    *   Pengaturan build akan terisi otomatis dari file `netlify.toml`. Anda tidak perlu mengubah apa pun.

2.  **Atur Environment Variables (Sangat Penting):**
    *   Sebelum menekan tombol deploy, Anda harus mengatur kunci API Supabase.
    *   Buka **Site settings > Build & deploy > Environment**.
    *   Klik **"Edit variables"** dan tambahkan **tiga** variabel berikut:

        *   **Variabel 1:**
            *   **Key:** `NEXT_PUBLIC_SUPABASE_URL`
            *   **Value:** (Salin dari pengaturan API Supabase Anda)
        *   **Variabel 2:**
            *   **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            *   **Value:** (Salin kunci `anon` `public` dari pengaturan API Supabase Anda)
        *   **Variabel 3:**
            *   **Key:** `SUPABASE_SERVICE_ROLE_KEY`
            *   **Value:** (Salin kunci `service_role` `secret` dari pengaturan API Supabase Anda)

3.  **Deploy Situs:**
    *   Setelah variabel disimpan, klik **"Deploy site"**.

---

## 2. Alur Kerja Pembaruan (Untuk Sehari-hari)

Setiap kali Anda ingin memperbarui situs dengan kode baru, ikuti langkah-langkah berikut.

1.  **Buat Perubahan Kode:**
    *   Edit atau tambahkan file di proyek lokal Anda.

2.  **Simpan Perubahan ke Git:**
    *   Buka terminal dan jalankan perintah berikut secara berurutan:
    ```bash
    # 1. Tambahkan semua file yang berubah
    git add .

    # 2. Buat "snapshot" dari perubahan dengan pesan yang jelas
    git commit -m "Deskripsi pembaruan Anda, contoh: 'memperbaiki bug di halaman kontak'"
    ```

3.  **Kirim Perubahan ke GitHub:**
    *   Unggah perubahan Anda ke GitHub.
    ```bash
    git push origin main
    ```

4.  **Selesai!**
    *   Netlify akan secara otomatis mendeteksi `push` baru Anda, lalu membangun ulang dan men-deploy versi terbaru dari situs Anda. Anda hanya perlu menunggu beberapa menit hingga situs Anda diperbarui.
