const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const SellingPoints = require('../models/sellings-points.model');
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

    req.file.filename = `SellingPoint-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\SellingPoint\\${req.file.filename}`);

    next();
});


// Crud
exports.addSellingPoint = catchAsync(async (req, res, next) => {
    const sellingPoint = await SellingPoints.create(req.body);
    if (!sellingPoint) {
        return next(new AppError('غير قادر على إضافة نقطة البيع هذه', 400));
    }

    if (req.file) {
        req.file.filename = `${sellingPoint.name}-${Date.now()}.jpeg`;
        const dir = `public\\img\\SellingPoint`;

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`${dir}\\${req.file.filename}`);


        sellingPoint.backgroundImage = `${dir}\\${req.file.filename}`;
    }

    await sellingPoint.save();
    res.status(201).json({
        status: true,
        message: "تم إنشاء نقطة البيع بنجاح",
        data: sellingPoint
    });
});

exports.getSellingPoint = catchAsync(async (req, res, next) => {
    const {id} = req.params;

    const sellingPoint = await SellingPoints.findById(id);

    return res.status(200).json({
        status: true,
        sellingPoint
    })
})

exports.getAllSellingPoints = catchAsync(async (req, res, next) => {

    const {name} = req.query;


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const allSellingPoints = await SellingPoints.find(filter);

    return res.status(200).json({
        status: true,
        data: allSellingPoints
    });
});

exports.updateSellingPoint = catchAsync(async (req, res, next) => {
    const sellingPoint = await SellingPoints.findById(req.params.id);
    if (!sellingPoint) {
        return next(new AppError(`SellingPoint does not exist`, 404));
    }

    if (req.file) {
        const dir = path.join('public', 'img', 'SellingPoint');

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        req.body.backgroundImage = path.join(dir, req.file.filename);
    }

    Object.assign(sellingPoint, req.body);
    await sellingPoint.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        status: true,
        message: `Selling Point details have been updated successfully`,
        sellingPoint
    });
});

exports.deleteSellingPoint = catchAsync(async (req, res, next) => {


    const sellingPoint = await SellingPoints.findByIdAndDelete(req.params.id);

    if (!sellingPoint) {
        if (!sellingPoint) {
            return next(new AppError(`SellingPoint does not exist`, 404));
        }
    }

    // remove image too
    fs.unlink(`${sellingPoint.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
            return next(new AppError('Unexpected Error', 500))
        }
    });

    res.status(200).json({
        status: true,
        message: "SellingPoint deleted Successfully"
    })


})