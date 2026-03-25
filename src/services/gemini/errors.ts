export function handleGeminiError(error: any): string {
  const errorString = error instanceof Error ? error.message : String(error);
  
  const errorMap: Record<string, string> = {
    'urls to lookup exceeds the limit': "⚠️ Terlalu Banyak URL (Error 400)\n\nPenyebab: Permintaan mengandung terlalu banyak URL untuk dianalisis (maksimal 20).\n\nSolusi: Kurangi jumlah URL dalam prompt atau gunakan satu URL referensi saja.",
    '429': "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\nPenyebab:\n1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\nSolusi:\n• Tunggu 1-2 menit sebelum mencoba lagi.\n• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.",
    'RESOURCE_EXHAUSTED': "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\nPenyebab:\n1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\nSolusi:\n• Tunggu 1-2 menit sebelum mencoba lagi.\n• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.",
    '401': "❌ API Key Tidak Valid (Error 401)\n\nPenyebab:\n• API Key salah atau tidak memiliki izin.\n• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\nSolusi:\n• Periksa kembali API Key Anda.\n• Pastikan API Key berasal dari 'Google AI Studio'.",
    'API_KEY_INVALID': "❌ API Key Tidak Valid (Error 401)\n\nPenyebab:\n• API Key salah atau tidak memiliki izin.\n• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\nSolusi:\n• Periksa kembali API Key Anda.\n• Pastikan API Key berasal dari 'Google AI Studio'.",
    '403': "🚫 Akses Ditolak (Error 403)\n\nPenyebab:\n• API Key tidak memiliki izin untuk mengakses model ini.\n• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\nSolusi:\n• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n• Coba buat API Key baru di project yang berbeda.",
    'PERMISSION_DENIED': "🚫 Akses Ditolak (Error 403)\n\nPenyebab:\n• API Key tidak memiliki izin untuk mengakses model ini.\n• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\nSolusi:\n• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n• Coba buat API Key baru di project yang berbeda.",
    '404': "🔍 Model Tidak Ditemukan (Error 404)\n\nPenyebab:\n• Nama model yang dipilih tidak tersedia atau salah.\n\nSolusi:\n• Coba ganti model ke 'gemini-3.1-flash-lite-preview' di Pengaturan.",
    'NOT_FOUND': "🔍 Model Tidak Ditemukan (Error 404)\n\nPenyebab:\n• Nama model yang dipilih tidak tersedia atau salah.\n\nSolusi:\n• Coba ganti model ke 'gemini-3.1-flash-lite-preview' di Pengaturan.",
    'SAFETY': "🛡️ Konten Diblokir (Safety Filter)\n\nPenyebab:\n• AI mendeteksi konten yang melanggar kebijakan keamanan.\n\nSolusi:\n• Ubah kata kunci atau deskripsi Anda agar lebih umum.",
    'INTERNAL': "⚙️ Kesalahan Internal Server (Error 500)\n\nPenyebab: Terjadi gangguan pada server Google.\n\nSolusi: Tunggu beberapa saat dan coba lagi.",
    'UNAVAILABLE': "⚙️ Server Tidak Tersedia (Error 503)\n\nPenyebab: Server Google sedang sibuk atau dalam pemeliharaan.\n\nSolusi: Tunggu beberapa saat dan coba lagi.",
    'DEADLINE_EXCEEDED': "⏱️ Waktu Permintaan Habis (Timeout)\n\nPenyebab: Koneksi internet lambat atau server butuh waktu terlalu lama.\n\nSolusi: Periksa koneksi internet Anda dan coba lagi."
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (errorString.includes(key)) {
      return message;
    }
  }

  return `⚠️ Terjadi Kesalahan Tak Terduga\n\nDetail: ${errorString.substring(0, 200)}`;
}
