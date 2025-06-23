module.exports = {
  apps: [
    {
      name: 'main-app',
      script: 'build/index.js'
    },
    {
      name: 'worker',
      script: 'build/worker.js'
    }
  ]
};

