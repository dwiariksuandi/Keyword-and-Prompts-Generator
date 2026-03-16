import React, { useRef } from 'react';
import { BookOpen, Download, CheckCircle2, Info, Zap, Sparkles, Search, ShieldCheck, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GuideTab() {
  const guideRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!guideRef.current) return;
    
    const canvas = await html2canvas(guideRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0B1121'
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 rounded-lg">
            <BookOpen className="w-6 h-6 text-[#00D8B6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panduan Penggunaan</h1>
            <p className="text-slate-400">Pelajari cara memaksimalkan fitur Adobe Stock Insight.</p>
          </div>
        </div>
        <button 
          onClick={downloadPDF}
          className="flex items-center justify-center gap-2 bg-[#00D8B6] hover:bg-[#00c2a3] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(0,216,182,0.2)]"
        >
          <Download size={18} />
          <span>Download PDF</span>
        </button>
      </div>

      <div ref={guideRef} className="bg-[#111827] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-12 text-slate-300">
        {/* Header Section for PDF */}
        <div className="border-b border-slate-800 pb-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Adobe Stock Insight <span className="text-[#00D8B6]">v1.3.0</span></h2>
          <p className="text-slate-500">Ultimate AI-Powered Research & Prompt Engineering Tool</p>
        </div>

        {/* Section 1: Introduction */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#00D8B6]">
            <Info size={20} />
            <h3 className="text-xl font-bold uppercase tracking-wider">1. Pendahuluan</h3>
          </div>
          <p className="leading-relaxed">
            Adobe Stock Insight adalah aplikasi berbasis AI yang dirancang khusus untuk membantu kontributor microstock (terutama Adobe Stock) dalam melakukan riset pasar, menemukan niche yang menguntungkan, dan membuat prompt AI berkualitas tinggi yang siap jual.
          </p>
        </section>

        {/* Section 2: Fitur Utama */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#00D8B6]">
            <Zap size={20} />
            <h3 className="text-xl font-bold uppercase tracking-wider">2. Fitur Utama & Fungsi</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Search className="text-[#00D8B6]" size={20} />
                <h4 className="font-bold text-white">Market Analysis (Top Tab)</h4>
              </div>
              <p className="text-sm leading-relaxed">
                Menganalisis kata kunci untuk menemukan "Blue Ocean" (niche dengan volume tinggi namun kompetisi rendah). Fitur ini mensimulasikan data real-time dari pasar microstock global.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="text-[#00D8B6]" size={20} />
                <h4 className="font-bold text-white">Aesthetic DNA Analysis</h4>
              </div>
              <p className="text-sm leading-relaxed">
                Fitur eksklusif untuk kategori AI Art. Unggah gambar referensi untuk mengekstrak palet warna, mood, gaya artistik, dan komposisi secara otomatis untuk digunakan dalam prompt baru.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-[#00D8B6]" size={20} />
                <h4 className="font-bold text-white">Prompt Scoring & Feedback</h4>
              </div>
              <p className="text-sm leading-relaxed">
                Setiap prompt yang dihasilkan akan dinilai berdasarkan 4 kriteria: Keyword Density, Clarity, Specificity, dan Adobe Stock Adherence. Anda akan mendapatkan saran perbaikan yang sangat detail.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-[#00D8B6]" size={20} />
                <h4 className="font-bold text-white">Adobe Stock Compliance</h4>
              </div>
              <p className="text-sm leading-relaxed">
                Memastikan prompt tidak mengandung merek dagang, teks, atau elemen yang dilarang oleh kebijakan Adobe Stock, sehingga meningkatkan peluang konten Anda diterima oleh reviewer.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cara Penggunaan */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#00D8B6]">
            <CheckCircle2 size={20} />
            <h3 className="text-xl font-bold uppercase tracking-wider">3. Langkah-Langkah Penggunaan</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00D8B6] text-slate-900 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h5 className="font-bold text-white">Konfigurasi API Key</h5>
                <p className="text-sm text-slate-400">Masukkan Gemini API Key Anda di halaman awal atau menu Settings untuk mengaktifkan kecerdasan AI.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00D8B6] text-slate-900 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h5 className="font-bold text-white">Pilih Tipe Konten & Keyword</h5>
                <p className="text-sm text-slate-400">Pilih kategori (Photo, Vector, dll) dan masukkan topik riset. Anda juga bisa mengunggah gambar referensi atau menempelkan URL riset.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00D8B6] text-slate-900 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h5 className="font-bold text-white">Analisis & Generate</h5>
                <p className="text-sm text-slate-400">Klik 'Start Analysis' untuk melihat peluang pasar, lalu klik 'Create Prompts' pada niche yang Anda minati.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00D8B6] text-slate-900 rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h5 className="font-bold text-white">Review & Export</h5>
                <p className="text-sm text-slate-400">Lihat skor kualitas prompt, baca feedback, lalu salin atau download prompt untuk digunakan di generator AI favorit Anda.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">© 2026 Adobe Stock Insight • Powered by Google Gemini</p>
        </div>
      </div>
    </div>
  );
}
