import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

/**
 * 将base64编码的图片数据保存到系统临时目录
 * @param {string} base64_str - base64编码的图片数据，可以包含或不包含data URI前缀
 * @param {Object} options - 可选配置项
 * @param {string} options.prefix - 文件名前缀，默认为'img-'
 * @param {string} options.ext - 文件扩展名，默认根据base64数据自动检测
 * @param {string} options.dir - 自定义保存目录，默认为系统临时目录
 * @param {number} options.max_size - 最大允许的文件大小（字节），默认为10MB
 * @returns {Promise<Object>} 返回包含文件信息的对象 {path, size, mime_type, name}
 * @throws {Error} 如果base64数据无效或写入失败
 */
export default async function (base64_str, options = {}) {
    // 参数验证
    if (!base64_str) {
        throw new TypeError('base64字符串不能为空');
    }

    if (typeof base64_str !== 'string') {
        throw new TypeError('base64字符串必须是字符串类型');
    }

    // 验证options参数
    if (options && typeof options !== 'object') {
        throw new TypeError('options参数必须是对象类型');
    }

    // 解构并设置默认值
    const {
        prefix = 'img-',
        ext: custom_ext,
        dir: custom_dir,
        max_size = 10 * 1024 * 1024, // 默认10MB
    } = options;

    // 提取MIME类型和纯base64数据
    let mime_type = '';
    let base64_data = base64_str;

    // 检查是否包含data URI前缀
    const data_uri_regex = /^data:([\w\/+-]+);base64,(.+)$/;
    const matches = base64_str.match(data_uri_regex);

    if (matches) {
        mime_type = matches[1];
        base64_data = matches[2];
    }

    // 验证base64数据格式
    const base64_regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64_regex.test(base64_data.replace(/\s/g, ''))) {
        throw new Error('提供的字符串不是有效的base64格式');
    }

    // 根据MIME类型确定文件扩展名
    let file_ext = custom_ext;
    if (!file_ext && mime_type) {
        const mime_to_ext = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'image/svg+xml': '.svg',
            'image/bmp': '.bmp',
            'image/x-icon': '.ico',
            'image/tiff': '.tiff',
        };
        file_ext = mime_to_ext[mime_type] || '.bin';
    } else if (!file_ext) {
        file_ext = '.png'; // 默认扩展名
    }

    // 确保扩展名以点开头
    if (file_ext && !file_ext.startsWith('.')) {
        file_ext = '.' + file_ext;
    }

    // 验证文件前缀
    if (prefix && typeof prefix !== 'string') {
        throw new TypeError('文件名前缀必须是字符串类型');
    }

    // 生成随机文件名
    const safe_prefix = prefix.replace(/[^a-zA-Z0-9-_]/g, '');
    const random_id = crypto.randomBytes(8).toString('hex');
    const file_name = `${safe_prefix || 'img-'}${random_id}${file_ext}`;

    // 获取保存目录
    let save_dir;
    if (custom_dir) {
        // 验证自定义目录
        if (typeof custom_dir !== 'string') {
            throw new TypeError('自定义目录必须是字符串类型');
        }

        // 确保目录存在
        try {
            await fs.mkdir(custom_dir, { recursive: true });
            save_dir = custom_dir;
        } catch (err) {
            console.error('创建自定义目录失败，将使用系统临时目录:', err);
            save_dir = os.tmpdir();
        }
    } else {
        save_dir = os.tmpdir();
    }

    const file_path = path.join(save_dir, file_name);

    try {
        // 将base64数据转换为Buffer
        const buffer = Buffer.from(base64_data, 'base64');

        // 检查数据是否有效
        if (buffer.length === 0) {
            throw new Error('解码后的base64数据为空');
        }

        // 检查文件大小
        if (buffer.length > max_size) {
            throw new Error(`文件大小超出限制，最大允许${max_size / (1024 * 1024)}MB，当前大小${(buffer.length / (1024 * 1024)).toFixed(2)}MB`);
        }

        // 写入文件
        await fs.writeFile(file_path, buffer);

        // 获取文件状态
        const stats = await fs.stat(file_path);

        // 返回文件信息
        return {
            path: file_path,
            name: file_name,
            size: stats.size,
            mime_type: mime_type || 'application/octet-stream',
        };
    } catch (error) {
        // 详细的错误处理
        if (error.code === 'ENOSPC') {
            throw new Error('磁盘空间不足，无法保存文件');
        } else if (error.code === 'EACCES') {
            throw new Error(`没有权限写入文件: ${file_path}`);
        } else {
            throw new Error(`保存base64图片到文件失败: ${error.message}`);
        }
    }
}
