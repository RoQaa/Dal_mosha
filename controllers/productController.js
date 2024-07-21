const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');
const path = require('path')


// file upload - resize
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const multerStorage = multer.memoryStorage();
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
exports.uploadSellingPointPhoto = upload.single('backgroundImage');

exports.resizeCategoryPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `Product-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\Product\\${req.file.filename}`);

    next();
});


// Crud
exports.addProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);

    if (!product) {
        return next(new AppError('غير قادر على إضافة المنتج ', 400));
    }

    if (req.file) {
        req.file.filename = `${product.name}-${Date.now()}.jpeg`;
        const dir = `public\\img\\Product`;

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`${dir}\\${req.file.filename}`);


        product.backgroundImage = `${dir}\\${req.file.filename}`;
    }

    await product.save();

    res.status(201).json({
        status: true,
        message: "تم إضافة المنتج بنجاح",
        product
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const {id} = req.params;

    const product = await Product.findById(id);

    return res.status(200).json({
        status: true,
        product
    })
})

exports.getAllProducts = catchAsync(async (req, res, next) => {

    const {name} = req.query;


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const products = await Product.find(filter);

    return res.status(200).json({
        status: true,
        products
    });
});


exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError(`Product does not exist`, 404));
    }

    if (req.file) {
        const dir = path.join('public', 'img', 'Product');

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        req.body.backgroundImage = path.join(dir, req.file.filename);
    }


    Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
    });

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        status: true,
        message: `Product details have been updated successfully`,
        product
    });
});


exports.deleteProduct = catchAsync(async (req, res, next) => {


    const product = await Product.findByIdAndDelete(req.params.id);


    if (!product) {
        return next(new AppError(`Product does not exist`, 404));
    }


    // remove image too
    fs.unlink(`${product.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
            return next(new AppError('Unexpected Error', 500))
        }
    });

    res.status(200).json({
        status: true,
        message: "Product deleted Successfully"
    })


})