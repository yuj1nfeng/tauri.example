import { RecoilRoot } from 'recoil';
import VideoList from '@/component/video.list.jsx';
import Tools from '@/component/tools.jsx';
import Actions from '@/component/actions.jsx';
export default function () {
    return (
        <RecoilRoot >
            <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2em' }}>
                <header style={{ textAlign: 'center' }}>
                    <h3>🍉🍉🚀🚀🚀🍉🍉</h3>
                </header>
                <main className='main'>
                    <Actions />
                    <VideoList />
                    <Tools />
                </main>
                <footer style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer', color: '#3e3e3e', fontSize: '8px' }}>
                    <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
                </footer>
            </div>
        </RecoilRoot>
    );
}
