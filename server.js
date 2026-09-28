const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

/*

npm init -y
npm install express ejs mysql2

*/

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expense_db"
});


// Test database connection
db.connect((err) => {

    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL");

});


// ========================================
// 1. READ - View all expenses
// ========================================

app.get("/", (req, res) => {

    const sql = "SELECT * FROM expenses ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        const expenses = results.map(e => ({
            ...e,
            amount: parseFloat(e.amount)
        }));

        const totalAmount = expenses.reduce(
            (sum, item) => sum + item.amount, 0
        );

        res.render("index", { expenses, totalAmount });

    });

});


// ========================================
// 2. CREATE - Render Add Form
// ========================================

app.get("/add", (req, res) => {
    res.render("add");
});


// ========================================
// 2. CREATE - Process Add Form
// ========================================

app.post("/add", (req, res) => {

    const title = req.body.title;
    const amount = parseFloat(req.body.amount);
    const day = req.body.day;
    const category = req.body.category;

    const sql = `
        INSERT INTO expenses
        (title, amount, day, category)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [title, amount, day, category], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.redirect("/");

    });

});


// ========================================
// 3. UPDATE - Render Edit Form
// ========================================

app.get("/edit/:id", (req, res) => {

    const sql = "SELECT * FROM expenses WHERE id = ?";

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        if (results.length === 0) {
            return res.redirect("/");
        }

        const expense = {
            ...results[0],
            amount: parseFloat(results[0].amount)
        };

        res.render("edit", { expense });

    });

});


// ========================================
// 3. UPDATE - Process Edit Form
// ========================================

app.post("/edit/:id", (req, res) => {

    const title = req.body.title;
    const amount = parseFloat(req.body.amount);
    const day = req.body.day;
    const category = req.body.category;

    const sql = `
        UPDATE expenses
        SET title = ?, amount = ?, day = ?, category = ?
        WHERE id = ?
    `;

    db.query(sql, [title, amount, day, category, req.params.id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.redirect("/");

    });

});


// ========================================
// 4. DELETE - Remove Expense
// ========================================

app.post("/delete/:id", (req, res) => {

    const sql = "DELETE FROM expenses WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.redirect("/");

    });

});


// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Weekly Expense Tracker running at http://localhost:${PORT}`
    );

});