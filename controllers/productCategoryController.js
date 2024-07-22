const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const ProductCategory = require('../models/productsCategoryModel');
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

    req.file.filename = `ProductCategory-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\ProductCategory\\${req.file.filename}`);

    next();
});


// Crud
exports.addProductRecipe = catchAsync(async (req, res, next) => {
    const productCategory = await ProductCategory.create(req.body);
    if (!productCategory) {
        return next(new AppError('غير قادر على إضافة التصنيف الفرعي', 400));
    }

    if (req.file) {
        req.file.filename = `${productCategory.name}-${Date.now()}.jpeg`;
        const dir = `public\\img\\ProductCategory`;

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`${dir}\\${req.file.filename}`);


        productCategory.backgroundImage = `${dir}\\${req.file.filename}`;
    }

    await productCategory.save();

    res.status(201).json({
        status: true,
        message: "تم إنشاءالتصنيف الفرعي بنجاح",
        productCategory
    });
});

exports.getProductRecipe = catchAsync(async (req, res, next) => {
    const {id} = req.params;

    const productCategory = await ProductCategory.findById(id);

    return res.status(200).json({
        status: true,
        productCategory
    })
})

exports.getAllProductRecipe = catchAsync(async (req, res, next) => {

    const {name} = req.query;


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const allProductrecipeCategories = await ProductCategory.find(filter);


    return res.status(200).json({
        status: true,
        allProductrecipeCategories
    });
});


exports.updateProductRecipe = catchAsync(async (req, res, next) => {
    const productCategory = await ProductCategory.findById(req.params.id);
    if (!productCategory) {
        return next(new AppError(`ProductCategory does not exist`, 404));
    }

    if (req.file) {
        const dir = path.join('public', 'img', 'ProductCategory');

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        req.body.backgroundImage = path.join(dir, req.file.filename);
    }


    Object.keys(req.body).forEach(key => {
        productCategory[key] = req.body[key];
    });

    await productCategory.save({validateBeforeSave: false});

    res.status(200).json({
        status: true,
        message: `ProductCategory details have been updated successfully`,
        productCategory
    });
});


exports.deleteProductRecipe = catchAsync(async (req, res, next) => {


    const productCategory = await ProductCategory.findByIdAndDelete(req.params.id);


    if (!productCategory) {
        return next(new AppError(`Place does not exist`, 404));
    }


    // remove image too
    fs.unlink(`${productCategory.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
            return next(new AppError('Unexpected Error', 500))
        }
    });

    res.status(200).json({
        status: true,
        message: "ProductCategory deleted Successfully"
    })


})