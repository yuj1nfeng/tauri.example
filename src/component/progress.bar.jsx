import React, { useState, useEffect } from 'react';

export default ({
    percentage = 0,
    height = '36px',
    bgColor = 'bg-gray-200',
    progressColor = 'bg-blue-800',
    borderRadius = '0.3rem',
    animationDuration = 800,
    stripeAnimationDuration = 1500,
    textColor = 'text-white'
}) => {
    const [progress, setProgress] = useState(0);
    // 跟踪是否应该播放动画
    const [isAnimating, setIsAnimating] = useState(true);

    // 进度更新动画
    useEffect(() => {
        const timer = setTimeout(() => {
            const newProgress = Math.max(0, Math.min(100, percentage));
            setProgress(newProgress);
            // 当进度达到100%时停止动画
            setIsAnimating(newProgress < 100);
        }, 50);

        return () => clearTimeout(timer);
    }, [percentage]);

    // 动态文本颜色
    const getTextColor = () => {
        return progress < 15 ? 'text-gray-700' : textColor;
    };

    // 计算文字尺寸
    const getTextStyle = () => {
        const heightValue = parseFloat(height);
        const lineHeight = `${heightValue * 0.95}px`;
        const fontSize = `${heightValue * 0.65}px`;
        return { lineHeight, fontSize };
    };

    return (
        <>
            {/* 动画关键帧定义 */}
            <style>
                {`
                    @keyframes stripeAnimation {
                        0% { background-position: 20px 0; }
                        100% { background-position: 0 0; }
                    }
                    
                    .stripe-animate {
                        animation: stripeAnimation ${stripeAnimationDuration}ms linear infinite;
                    }
                `}
            </style>

            <div
                className={`w-full overflow-hidden ${bgColor} rounded-lg relative`}
                style={{ height, borderRadius }}
            >
                {/* 进度条填充部分 */}
                <div
                    className={`${progressColor} transition-all ease-out relative overflow-hidden`}
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        transitionDuration: `${animationDuration}ms`,
                        borderRadius
                    }}
                >
                    {/* 条纹动画层 - 仅在isAnimating为true时应用动画类 */}
                    <div
                        className={`absolute inset-0 bg-white/20 ${isAnimating ? 'stripe-animate' : ''}`}
                        style={{
                            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
                            backgroundSize: '20px 20px'
                        }}
                    />
                </div>

                {/* 中间百分比文本 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                        className={`font-semibold ${getTextColor()}`}
                        style={getTextStyle()}
                    >
                        {progress}%
                    </span>
                </div>
            </div>
        </>
    );
};
