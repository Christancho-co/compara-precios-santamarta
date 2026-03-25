import type { Product } from './types';

// Ara no tiene tienda online - precios de tienda física Santa Marta
// Referencia: precios observados en tienda física
const ARA_PRODUCTS: Record<string, Product[]> = {
  arroz: [
    { name: 'Arroz Roa x 500g', price: 2290, store: 'Ara', image: '', url: 'https://d1.com.co' },
    { name: 'Arroz Roa x 1kg', price: 4190, store: 'Ara', image: '', url: 'https://d1.com.co' },
    { name: 'Arroz Roa x 5kg', price: 18900, store: 'Ara', image: '', url: 'https://d1.com.co' },
  ],
  aceite: [
    { name: 'Aceite Girasol Ara x 1L', price: 12500, store: 'Ara', image: '', url: 'https://d1.com.co' },
  ],
  leche: [
    { name: 'Leche Fresca x 900ml', price: 3790, store: 'Ara', image: '', url: 'https://d1.com.co' },
  ],
  azucar: [
    { name: 'Azúcar Ara x 1kg', price: 3290, store: 'Ara', image: '', url: 'https://d1.com.co' },
  ],
};

export async function searchAra(query: string): Promise<Product[]> {
  const key = query.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const match = Object.keys(ARA_PRODUCTS).find(k =>
    key.includes(k) || k.includes(key)
  );

  return match ? ARA_PRODUCTS[match] : [];
}
