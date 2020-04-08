const express = require('express');
const OngController = require('./controllers/OngController');
const incidentsController = require('./controllers/incidentsController');
const profileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

routes.post('/sessions',SessionController.create)
routes.get('/ongs', OngController.index); //Lista Ongs
routes.post('/ongs', OngController.create); //Cria Ongs

routes.get('/incidents', incidentsController.index); //Lista Incidents
routes.post('/incidents', incidentsController.create); //Cria Incidents
routes.delete('/incidents/:id', incidentsController.delete); //Cria Incidents
routes.get('/profile', profileController.index ); //Cria Incidents


module.exports = routes;