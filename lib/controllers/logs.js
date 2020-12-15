const { Router } = require('express');
const Log = require('../models/Log');

module.exports = Router()
    .post('/', (req, res, next) => {
        Log
            .insert(req.body)
            .then(log => res.send(log))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Log
            .find()
            .then(log => res.send(log))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Log
            .findById(req.params.id)
            .then(log => res.send(log))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Log
            .update(req.params.id, req.body)
            .then(log => res.send(log))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Log
            .delete(req.params.id)
            .then(log => res.send(log))
            .catch(next);
    })
