module.exports = {
    apps: [
        {
            name: 'chat-web-base-customer-ssr',
            script: 'dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: { NODE_ENV: 'production' },
            error_file: 'logs/pm2/ssr-error.log',
            out_file: 'logs/pm2/ssr-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        }
    ]
}