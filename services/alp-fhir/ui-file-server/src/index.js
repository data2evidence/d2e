const express = require('express')
const app = express()
const port = 3000

app.use('/', express.static('ui-files/dist'))

app.listen(port, () => {
  console.log(`Local UI File Server listening on port ${port}`)
})