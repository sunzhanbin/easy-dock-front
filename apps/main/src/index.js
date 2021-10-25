(async () => {
  const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT)
  if(token) {
    require('./app.tsx')
  }
})()