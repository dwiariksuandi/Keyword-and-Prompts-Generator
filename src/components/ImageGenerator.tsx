import React, { useState } from 'react';
import { generateImage } from '../services/imageGenerationService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const imageUrl = await generateImage(prompt);
      setImage(imageUrl);
    } catch (error) {
      console.error(error);
      alert('Gagal menghasilkan gambar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Nano Banana Image Generator</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Deskripsikan gambar..."
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded-full hover:bg-slate-800 transition"
      >
        {loading ? 'Menghasilkan...' : 'Generate'}
      </button>
      {image && <img src={image} alt="Generated" className="mt-4 w-full rounded-xl" referrerPolicy="no-referrer" />}
    </div>
  );
};
