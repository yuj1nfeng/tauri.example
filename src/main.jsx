import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tdesign-react/esm/style/index.js';
import '@/style/theme.css';
import '@/style/custom.css';
import App from '@/app.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
