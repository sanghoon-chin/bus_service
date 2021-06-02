const express = require('express')
const path = require('path')

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

const server = app.listen(80, () => {
    console.log('running')
})