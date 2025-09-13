import sse from './sse.js';
import service from './service.js';
import tauri from './tauri.js';

import playVideo from './ext/play.video.js';
import captureVideoFrame from './ext/capture.video.frame.js';
import createObjectURL from './ext/create.object.url.js';
import imageToBase64 from './ext/image.to.base64.js';

const ext = {
    createObjectURL,
    playVideo,
    captureVideoFrame,
    imageToBase64,
};

export { sse, service, tauri, ext };
export default { sse, service, tauri, ext };
