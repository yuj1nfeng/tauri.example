import { useRecoilState } from 'recoil';
import videosAtom from '../store/videos.atom.js';
import utils from '../utils/index.js';

export default useVideoService;

function useVideoService() {
    const [videos, setVideos] = useRecoilState(videosAtom);
    const init = async () => {
        const list = await utils.store.videos.getAll();
        setVideos(list);
    };
    const add = async (video) => {
        video.id = await utils.store.videos.add(video);
        setVideos((prev) => [...prev, video]);
    };
    const remove = async (id) => {
        await utils.store.videos.delete(id);
        const list = await utils.store.videos.getAll();
        setVideos(list);
        // setVideos((prev) => prev.filter((v) => v.id !== id));
    };
    const removeAll = async () => {
        await utils.store.videos.clear();
        setVideos([]);
    };
    const addList = async (files) => {
        const exists_list = videos.map((p) => p.filename);
        for (const file of files) {
            if (exists_list.includes(file)) continue;
            const result = await utils.ext.invoke('video.meta', { input: file });
            if (result.error) continue;
            const meta = utils.consts.fn.fmtMeta(result);
            const resp = await utils.ext.invoke('video.thumbnail', { input: file });
            meta.thumbnail = typeof resp == 'string' ? resp : null;
            await add(meta);
        }
    };
    const uploadFiles = async () => {
        const files = await utils.tauri.dialog.open({ filters: [{ name: 'videos', extensions: ['mp4', 'mov', 'webm'] }], multiple: true });
        if (files.length === 0) return;
        await addList(files);
    };

    const uploadFolder = async () => {
        const result = await utils.tauri.dialog.open({ directory: true });
        if (!result) return;
        const files = await utils.ext.invoke('video.all', { input: result });
        await addList(files);
    };
    return { init, add, remove, removeAll, addList, uploadFiles, uploadFolder };
}
