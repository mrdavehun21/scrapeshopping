import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';

let browser: Browser | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
  }
  return browser;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query, stores } = body;

  if (!query || !Array.isArray(stores) || stores.length === 0) {
    return NextResponse.json({ error: 'Missing query or selected stores' }, { status: 400 });
  }

  const browser = await getBrowser();
  const page = await browser.newPage();

  const storeUrls: Record<string, string> = {
    Spar: 'https://wolt.com/hu/hun/budapest/venue/sparszupermarket-klauzalter',
    Auchan: 'https://wolt.com/hu/hun/budapest/venue/auchan-i-budakalasz',
    //Aldi: 'https://www.aldi.hu/hu/search.html'
  };

  const results: Record<string, string> = {};

  for (const store of stores) {
    const baseUrl = storeUrls[store];
    if (!baseUrl) continue;

    const url = `${baseUrl}?search=${encodeURIComponent(query)}`;
    await page.goto(url, {
      waitUntil: 'load'
    });

    //await page.screenshot({ path: 'debug.png', fullPage: true });

    const result = await page.evaluate(() => {
      const el = document.querySelector('.p1yjaao3');
      return el?.textContent || 'No result found';
    });

    results[store] = result;
  }

  await page.close();

  return NextResponse.json({ results });
}
