const express = require("express");
const cors    = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json());

const db = require('./db');

app.use(express.json())
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Clinic Management API is running!');
});

app.use('/api/patients',     require('./routes/patients'));
app.use('/api/doctors',      require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/patient-health', require('./routes/health'));

/* app.get('/api/patients',(req, res) => {
    const mock = [
        { id: 1, name: 'John    Doe', blood_group: 'O+' },
        { id: 2, name: 'Jane Smith', blood_group: 'A-' }
    ];
    

    res.json(mock)
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});