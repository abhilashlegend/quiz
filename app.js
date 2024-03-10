const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./util/database').mongoConnect;
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(quizRoutes);

app.use("/admin", adminRoutes );

app.use((req, res, next) => {
    res.render("error/404.ejs", {pageTitle: "Page not found"})
})

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("Server listening on http://localhost:3000/");
    });
})

