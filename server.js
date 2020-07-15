const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.json({ msg: 'Welcome to SplitShare' }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

app.listen(PORT, () => console.log(`Server Started On port ${PORT}`));
