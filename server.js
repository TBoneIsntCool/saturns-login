const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// In-memory user store (in production, use a database)
const users = {
    'liam': {
        username: 'liam',
        passwordHash: '$2b$10$tTWm5nsmTtqSldmCFpkFleaKTeVrFxCqPHa2GXnIcYptSJgSKl1da',
        page: 'users/liam.html'  // Updated path
    },
    'kolton': {
        username: 'kolton',
        passwordHash: '$2b$10$BPmjBSw7cD96Zvq.J2vh4OH/HnW.lSUIP9zrbYFfIAHHOw6n.DwYC',
        page: 'users/kolton.html'  // Updated path
    },
    'admin': {
        username: 'admin',
        passwordHash: '$2b$10$vc3SVfr2gWz/YNskvV5F6u5/uuVJaqn9SVFLh4yxCLFYR2EBnK/PS',
        page: 'users/admin.html'  // Updated path
    },
    // Add more users as needed
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'a-very-secret-key-that-you-should-change', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users[username];
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        req.session.user = user.username;
        res.json({ page: user.page }); // Send the user's page to the client
    } else {
        res.status(401).send('Invalid username or password');
    }
});

app.get('/users/:page', checkAuth, (req, res) => {
    const page = `users/${req.params.page}`;
    if (Object.values(users).some(user => user.page === page && user.username === req.session.user)) {
        res.sendFile(path.join(__dirname, page));
    } else {
        res.status(403).send('Access denied');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    });
});


app.use(express.static(path.join(__dirname)));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
