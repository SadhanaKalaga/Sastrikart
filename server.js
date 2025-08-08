const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'Sastrikart' directory
app.use(express.static(path.join(__dirname)));

app.use(express.json()); // Middleware to parse JSON bodies

const mockData = {
    users: [
        { id: 'U1001', name: 'Ramesh Kumar', email: 'ramesh@example.com' },
        { id: 'U1002', name: 'Sunita Devi', email: 'sunita@example.com' },
        { id: 'U1003', name: 'Amit Singh', email: 'amit@example.com' },
        { id: 'U1004', name: 'Priya Sharma', email: 'priya@example.com' }
    ],
    priests: [
        { id: 'P2001', name: 'Acharya Sharma', email: 'acharya.sharma@example.com' },
        { id: 'P2002', name: 'Pandit Joshi', email: 'pandit.joshi@example.com' },
        { id: 'P2003', name: 'Shastriji Maharaj', email: 'shastriji@example.com' },
    ],
    bookings: [
        { id: 'BK-12345', user: 'Ramesh Kumar', priest: 'Acharya Sharma', service: 'Griha Pravesh', date: '2025-08-03', amount: 8000, status: 'Completed' },
        { id: 'BK-12346', user: 'Sunita Devi', priest: 'Pandit Joshi', service: 'Satyanarayan Pooja', date: '2025-08-02', amount: 4500, status: 'Completed' },
        { id: 'BK-12347', user: 'Amit Singh', priest: 'Shastriji Maharaj', service: 'Vastu Shanti', date: '2025-08-05', amount: 12000, status: 'Upcoming' },
        { id: 'BK-12348', user: 'Priya Sharma', priest: 'Acharya Sharma', service: 'Namkaran Sanskar', date: '2025-08-06', amount: 3000, status: 'Upcoming' },
    ]
};

app.get('/api/users', (req, res) => {
  res.json(mockData.users);
});

app.get('/api/priests', (req, res) => {
  res.json(mockData.priests);
});

app.get('/api/bookings', (req, res) => {
    res.json(mockData.bookings);
});

app.get('/api/dashboard-stats', (req, res) => {
    const totalUsers = mockData.users.length;
    const totalPriests = mockData.priests.length;
    const totalBookings = mockData.bookings.length;
    const totalRevenue = mockData.bookings.reduce((sum, booking) => sum + booking.amount, 0);

    res.json({
        totalUsers,
        totalPriests,
        totalBookings,
        totalRevenue
    });
});

// Add a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    newUser.id = `U${Date.now()}`;
    mockData.users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    const index = mockData.users.findIndex(u => u.id === id);
    if (index !== -1) {
        mockData.users[index] = { ...mockData.users[index], ...updatedUser };
        res.json(mockData.users[index]);
    } else {
        res.status(404).send('User not found');
    }
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const index = mockData.users.findIndex(u => u.id === id);
    if (index !== -1) {
        mockData.users.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

// Add a new priest
app.post('/api/priests', (req, res) => {
    const newPriest = req.body;
    newPriest.id = `P${Date.now()}`;
    mockData.priests.push(newPriest);
    res.status(201).json(newPriest);
});

// Update a priest
app.put('/api/priests/:id', (req, res) => {
    const { id } = req.params;
    const updatedPriest = req.body;
    const index = mockData.priests.findIndex(p => p.id === id);
    if (index !== -1) {
        mockData.priests[index] = { ...mockData.priests[index], ...updatedPriest };
        res.json(mockData.priests[index]);
    } else {
        res.status(404).send('Priest not found');
    }
});

// Delete a priest
app.delete('/api/priests/:id', (req, res) => {
    const { id } = req.params;
    const index = mockData.priests.findIndex(p => p.id === id);
    if (index !== -1) {
        mockData.priests.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Priest not found');
    }
});

app.listen(port, () => {
  console.log(`SastriKart server listening at http://localhost:${port}`);
});
