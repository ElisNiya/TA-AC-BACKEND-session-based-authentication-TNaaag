writeCode

- create a middleware and set a cookie of your name and send it to browser.
- check cookie in your browser
- access cookies set on browser


app.use(cookieParser())

app.use((req,res, next) => {
  res.cookie('name', 'Altcampus')
  next()
})


