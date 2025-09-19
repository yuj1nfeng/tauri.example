
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

function createTaskId() {
    const date = new Date();

    // 获取各时间部分并确保两位数
    const year = String(date.getFullYear()).slice(2); // 取年份后两位
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time_fmt = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return time_fmt + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

}



export default { getRandomInt, createTaskId };
