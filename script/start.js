Bun.spawn(['bun', 'tauri', 'dev'], { stdio: ['inherit', 'inherit', 'inherit'] });
Bun.spawn(['bun', 'run', 'server/app.js', '--watch'], { stdio: ['inherit', 'inherit', 'inherit'] });
