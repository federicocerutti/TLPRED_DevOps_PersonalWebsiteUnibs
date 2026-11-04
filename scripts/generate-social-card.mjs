import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

// A gentle paper tint preserves the complete drawing without cutting its edges.
await sharp('public/images/people/federico-cerutti.png')
  .linear([239 / 255, 232 / 255, 219 / 255], [0, 0, 0])
  .png().toFile('public/images/people/federico-cerutti-beige.png');

const font = readFileSync('node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2').toString('base64');
const portrait = readFileSync('public/images/people/federico-cerutti-beige.png').toString('base64');
const browser = await chromium.launch({ channel: 'chrome' });
try {
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>
 @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:300;font-style:normal}
 *{box-sizing:border-box}body{margin:0;background:#efe8db;color:#272a2a;font-family:Inter,sans-serif;font-weight:300}
 .card{width:1200px;height:630px;position:relative;overflow:hidden}
 .portrait{position:absolute;right:42px;top:18px;width:490px;height:552px;object-fit:contain}
 .copy{position:absolute;left:68px;top:86px;width:625px}
 h1{font-weight:300;font-size:64px;letter-spacing:-2.5px;line-height:1.13;margin:0 0 24px}
 .field{font-size:32px;line-height:1.35;margin:0;color:#444b4a;letter-spacing:-.6px}
 .role{font-size:21px;line-height:1.55;margin:24px 0 0;color:#606562}
 .uk{font-size:17px;line-height:1.6;margin:20px 0 0;color:#606562}
 .url{position:absolute;left:68px;bottom:27px;font-size:18px;letter-spacing:.15px;color:#71756e}
 </style></head><body><div class="card"><img class="portrait" src="data:image/png;base64,${portrait}"><div class="copy"><h1>Federico Cerutti</h1><p class="field">Adopt AI. Protect what your<br>organisation knows.</p><p class="role">AI and cybersecurity · Research, consultancy, training<br>Full Professor · University of Brescia</p><p class="uk">Honorary Senior Lecturer · Cardiff University<br>Visiting Fellow · University of Southampton<br>Visiting Professor · Imperial College London</p></div><div class="url">federico-cerutti.unibs.it</div></div></body></html>`);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'public/images/federico-cerutti-ai-cybersecurity-beige.jpg',type:'jpeg',quality:92});
} finally {await browser.close();}
