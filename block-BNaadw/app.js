var express = require('express')
var mongoose = require('mongoose')
var path = require('path')
var Product = require('./models/product')
var usersRouter = require('./routes/users')
var logger = require('morgan')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

var indexrouter = require('.router/index.js')
var articlesRouter = require('./routes/articles')
mongoose.connect()

var app = express('mongodb://localhost/user-diary', {
useNewUrlParser: true, 
useUnifiedTopology: true
}, (err) => {
    console.log(err ? err : 'connected')
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


//add session after cookie parser

app.use(session({
    secret: process.env.SECRET,
    resave: false,  //will save the entire session
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection })
}))


app.get('/', (req,res) => {
    res.send('welcome')
})
app.post('/products', (req,res) => {
    console.log(req.body)
    //save data to db
    Product.create(req.body, (err, product) => {
        console.log(err, product)
    })
})

app.get('/products', (req,res) => {
    Product.find({},(err, products) =>{
        console.log(err,products)
        //res.json({products: products})
    })
})

app.put('/products/:id', (req,res)=>{
    var id = req.params.id
    Product.findByIdAndUpdate(iq, req.body, {new:true}, (err, updatedProduct) => {
        res.json(updatedProduct)
    })
})

app.delete('/products/:id', (req,res) => {
    Product.findByIdAndUpdate(req.params.id, (err,deletedProduct) => {
       // res.json()
        res.send(`${deletedProduct.title} was deleted`)

    })
})

//findOneAndDelete - will find one document - the first with the searched criteria and takes query as object
//even if deleted the old version will be visible

//routing

app.use('/', require('./routes/index'))
app.use('/books', require('./routes/books'))

app.use('/books', (req,res,next) => {
    res.send('page not found')
})

//
app.set('view engine', 'ejs')
app.set(express.urlencoded({extended:false}))  //to capture form data parse into object 

app.get('/', (req,res) => {

    res.render('index.ejs')
})

app.use('/students', studentsRouter)

app.use((req,res,next) => {
    res.status(404).send('page not found')
})
app.use((err,req,res,next) => {
    res.send(err)
})



///
app.use('/articles', articlesRouter)
