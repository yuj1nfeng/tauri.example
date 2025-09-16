import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import '@arco-design/web-react/dist/css/arco.css';
import 'tdesign-react/esm/style/index.js';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
