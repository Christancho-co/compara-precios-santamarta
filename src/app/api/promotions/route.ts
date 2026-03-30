import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles...
  const dayOfMonth = now.getDate();
  
  const promotions: Array<{ store: string; text: string; image?: string }> = [];

  // ÉXITO - Promociones por día
  if (dayOfWeek === 2) { // Martes
    promotions.push({
      store: 'Éxito',
      text: '🥬 Martes del Campo: Hasta 35% en frutas y verduras'
    });
  } else if (dayOfWeek === 3) { // Miércoles
    promotions.push({
      store: 'Éxito',
      text: '🥩 Miércoles de Carnes: Hasta 30% en res, cerdo y pollo'
    });
  } else if ([15, 16, 30, 31].includes(dayOfMonth) || dayOfMonth === 1) {
    promotions.push({
      store: 'Éxito',
      text: '🔥 Mega Ofertas: Descuentos en pastas, granos y más'
    });
  } else {
    promotions.push({
      store: 'Éxito',
      text: '✨ Ahorra todos los días en tu mercado'
    });
  }

  // OLÍMPICA - Promociones por día
  if (dayOfWeek === 3) { // Miércoles
    promotions.push({
      store: 'Olímpica',
      text: '🍅 Miércoles de Plaza: 40% en frutas y verduras'
    });
  } else {
    promotions.push({
      store: 'Olímpica',
      text: '💰 Golazos de la semana: Ofertas especiales'
    });
  }

  // D1 - Promociones generales
  promotions.push({
    store: 'D1',
    text: '📦 Precios bajos todos los días'
  });

  // ARA - Promociones generales
  promotions.push({
    store: 'Ara',
    text: '🛍️ Ahorra en tu mercado diario'
  });

  // MEGATIENDAS - Promociones generales
  promotions.push({
    store: 'Megatiendas',
    text: '🎯 Ofertas de fin de semana'
  });

  return NextResponse.json(
    { promotions },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    }
  );
}
