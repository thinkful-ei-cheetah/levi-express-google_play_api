const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app.js');
const playstore = require('../playstore');
const playstoreSortApp = require('./playstore.sortApp');
const playstoreSortRating = require('./playstore.sortRating');
const playstoregenresAction = require('./playstore.genresAction');
const playstoreSortAppGenresAction = require('./playstore.sortAppGenresAction');

describe('GET /', () => {
    it('should return "Hello Expres!"', () => {
        return request(app)
            .get('/')
            .expect(200, 'Hello Express!');
    });
});

describe('GET /apps', () => {
    it('should return full playstore with no queries', () => {
        return request(app)
            .get('/apps')
            .expect(200, playstore)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            });
    });

    it('should return full playstore, sorted by app', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200, playstoreSortApp)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            });
    });

    it('should return full playstore, sorted by rating', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.ordered.deep.members(playstoreSortRating);
            });
    });

    it('should return a filtered playstore, filtered by action', () => {
        return request(app)
            .get('/apps')
            .query({genres: 'action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.deep.members(playstoregenresAction);
            });
    });

    it('should return a filtered and sorted playstore, filtered by action and sorted by app', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'app', genres: 'action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.deep.members(playstoreSortAppGenresAction);
            });
    });
});