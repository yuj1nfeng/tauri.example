import fs from 'node:fs/promises';
import path from 'node:path';

export const api_path = 'video.all';
export const method = 'post';
export const app = async (ctx) => {
    const body = await ctx.req.json();
    const { input, extensions = 'mp4,mov,avi,flv,wmv,mpg,mpeg,mkv,webm,3gp,flv,ts,mts,rmvb' } = body;
    const exts = extensions.split(',').map((ext) => ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`);
    const list = await fs.readdir(input, { withFileTypes: true, recursive: true });
    const result = list.filter((p) => !p.parentPath.includes('$RECYCLE.BIN'))
        .filter((p) => p.isFile() && exts.includes(path.extname(p.name).toLowerCase()))
        .map((p) => path.join(p.parentPath, p.name));

    return ctx.json(result);
};
