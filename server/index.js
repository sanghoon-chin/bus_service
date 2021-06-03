const express = require('express')
const path = require('path')

const app = express();

app.get('/', (req, res) => {
    res.sendFile('map.html', {
        root: path.resolve(__dirname, '../frontend/dist')
    })
})

const server = app.listen(80, () => {
    console.log('running')
})