// require the requirements
const express = require('express');
const router = express.Router();
const controller = require('../controller/UserController')
const issuseController = require('../controller/InquiryController')
const dailypdateController = require('../controller/dailyUpdateController')
const passport = require('passport')
require('../middleware/passport')(passport)

//create users routing Api's

//create user register Api
router.post('/register', controller.Register)
//admin verification
router.post('/admin/verify', controller.Verify)
//user login Api
router.post('/login', controller.Login)
//get profile
router.get('/getall', controller.GetAllprofile)
//get profile
router.put('/updateProfile', passport.authenticate('jwt', { session: false }), controller.UpdateProfile)
//delete profile
router.delete('/deleteProfile', passport.authenticate('jwt', { session: false }), controller.DeleteUser);


//create issue routing Api's

//create issue Api
router.post('/issueCreate', passport.authenticate('jwt', { session: false }), issuseController.CreateIssue)
//getall issue Api
router.get('/issueGet', passport.authenticate('jwt', { session: false }), issuseController.GetAllIssue)
//update issue Api
router.put('/issueUpdate', passport.authenticate('jwt', { session: false }), issuseController.UpdateIssue)
//delete issue Api
router.delete('/issueDelete', passport.authenticate('jwt', { session: false }), issuseController.IssueDelete)

//dailyupdate api

//create dailyupdate api
router.post('/createDaily', passport.authenticate('jwt', { session: false }), dailypdateController.CreateDailyUpdate)
//getbydepartment
router.get('/getDaily', passport.authenticate('jwt', { session: false }), dailypdateController.GetBydepartment)
//update dailyupdate api
router.put('/updateDaily', passport.authenticate('jwt', { session: false }), dailypdateController.UpdateDailyUpdate)
//delete dailyupdate
router.delete('/deleteDaily', passport.authenticate('jwt', { session: false }), dailypdateController.DeleteDailyUpdate)


module.exports = router;