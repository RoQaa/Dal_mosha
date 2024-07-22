const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs')
const RecipeCategory = require('../models/recipeCategoryModel')
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync')


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
    // limits: { fileSize: 2000000 /* bytes */ },
    fileFilter: multerFilter
});
exports.uploadCategoryPhoto = upload.single('backgroundImage');

exports.resizeCategoryPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `RecipeCategory-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\Categories\\${req.file.filename}`);

    next();
});


exports.createCategory = catchAsync(async (req, res, next) => {
    const doc = new RecipeCategory(req.body);
    const id = doc._id.toString();

    if (!doc) {
        return next(new AppError(`Something went wrong`, 404));
    }
    if (req.file) {
        req.file.filename = `RecipeCategory-${id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public\\img\\Categories\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\Categories\\${req.file.filename}`;
    }

    await doc.save();
    res.status(201).json({
        status: true,
        message: "RecipeCategory Created Successfully",
        data: doc
    })

})
exports.getCategorys = catchAsync(async (req, res, next) => {
    let Categories = await RecipeCategory.find();
    if (!Categories || Categories.length === 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        Categories
    })
})


exports.updateCategory = catchAsync(async (req, res, next) => {
   

    const cat = await RecipeCategory.findById(req.params.id);
    console.log("here")
    if (!cat) {
        return next(new AppError(`RecipeCategory not found`, 404))
    }
    if (req.file) {
        req.body.backgroundImage = `public\\img\\Categories\\${req.file.filename}`;
        fs.unlink(`${cat.backgroundImage}`, (err) => {
            console.log("image deleted")
            if (err) {
                console.log("Error:delete image ")
            }

        });


        Object.assign(cat, req.body); // Assuming `updateData` contains fields to update
        await cat.save({validateBeforeSave: false});

        res.status(200).json({
            status: true,
            message: `Successfully updated RecipeCategory`,
            data: cat
        })

    }
})

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const cat = await RecipeCategory.findById(req.params.id)
    if (!cat) return next(new AppError(`RecipeCategory not found`, 404))

    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
        }
    });

    await RecipeCategory.deleteOne();
    res.status(200).json({
        status: true,
        message: "Categories deleted Successfully"
    })
})

exports.searchCategory = catchAsync(async (req, res, next) => {

    const doc = await RecipeCategory.find(
        {name: {$regex: req.params.term, $options: "i"}},
    ).limit(10);
    if (!doc || doc.length === 0) return next(new AppError(`RecipeCategory not found`, 404))
    res.status(200).json({
        status: true,
        data: doc
    })
})
