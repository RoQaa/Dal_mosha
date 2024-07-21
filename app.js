const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const path = require('path')
const rateLimit = require('express-rate-limit'); // security
const helmet = require('helmet'); // security
const mongoSanitize = require('express-mongo-sanitize'); // security
const xss = require('xss-clean'); // security
const cors = require('cors')
const supplierRouter = require('./routes/supplierRouter')
const userRouter = require('./routes/userRouter')
const repoRouter = require('./routes/repoRouter');
const categoryRouter = require('./routes/categoryRouter')
const unitRouter = require('./routes/unitRouter')
const subCategoryRouter = require('./routes/subCategoryRouter');
const invoiceRouter = require('./routes/invoiceRouter');
const sellingPointRouter = require('./routes/placesRoutes')
const paymentMethodRouter = require('./routes/paymentMethodsRoute')
const clientTypeRouter = require('./routes/clientTypesRoutes')
const clientRouter = require('./routes/clientRouter')
const invoiceDepartmentRouter = require('./routes/invoiceDepartmentRouter')
const productCategory = require('./routes/productCategoryRouter')
const AppError = require(`${__dirname}/utils/appError`);

const globalErrorHandler = require(`${__dirname}/controllers/errorController`);
const app = express();

// Global MiddleWares

//set security http headers
app.use(helmet()); // set el htttp headers property

/*
app.use(cors());
app.options('*', cors())
*/
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
// Poclicy for blocking images
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

//development logging
if (process.env.NODE_ENV === 'development') {
    //   app.use(morgan('dev'));

    morganBody(app, {
        logAllReqHeader: true,
    });


}

//Limit requests from same API
// hna bn3ml limitng l3dd el mrat elly log in 34an  el brute force attacks
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests please try again later',
});


app.use('/api', limiter); // (/api)=> all routes start with /api

//Body parser,reading data from body into req.body
app.use(express.json()); //middle ware for req,res json files 3and req.body

//Data sanitization against no SQL injection
app.use(mongoSanitize());

//Data sanitization against cross site scripting attacks (XSS)
app.use(xss());


//serving static files
//app.use(express.static(`${__dirname}/public`));
//app.use('/static', express.static('public'));
//app.set('view engine', 'ejs'); // Change 'ejs' to your desired template engine
app.use('/api/public', express.static(path.join(__dirname, 'public')));

//app.use(express.json({limit:'10kb'})); => limit of data in body not more than 10 KB

//request time of API
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();

    next();
});

app.use('/api/v1/supplier', supplierRouter)
app.use('/api/v1/repo', repoRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/unit', unitRouter)
app.use('/api/v1/subCategory', subCategoryRouter)
app.use('/api/v1/invoice', invoiceRouter)
app.use('/api/v1/invoiceDepartment', invoiceDepartmentRouter)
app.use('/api/v1/selling-points', sellingPointRouter)
app.use('/api/v1/payment-method', paymentMethodRouter)
app.use('/api/v1/client-types', clientTypeRouter)
app.use('/api/v1/clients', clientRouter)
app.use('/api/v1/productCategory', productCategory)
app.all('*', (req, res, next) => {

    return next(
        new AppError(`Can't find the url ${req.originalUrl} on this server`, 404)
    );
});
app.use(globalErrorHandler);

module.exports = app;

//TODO:Pagination imprtant