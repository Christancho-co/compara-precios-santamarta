import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? '';
  
  const url = `https://www.olimpica.com/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=15&map=ft`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-CO,es;q=0.9',
        'Referer': 'https://www.olimpica.com/',
        'Origin': 'https://www.olimpica.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    });

    const text = await res.text();
    console.log('Olimpica status:', res.status, 'body preview:', text.slice(0, 100));

    if (!res.ok) {
      return NextResponse.json({ error: `HTTP ${res.status}`, body: text.slice(0, 200) }, { status: 200 });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 200 });
  }
}
