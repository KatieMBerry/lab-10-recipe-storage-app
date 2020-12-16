const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');

describe('log-app routes', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('creates a new log via POST', async () => {

        const recipe = await Recipe.insert({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ]
        });

        const res = await request(app)
            .post('/api/v1/logs')
            .send({
                dateOfEvent: 'Dec 25, 1999',
                notes: 'way too fussy',
                rating: 3,
                recipeId: recipe.id
            });

        expect(res.body).toEqual({
            id: '1',
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });
    });

    it('retrieves all logs via GET', async () => {
        const recipe = await Recipe.insert({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ]
        });
        const logs = await Promise.all([
            {
                dateOfEvent: 'Dec 25, 1999',
                notes: 'way too fussy',
                rating: 3,
                recipeId: recipe.id
            },
            {
                dateOfEvent: 'July 4, 2020',
                notes: 'no one here anyway',
                rating: 1,
                recipeId: recipe.id
            }
        ].map(log => Log.insert(log)));

        const res = await request(app)
            .get('/api/v1/logs');

        expect(res.body).toEqual(expect.arrayContaining(logs));
        expect(res.body).toHaveLength(logs.length);
    });

    it('retrieves a log by ID from the database via GET', async () => {
        const recipe = await Recipe.insert({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ]
        });

        const log = await Log.insert({
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });

        const response = await request(app)
            .get(`/api/v1/logs/${log.id}`);

        expect(response.body).toEqual({
            id: log.id,
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });
    });

    it('updates a log via PUT', async () => {
        const recipe = await Recipe.insert({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ]
        });

        const log = await Log.insert({
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });

        const res = await request(app)
            .put(`/api/v1/logs/${log.id}`)
            .send({
                dateOfEvent: 'Dec 25, 1999',
                notes: 'way too fussy',
                rating: 3,
                recipeId: recipe.id
            });

        expect(res.body).toEqual({
            id: log.id,
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });
    });

    it('deletes a log by ID via DELETE, and returns it', async () => {
        const recipe = await Recipe.insert({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ]
        });

        const log = await Log.insert({
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });

        const response = await request(app)
            .delete(`/api/v1/logs/${log.id}`)
            .send(log)

        expect(response.body).toEqual({
            id: log.id,
            dateOfEvent: 'Dec 25, 1999',
            notes: 'way too fussy',
            rating: 3,
            recipeId: recipe.id
        });
    });

});
