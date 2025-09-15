import getCallerInfo from './src/utils/ext/get.caller.info.js';
// 测试示例
function gsgs() {
    // 从中间函数调用，验证深度
    console.log('直接调用方信息:', getCallerInfo(0)); // 应指向调用 intermediate() 的位置
    console.log('上一级调用方信息:', getCallerInfo(1)); // 应指向更外层
}

// 触发测试
gsgs();
