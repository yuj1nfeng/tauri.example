import fs from 'node:fs/promises';

const ext = process.platform === 'win32' ? '.exe' : '';

const rust_info = await Bun.$`rustc -vV`.text();
const target_triple = /host: (\S+)/g.exec(rust_info)[1];
if (!target_triple) console.error('Failed to determine platform target triple');
const target_dir = './src-tauri/binaries';
// await fs.mkdir(target_dir, { recursive: true, force: true });
// await fs.rename(`app${ext}`, `${target_dir}/app-${target_triple}${ext}`);
await Bun.$`bun build ./server/app.js --compile --outfile ${target_dir}/app-${target_triple}${ext}`;
