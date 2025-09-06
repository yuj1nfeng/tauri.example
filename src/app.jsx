import React, { useState, useRef, useEffect } from 'react';
import tauri from './utils/tauri.js';

// 视频去水印组件
export default function () {
  // 状态管理

  const openSingleFile = async () => {
    const result = await tauri.dialog.open({});
    if (result) await tauri.dialog.message(`您选择了文件:\n${result}`, { buttons: 'Ok', title: '提示', kind: 'info' });
  };

  const openMultipleFile = async () => {
    const result = await tauri.dialog.open({ multiple: true });
    if (result) await tauri.dialog.message(`您选择了文件:\n${result.join('\n')}`, { buttons: 'Ok', title: '提示', kind: 'info' });
  };
  const openDirectory = async () => {
    const result = await tauri.dialog.open({ directory: true });
    if (result) await tauri.dialog.message(`您选择了目录:\n${result}`, { buttons: 'Ok', title: '提示', kind: 'info' });
  };

  const openFileWithFilter= async () => {
    const result = await tauri.dialog.open({ filters:[{name:'ss',extensions:['mp4','mov','jpeg']}],multiple: true });
    if (result) await tauri.dialog.message(`您选择了文件:\n${result.join('\n')}`, { buttons: 'Ok', title: '提示', kind: 'info' });
  };

  return (
    <div className="video-watermark-remover">
      <header className="page-header">
        <h1>视频去水印工具</h1>
        <p>上传视频 → 框选水印 → 一键处理</p>
      </header>

      <main className="main-content">
        <button className="process-btn" onClick={openSingleFile}>
          <span>单选文件</span>
        </button>
        <button className="process-btn" onClick={openMultipleFile}>
          <span>打开多个文件</span>
        </button>
        <button className="process-btn" onClick={openDirectory}>
          <span>打开目录</span>
        </button>
        <button className="process-btn" onClick={openFileWithFilter}>
          <span>打开指定类型文件</span>
        </button>
      </main>

      <footer className="page-footer">
        <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
      </footer>
    </div>
  );
}
