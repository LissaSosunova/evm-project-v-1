module.exports = [
  {
    context: '/dist/',
    pathRewrite: {'^/dist': ''},
    target: "http://localhost:3000/",
    secure: false,
    changeOrigin: true
  },
  {
    context: ['/api'],
    target: "http://localhost:5006/",
    secure: false,
    changeOrigin: true
  }
];
