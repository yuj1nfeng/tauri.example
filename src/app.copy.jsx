import { RecoilRoot } from 'recoil';
import VideoList from '@/component/video.list.jsx';
import Tools from '@/component/tools.jsx';
import Actions from '@/component/actions.jsx';
import TaskList from '@/component/task.list.jsx';
export default function () {
    return (
        <RecoilRoot >
            <main style={{ height: '90vh', overflow: 'auto' }}>
                <Actions />
                <VideoList style={{ height: 220, fontSize: 12 }} />
                <TaskList style={{ height: 220, fontSize: 12 }} />
                <Tools />
            </main>
        </RecoilRoot>
    );
}
