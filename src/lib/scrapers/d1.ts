import type { Product } from './types';

// D1 no tiene API pública - precios verificados manualmente
// Actualizar cada semana visitando domicilios.tiendasd1.com
const D1_PRODUCTS: Record<string, Product[]> = {
  arroz: [
    { name: 'Arroz Diana x 500g', price: 2490, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=arroz' },
    { name: 'Arroz Diana x 1kg', price: 4490, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=arroz' },
    { name: 'Arroz Diana x 2kg', price: 8490, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=arroz' },
    { name: 'Arroz Diana x 5kg', price: 19900, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=arroz' },
  ],
  aceite: [
    { name: 'Aceite Girasol D1 x 1L', price: 12900, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=aceite' },
    { name: 'Aceite Girasol D1 x 3L', price: 34900, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=aceite' },
  ],
  leche: [
    { name: 'Leche Latti x 900ml', price: 3990, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=leche' },
    { name: 'Leche Latti x 1100ml', price: 4790, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=leche' },
  ],
  azucar: [
    { name: 'Azúcar D1 x 1kg', price: 3490, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=azucar' },
    { name: 'Azúcar D1 x 2kg', price: 6490, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=azucar' },
  ],
  pasta: [
    { name: 'Pasta Gustino x 250g', price: 1590, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=pasta' },
    { name: 'Pasta Gustino x 500g', price: 2790, store: 'D1', image: '', url: 'https://domicilios.tiendasd1.com/search?name=pasta' },
  ],
};

export async function searchD1(query: string): Promise<Product[]> {
  const key = query.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Buscar por coincidencia parcial
  const match = Object.keys(D1_PRODUCTS).find(k => 
    key.includes(k) || k.includes(key)
  );

  return match ? D1_PRODUCTS[match] : [];
}
