const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          {
            amount: '1',
            measurement: 'cups',
            name: 'butter'
          },
          {
            amount: '1 / 2',
            measurement: 'cup',
            name: 'chocolate chips'
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              amount: '1',
              measurement: 'cups',
              name: 'butter'
            },
            {
              amount: '1 / 2',
              measurement: 'cup',
              name: 'chocolate chips'
            }
          ]
        });
      });
  });

  it('gets all recipes', async () => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [], ingredients: [] },
      { name: 'cake', directions: [], ingredients: [] },
      { name: 'pie', directions: [], ingredients: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('finds a single recipe by id and all associated logs', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: '1',
          measurement: 'cups',
          name: 'butter'
        },
        {
          amount: '1 / 2',
          measurement: 'cup',
          name: 'chocolate chips'
        }
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

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)

      .then(res => {
        expect(res.body).toEqual({
          ...recipe,
          logs: expect.arrayContaining(logs)
        });
      });
  });

  it('updates a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: '1',
          measurement: 'cups',
          name: 'butter'
        },
        {
          amount: '1 / 2',
          measurement: 'cup',
          name: 'chocolate chips'
        }
      ]
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          {
            amount: '1',
            measurement: 'cups',
            name: 'butter'
          },
          {
            amount: '1 / 2',
            measurement: 'cup',
            name: 'chocolate chips'
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              amount: '1',
              measurement: 'cups',
              name: 'butter'
            },
            {
              amount: '1 / 2',
              measurement: 'cup',
              name: 'chocolate chips'
            }
          ]
        });
      });
  });

  it('finds a single recipe by id, deletes it and returns it', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: '1',
          measurement: 'cups',
          name: 'butter'
        },
        {
          amount: '1 / 2',
          measurement: 'cup',
          name: 'chocolate chips'
        }
      ]
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)

      .then(res => {
        expect(res.body).toEqual(recipe);
      });
  });

});
