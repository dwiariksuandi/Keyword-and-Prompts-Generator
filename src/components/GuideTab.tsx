import React, { useRef } from 'react';
import { BookOpen, Download, CheckCircle2, Info, Zap, Sparkles, Search, ShieldCheck, FileText, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GuideTab() {
  const guideRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!guideRef.current) return;
    
    const canvas = await html2canvas(guideRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#050505'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('Panduan_Penggunaan_AdobeStock_Insight.pdf');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Compass className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Neural <span className="text-white/40">Navigator</span></h1>
            <p className="text-white/40 font-medium">Master the architecture of Adobe Stock Insight.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadPDF}
          className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-white/5 border border-white/10"
        >
          <Download size={20} />
          <span className="uppercase tracking-widest text-[10px]">Download Protocol</span>
        </motion.button>
      </div>

      <div ref={guideRef} className="bg-[#0A0A0A] p-8 sm:p-16 space-y-24 text-white/60 relative overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        {/* Header Section for PDF */}
        <div className="border-b border-white/5 pb-12 relative">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">ADOBE STOCK <span className="text-white/40">INSIGHT</span></h2>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-lg border border-white/10">v1.3.0</span>
          </div>
          <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.2em]">Ultimate AI-Powered Research & Prompt Engineering Tool</p>
        </div>

        {/* Section 1: Introduction */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Info size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.2em]">01. Pendahuluan</h3>
          </div>
          <p className="leading-relaxed font-medium text-lg text-white/40">
            Adobe Stock Insight adalah aplikasi berbasis AI yang dirancang khusus untuk membantu kontributor microstock (terutama Adobe Stock) dalam melakukan riset pasar, menemukan niche yang menguntungkan, dan membuat prompt AI berkualitas tinggi yang siap jual.
          </p>
        </motion.section>

        {/* Section 2: Fitur Utama */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.2em]">02. Fitur Utama & Fungsi</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: <Search size={24} />, title: "Market Analysis", desc: "Menganalisis kata kunci untuk menemukan \"Blue Ocean\" (niche dengan volume tinggi namun kompetisi rendah)." },
              { icon: <Sparkles size={24} />, title: "Aesthetic DNA", desc: "Fitur eksklusif untuk kategori AI Art. Unggah gambar referensi untuk mengekstrak palet warna, mood, dan gaya artistik." },
              { icon: <FileText size={24} />, title: "Prompt Scoring", desc: "Setiap prompt dinilai berdasarkan 4 kriteria: Keyword Density, Clarity, Specificity, dan Adobe Stock Adherence." },
              { icon: <ShieldCheck size={24} />, title: "Adobe Compliance", desc: "Memastikan prompt tidak mengandung merek dagang atau elemen yang dilarang oleh kebijakan Adobe Stock." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <div className="text-white group-hover:text-black transition-colors">{feature.icon}</div>
                </div>
                <h4 className="font-black text-white text-lg mb-3 uppercase tracking-tight">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-white/40 font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Cara Penggunaan */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.2em]">03. Langkah-Langkah Penggunaan Detail</h3>
          </div>
          
          <div className="space-y-8">
            {[
              { step: "01", title: "Persiapan & Konfigurasi", desc: "Pastikan Anda memiliki Gemini API Key yang valid. Buka menu 'Settings' di aplikasi dan masukkan API Key Anda. Tanpa API Key, aplikasi tidak dapat melakukan analisis atau generate prompt." },
              { step: "02", title: "Riset Niche & Keyword", desc: "Pada tab 'Analysis', masukkan topik atau niche yang ingin Anda targetkan (misal: 'Agrivoltaics'). Aplikasi akan menganalisis volume pencarian, kompetisi, dan memberikan skor peluang." },
              { step: "03", title: "Trend Forecasting", desc: "Gunakan tab 'Forecast' untuk melihat prediksi tren pasar 3-6 bulan ke depan. AI akan menganalisis data historis dan sinyal pasar untuk mengidentifikasi niche yang akan naik daun." },
              { step: "04", title: "Analisis Estetika (Opsional)", desc: "Jika Anda memiliki gambar referensi yang bagus, unggah di tab 'VisualQA'. AI akan membedah DNA estetika gambar tersebut (warna, komposisi, pencahayaan) untuk membantu Anda membuat prompt yang serupa." },
              { step: "05", title: "Generate & Optimasi Prompt", desc: "Pilih niche yang memiliki skor peluang tinggi. Klik 'Create Prompts'. Anda akan mendapatkan daftar prompt yang sudah dioptimasi. Gunakan fitur 'Critic Agent' untuk memperbaiki prompt jika skor kualitasnya masih rendah." },
              { step: "06", title: "Review & Export", desc: "Periksa skor kualitas prompt (Keyword Density, Clarity, Specificity, Adobe Adherence). Jika sudah puas, klik tombol 'Copy' atau 'Download' untuk menyalin prompt ke generator AI favorit Anda (Midjourney, Kling, dll)." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-8 rounded-[2rem] hover:bg-white/[0.02] transition-all duration-500 group border border-transparent hover:border-white/5">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black font-mono text-xl shadow-xl shadow-white/5">
                  {item.step}
                </div>
                <div>
                  <h5 className="font-black text-white text-lg mb-2 uppercase tracking-tight">{item.title}</h5>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 4: Tips Pro */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.2em]">04. Tips Pro</h3>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] space-y-6">
            <ul className="list-disc list-inside text-sm text-white/40 font-medium leading-relaxed space-y-4">
              <li><strong className="text-white">Fokus pada Blue Ocean:</strong> Cari niche dengan <em>Competition Score</em> rendah (&lt; 30) dan <em>Opportunity Score</em> tinggi (&gt; 70).</li>
              <li><strong className="text-white">Gunakan Gambar Referensi:</strong> AI bekerja jauh lebih baik jika diberikan referensi visual yang sesuai dengan gaya Adobe Stock yang Anda inginkan.</li>
              <li><strong className="text-white">Iterasi Prompt:</strong> Jangan puas dengan hasil pertama. Gunakan fitur optimasi berkali-kali untuk mendapatkan hasil yang lebih teknis dan spesifik.</li>
              <li><strong className="text-white">Perhatikan Adobe Compliance:</strong> Selalu perhatikan skor <em>Adobe Adherence</em>. Hindari prompt yang mengandung elemen yang dilarang (teks, logo, wajah selebriti).</li>
            </ul>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">© 2026 Adobe Stock Insight • Powered by Google Gemini</p>
        </div>
      </div>
    </motion.div>
  );
}
