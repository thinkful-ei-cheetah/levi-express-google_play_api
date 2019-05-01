const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore');

const app = express();

// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));

//This is the final request handler
app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/apps', (req, res) => {
    let {sort} = req.query;
    let {genres} = req.query;
    let store = playstore;

    const sortList = ['rating', 'app'];
    const genresList = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

    if (sort) {
        sort = sort.toLowerCase();
        if (!sortList.includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app')
        } else {
            sort = sort.charAt(0).toUpperCase() + sort.slice(1);
            store.sort((a,b) => {
                return a[sort] > b[sort] ? 1: a[sort]< b[sort] ? -1: 0;
            })
        }
    }
    if (genres) {
        genres = genres.toLowerCase();
        genres = genres.charAt(0).toUpperCase() + genres.slice(1);
        if (!genresList.includes(genres)) {
            return res
                .status(400)
                .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card')
        } else {
            store = store.filter(app => {
                return app['Genres'].includes(genres);
            })
        }
    }



    res.status(200).send(store);
});

module.exports = app;