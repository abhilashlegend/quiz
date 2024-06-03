const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./util/database').mongoConnect;
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
//const cookieParser =  require('cookie-parser');
//const { doubleCsrf: csrf } = require('csrf-csrf');
const flash = require('connect-flash');
const multer = require('multer');

const store = new mongoDbStore({
    uri: 'mongodb://127.0.0.1:27017/quiz',
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {  
        cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

/*
const csrfProtection = csrf({
    getSecret: () => 'supersecret',
    getTokenFromRequest: (req) => req.body._csrf,
});
*/


app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
//app.use(cookieParser("supersecret")); // BEFORE the csrf middleware
//app.use(csrfProtection.doubleCsrfProtection);
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLogin || false;
    if(req.session.user){
        res.locals.isAdmin = req.session.user.role == 'admin' ? true : false;
    }
    //    res.locals.csrfToken = req.csrfToken();
    next();
  });

app.use(quizRoutes);

app.use("/admin", adminRoutes );

app.get('/500', (req, res, next) => {
    res.render("error/500.ejs", {pageTitle: "Internal Server Error"});
})

app.use((req, res, next) => {
    res.render("error/404.ejs", {pageTitle: "Page not found"});
})

// app.use((error, req, res, next) => {
//     res.redirect("/500");
// })

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("Server listening on http://localhost:3000/");
    });
})

