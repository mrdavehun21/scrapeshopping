/*import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = body.query;

  if (!query) {
    return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
  }

  // Launch Puppeteer and search Google
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(`https://wolt.com/hu/hun/budapest/venue/sparszupermarket-klauzalter?search=${encodeURIComponent(query)}`);

  const result = await page.evaluate(() => {
    const firstResult = document.querySelector('.p1yjaao3');
    return firstResult ? firstResult.textContent : 'No result found';
  });

  await browser.close();

  return NextResponse.json({ result });
}
*/
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = body.query;

  if (!query) {
    return NextResponse.json({ error: 'No search query provided' }, { status: 400 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['image', 'font'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // 🔍 Go to Wolt search URL quickly
  await page.goto(
    `https://wolt.com/hu/hun/budapest/venue/sparszupermarket-klauzalter?search=${encodeURIComponent(query)}`
  );

  // Extract first matching result
  const result = await page.evaluate(() => {
    const firstResult = document.querySelector('.p1yjaao3');
    return firstResult ? firstResult.textContent : 'No result found';
  });

  await browser.close();

  return NextResponse.json({ result });
}

