const express=require('express');
const authController=require('../controllers/authController')
const repoController=require('../controllers/repoController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createRepo',repoController.uploadRepoPhoto,repoController.createRepo),
router.get('/getRepos/:id',repoController.getRepos) //NOTE: inventory id
router.patch('/updateRepo/:id',repoController.uploadRepoPhoto,repoController.resizeRepoPhoto,repoController.updateRepo)
router.delete('/deleteRepo/:id',repoController.deleteRepo)
router.get('/search/:term',repoController.searchRepo)


module.exports=router;




