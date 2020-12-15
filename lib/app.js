const express = require('express');
const Recipe = require('./models/Recipe');
const app = express();

app.use(express.json());

app.use('/api/v1/recipes', require('./controllers/recipes'));
app.use('/api/v1/logs', require('./controllers/logs'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
