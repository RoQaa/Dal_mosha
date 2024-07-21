const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const Place = require('../models/placesModel');
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

    req.file.filename = `Places-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\Places\\${req.file.filename}`);

    next();
});


// Crud
exports.addPlace = catchAsync(async (req, res, next) => {
    const place = await Place.create(req.body);
    if (!place) {
        return next(new AppError('غير قادر على إضافة نقطة البيع هذه', 400));
    }

    if (req.file) {
        req.file.filename = `${place.name}-${Date.now()}.jpeg`;
        const dir = `public\\img\\Places`;

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`${dir}\\${req.file.filename}`);


        place.backgroundImage = `${dir}\\${req.file.filename}`;
    }

    await place.save();
    res.status(201).json({
        status: true,
        message: "تم إنشاء نقطة البيع بنجاح",
        data: place
    });
});

exports.getPlace = catchAsync(async (req, res, next) => {
    const {id} = req.params;

    const place = await Place.findById(id);

    return res.status(200).json({
        status: true,
        place
    })
})

exports.getAllPlaces = catchAsync(async (req, res, next) => {

    const {name} = req.query;


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const allPlaces = await Place.find(filter);

    return res.status(200).json({
        status: true,
        data: allPlaces
    });
});

exports.updatePlace = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
        return next(new AppError(`Place does not exist`, 404));
    }

    if (req.file) {
        const dir = path.join('public', 'img', 'Places');

        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        req.body.backgroundImage = path.join(dir, req.file.filename);
    }

    Object.assign(place, req.body);
    await place.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        status: true,
        message: `place details have been updated successfully`,
        place
    });
});

exports.deletePlace = catchAsync(async (req, res, next) => {


    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
        if (!place) {
            return next(new AppError(`Place does not exist`, 404));
        }
    }

    // remove image too
    fs.unlink(`${place.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
            return next(new AppError('Unexpected Error', 500))
        }
    });

    res.status(200).json({
        status: true,
        message: "Place deleted Successfully"
    })


})