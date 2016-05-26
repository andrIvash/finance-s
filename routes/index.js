
module.exports = function(app) {
  app.get('/', require('./main').get);
  app.get('/dev', require('./dev').get);
  app.post('/dev', require('./dev').post);
  app.get('/proj', require('./proj').get);
  app.post('/proj', require('./proj').post);
  
  
};
