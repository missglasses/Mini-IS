const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'expenses.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Helper functions to read and write JSON data
const getExpenses = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveExpenses = (expenses) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
};

// 1. READ: View all expenses for the week
app.get('/', (req, res) => {
    const expenses = getExpenses();
    const totalAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    res.render('index', { expenses, totalAmount });
});

// 2. CREATE: Render Add Form
app.get('/add', (req, res) => {
    res.render('add');
});

// 2. CREATE: Process Add Form submission
app.post('/add', (req, res) => {
    const expenses = getExpenses();
    const newExpense = {
        id: Date.now().toString(),
        title: req.body.title,
        amount: parseFloat(req.body.amount),
        day: req.body.day,
        category: req.body.category
    };
    expenses.push(newExpense);
    saveExpenses(expenses);
    res.redirect('/');
});

// 3. UPDATE: Render Edit Form
app.get('/edit/:id', (req, res) => {
    const expenses = getExpenses();
    const expense = expenses.find(e => e.id === req.params.id);
    if (!expense) return res.redirect('/');
    res.render('edit', { expense });
});

// 3. UPDATE: Process Edit Form submission
app.post('/edit/:id', (req, res) => {
    let expenses = getExpenses();
    const index = expenses.findIndex(e => e.id === req.params.id);
    
    if (index !== -1) {
        expenses[index] = {
            id: req.params.id,
            title: req.body.title,
            amount: parseFloat(req.body.amount),
            day: req.body.day,
            category: req.body.category
        };
        saveExpenses(expenses);
    }
    res.redirect('/');
});

// 4. DELETE: Remove Expense
app.post('/delete/:id', (req, res) => {
    let expenses = getExpenses();
    expenses = expenses.filter(e => e.id !== req.params.id);
    saveExpenses(expenses);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Weekly Expense Tracker running on http://localhost:${PORT}`);
});