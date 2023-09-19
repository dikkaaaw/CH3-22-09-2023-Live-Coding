// CORE PACKAGE/MODULE
const fs = require('fs');

// OUR OWN PACKAGE/MODULE

// THIRD PARTY PACKAGE/MODULE
const express = require('express');
const app = express();

// middleware dari express
// memodifikasi incoming request/request body ke api kita
app.use(express.json());

const port = process.env.port || 3000;

// baca data dari file json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    // generate id untuk data baru dari request api kita
    const newId = tours[tours.length - 1].id + 1;
    const newData = Object.assign({ id: newId }, req.body);

    tours.push(newData);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // 201 = CREATED
        res.status(201).json({
            status: 'success',
            data: {
                tour: newData
            }
        })
    })
})

app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    // findIndex = -1 (kalau data nya gk ada)
    const tourIndex = tours.findIndex(el => el.id === id)

    if(tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        })
    }

    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: `tour with this id ${id} edited`,
            data: {
                tour: tours[tourIndex]
            }
        })
    })
})

app.delete('/api/v1/tours/:id', (req, res) => {
    // konversi string jadi number
    const id = req.params.id * 1;

    // cari index dari data yg sesuai id di req.params
    const tourIndex = tours.findIndex(el => el.id === id);

    // validasi kalau data yg sesuai req.params.id nya gak ada
    if (tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: 'data not found'
        })
    }

    // proses mengahpus data sesuai index array nya => req.params.id
    tours.splice(tourIndex, 1);

    // proses update di file json nya
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: 'berhasil delete data',
            data: null
        })
    })
})

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})

