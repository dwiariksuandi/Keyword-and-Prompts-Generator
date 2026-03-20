export interface Trend {
  id: string;
  niche: string;
  forecastScore: number; // 0-100
  seasonality: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';
  description: string;
  recommendedAction: string;
}

// Mock data yang dirancang untuk integrasi API di masa depan
const mockTrends: Trend[] = [
  {
    id: '1',
    niche: 'Sustainable Architecture',
    forecastScore: 85,
    seasonality: 'Year-round',
    description: 'Permintaan tinggi untuk desain bangunan hemat energi dan material ramah lingkungan.',
    recommendedAction: 'Fokus pada pencahayaan alami dan material tekstur kayu/batu.'
  },
  {
    id: '2',
    niche: 'Back-to-School Digital Learning',
    forecastScore: 92,
    seasonality: 'Summer',
    description: 'Puncak permintaan pada bulan Juni-Juli untuk aset pembelajaran digital.',
    recommendedAction: 'Siapkan aset siswa dengan perangkat digital dan lingkungan belajar modern.'
  },
  {
    id: '3',
    niche: 'Holiday Festive Decor',
    forecastScore: 95,
    seasonality: 'Autumn',
    description: 'Permintaan melonjak mulai Agustus untuk persiapan kampanye akhir tahun.',
    recommendedAction: 'Mulai produksi aset dekorasi minimalis dan hangat.'
  }
];

export async function getTrendForecast(niche?: string): Promise<Trend[]> {
  // Simulasi panggilan API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (niche) {
        resolve(mockTrends.filter(t => t.niche.toLowerCase().includes(niche.toLowerCase())));
      } else {
        resolve(mockTrends);
      }
    }, 500);
  });
}
