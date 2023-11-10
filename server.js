const express = require('express');

// Import the connection object
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database before starting the Express.js server
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

//Default response for not found request
app.use((req, res) => {
    res.status(404).end();
});
  
app.listen(PORT, () =>
    console.log(`Server on port http://localhost:${PORT}`)
);
