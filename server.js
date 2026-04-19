const express = require("express");
const app = express();

require('dotenv').config(); 
const db = require('./db');

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Clinic Management API is running!');
});

/* app.get('/api/patients',(req, res) => {
    const mock = [
        { id: 1, name: 'John    Doe', blood_group: 'O+' },
        { id: 2, name: 'Jane Smith', blood_group: 'A-' }
    ];

    res.json(mock)
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});