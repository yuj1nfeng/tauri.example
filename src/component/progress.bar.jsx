import React from 'react';
import '@/style/progress.bar.css';

const ProgressBar = ({
    value = 0,
    max = 100,
    size = 'medium',
    variant = 'primary',
    showLabel = false,
    showPercentage = true,
    animated = false,
    striped = true,
    label = '',
    className = '',
    style = {},
    onComplete = null,
    duration = 100,
    autoIncrement = false,
    incrementSpeed = 20
}) => {
    const [currentValue, setCurrentValue] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // 计算百分比
    const percentage = Math.min(Math.max((currentValue / max) * 100, 0), 100);
    // const displayPercentage = Math.round(percentage);
    const displayPercentage = percentage.toFixed(2);

    // 动画效果
    React.useEffect(() => {
        if (animated && value !== currentValue) {
            setIsAnimating(true);
            const startValue = currentValue;
            const endValue = value;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 使用缓动函数
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const newValue = startValue + (endValue - startValue) * easeOutCubic;

                setCurrentValue(newValue);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrentValue(endValue);
                    setIsAnimating(false);
                    if (endValue >= max && onComplete) {
                        onComplete();
                    }
                }
            };

            requestAnimationFrame(animate);
        } else {
            setCurrentValue(value);
        }
    }, [value, animated, duration, max, onComplete, currentValue]);

    // 自动递增
    React.useEffect(() => {
        if (autoIncrement && currentValue < max) {
            const timer = setInterval(() => {
                setCurrentValue(prev => {
                    const newValue = Math.min(prev + 1, max);
                    if (newValue >= max && onComplete) {
                        onComplete();
                    }
                    return newValue;
                });
            }, incrementSpeed);

            return () => clearInterval(timer);
        }
    }, [autoIncrement, currentValue, max, incrementSpeed, onComplete]);

    const progressClasses = [
        'progress-bar',
        `progress-bar--${size}`,
        `progress-bar--${variant}`,
        striped && 'progress-bar--striped',
        animated && 'progress-bar--animated',
        isAnimating && 'progress-bar--animating',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={progressClasses} style={style}>
            {(showLabel && label) && (
                <div className="progress-bar__label">
                    {label}
                </div>
            )}

            <div className="progress-bar__container">
                <div
                    className="progress-bar__fill"
                    style={{ width: `${percentage}%` }}
                >
                    {striped && <div className="progress-bar__stripes" />}
                </div>

                {showPercentage && (
                    <div className="progress-bar__percentage">
                        {displayPercentage}%
                    </div>
                )}
            </div>

            {showLabel && !label && (
                <div className="progress-bar__info">
                    {currentValue.toFixed(0)} / {max}
                </div>
            )}
        </div>
    );
};

// 预设的进度条变体
export const CircularProgress = ({
    value = 0,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'primary',
    showPercentage = true,
    animated = true,
    className = '',
    style = {}
}) => {
    const [currentValue, setCurrentValue] = React.useState(0);

    React.useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setCurrentValue(value), 100);
            return () => clearTimeout(timer);
        } else {
            setCurrentValue(value);
        }
    }, [value, animated]);

    const percentage = Math.min(Math.max((currentValue / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div
            className={`circular-progress circular-progress--${variant} ${className}`}
            style={{ width: size, height: size, ...style }}
        >
            <svg width={size} height={size}>
                {/* 背景圆环 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="circular-progress__background"
                />
                {/* 进度圆环 */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="circular-progress__fill"
                    style={{
                        transition: animated ? 'stroke-dashoffset 0.5s ease-in-out' : 'none',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%'
                    }}
                />
            </svg>
            {showPercentage && (
                <div className="circular-progress__percentage">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
};

export default ProgressBar;