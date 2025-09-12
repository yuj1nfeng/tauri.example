import { readFile } from '@tauri-apps/plugin-fs';

export default async function createObjectURL(url, type = 'video/mp4') {
    const data = await readFile(url);
    const blob = new Blob([data], { type: type });
    const video_url = URL.createObjectURL(blob);
    return video_url;
}
