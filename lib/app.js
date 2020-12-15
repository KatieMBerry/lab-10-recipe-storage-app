const express = require('express');
const Recipe = require('./models/recipe');
const app = express();

app.use(express.json());

app.post('/api/v1/recipes', (req, res, next) => {
  Recipe
    .insert(req.body)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.get('/api/v1/recipes', (req, res, next) => {
  Recipe
    .find()
    .then(recipes => res.send(recipes))
    .catch(next);
});

app.get('/api/v1/recipes/:id', (req, res, next) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.put('/api/v1/recipes/:id', (req, res) => {
  Recipe
    .update(req.params.id, req.body)
    .then(recipe => res.send(recipe));
});

app.delete('/api/v1/recipes/:id', (req, res, next) => {
  Recipe
    .delete(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
