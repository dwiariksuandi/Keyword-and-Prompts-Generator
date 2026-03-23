import React, { useRef } from 'react';
import { Download, CheckCircle2, Info, Zap, Sparkles, Search, ShieldCheck, FileText, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GuideTab() {
  const guideRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!guideRef.current) return;
    
    const canvas = await html2canvas(guideRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0B1120'
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
            className="p-4 glass-panel bg-accent/10 border border-accent/20 futuristic-glow"
          >
            <Compass className="w-8 h-8 text-accent" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight font-display">Neural <span className="text-accent">Navigator</span></h1>
            <p className="text-slate-400 font-light">Master the architecture of Adobe Stock Insight.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-accent/20 border border-accent/20"
        >
          <Download size={20} />
          <span className="uppercase tracking-widest text-xs">Download Protocol</span>
        </motion.button>
      </div>

      <div ref={guideRef} className="glass-panel p-8 sm:p-16 space-y-20 text-slate-300 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        {/* Header Section for PDF */}
        <div className="border-b border-white/10 pb-12 relative">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-4xl font-black text-white tracking-tighter font-display">ADOBE STOCK <span className="text-accent">INSIGHT</span></h2>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] bg-accent/10 px-3 py-1 rounded-lg border border-accent/20">v1.3.0</span>
          </div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Ultimate AI-Powered Research & Prompt Engineering Tool</p>
        </div>

        {/* Section 1: Introduction */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 text-accent">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Info size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] font-display">01. Pendahuluan</h3>
          </div>
          <p className="leading-relaxed font-light text-lg">
            Adobe Stock Insight adalah aplikasi berbasis AI yang dirancang khusus untuk membantu kontributor microstock (terutama Adobe Stock) dalam melakukan riset pasar, menemukan niche yang menguntungkan, dan membuat prompt AI berkualitas tinggi yang siap jual.
          </p>
        </motion.section>

        {/* Section 2: Fitur Utama */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="flex items-center gap-4 text-accent">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] font-display">02. Fitur Utama & Fungsi</h3>
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
                className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-accent/30 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 mb-6 group-hover:futuristic-glow transition-all">
                  <div className="text-accent">{feature.icon}</div>
                </div>
                <h4 className="font-bold text-white text-lg mb-3 font-display tracking-tight">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-slate-400 font-light">
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
          className="space-y-10"
        >
          <div className="flex items-center gap-4 text-accent">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] font-display">03. Langkah-Langkah Penggunaan Detail</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { step: "01", title: "Persiapan & Konfigurasi", desc: "Pastikan Anda memiliki Gemini API Key yang valid. Buka menu 'Settings' di aplikasi dan masukkan API Key Anda. Tanpa API Key, aplikasi tidak dapat melakukan analisis atau generate prompt." },
              { step: "02", title: "Riset Niche & Keyword", desc: "Pada tab 'Analysis', masukkan topik atau niche yang ingin Anda targetkan (misal: 'Agrivoltaics'). Aplikasi akan menganalisis volume pencarian, kompetisi, dan memberikan skor peluang." },
              { step: "03", title: "Analisis Estetika (Opsional)", desc: "Jika Anda memiliki gambar referensi yang bagus, unggah di tab 'VisualQA'. AI akan membedah DNA estetika gambar tersebut (warna, komposisi, pencahayaan) untuk membantu Anda membuat prompt yang serupa." },
              { step: "04", title: "Generate & Optimasi Prompt", desc: "Pilih niche yang memiliki skor peluang tinggi. Klik 'Create Prompts'. Anda akan mendapatkan daftar prompt yang sudah dioptimasi. Gunakan fitur 'Critic Agent' untuk memperbaiki prompt jika skor kualitasnya masih rendah." },
              { step: "05", title: "Review & Export", desc: "Periksa skor kualitas prompt (Keyword Density, Clarity, Specificity, Adobe Adherence). Jika sudah puas, klik tombol 'Copy' atau 'Download' untuk menyalin prompt ke generator AI favorit Anda (Midjourney, Kling, dll)." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-6 rounded-3xl hover:bg-white/5 transition-colors group">
                <div className="flex-shrink-0 w-12 h-12 bg-accent text-slate-900 rounded-2xl flex items-center justify-center font-bold font-mono text-xl shadow-lg shadow-accent/20">
                  {item.step}
                </div>
                <div>
                  <h5 className="font-bold text-white text-lg mb-2 font-display tracking-tight">{item.title}</h5>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{item.desc}</p>
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
          className="space-y-10"
        >
          <div className="flex items-center gap-4 text-accent">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] font-display">04. Tips Pro</h3>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4">
            <ul className="list-disc list-inside text-sm text-slate-400 font-light leading-relaxed space-y-2">
              <li><strong>Fokus pada Blue Ocean:</strong> Cari niche dengan <em>Competition Score</em> rendah (&lt; 30) dan <em>Opportunity Score</em> tinggi (&gt; 70).</li>
              <li><strong>Gunakan Gambar Referensi:</strong> AI bekerja jauh lebih baik jika diberikan referensi visual yang sesuai dengan gaya Adobe Stock yang Anda inginkan.</li>
              <li><strong>Iterasi Prompt:</strong> Jangan puas dengan hasil pertama. Gunakan fitur optimasi berkali-kali untuk mendapatkan hasil yang lebih teknis dan spesifik.</li>
              <li><strong>Perhatikan Adobe Compliance:</strong> Selalu perhatikan skor <em>Adobe Adherence</em>. Hindari prompt yang mengandung elemen yang dilarang (teks, logo, wajah selebriti).</li>
            </ul>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em]">© 2026 Adobe Stock Insight • Powered by Google Gemini</p>
        </div>
      </div>
    </motion.div>
  );
}
