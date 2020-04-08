const express = require('express');
const cors = require('cors');
const routes = require('./routes')

const app = express();

app.use(cors());
app.use(express.json()); //isso para o servidor entender que será passado o Body no formato JSON
app.use(routes);

app.listen(3333);