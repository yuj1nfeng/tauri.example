/**
 * 获取调用者信息
 * @param {number} depth - 调用栈深度，0表示直接调用者，1表示调用者的调用者，以此类推
 * @returns {Object|null} 调用者信息对象或null（如果无法获取）
 */
export default function getCallerInfo(depth = 0) {
    // 验证depth参数
    if (typeof depth !== 'number' || depth < 0 || !Number.isInteger(depth)) {
        console.warn('depth参数必须是非负整数');
        depth = 0; // 使用默认值
    }
    
    try {
        // 保存原始堆栈跟踪处理函数
        const originalPrepareStackTrace = Error.prepareStackTrace;
        
        // 创建错误对象
        const err = new Error();
        
        // 使用同步锁定方式修改和恢复prepareStackTrace
        let stackFrames;
        try {
            // 临时修改堆栈跟踪格式
            Error.prepareStackTrace = (err, stackTraces) => stackTraces;
            
            // 捕获堆栈，排除当前函数
            Error.captureStackTrace(err, getCallerInfo);
            stackFrames = err.stack; // 此时 stack 是 StackTraceItem 数组
        } finally {
            // 确保恢复原始配置，即使发生错误
            Error.prepareStackTrace = originalPrepareStackTrace;
        }

        // 计算目标帧位置（depth 0 对应直接调用方）
        const targetFrame = stackFrames[depth];
        if (!targetFrame) return null;

        // 提取信息（使用 V8 引擎的 StackTraceAPI）
        return {
            functionName: targetFrame.getFunctionName() || targetFrame.getMethodName() || '匿名函数',
            filePath: targetFrame.getFileName() || '未知文件',
            lineNumber: targetFrame.getLineNumber() || -1,
            columnNumber: targetFrame.getColumnNumber() || -1,
            isNative: targetFrame.isNative() || false,
        };
    } catch (e) {
        // 避免输出详细错误信息，只记录发生了错误
        console.warn('获取调用方信息失败');
        return null;
    }
}
