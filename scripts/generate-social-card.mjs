import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Preserve the original drawing. A silhouette mask removes its white backdrop;
// a soft lower fade keeps the unfinished shirt edges natural on either theme.
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1080">
<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset="0.77" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient></defs>
<path fill="url(#fade)" d="M62 873 L70 844 Q80 821 105 808 Q192 759 305 721 L331 670 Q300 628 281 556 L277 450 L281 376 Q267 315 277 277 Q278 246 290 225 L289 204 L307 217 Q301 188 332 155 Q370 120 408 111 Q460 89 510 110 Q548 124 556 160 Q579 144 609 170 Q662 200 669 262 L673 377 L666 396 Q686 393 676 444 Q667 495 618 528 L590 605 Q612 615 628 654 L646 703 Q757 756 896 817 Q848 859 829 913 L783 1034 Q660 1090 471 1080 L300 1063 L125 968 Q84 937 83 900 Z"/>
</svg>`);
const maskPixels = await sharp(mask).ensureAlpha().raw().toBuffer();
for (let i = 0; i < maskPixels.length; i += 4) maskPixels[i + 3] = maskPixels[i];
const alphaMask = await sharp(maskPixels, { raw: { width: 960, height: 1080, channels: 4 } }).png().toBuffer();
const cutout = await sharp('public/images/people/federico-cerutti.png')
  .ensureAlpha().composite([{ input: alphaMask, blend: 'dest-in' }]).png().toBuffer();
await sharp({create:{width:960,height:1080,channels:3,background:'#202326'}})
  .composite([{input:cutout}]).png().toFile('public/images/people/federico-cerutti-dark.png');

const font = readFileSync('node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2').toString('base64');
const portrait = readFileSync('public/images/people/federico-cerutti-dark.png').toString('base64');
const browser = await chromium.launch({ channel: 'chrome' });
try {
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>
 @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:300;font-style:normal}
 *{box-sizing:border-box}body{margin:0;background:#202326;color:#f0eeea;font-family:Inter,sans-serif;font-weight:300}
 .card{width:1200px;height:630px;position:relative;overflow:hidden}
 .portrait{position:absolute;right:42px;top:18px;width:490px;height:552px;object-fit:contain}
 .copy{position:absolute;left:68px;top:139px;width:650px}
 h1{font-weight:300;font-size:64px;letter-spacing:-2.5px;line-height:1.13;margin:0 0 32px}
 .field{font-size:31px;line-height:1.4;margin:0;color:#d4d5d3;letter-spacing:-.6px}
 .role{font-size:21px;line-height:1.55;margin:42px 0 0;color:#b9bcbf}
 .url{position:absolute;left:68px;bottom:50px;font-size:18px;letter-spacing:.15px;color:#999fa3}
 </style></head><body><div class="card"><img class="portrait" src="data:image/png;base64,${portrait}"><div class="copy"><h1>Federico Cerutti</h1><p class="field">AI and cybersecurity</p><p class="role">Research, consultancy and training<br>Full Professor · University of Brescia</p></div><div class="url">federico-cerutti.unibs.it</div></div></body></html>`);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'public/images/federico-cerutti-ai-cybersecurity-dark.jpg',type:'jpeg',quality:92});
} finally {await browser.close();}
