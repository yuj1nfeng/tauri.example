/**
 * 生成指定范围内的随机整数（包含最小值和最大值）
 * @param {number} min - 最小值（整数）
 * @param {number} max - 最大值（整数）
 * @returns {number} 随机整数
 */
function getRandomInt(min, max) {
    // 确保输入为整数，处理可能的浮点数输入
    let floor_min = Math.floor(min);
    let floor_max = Math.floor(max);

    // 确保min不大于max
    if (floor_min > floor_max) [floor_min, floor_max] = [floor_max, floor_min]; // 交换两个值

    // 生成 [0, floor_max - floor_min + 1) 范围内的随机数，再加上floor_min
    return Math.floor(Math.random() * (floor_max - floor_min + 1)) + floor_min;
}

export default { getRandomInt };
