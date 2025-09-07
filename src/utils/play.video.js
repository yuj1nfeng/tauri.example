/**
 * 显示一个带有关闭按钮的视频播放器。
 * @param {string} url - 视频的URL。
 */
export default function (url) {
    let isVisible = true;

    // 创建主容器 div
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.zIndex = '1000';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    div.style.padding = '0';
    div.style.borderRadius = '100%';
    div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';

    // 添加拖拽功能
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;

    div.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = div.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        startX = e.clientX;
        startY = e.clientY;
        div.style.cursor = 'grabbing';
        div.style.transform = 'none'; // 移除初始的居中transform
        div.style.top = `${rect.top}px`;
        div.style.left = `${rect.left}px`;
        e.preventDefault(); // 防止文本选中
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // 限制在视窗范围内
        const maxX = window.innerWidth - div.offsetWidth;
        const maxY = window.innerHeight - div.offsetHeight;

        div.style.left = `${Math.min(Math.max(0, newX), maxX)}px`;
        div.style.top = `${Math.min(Math.max(0, newY), maxY)}px`;
        e.preventDefault(); // 防止文本选中
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        div.style.cursor = 'grab';
    });

    // 创建 video 元素
    const video = document.createElement('video');
    video.src = url;
    video.controls = true; // 添加播放控件
    video.style.borderRadius = '10px';
    video.style.height = '50vh';
    // 创建关闭按钮
    const btn = document.createElement('button');
    btn.textContent = 'X';
    btn.style.position = 'absolute';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.background = 'rgba(0,0,0,0.5)';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.width = '30px';
    btn.style.height = '30px';
    btn.style.cursor = 'pointer';

    // 防止按钮点击触发拖拽
    btn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    /**
     * 处理关闭按钮点击事件，隐藏视频播放器。
     */
    const handleClose = () => {
        isVisible = false;
        div.style.display = 'none'; // 隐藏整个容器
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    };

    btn.addEventListener('click', handleClose);

    // 将视频和按钮添加到容器中
    div.appendChild(video);
    div.appendChild(btn);

    // 将容器添加到 body 中
    document.body.appendChild(div);

    // 返回一个函数，用于外部控制视频的显示/隐藏
    return {
        hide: () => {
            isVisible = false;
            div.style.display = 'none';
        },
        show: () => {
            isVisible = true;
            div.style.display = ''; // 显示容器
        },
        remove: () => {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        },
    };
}