const express = require('express')
const app = express()
const port = 3000

app.use('/ui-files', express.static('ui-files'))
app.use('/', (req) => 'Hello World')

app.listen(port, () => {
  console.log(`Local UI File Server listening on port ${port}`)
})