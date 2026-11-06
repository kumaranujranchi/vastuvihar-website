const port = process.env.PORT || 3001;

module.exports = {
  apps: [
    {
      name: 'vastuvihar',
      script: 'node_modules/next/dist/bin/next',
      args: `start -p ${port}`,
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: port,
      },
    },
  ],
};
