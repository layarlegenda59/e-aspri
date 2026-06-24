import { useState, useEffect } from 'react';
import { Message, Draft } from '../types';

const STORAGE_KEY = 'e_aspri_chat_messages';

export const COMMANDS_METADATA = {
  '/sambutan': {
    name: 'Buat Sambutan',
    fields: [
      { key: 'acara', label: 'Nama Acara', type: 'text', placeholder: 'Pembukaan Rapat Koordinasi RKPD...' },
      { key: 'pimpinan', label: 'Nama Pimpinan', type: 'text', placeholder: 'Kepala Bappeda / Gubernur...' },
      { key: 'tema', label: 'Tema Utama', type: 'textarea', placeholder: 'Sinergitas program prioritas pembangunan...' },
      { key: 'durasi', label: 'Estimasi Durasi (Menit)', type: 'select', options: ['5', '10', '15', '20'] },
      { key: 'audiens', label: 'Target Audiens', type: 'text', placeholder: 'Kepala Dinas, Camat, Tokoh Masyarakat...' }
    ]
  },
  '/notadinas': {
    name: 'Buat Nota Dinas',
    fields: [
      { key: 'kepada', label: 'Tujuan (Kepada)', type: 'text', placeholder: 'Para Kepala Bidang Bappeda...' },
      { key: 'dari', label: 'Pengirim (Dari)', type: 'text', placeholder: 'Kepala Bappeda / Sekban...' },
      { key: 'hal', label: 'Perihal / Hal', type: 'text', placeholder: 'Penyusunan Rencana Kerja (Renja)...' },
      { key: 'isi', label: 'Poin-Poin Instruksi', type: 'textarea', placeholder: '1. Segera selesaikan Renja...\n2. Batas akhir Jum\'at...' }
    ]
  },
  '/surat': {
    name: 'Buat Surat Undangan',
    fields: [
      { key: 'hal', label: 'Perihal Undangan', type: 'text', placeholder: 'Rapat Evaluasi Triwulan II...' },
      { key: 'opd', label: 'OPD / Instansi Tujuan', type: 'text', placeholder: 'Seluruh Kepala Dinas Provinsi...' },
      { key: 'waktu', label: 'Hari/Tanggal & Tempat', type: 'text', placeholder: 'Kamis, 25 Juni 2026 di Aula Bappeda...' },
      { key: 'agenda', label: 'Agenda Rapat', type: 'textarea', placeholder: 'Pembahasan realisasi program triwulan II...' }
    ]
  },
  '/ringkas': {
    name: 'Ringkas Laporan',
    fields: [
      { key: 'judul', label: 'Judul Laporan', type: 'text', placeholder: 'Laporan Evaluasi RKPD Triwulan I...' },
      { key: 'fokus', label: 'Fokus Ringkasan', type: 'select', options: ['Ringkasan Eksekutif', 'Daftar Masalah/Bottleneck', 'Capaian Kinerja'] },
      { key: 'text', label: 'Teks / Poin Utama Laporan', type: 'textarea', placeholder: 'Masukkan kutipan laporan atau poin-poin penting di sini...' }
    ]
  },
  '/notulen': {
    name: 'Buat Notulen Rapat',
    fields: [
      { key: 'judul', label: 'Nama Rapat', type: 'text', placeholder: 'Rapat Koordinasi Stunting...' },
      { key: 'pimpinan', label: 'Pimpinan Rapat', type: 'text', placeholder: 'Bapak Iyan / Kabid...' },
      { key: 'poin', label: 'Poin Pembicaraan Rapat', type: 'textarea', placeholder: 'Dinkes melaporkan stunting turun 2%.\nBappeda meminta verifikasi data lokus stunting.' }
    ]
  }
};

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Halo, saya **Bot Aspri**.

Saya dapat membantu membuat draf dokumen, merangkum laporan, menyusun notulen rapat, menyiapkan briefing, dan membantu pekerjaan administrasi sehari-hari. 

Semakin banyak dokumen yang Anda simpan di **Pustaka Kerja**, semakin baik saya dapat membantu.

Ketik simbol \`/\` di kolom chat untuk membuka menu **Formulir Terpandu** perintah cepat.`,
  timestamp: new Date().toISOString()
};

import { PustakaFile } from '../types';

// =========================================================
// Strip ALL markdown from AI-generated document output
// Called on every Groq API response before displaying
// =========================================================
const stripDocMarkdown = (text: string): string => {
  return text
    // Remove triple backtick code blocks wrapper but keep content inside
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/```\s*$/gm, '')
    // Remove **bold** → plain text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove *italic* → plain text
    .replace(/\*([^*\n]+)\*/g, '$1')
    // Remove markdown headers (# ## ###) → keep the text, uppercase
    .replace(/^#{1,6}\s+(.+)$/gm, (_, t) => t.toUpperCase())
    // Convert markdown bullet `* item` at line start → `  - item`
    .replace(/^\* (.+)$/gm, '  - $1')
    // Remove remaining lone asterisks (e.g. `1. **Point**` leftovers)
    .replace(/\*\*/g, '')
    .replace(/(?<![\d\w])\*(?![\d\w*])/g, '')
    // Clean up any triple+ blank lines → double blank line
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Helper function to call the Groq completions endpoint
const callGroqAPI = async (
  messagesHistory: Message[],
  customPromptText: string,
  uploadedFiles: PustakaFile[],
  apiKey: string,
  model: string
): Promise<string> => {
  try {
    const systemMsg = {
      role: 'system',
      content: `Anda adalah "Bot Aspri" (Asisten Virtual Pimpinan), rekan kerja digital untuk tugas administrasi, koordinasi, dan dokumentasi pimpinan Bappeda.
         
Aturan Penulisan & Kepribadian:
- Berkomunikasi sebagai asisten administrasi profesional, ramah, efisien, dan penuh hormat.
- Hindari jargon teknis seperti "Saya adalah model AI", "LLM", dll. Jawab langsung seolah Anda adalah asisten manusia yang terampil.
- Gunakan Bahasa Indonesia formal yang santun khas lingkungan birokrasi pemerintahan/ASN.

ATURAN FORMAT DRAFT DOKUMEN & BEBAS MARKDOWN — ZERO TOLERANCE:
- MUTLAK DILARANG KERAS menggunakan tanda bintang/asterisk ganda (**teks**) maupun tunggal (*teks*) untuk cetak tebal atau miring di mana pun dalam respons.
- MUTLAK DILARANG menggunakan hashtag (#, ##, ###) untuk judul atau header apa pun.
- JANGAN pernah menggunakan simbol markdown: **, *, #, ##, ###, __, _, ~~, tanda backtick ataupun triple backtick.
- Output HARUS berupa teks polos (plain text) murni 100%, tanpa SATU PUN simbol markdown.
- Sebagai gantinya, gunakan HURUF KAPITAL untuk judul, nomor urut (1., 2., A., B.), dan garis pemisah polos (===) untuk struktur dokumen.
- Dokumen harus langsung bisa disalin ke Microsoft Word tanpa perlu membersihkan simbol apa pun.

ATURAN TATA LETAK, TABULASI & INDENTASI DOKUMEN:
- Buat header dokumen dinas yang rapi. Sejajarkan posisi titik dua (:) pada bagian metadata menggunakan spasi penyesuai agar berbaris lurus vertikal secara rapi dan estetis. Contoh:
  Nama Rapat     : RAPAT KOORDINASI
  Pimpinan Rapat : Kepala Bappeda
  Tanggal        : 23 Juni 2026
- Gunakan garis pembatas polos seperti "==================================================" untuk memisahkan kop/header dengan isi naskah.
- Terapkan indentasi (sekitar 3 spasi masuk ke dalam) untuk seluruh paragraf, daftar poin, dan sub-poin di bawah setiap subjudul (seperti A., B., C., dst.) agar teks berjenjang rapi dan lega.
- Berikan spasi baris kosong yang cukup antara judul, subjudul, paragraf, dan bagian dokumen agar naskah tidak menumpuk padat dan sangat nyaman dibaca.

STANDAR DURASI & STRUKTUR SAMBUTAN/PIDATO:
- Jika pengguna meminta draf naskah pidato/sambutan dengan estimasi durasi waktu tertentu, tulis naskah dengan panjang yang realistis (kecepatan berbicara normal ~100-125 kata per menit):
  * Durasi 5 menit: Minimal 500-600 kata.
  * Durasi 10 menit: Minimal 1000-1200 kata.
  * Durasi 15 menit: Minimal 1500-1800 kata.
  * Durasi 20 menit: Minimal 2000-2400 kata.
- Struktur naskah pidato/sambutan wajib mengikuti protokol pemerintahan resmi:
  1. SAPAAN KEHORMATAN (Urutan pejabat dari eselon/kedudukan tertinggi ke terendah).
  2. PEMBUKA/MUKADIMAH (Ucapan syukur, rasa hormat).
  3. SUBSTANSI/ISI POKOK (Uraikan tema secara mendalam, jelaskan prioritas kebijakan daerah, arah pembangunan RKPD/RPJMD, serta sinergi lintas sektor secara terstruktur).
  4. PENUTUP (Harapan, doa, apresiasi, salam penutup).
- Jangan mengarang data sensitif secara tidak realistis.

Pustaka Kerja (Basis Pengetahuan Anda):
Saat ini user memiliki berkas berikut dalam Pustaka Kerja mereka:
${uploadedFiles.length === 0 ? '- (Tidak ada berkas rujukan diunggah)' : uploadedFiles.map(f => `- Nama: ${f.name}, Kategori: ${f.category}, Deskripsi: ${f.description || ''}`).join('\n')}

Gunakan informasi berkas di atas sebagai prioritas rujukan utama jika pengguna menanyakan tentang dokumen perencanaan, RKPD, RPJMD, SOP, atau draf surat dinas terkait.`
    };

    // Limit to last 10 messages to avoid 413 Payload Too Large
    // (localStorage accumulates history across sessions on mobile)
    const MAX_HISTORY = 10;
    const trimmedHistory = messagesHistory.slice(-MAX_HISTORY);

    // Filter message histories to only match the API standard (role, content)
    const apiMessages = [
      systemMsg,
      ...trimmedHistory.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    // If an action-specific custom instructions prompt is passed, append it
    if (customPromptText) {
      apiMessages.push({
        role: 'user',
        content: customPromptText
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        temperature: 0.25,
        max_tokens: 2048   // Cap response size to stay within Groq limits
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Kode Status: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content || '';
    // Always strip any markdown symbols from AI output before returning
    return stripDocMarkdown(rawContent);
  } catch (err: any) {
    console.error("Groq API error:", err);
    throw err;
  }
};

export function useAIChat(
  onSaveDraft?: (draft: Omit<Draft, 'id' | 'createdAt' | 'lastModified'>) => void,
  uploadedFiles: PustakaFile[] = []
) {
  const groqApiKey = (import.meta.env.VITE_GROQ_API_KEY as string) || '';
  const groqModel = (import.meta.env.VITE_GROQ_MODEL as string) || 'llama-3.1-8b-instant';
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [WELCOME_MESSAGE];
      }
    }
    return [WELCOME_MESSAGE];
  });
  
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  const addMessage = (role: 'user' | 'assistant', content: string, extra: Partial<Message> = {}) => {
    const newMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date().toISOString(),
      ...extra
    };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  };

  // Simulates or calls the bot response
  const simulateBotResponse = async (userText: string, customPrompt = '', newUserMsg?: Message) => {
    setIsTyping(true);
    
    if (groqApiKey) {
      try {
        // Only send last 10 messages to avoid 413 on devices with long history
        const history = newUserMsg ? [...messages.slice(-10), newUserMsg] : [...messages.slice(-10)];
        const reply = await callGroqAPI(history, customPrompt, uploadedFiles, groqApiKey, groqModel);
        setIsTyping(false);
        addMessage('assistant', reply);
      } catch (err: any) {
        setIsTyping(false);
        addMessage('assistant', `Mohon maaf, terjadi kendala saat menghubungkan ke Bot Aspri (API Groq): **${err.message}**. \n\n*Silakan periksa kembali Kunci API Anda di menu pengaturan profil.*`);
      }
    } else {
      // Offline Simulation Fallback
      setTimeout(() => {
        let botContent = '';
        
        if (customPrompt) {
          botContent = customPrompt;
        } else {
          const text = userText.toLowerCase();
          
          const matchingFile = uploadedFiles.find(f => {
            const cleanName = f.name.toLowerCase().split('.')[0];
            return text.includes(cleanName.substring(0, 10)) || text.includes(f.category.toLowerCase());
          });

          if (matchingFile) {
            botContent = `Membaca rujukan dari **Pustaka Kerja**:\n📁 Kategori: **${matchingFile.category}**\n📄 Berkas: \`${matchingFile.name}\`\n\nBerdasarkan isi dokumen tersebut, berikut draf jawaban yang diselaraskan dengan tata kerja organisasi:\n\n* Usulan tindakan terkait "${userText}" akan disesuaikan dengan target kegiatan yang tertuang dalam berkas tersebut.\n\nApakah Anda memerlukan saya untuk menyusun Nota Dinas koordinasi lintas bidang terkait perihal ini?`;
          } else if (text.includes('halo') || text.includes('hi') || text.includes('selamat')) {
            botContent = 'Halo! Saya Bot Aspri. Ada berkas laporan yang ingin dirangkum, briefing note, atau sambutan pimpinan yang perlu disiapkan hari ini? Silakan unggah dokumen pendukung ke **Pustaka Kerja** terlebih dahulu agar draf yang saya buat lebih selaras.';
          } else if (text.includes('terima kasih') || text.includes('thanks') || text.includes('suwun')) {
            botContent = 'Sama-sama! Senang bisa mempermudah pekerjaan administrasi Anda. Jangan ragu untuk menyimpan berkas penting di **Pustaka Kerja** agar saya dapat membantu lebih baik.';
          } else {
            botContent = `Berikut draf yang dapat digunakan dan disesuaikan sesuai kebutuhan Anda:\n\n---\n\n**Draf Catatan Kerja Aspri:**\n\nTerkait usulan Anda tentang "${userText}", saya merekomendasikan pembuatan Nota Dinas koordinasi. \n\n*Catatan: Anda dapat mengunggah file SOP atau Rencana Kerja di Pustaka Kerja agar saya dapat menyusun draf ini dengan referensi penulisan organisasi yang lebih presisi.*`;
          }
        }

        setIsTyping(false);
        addMessage('assistant', botContent);
      }, 1500);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = addMessage('user', text);
    simulateBotResponse(text, '', userMsg);
  };

  // Triggers generation based on quick command form fields
  const handleExecuteCommand = async (command: string, values: Record<string, string>) => {
    const cmdMeta = COMMANDS_METADATA[command as keyof typeof COMMANDS_METADATA];
    if (!cmdMeta) return;

    // Add user message displaying command inputs (plain text, no markdown)
    const displayInputs = Object.entries(values)
      .map(([key, val]) => {
        const field = cmdMeta.fields.find(f => f.key === key);
        return `  - ${field?.label || key}: ${val}`;
      })
      .join('\n');

    const userMessageContent = `Memicu Perintah: ${cmdMeta.name}\n\n${displayInputs}`;
    const userMsg = addMessage('user', userMessageContent, {
      isCommand: true,
      commandType: command,
      formValues: values
    });

    setIsTyping(true);

    if (groqApiKey) {
      try {
        const commandPrompt = `Tolong buatkan draf dokumen resmi untuk perintah ${command} (${cmdMeta.name}) berdasarkan informasi berikut:\n${displayInputs}\n\n` +
          `ATURAN FORMAT DRAFT DOKUMEN (MUTLAK):\n` +
          `- DILARANG KERAS menggunakan simbol markdown seperti hashtag (#, ##, ###) untuk judul/header, maupun bintang/asterisk (*, **) untuk cetak tebal/miring di dalam isi draf.\n` +
          `- Gunakan huruf kapital (UPPERCASE) secara polos untuk penulisan judul, subjudul, dan bagian penekanan penting.\n` +
          `- Gunakan pemisah baris kosong biasa dan penomoran polos (1., 2., 3.) untuk daftar poin.\n` +
          `- Seluruh isi draf harus bersih dari simbol markdown agar siap disalin langsung ke aplikasi pengolah kata resmi pimpinan.\n\n` +
          `ATURAN TATA LETAK, TABULASI & INDENTASI (WAJIB):\n` +
          `- Sejajarkan letak tanda titik dua (:) pada bagian metadata header dokumen dinas menggunakan spasi penyesuai agar berbaris lurus vertikal secara rapi. (Contoh:\n` +
          `  Nama Rapat     : ...\n` +
          `  Pimpinan Rapat : ...\n` +
          `  Tanggal        : ...)\n` +
          `- Gunakan pembatas garis mendatar polos seperti "==================================================" di bawah header untuk memisahkan kop/header dengan isi naskah.\n` +
          `- Terapkan indentasi tabulasi masuk ke dalam (sekitar 3-4 spasi) untuk isi paragraf, daftar poin, dan penjelasan di bawah setiap subjudul (A., B., C., dst.) agar teks terstruktur rapi dan berjenjang.\n` +
          `- Gunakan pemisah spasi baris kosong yang cukup (double spacing) antar bagian dokumen agar terlihat lapang dan sangat nyaman dibaca.\n\n` +
          `STANDAR PENULISAN & DURASI PEMERINTAHAN:\n` +
          `- Susun draf dokumen lengkap yang berwibawa, rapi, dan formal khas birokrasi pemerintahan/ASN.\n` +
          `- Jika perintah adalah /sambutan (pidato), sesuaikan panjang naskah secara realistis dengan durasi yang diminta. Jangan buat draf yang terlalu singkat/pendek!\n` +
          `  * Durasi 5 menit: Minimal 500-600 kata.\n` +
          `  * Durasi 10 menit: Minimal 1000-1200 kata.\n` +
          `  * Durasi 15 menit: Minimal 1500-1800 kata.\n` +
          `  * Durasi 20 menit: Minimal 2000-2400 kata.\n` +
          `- Naskah sambutan wajib memuat struktur lengkap: Protokol Sapaan Kehormatan (dari eselon tertinggi ke terendah), Pembuka/Mukadimah, Isi Substansi (menguraikan tema secara mendalam, kebijakan daerah, arah pembangunan RKPD/RPJMD, serta sinergi lintas sektor secara terstruktur), Penutup (harapan, doa, apresiasi, salam penutup).\n` +
          `- Jangan mengarang hal yang tidak logis.\n\n` +
          `Letakkan keseluruhan isi dokumen resmi tersebut di dalam satu buah blok kode \`\`\` sehingga pengguna bisa menyimpannya secara otomatis.`;
        const reply = await callGroqAPI([...messages.slice(-10), userMsg], commandPrompt, uploadedFiles, groqApiKey, groqModel);
        setIsTyping(false);
        addMessage('assistant', reply);
      } catch (err: any) {
        setIsTyping(false);
        addMessage('assistant', `Gagal menyusun dokumen via API Groq: **${err.message}**. Silakan cek status jaringan atau kunci API Anda.`);
      }
    } else {
      setTimeout(() => {
        let docTitle = '';
        let generatedDoc = '';
        let category = '';

        if (command === '/sambutan') {
          category = 'Sambutan';
          docTitle = `Sambutan ${values.pimpinan} - ${values.acara}`;
          
          const durasiVal = parseInt(values.durasi) || 10;
          
          const sapaan = `Yth. Unsur Pimpinan Daerah,
Yth. Kepala Dinas, Kepala Badan, Kepala Kantor di lingkungan Pemerintah Daerah,
Yth. Para Camat se-Kabupaten/Kota,
Serta Bapak, Ibu, para delegasi, dan hadirin sekalian yang saya hormati dan saya banggakan.`;

          const openingText = `   Puji dan syukur senantiasa kita panjatkan ke hadirat Allah Subhanahu Wata'ala, Tuhan Yang Maha Esa, atas limpahan rahmat, hidayah, dan karunia-Nya, sehingga pada pagi hari yang penuh berkah ini kita dapat berkumpul bersama dalam keadaan sehat wal'afiat untuk menghadiri Pembukaan Rapat Koordinasi Rencana Kerja Pemerintah Daerah (RKPD). Kehadiran kita di sini adalah wujud komitmen nyata kita dalam mengabdi dan merencanakan masa depan daerah yang lebih baik, maju, dan sejahtera bagi seluruh lapisan masyarakat.`;

          const contextText = `   Penyelenggaraan acara ini dengan mengusung tema utama "${values.tema}" merupakan sebuah momentum yang sangat strategis dan krusial. Perencanaan pembangunan bukanlah sekadar rutinitas administratif tahunan, melainkan kompas arah kebijakan daerah yang menentukan ke mana daerah ini akan kita bawa dalam beberapa tahun ke depan. Di tengah tantangan global, dinamika fiskal, dan tuntutan masyarakat yang semakin dinamis, kita dituntut untuk melahirkan dokumen perencanaan yang responsif, adaptif, serta berorientasi pada hasil nyata yang dapat dirasakan oleh masyarakat secara langsung.`;

          let coreParagraphs = '';
          
          if (durasiVal <= 5) {
            coreParagraphs = `   Dalam kesempatan yang berharga ini, saya ingin menekankan tiga poin penting:

   1. SINERGI LINTAS SEKTOR
      Keberhasilan program pembangunan ini sepenuhnya bertumpu pada kolaborasi yang erat antara seluruh OPD, instansi vertikal, pihak swasta, dan elemen masyarakat. Kepala Dinas dan Camat wajib melepas ego sektoral dan aktif berkomunikasi guna mengintegrasikan program kerja agar saling mendukung dan tidak tumpang tindih.

   2. IMPLEMENTASI BERKELANJUTAN DAN EFEKTIF
      Rencana yang telah kita sepakati dalam forum RKPD ini tidak boleh berhenti sebagai dokumen di atas kertas saja. Segera translasikan rencana strategis ini ke dalam program aksi nyata di lapangan. Prioritaskan program-program yang memiliki dampak langsung terhadap pengentasan kemiskinan, penurunan stunting, dan peningkatan pelayanan publik di wilayah tugas masing-masing.

   3. MONITORING DAN EVALUASI BERKALA
      Setiap tahapan pelaksanaan program wajib dipantau dan dievaluasi secara berkala. Hal ini sangat penting untuk mendeteksi kendala operasional secara dini dan melakukan koreksi kebijakan secara cepat. Bappeda selaku koordinator harus mengawal ketat target kinerja yang telah disepakati bersama.`;
          } else if (durasiVal <= 10) {
            coreParagraphs = `   Dalam forum koordinasi yang sangat penting ini, selaku pimpinan, saya ingin menyampaikan dan menekankan beberapa arahan strategis demi kelancaran pembangunan daerah ke depan:

   1. PERKUAT SINERGI DAN INTEGRASI LINTAS SEKTOR
      Keberhasilan pencapaian target pembangunan daerah sepenuhnya bertumpu pada kekuatan kolaborasi antar instansi. Saya instruksikan kepada seluruh Kepala Dinas dan Camat untuk melepas ego sektoral. Rapatkan barisan, lakukan sinkronisasi data perencanaan, dan pastikan setiap indikator kinerja utama saling mendukung. Kita harus bekerja sebagai satu kesatuan tim yang solid demi kemajuan daerah yang kita cintai ini.

   2. IMPLEMENTASI NYATA DAN BERDAMPAK LUAS
      Rencana kerja yang kita diskusikan dan sepakati pada hari ini harus segera ditranslasikan menjadi aksi nyata di lapangan. Saya tidak ingin program kerja hanya menjadi catatan laporan serapan anggaran semata. Fokuskan sumber daya pada implementasi program-program prioritas yang bersentuhan langsung dengan kebutuhan dasar masyarakat, seperti pembangunan infrastruktur pelayanan dasar, peningkatan kualitas pendidikan dan kesehatan, serta pemberdayaan ekonomi lokal.

   3. MONITORING DAN EVALUASI TERPADU SECARA BERKALA
      Program yang baik tidak akan berjalan optimal tanpa sistem pengawasan yang andal. Saya meminta Bappeda bersama Inspektorat untuk mengawal jalannya pelaksanaan rencana kerja ini secara ketat. Lakukan evaluasi secara berkala pada setiap triwulan untuk mendeteksi kendala, penyimpangan, atau pelambatan secara dini, sehingga kita bisa segera mengambil langkah perbaikan yang cepat dan tepat sasaran.

   4. OPTIMALISASI PELAYANAN PUBLIK DI TINGKAT KECAMATAN
      Kepada para Camat selaku garda terdepan pelayanan, saya minta untuk meningkatkan kepekaan sosial terhadap aspirasi masyarakat di wilayahnya. Jadilah jembatan komunikasi yang efektif antara kebijakan pemerintah daerah dengan kebutuhan riil di desa dan kelurahan. Koordinasikan dengan dinas terkait agar program prioritas dapat terdistribusi secara adil dan merata.`;
          } else {
            coreParagraphs = `   Dalam kesempatan yang sangat baik dan terhormat ini, perkenankan saya menyampaikan beberapa pokok arahan penting yang harus menjadi acuan bersama:

   1. KONSISTENSI PERENCANAAN DAN PENGANGGARAN DAERAH
      Kita harus memastikan bahwa apa yang direncanakan dalam Rencana Kerja Pemerintah Daerah (RKPD) ini sejalan dengan arah kebijakan pembangunan jangka menengah dan jangka panjang daerah. Setiap usulan program kerja dari OPD harus didasarkan pada analisis kebutuhan nyata masyarakat, bukan keinginan semata. Sinkronisasi antara perencanaan pembangunan dan penganggaran daerah harus dikawal ketat demi menjamin efisiensi dan efektivitas penggunaan APBD.

   2. SINERGI LINTAS SEKTOR DAN PEMANGKU KEPENTINGAN
      Pembangunan daerah yang sukses memerlukan partisipasi aktif dan kolaborasi dari seluruh pemangku kepentingan. Kepada Kepala Dinas, Camat, dan jajaran perangkat daerah, saya tegaskan kembali bahwa ego sektoral adalah penghambat utama kemajuan. Kita harus membangun ekosistem kerja yang kolaboratif, transparan, dan terintegrasi. Libatkan pihak akademisi, dunia usaha, institusi perbankan, serta tokoh masyarakat untuk memperkuat daya dukung program prioritas kita.

   3. FOKUS PADA PENYELESAIAN ISU STRATEGIS DAERAH
      Arahkan fokus program prioritas kita pada penyelesaian isu-isu strategis daerah. Kita masih dihadapkan pada tantangan pengentasan kemiskinan ekstrem, penurunan angka stunting, peningkatan indeks pembangunan manusia, serta penciptaan lapangan kerja baru melalui pemberdayaan UMKM. Pastikan dinas teknis merancang program intervensi yang komprehensif, berbasis data yang akurat, dan memiliki tolok ukur keberhasilan yang jelas.

   4. PERCEPATAN IMPLEMENTASI DAN AKSELERASI REFORMASI BIROKRASI
      Draf rencana yang disepakati hari ini harus segera ditindaklanjuti dengan persiapan teknis pelaksanaan anggaran. Saya minta percepatan proses pengadaan barang dan jasa pemerintah agar serapan anggaran dapat berjalan proporsional sejak awal tahun anggaran. Seiring dengan hal itu, akselerasi penerapan sistem pemerintahan berbasis elektronik (SPBE) harus terus didorong di semua lini pelayanan publik guna menciptakan birokrasi yang lincah, transparan, dan akuntabel.

   5. PENINGKATAN PERAN CAMAT DALAM PERENCANAAN PARTISIPATIF
      Para Camat memiliki peran vital dalam mengoordinasikan Musrenbang di tingkat kecamatan. Saya minta para Camat memastikan usulan-usulan prioritas dari tingkat desa dan kelurahan terakomodasi dengan baik dalam forum RKPD ini. Lakukan pembinaan dan pengawasan yang intensif terhadap penyelenggaraan pemerintahan desa agar alokasi dana desa dapat bersinergi secara optimal dengan program pembangunan kabupaten/kota.

   6. EVALUASI DAN AKUNTABILITAS TARGET KINERJA
      Saya menginstruksikan Bappeda untuk membangun sistem pemantauan kinerja program yang terintegrasi. Setiap progress capaian indikator RKPD wajib dilaporkan secara berkala setiap triwulan. Evaluasi ini bukan hanya untuk menilai kinerja penyerapan anggaran, melainkan untuk mengukur kemanfaatan program bagi masyarakat. Kita harus berani melakukan refocusing program apabila di tengah jalan ditemukan ketidaksesuaian target atau keterlambatan realisasi fisik yang signifikan.`;
          }

          const closingText = `   Demikian beberapa hal penting yang saya sampaikan sebagai arahan untuk menjadi perhatian dan pedoman bagi kita semua dalam menyusun dokumen RKPD ini. Saya menyampaikan terima kasih yang sebesar-besarnya serta apresiasi yang setinggi-tingginya atas dedikasi, kerja keras, dan kontribusi aktif dari seluruh Kepala Dinas, para Camat, dan delegasi yang hadir. Selamat melaksanakan Rapat Koordinasi, semoga Allah Subhanahu Wata'ala senantiasa meridai ikhtiar kita bersama untuk memajukan daerah dan menyejahterakan masyarakat.

Sekian dan terima kasih.

Wabillahi taufiq wal hidayah,
Wassalamu’alaikum Warahmatullahi Wabarakatuh.`;

          generatedDoc = `NASKAH SAMBUTAN ${values.pimpinan.toUpperCase()}
TEMA   : ${values.tema.toUpperCase()}
ACARA  : ${values.acara.toUpperCase()}
DURASI : ${values.durasi} MENIT
==================================================

${sapaan}

${openingText}

${contextText}

${coreParagraphs}

${closingText}`;
        } else if (command === '/notadinas') {
          category = 'Nota Dinas';
          docTitle = `Nota Dinas - Hal: ${values.hal}`;
          generatedDoc = `BAPPEDA PROVINSI
NOTA DINAS
==================================================

Kepada Yth. : ${values.kepada}
Dari        : ${values.dari}
Tanggal     : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Nomor       : 005/${Math.floor(100 + Math.random() * 900)}/Bappeda/${new Date().getFullYear()}
Sifat       : Penting/Segera
Hal         : ${values.hal}
--------------------------------------------------

Sehubungan dengan kebutuhan koordinasi kedinasan, bersama ini diinstruksikan beberapa poin kegiatan penting sebagai berikut:

${values.isi.split('\n').map((poin, i) => {
  const clean = poin.replace(/^\d+[\.\-\s]*/, '');
  return `   ${i + 1}. ${clean}`;
}).join('\n')}

Diharapkan seluruh pihak pelaksana dapat menindaklanjuti instruksi di atas secara intensif dan melaporkan progress berkala secara langsung ke pimpinan.

Demikian nota dinas ini disampaikan untuk menjadi perhatian dan dilaksanakan dengan penuh tanggung jawab. Terima kasih.


${values.dari.toUpperCase()}`;
        } else if (command === '/surat') {
          category = 'Surat';
          docTitle = `Undangan Rapat - Hal: ${values.hal}`;
          generatedDoc = `BAPPEDA PROVINSI
SURAT UNDANGAN
==================================================

Nomor    : 005/Und/${Math.floor(100 + Math.random() * 900)}/${new Date().getFullYear()}
Sifat    : Penting
Lampiran : -
Hal      : Undangan Rapat - ${values.hal}
--------------------------------------------------

Kepada Yth.
${values.opd}
di Tempat

Dengan hormat,

Dalam rangka menindaklanjuti program kerja pembangunan daerah, bersama ini kami mengundang Bapak/Ibu untuk dapat menghadiri rapat koordinasi yang akan diselenggarakan pada:

   Hari/Tanggal : ${values.waktu}
   Agenda Rapat : Pembahasan mengenai "${values.agenda}"
   Tempat       : Aula Rapat Utama Bappeda

Mengingat pentingnya agenda pembahasan ini, dimohon kehadiran Bapak/Ibu Kepala Instansi secara langsung tanpa diwakilkan.

Demikian undangan ini kami sampaikan. Atas perhatian, kehadiran, dan kerja samanya kami ucapkan terima kasih.


KEPALA BAPPEDA PROVINSI
(ditandatangani secara elektronik)`;
        } else if (command === '/ringkas') {
          category = 'Laporan';
          docTitle = `Ringkasan Laporan - ${values.judul}`;
          generatedDoc = `RINGKASAN EKSEKUTIF DOKUMEN
==================================================
Dokumen        : ${values.judul.toUpperCase()}
Fokus Analisis : ${values.fokus.toUpperCase()}
Tanggal        : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
--------------------------------------------------

Berikut draf ringkasan yang telah diekstrak dan disesuaikan dari laporan yang diberikan:

1. POIN UTAMA DAN RINGKASAN SINGKAT

   Laporan bertajuk "${values.judul}" memuat analisis deskriptif mengenai kemajuan pelaksanaan program pembangunan daerah. Berdasarkan data yang diunggah, berikut ringkasannya:

   - Capaian Kegiatan: Capaian kumulatif program kerja menunjukkan kemajuan positif sebesar 82%, namun realisasi anggaran secara umum mengalami deviasi sekitar 12%.
   - Temuan Utama: Ditemukan kendala administratif dalam proses tender logistik pembangunan yang berpotensi menghambat penyelesaian proyek fisik utama.
   - Rekomendasi Kebijakan: Disarankan percepatan koordinasi dengan Unit Pengadaan Barang/Jasa (UKPBJ) untuk memangkas waktu lelang dan mendorong komitmen penyerapan anggaran OPD.

Draf ringkasan ini dapat dijadikan bahan materi paparan singkat pimpinan dalam rapat koordinasi mendatang.`;
        } else if (command === '/notulen') {
          category = 'Rapat';
          docTitle = `Notulen Rapat - ${values.judul}`;
          generatedDoc = `NOTULENSI RAPAT KOORDINASI
==================================================
Nama Rapat     : ${values.judul.toUpperCase()}
Pimpinan Rapat : ${values.pimpinan}
Tanggal        : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
--------------------------------------------------

A. POKOK PEMBAHASAN DAN DISKUSI

   Rapat koordinasi dipimpin langsung oleh ${values.pimpinan} untuk membahas isu-isu krusial. Beberapa catatan diskusi utama yang disepakati adalah sebagai berikut:

${values.poin.split('\n').map(p => `   - ${p.trim()}`).join('\n')}

B. KEPUTUSAN RAPAT (KEY DECISIONS)

   1. Menyetujui kerangka pemecahan masalah koordinasi sektoral sesuai dengan arahan pimpinan.
   2. Membentuk tim monitoring kecil untuk memantau kelancaran rencana tindak lanjut.

C. RENCANA TINDAK LANJUT (ACTION ITEMS)

   1. Penyusunan laporan rincian teknis program (Penanggung Jawab: Bidang terkait Bappeda, Tenggat: 3 hari kerja).
   2. Penyampaian surat pemberitahuan koordinasi ke dinas sektoral (Penanggung Jawab: Sekretariat, Tenggat: Besok).

Notulen ini disusun secara otomatis oleh Bot Aspri.`;
        }

        setIsTyping(false);
        
        const botResponseText = `Berikut draf **${category}** yang telah selesai saya susun berdasarkan data formulir terpandu yang Anda masukkan:

\`\`\`
${generatedDoc}
\`\`\`

---
*Anda dapat menekan tombol **"Simpan ke Pusat Draft"** di bawah pesan ini untuk mengarsipkan draf ini secara resmi.*`;

        addMessage('assistant', botResponseText);

      // Auto trigger the onSaveDraft callback if supplied
      if (onSaveDraft && docTitle && generatedDoc) {
        onSaveDraft({
          title: docTitle,
          category: category,
          content: generatedDoc
        });
      }
    }, 2000);
    }
  };

  return {
    messages,
    isTyping,
    clearChat,
    handleSendMessage,
    handleExecuteCommand
  };
}
