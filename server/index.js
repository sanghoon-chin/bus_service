const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();

app.get('/', async (req, res) => {
    const data = await fs.readFile(path.resolve(__dirname, '../frontend/dist/map.html'))
    res.setHeader('Content-Type', 'text/html')
    res.end(data)
})

// app.get('/', (req, res) => {
//     res.sendFile('map.html', {
//         root: path.resolve(__dirname, '../frontend/dist')
//     })
// })

const server = app.listen(80, () => {
    console.log('running')
})