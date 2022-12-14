module.exports = {
  apps: [
    {
      name: 'web-scraper-api',
      script: 'app.js',
      watch: false,
      env_production: {
        NODE_ENV: 'production', // 배포환경시 적용될 설정 지정
        DD_ENV: 'prod',
        DD_LOGS_INJECTION: true,
        DD_SERVICE: 'web-scraper-api',
      },
      time: true,
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      exec_mode: 'fork',
    },
  ],

  // Deployment Configuration
  deploy: {
    production: {
      key: './.key/woosungsw.pem',
      user: 'ec2-user',
      host: ['54.180.115.88'],
      ref: 'origin/main',
      repo: 'https://github.com/greenlabs-thkim/node-scraper-api.git',
      path: '/home/ec2-user/workspace/node-scraper-api',
      'post-deploy': 'npm install && pm2 restart ecosystem.config.js --env production --only node-scraper-api',
    },
  },
};
