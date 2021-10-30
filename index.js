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

// create a newspaper array to hold an array of objects, the objects are the name of the newspaper and the address of the URL (address) of the newspaper
const newspapers = [

    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
]

// push articles into array
const articles = []

// loop through each newspaper
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                // save text from a tag as the article's title
               const title = $(this).text()
               // save href from the a tage as the article's url
               const url = $(this).attr('href')

               articles.push({
                   title,
                   url: newspaper.base + url,
                   source: newspaper.name
               })
            })
        })
})

// GET ALL articles regarding climate change from the publications we included
// scrape data from site via get request
// NOTE: 'placeholder' is equivalent to end point
app.get('/news', (req, res) => {

    // the following will return data (articles) from each publication 
    res.json(articles)


});

// GET ONE article
app.get('/news/:newspaperId', async (req, res) => {


    // grab newspaper id from search params
    const newspaperID = req.params.newspaperId

    // check to see if newspaperID (name) from params is one of the newspapers within our newspaper array
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address

    // filter through artciles and append base to the url in case it's missing... base will be appended to url (if it exists) when creating our newspaper object(s) below on line 97
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                })
            })

            // respond with data from one publication 
            res.json(specificArticles)

        })
        .catch(err => console.log(err))
})


// listen 
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

// IMPORTANT COMMENTS WITH PSEUDO CODE
// // NOTE: 'placeholder' is equivalent to website URL
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    //     .then((response) => {

    //         // save data retrieved from fetch as html
    //         // pass in html variable to .load cheerio method in order to use cheerio as $
    //         const html = response.data
    //         const $ = cheerio.load(html)

    //         // below, include the element you wish to search for and the keyword related to the data that you wish to gather
    //         $('a:contains("climate")', html).each(function () {

    //             // for each a tag containing climate key word, save each a tags text as the article's title
    //             // for each href attribute found, save as URL to article
    //             const title = $(this).text()
    //             const url = $(this).attr('href')

    //             // for each title and url retrieved from scraped site, create an object for each an push into the articles array
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //         })

    //         // when the /news endpoint is visited, respond with scraped data in json format
    //         res.json(articles)

    //     })
    //     .catch((err) => console.log(err))
