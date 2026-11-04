import sharp from 'sharp';
const portrait = await sharp('public/images/people/federico-cerutti.png')
  .resize(390, 510, { fit: 'cover', position: 'attention' }).png().toBuffer();
const design = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#f5f3ee"/>
<rect x="60" y="60" width="6" height="44" fill="#155d58"/>
<g font-family="Arial, sans-serif" fill="#171d21">
<text x="86" y="91" font-size="27" font-weight="700">FEDERICO CERUTTI</text>
<text x="60" y="212" font-size="61" font-weight="700">Adopt AI.</text>
<text x="60" y="288" font-size="51" font-weight="700">Protect what your</text>
<text x="60" y="351" font-size="51" font-weight="700">organisation knows.</text>
<text x="60" y="420" font-size="26" fill="#155d58">AI · Cybersecurity · Consultancy · Training</text>
<text x="60" y="505" font-size="23">Full Professor · University of Brescia</text>
<text x="60" y="555" font-size="21" fill="#526069">federico-cerutti.unibs.it</text>
</g></svg>`);
await sharp(design).composite([{ input: portrait, left: 750, top: 60 }])
  .jpeg({ quality: 90, mozjpeg: true }).toFile('public/images/federico-cerutti-ai-cybersecurity.jpg');
