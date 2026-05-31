module.exports = {
  apps: [
    {
      name: "yito-website",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3063",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
