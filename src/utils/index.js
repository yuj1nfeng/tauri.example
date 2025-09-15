import sse from './sse.js';
import tauri from './tauri.js';
import consts from '#consts';
import kv from './kv.js';
import task from './task.js';

import playVideo from './ext/play.video.js';
import captureVideoFrame from './ext/capture.video.frame.js';
import createObjectURL from './ext/create.object.url.js';
import imageToBase64 from './ext/image.to.base64.js';
import fileToBlob from './ext/file.to.blob.js';
import createBlobFromBase64 from './ext/create.blob.js';
import invoke from './ext/invoke.js';
import createDB from './ext/create.db.js';
import getCallerInfo from './ext/get.caller.info.js';

const videoStore = await createDB('videos', { keyPath: 'id', autoIncrement: true }).init();

const ext = {
    createObjectURL,
    playVideo,
    captureVideoFrame,
    imageToBase64,
    fileToBlob,
    createBlobFromBase64,
    getCallerInfo,
    invoke,
};

export { task, sse, tauri, ext, consts, kv, videoStore };
export default { task, sse, tauri, ext, consts, kv, videoStore };
