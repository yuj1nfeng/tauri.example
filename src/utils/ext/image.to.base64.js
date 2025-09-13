

/**
 * 将表单数据中的File对象转换为base64编码字符串
 * @param {File} file - 表单数据中的File对象
 * @param {Object} options - 可选配置项
 * @param {string} options.mime_type - 可选，MIME类型，如果不提供将使用File对象的type属性
 * @param {number} options.max_size - 可选，文件最大大小（字节），默认为10MB
 * @returns {Promise<string>} 返回base64编码的字符串，格式为 data:image/xxx;base64,xxx
 * @throws {Error} 如果文件读取失败、格式不支持或超出大小限制
 */
export default async function(file, options = {}) {
    // 参数验证
    if (!file) {
        throw new Error('文件参数不能为空');
    }
    
    if (!(file instanceof File)) {
        throw new Error('参数必须是有效的File对象');
    }
    
    // 解构配置项，设置默认值
    const {
        mime_type: custom_mime_type,
        max_size = 10 * 1024 * 1024 // 默认最大10MB
    } = options;
    
    // 检查文件大小
    if (file.size > max_size) {
        throw new Error(`文件大小超出限制，最大允许${(max_size / (1024 * 1024)).toFixed(2)}MB，当前文件大小${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    }
    
    // 检查文件是否为空
    if (file.size === 0) {
        throw new Error('文件内容为空');
    }
    
    try {
        // 确定MIME类型
        let mime_type = custom_mime_type;
        
        // 如果没有提供mime_type，则使用File对象的type属性
        if (!mime_type || typeof mime_type !== 'string') {
            mime_type = file.type;
            
            // 如果File对象没有type或type为空，则尝试从文件名推断
            if (!mime_type) {
                // 确保文件名存在且有扩展名
                if (!file.name || file.name.indexOf('.') === -1) {
                    throw new Error('无法确定文件类型，文件名缺少扩展名');
                }
                
                const extension = file.name.split('.').pop().toLowerCase();
                
                // 支持的图片格式映射
                const mime_map = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml',
                    'bmp': 'image/bmp',
                    'ico': 'image/x-icon',
                    'tiff': 'image/tiff',
                    'tif': 'image/tiff'
                };
                
                mime_type = mime_map[extension];
                
                if (!mime_type) {
                    throw new Error(`不支持的文件扩展名: ${extension}`);
                }
            }
        }
        
        // 检查是否为支持的图片类型
        if (!mime_type.startsWith('image/')) {
            throw new Error(`不支持的文件类型: ${mime_type}，仅支持图片文件`);
        }
        
        // 使用FileReader API读取文件内容
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            // 设置超时处理
            const timeout = setTimeout(() => {
                reader.abort();
                reject(new Error('读取文件超时'));
            }, 30000); // 30秒超时
            
            reader.onload = () => {
                clearTimeout(timeout);
                // 检查结果是否有效
                if (!reader.result || typeof reader.result !== 'string') {
                    return reject(new Error('读取文件结果无效'));
                }
                // FileReader的result已经是base64格式的data URL
                resolve(reader.result);
            };
            
            reader.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('读取文件失败: ' + (reader.error ? reader.error.message : '未知错误')));
            };
            
            reader.onabort = () => {
                clearTimeout(timeout);
                reject(new Error('读取文件被中止'));
            };
            
            // 直接读取为data URL
            try {
                reader.readAsDataURL(file);
            } catch (e) {
                clearTimeout(timeout);
                reject(new Error(`初始化文件读取失败: ${e.message}`));
            }
        });
    } catch (error) {
        console.error('图片转base64失败:', error);
        throw new Error(`转换图片到base64失败: ${error.message}`);
    }
}