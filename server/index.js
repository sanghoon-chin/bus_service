const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(
    path.resolve(__dirname, '../frontend/dist')
));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/map.html'))
})

const server = app.listen(80, () => {
    console.log('running')
})