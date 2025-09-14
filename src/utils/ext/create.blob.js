

export default function createBlogFromBase64(base64) {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.match(/:(.*?);/)[1];
    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        view[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeType });
}   