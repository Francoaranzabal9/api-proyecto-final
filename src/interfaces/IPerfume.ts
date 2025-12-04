export interface Perfume {
  name: string;

  brand: string;

  concentration: 'EDP' | 'EDT' | 'Parfum' | 'EDC' | 'Extrait';

  genre: 'Masculino' | 'Femenino' | 'Unisex';

  volumeMl: number;

  description: string;

  price: number;

  stock: boolean;

  image: string;

  notes: {
    output: string[];
    heart: string[];
    deepNotes: string[];
  };
}