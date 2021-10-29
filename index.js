// dependencies
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

// PORT
const PORT = process.env.PORT || 8000

// call express to begin new instance of an express application
const app = express()

// serve welcome response
app.get('/', (req, res) => {
    res.json("yoo!")
})

// push articles into array
const articles = []

// scrape data from site via get request
// NOTE: 'placeholder' is equivalent to end point
app.get('/news', (req, res) => {

    // NOTE: 'placeholder' is equivalent to website URL
    axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then((response) => {

            // save data retrieved from fetch as html
            // pass in html variable to .load cheerio method in order to use cheerio as $
            const html = response.data
            const $ = cheerio.load(html)

            // below, include the element you wish to search for and the keyword related to the data that you wish to gather
            $('a:contains("climate")', html).each(function () {

                // for each a tag containing climate key word, save each a tags text as the article's title
                // for each href attribute found, save as URL to article
                const title = $(this).text()
                const url = $(this).attr('href')

                // for each title and url retrieved from scraped site, create an object for each an push into the articles array
                articles.push({
                    title,
                    url
                })
            })

            // when the /news endpoint is visited, respond with scraped data in json format
            res.json(articles)

        })
        .catch((err) => console.log(err))
})


// listen 
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
