import { Draft, Task, PustakaFile, MeetingDoc } from '../types';

export const INITIAL_DRAFTS: Draft[] = [
  {
    id: 'd1',
    title: 'Sambutan Kepala Bappeda - Pembukaan Musrenbangda 2026',
    category: 'Sambutan',
    content: `# SAMBUTAN KEPALA BAPPEDA PROVINSI
## ACARA: PEMBUKAAN MUSYAWARAH PERENCANAAN PEMBANGUNAN DAERAH (MUSRENBANGDA) TAHUN 2026

*Assalamu’alaikum Warahmatullahi Wabarakatuh,*
*Selamat pagi, salam sejahtera bagi kita semua.*

Yang terhormat Bapak Gubernur,
Yang kami hormati para Kepala Perangkat Daerah, para Bupati/Wali Kota, serta seluruh delegasi dan undangan yang berbahagia.

Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT, karena atas rahmat-Nya kita dapat berkumpul dalam rangka merencanakan arah pembangunan daerah kita untuk tahun anggaran 2026.

**Bapak/Ibu hadirin yang saya hormati,**

Penyusunan RKPD Tahun 2026 ini mengusung tema utama **"Akselerasi Pertumbuhan Ekonomi Inklusif dan Peningkatan Infrastruktur Berkelanjutan"**. Fokus utama kita tertuju pada tiga prioritas daerah:
1. **Penurunan angka kemiskinan ekstrem** hingga target di bawah 1%.
2. **Peningkatan kualitas SDM** melalui revitalisasi pendidikan vokasi dan penguatan layanan kesehatan primer.
3. **Penyediaan infrastruktur ramah lingkungan** guna mendukung interkoneksi kawasan industri dan pertanian.

Melalui Musrenbangda ini, saya mengajak seluruh pemangku kepentingan untuk memberikan masukan konstruktif. Kita harus memastikan program yang diusulkan benar-benar menyentuh kebutuhan masyarakat, berbasis data riil (evidence-based planning), dan terintegrasi antarsektor.

Demikian sambutan pengantar dari saya. Semoga ikhtiar kita bersama ini mendapat rida dari Tuhan Yang Maha Esa dan membawa kemajuan nyata bagi daerah kita tercinta.

*Wabillahi taufiq wal hidayah,*
*Wassalamu’alaikum Warahmatullahi Wabarakatuh.*`,
    createdAt: '2026-06-22T09:00:00Z',
    lastModified: '2026-06-22T10:30:00Z'
  },
  {
    id: 'd2',
    title: 'Nota Dinas - Koordinasi Percepatan Input Rencana Kegiatan RKPD 2026',
    category: 'Nota Dinas',
    content: `# BAPPEDA PROVINSI
## NOTA DINAS

**Kepada:** Yth. Para Kepala Bidang di Lingkungan Bappeda  
**Dari:** Kepala Bappeda Provinsi  
**Tanggal:** 23 Juni 2026  
**Nomor:** 005/124/Bappeda-IV/2026  
**Sifat:** Penting/Segera  
**Hal:** Koordinasi Percepatan Input Rencana Kegiatan ke dalam Aplikasi Sistem Informasi Perencanaan  

---

Sehubungan dengan batas waktu penyusunan Rencana Kerja Pemerintah Daerah (RKPD) Tahun Anggaran 2026 yang semakin dekat, bersama ini disampaikan beberapa hal penting untuk menjadi perhatian bersama:

1. **Batas Waktu Penginputan:** Seluruh Bidang diwajibkan menyelesaikan input usulan program dan kegiatan prioritas hasil penelaahan Pokok Pikiran DPRD dan Musrenbang ke dalam Sistem Informasi paling lambat pada hari **Jumat, 26 Juni 2026 pukul 16.00 WIB**.
2. **Verifikasi Usulan:** Kepala Bidang bertanggung jawab langsung untuk memverifikasi kesesuaian antara usulan OPD dengan arah kebijakan pembangunan dalam RPJMD 2024-2029.
3. **Koordinasi Teknis:** Apabila terdapat kendala teknis dalam sistem penginputan, agar segera berkoordinasi dengan Bidang Perencanaan, Pengendalian, dan Evaluasi Pembangunan Daerah (PPEPD).

Demikian untuk menjadi perhatian dan dilaksanakan dengan penuh tanggung jawab. Terima kasih atas kerja sama dan dedikasi Saudara sekalian.

**KEPALA BAPPEDA PROVINSI**  
*(ditandatangani secara elektronik)*`,
    createdAt: '2026-06-23T08:15:00Z',
    lastModified: '2026-06-23T08:15:00Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Siapkan draf pidato pengantar Kepala Bappeda untuk Musrenbangda 2026',
    completed: false,
    priority: 'tinggi',
    dueDate: 'Hari Ini',
    category: 'Dokumentasi'
  },
  {
    id: 't2',
    title: 'Tinjau target kemiskinan ekstrem pada dokumen draf RPJMD Bab IV',
    completed: false,
    priority: 'tinggi',
    dueDate: 'Besok',
    category: 'Perencanaan'
  },
  {
    id: 't3',
    title: 'Evaluasi dokumen usulan Musrenbang Kecamatan Bogor Barat',
    completed: false,
    priority: 'sedang',
    dueDate: '25 Jun 2026',
    category: 'Koordinasi'
  },
  {
    id: 't4',
    title: 'Kirim undangan rapat koordinasi evaluasi RKPD triwulan II ke OPD',
    completed: true,
    priority: 'sedang',
    dueDate: '22 Jun 2026',
    category: 'Administrasi'
  },
  {
    id: 't5',
    title: 'Siapkan bahan presentasi paparan RPJMD untuk Rapat Paripurna DPRD',
    completed: false,
    priority: 'tinggi',
    dueDate: '29 Jun 2026',
    category: 'Rapat'
  }
];

export const INITIAL_PUSTAKA_FILES: PustakaFile[] = [
  {
    id: 'f1',
    name: 'RKPD_Provinsi_Tahun_2026_Draf_Final.pdf',
    category: 'Planning',
    size: '4.8 MB',
    uploadDate: '2026-06-20',
    description: 'Rencana Kerja Pemerintah Daerah tahun 2026 hasil Musrenbang Provinsi.'
  },
  {
    id: 'f2',
    name: 'RPJMD_Provinsi_Periode_2024-2029.pdf',
    category: 'Planning',
    size: '12.4 MB',
    uploadDate: '2026-05-10',
    description: 'Rencana Pembangunan Jangka Menengah Daerah Provinsi.'
  },
  {
    id: 'f3',
    name: 'Template_Nota_Dinas_Standard_Bappeda.docx',
    category: 'Templates',
    size: '185 KB',
    uploadDate: '2026-06-01',
    description: 'Format baku nota dinas lingkup Bappeda sesuai Pergub Tata Naskah Dinas.'
  },
  {
    id: 'f4',
    name: 'SOP_Fasilitasi_Rancangan_Renja_OPD.pdf',
    category: 'SOP',
    size: '890 KB',
    uploadDate: '2026-04-15',
    description: 'Prosedur operasional standar fasilitasi penyusunan rancangan rencana kerja OPD.'
  },
  {
    id: 'f5',
    name: 'Laporan_Evaluasi_Kinerja_Pembangunan_Triwulan_I_2026.pdf',
    category: 'Monev',
    size: '3.1 MB',
    uploadDate: '2026-06-12',
    description: 'Laporan pemantauan capaian kinerja fisik dan keuangan program prioritas Triwulan I.'
  },
  {
    id: 'f6',
    name: 'Sambutan_Kepala_Bappeda_Musrenbang_2025_Lama.docx',
    category: 'Personal',
    size: '120 KB',
    uploadDate: '2025-03-14',
    description: 'Naskah pidato sambutan Kepala Bappeda pada pembukaan Musrenbangda tahun lalu.'
  },
  {
    id: 'f7',
    name: 'Notulensi_Rapat_Koordinasi_Bulanan_Mei.pdf',
    category: 'Meetings',
    size: '410 KB',
    uploadDate: '2026-06-02',
    description: 'Notulen resmi hasil rapat evaluasi program rutin bulanan staf Bappeda.'
  },
  {
    id: 'f8',
    name: 'Proposal_Usulan_Dinas_Perhubungan_LRT_Kawasan.pdf',
    category: 'Proposals',
    size: '2.5 MB',
    uploadDate: '2026-06-19',
    description: 'Dokumen proposal usulan pendanaan transportasi LRT kawasan perkotaan.'
  }
];

export const INITIAL_MEETINGS: MeetingDoc[] = [
  {
    id: 'm1',
    title: 'Rapat Koordinasi Pembahasan Usulan Prioritas Sektor Infrastruktur RKPD 2026',
    date: '2026-06-22',
    duration: '1 Jam 45 Menit',
    status: 'selesai',
    transcriptSnippet: 'Kepala Bappeda: "Untuk porsi anggaran infrastruktur, kita harus menitikberatkan pada perbaikan jalan penghubung logistik pedesaan. Terutama kawasan agropolitan. Dinas PU agar memverifikasi kelayakan lahan agar tidak ada kendala pembebasan tanah nantinya..."',
    summary: 'Rapat menyepakati penapisan usulan infrastruktur jalan raya dengan fokus interkoneksi sentra produksi tani. Total pagu indikatif sektor infrastruktur ditetapkan sebesar 24% dari pagu belanja langsung daerah.',
    actionItems: [
      'Dinas Pekerjaan Umum melakukan verifikasi status lahan jalan penghubung (Deadline: 30 Juni 2026).',
      'Bidang Infrastruktur Bappeda menyusun laporan peringkat usulan Musrenbang kecamatan (Deadline: 27 Juni 2026).'
    ]
  },
  {
    id: 'm2',
    title: 'Rapat Evaluasi Penurunan Stunting Terintegrasi',
    date: '2026-06-23',
    duration: '45 Menit',
    status: 'proses',
    transcriptSnippet: 'Asisten Pemerintahan: "Kami butuh data konvergensi intervensi stunting dari dinas kesehatan per Juni ini. Ini mendesak untuk dilaporkan ke pimpinan..."'
  }
];
