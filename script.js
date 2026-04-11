const URL_API_SHEETS = "https://script.google.com/macros/s/AKfycbyvR9KuzSM1xGpL-GmmjTCUxc26n0GIPMLD17VuK3GslRLC9CoYkc-SZfviJwQHAXjc/exec";
const KOTA_MALANG_ID = "1632"; 

async function loadData() {
    try {
        const response = await fetch(URL_API_SHEETS);
        const data = await response.json();

        // 1. Konfigurasi Utama
        const conf = data.Konfigurasi[0];
        document.getElementById('nama-masjid').innerText = conf.Nama_Masjid;
        document.getElementById('footer-nama-masjid').innerText = conf.Nama_Masjid;
        document.getElementById('copyright-nama').innerText = conf.Nama_Masjid;
        document.getElementById('logo-masjid').src = conf.Logo_URL;
        document.getElementById('motto-masjid').innerText = conf.Motto;
        document.getElementById('alamat-masjid-hero').innerText = conf.Alamat;
        document.getElementById('footer-alamat').innerText = conf.Alamat;
        document.getElementById('running-text').innerText = conf.Running_Text;
        
        // Kontak & Sosmed
        document.getElementById('footer-email').innerText = conf.Email;
        document.getElementById('footer-wa').href = `https://wa.me/${conf.WhatsApp}`;
        document.getElementById('link-ig').href = `https://instagram.com/${conf.Instagram}`;
        document.getElementById('link-fb').href = `https://facebook.com/${conf.Facebook}`;
        document.getElementById('gmap-frame').src = conf.Link_GMap;

        // 2. Jadwal Sholat (API MyQuran)
        const d = new Date();
        const resSholat = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${KOTA_MALANG_ID}/${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
        const sholatData = await resSholat.json();
        const jadwal = sholatData.data.jadwal;
        const listWaktu = [
            {n: 'Subuh', j: jadwal.subuh}, {n: 'Dzuhur', j: jadwal.dzuhur},
            {n: 'Ashar', j: jadwal.ashar}, {n: 'Maghrib', j: jadwal.maghrib}, {n: 'Isya', j: jadwal.isya}
        ];

        let sHtml = "";
        listWaktu.forEach(w => {
            const p = data.Petugas.find(x => x.Waktu.toLowerCase() === w.n.toLowerCase()) || {Imam: '-', Muadzin: '-'};
            sHtml += `<div class="sholat-card"><h4>${w.n}</h4><div class="jam">${w.j}</div><div class="petugas">Imam: ${p.Imam}<br>Bilal: ${p.Muadzin}</div></div>`;
        });
        document.getElementById('sholat-list').innerHTML = sHtml;

        // 3. Keuangan
        let kHtml = "<ul>";
        data.Keuangan.forEach(k => kHtml += `<li><strong>${k.Keterangan}:</strong> ${k.Jumlah}</li>`);
        document.getElementById('list-keuangan').innerHTML = kHtml + "</ul>";

        // 4. Pengumuman
        let pHtml = "";
        data.Pengumuman.forEach(p => pHtml += `<div style="margin-bottom:15px"><strong>${p.Judul}</strong><p style="font-size:0.9rem">${p.Isi}</p></div>`);
        document.getElementById('list-pengumuman').innerHTML = pHtml || "Belum ada pengumuman.";

        // 5. Pengurus
        let prHtml = "";
        data.Pengurus.forEach(pr => prHtml += `<div class="card-pengurus"><img src="${pr.Foto_Pengurus}" class="img-pengurus"><h4>${pr.Nama}</h4><p>${pr.Jabatan}</p></div>`);
        document.getElementById('list-pengurus').innerHTML = prHtml;

        // 6. Galeri
        let gHtml = "";
        data.Galeri.forEach(g => gHtml += `<img src="${g.URL_Gambar}" alt="${g.Judul_Foto}">`);
        document.getElementById('list-galeri').innerHTML = gHtml;

    } catch (e) { console.error("Error:", e); }
}
loadData();
