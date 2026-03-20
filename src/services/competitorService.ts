export interface VisualGap {
  niche: string;
  missingElement: string;
  reasoning: string;
  opportunityScore: number; // 0-100
}

// Mock data untuk simulasi analisis kompetitor
const mockGaps: VisualGap[] = [
  {
    niche: 'Sustainable Architecture',
    missingElement: 'Interior dengan pencahayaan alami yang ekstrem',
    reasoning: 'Kompetitor terlalu fokus pada eksterior bangunan. Interior yang menampilkan interaksi cahaya alami masih jarang.',
    opportunityScore: 88
  },
  {
    niche: 'Back-to-School Digital Learning',
    missingElement: 'Siswa dengan ekspresi frustrasi yang autentik',
    reasoning: 'Kebanyakan aset menunjukkan siswa yang selalu bahagia. Ekspresi autentik saat belajar sulit ditemukan.',
    opportunityScore: 94
  }
];

export async function analyzeCompetitorGaps(niche: string): Promise<VisualGap[]> {
  // Simulasi analisis mendalam portofolio kompetitor
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGaps.filter(g => g.niche.toLowerCase().includes(niche.toLowerCase())));
    }, 1000);
  });
}
