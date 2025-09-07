export default function (video_url, time) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = video_url;
        video.muted = true;
        video.autoplay = true;
        video.currentTime = time;
        video.oncanplay = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // const frame_url = canvas.toDataURL('image/jpeg');
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                resolve(url);
            }, 'image/jpeg');
            video.remove();

            // resolve(frame_url);
        };
    });
}