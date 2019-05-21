import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import yargs from 'yargs'
let argv = yargs.argv

const port = argv.p
const buildRoot = './build/es6-bundled'
const app = express()

app.use(express.static(buildRoot))
app.use(bodyParser.json())

app.get('/api/ping', (req, res) => res.end('pong'))

app.get('/*', (req, res) => {
  if (fs.existsSync(`${buildRoot}/index.html`)) {
    fs.createReadStream(`${buildRoot}/index.html`).pipe(res)
  } else {
    res.end('build the project (yarn build) before serving the front routes')
  }
})

app.post('/api/contact', (req, res) => {
  let body = req.body
  if (!body || !body.name || !body.subject || !body.content) {
    res.status(401).end()
    return
  }
  const lastId = fs
    .readdirSync('./messages')
    .map(n => parseInt(n.split('.')[0]))
    .sort()
    .pop()

  try {
    fs.writeFileSync(
      `./messages/${lastId + 1}.txt`,
      `${body.name}\n${body.subject}\n${body.content}`
    )
  } catch (e) {
    res.status(500).end()
    return
  }

  res.end()
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})
