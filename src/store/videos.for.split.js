
import { selector } from 'recoil';
import videosAtom from './videos.atom.js';

export default selector({
    key: 'videos.for.split',
    get: ({ get }) => {
        const videos = get(videosAtom);
        return videos.filter((video) => Number(video.duration) > 20);
    },
});
