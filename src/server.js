const express = require('express');
const cors = require('cors');
const admRoutes = require('./AdmRoutes');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(admRoutes)

app.listen(3001, () => {
    console.log('Listening on port 3001');
});