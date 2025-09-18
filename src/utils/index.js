import sse from './sse.js';
import tauri from './tauri.js';
import consts from '#consts';
import kv from './kv.js';
// import task from './task.js';
import rules from './rules.js';

import playVideo from './ext/play.video.js';
import captureVideoFrame from './ext/capture.video.frame.js';
import createObjectURL from './ext/create.object.url.js';
import imageToBase64 from './ext/image.to.base64.js';
import fileToBlob from './ext/file.to.blob.js';
import createBlobFromBase64 from './ext/create.blob.js';
import invoke from './ext/invoke.js';
import getCallerInfo from './ext/get.caller.info.js';
import useStore from './ext/use.store.js';

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
const store = {
    videos: await useStore('app.videos', { keyPath: 'id', autoIncrement: true }).init(),
    tasks: await useStore('app.tasks', { keyPath: 'id', autoIncrement: true }).init(),
};

export { sse, tauri, ext, consts, kv, store, rules };
export default { sse, tauri, ext, consts, kv, store, rules };
