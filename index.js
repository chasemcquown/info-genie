// dependencies
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

// PORT
const PORT = process.env.PORT || 8000

// new express app
const app = express()

// scrape data
app.get('/', (req, res) => {
    res.json("yoo!")
})

// listen 
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
