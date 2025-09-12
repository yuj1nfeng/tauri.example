import React from 'react';
import PropTypes from 'prop-types';
import './progress.btn.css';

const ProgressBtn = ({
    progress = 0,
    color = '#1677FF', // 默认颜色与CSS变量保持一致
    loading = false,
    disabled = false,
    size = 'medium', // 新增size属性，默认值为'medium'
    children,
    ...props
}) => {
    const isCompleted = progress === 100 && !loading;

    const progressStyle = {
        width: `${Math.min(100, Math.max(0, progress))}%`,
        backgroundColor: color,
    };

    return (
        <button
            className={`progress-btn progress-btn--${size} ${loading ? 'loading' : ''} ${isCompleted ? 'progress-btn--completed' : ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {/* 进度条在内容之下 */}
            <span className="progress-btn__bar" style={progressStyle} />
            <span className="progress-btn__content">
                {loading ? (
                    <span className="progress-btn__loader" />
                ) : null}
                {children}
            </span>
        </button>
    );
};

ProgressBtn.propTypes = {
    progress: PropTypes.number,
    color: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']), // 限制size的取值范围
    children: PropTypes.node,
};

export default ProgressBtn;