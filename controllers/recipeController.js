const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs')
const recipe = require('../models/recipeModel')
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync');
const RecipeQuantity = require('../models/recipeQuantity');

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
exports.uploadrecipePhoto = upload.single('backgroundImage');

exports.resizerecipePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `recipe-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\recipe\\${req.file.filename}`);

    next();
});



exports.createrecipe = catchAsync(async (req, res, next) => {
    const doc = new recipe(req.body);
    const id = doc._id.toString();

    if (!doc) {
        return next(new AppError(`Cant add this Recipe`, 404));
    }
    if (req.file) {
        req.file.filename = `recipe-${id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public\\img\\recipe\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\recipe\\${req.file.filename}`;
    }

    await doc.save();

    res.status(201).json({
        status: true,
        message: "recipe created Successfully",
        data: doc
    })
})

exports.getrecipes = catchAsync(async (req, res, next) => {
    const recipes = await recipe.find();
    if (!recipes || recipes.length === 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        recipes
    })


})


exports.updaterecipe = catchAsync(async (req, res, next) => {

    const cat = await recipe.findById(req.params.id);
    if (!cat) {
        return next(new AppError(`recipe not found`, 404))
    }
    if (req.file) {
        req.body.backgroundImage = `public\\img\\recipe\\${req.file.filename}`;
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
            message: `Successfully updated recipe`,
            data: cat
        })

    }
})

exports.deleterecipe = catchAsync(async (req, res, next) => {
    const cat = await recipe.findById(req.params.id)
    if (!cat) return next(new AppError(`recipe not found`, 404))

    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
        }
    });

    await recipe.deleteOne();
    res.status(200).json({
        status: true,
        message: "recipe deleted Successfully"
    })
})

exports.searchrecipe = catchAsync(async (req, res, next) => {

    const doc = await recipe.find(
        {name: {$regex: req.params.term, $options: "i"}},
    ).limit(10);

    if (!doc || doc.length === 0) return next(new AppError(`recipe not found`, 404))
    res.status(200).json({
        status: true,
        data: doc
    })
})

