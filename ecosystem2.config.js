module.exports = {
  apps: [
    {
      name: 'movies',
      script: './server/build/launch/movies.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      // args: 'one two',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        MONGO_HOST: 'localhost',
        MONGO_PORT: 27017,
        MONGO_DATABASE: 'moviebase',
        // OMBD_API_KEY: '',
      },
      env_production: {
        NODE_ENV: 'production',
        MONGO_HOST: 'localhost',
        MONGO_PORT: 27017,
        MONGO_DATABASE: 'moviebase',
        // OMBD_API_KEY: '',
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'node',
  //     host: '212.83.163.1',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/production',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
  //   },
  // },
};
