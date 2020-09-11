// require the requirements
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Daily = require('../model/dailyUpdate')
//create app 
const app = express();
//use cors
app.use(cors());

//dailyupdate create 

module.exports.CreateDailyUpdate = async (req, res) => {
    let reqDaily = req.body;
    let user = req.user;
    if (user.usertype == "Admin") {
        if (reqDaily.department == "" || reqDaily.department == "undefined") {
            return res.send({ status: true, message: 'department is must please enter your department' })
        }
        else if ((reqDaily.department != 'MCA') &&
            (reqDaily.department != 'MSC IT') &&
            (reqDaily.department != 'MSC CS') &&
            (reqDaily.department != 'RVSCAS') &&
            (reqDaily.department != 'BCA') &&
            (reqDaily.department != 'BSC CS') &&
            (reqDaily.department != 'BSC IT')) {
            return res.send({ status: true, message: 'please check your department value must be like MCA,MSC-IT ,MSC-CS ,RVSCAS' })
        }
        else if (reqDaily.description == '' || reqDaily.description == undefined) {
            return res.send({ message: 'description is must to create an issue' })
        }
        else {
            var des = new String(reqDaily.description)
            if (des.length >= 30) {

                var daily = new Daily({
                    user_Ref: user.id,
                    department: reqDaily.department,
                    description: reqDaily.description
                })
                daily.save().then(data => {
                    res.status(200).send({ message: 'dailyupdate created successfully', data: data })
                }).catch(err => {
                    res.status(400).send({ message: 'sorry something wrong to create dailyupdate', err: err })
                })
            }
            else {
                return res.send({ message: 'we want more details in the description ' })
            }
        }
    }
    else {
        return res.send({ message: 'Sorry admin only create this dailyUpdates' })
    }
}

// Get my department
module.exports.GetBydepartment = async (req, res) => {
    let reqDaily = req.body;
    let user = req.user;
    if (user.usertype == "Admin") {
        Daily.find({user_Ref:user.id},[],{sort:{_id:-1}}).populate('user_Ref').then(data => {
            res.status(200).send({ message: 'this is your update', data: data })
        }).catch(err => {
            res.status(400).send({ message: 'sorry something wrong to find dailyupdate', err: err })
        })
    }
    else {
        if (user.usertype == "User") {

            Daily.find({ department: user.department },[],{sort:{_id:-1}}).populate('user_Ref').then(data => {
                res.status(200).send({ message: 'this is your update', data: data })
            }).catch(err => {
                res.status(400).send({ message: 'sorry something wrong to find dailyupdate', err: err })
            })
        }
        else {
            return res.send({ message: 'Sorry you are not a user' })
        }
    }
}

//update the dailyupdate
module.exports.UpdateDailyUpdate = async (req, res) => {
    let reqDaily = req.body;
    let user = req.user;
    var updata = {};
    if (user.usertype == "Admin") {
        if (reqDaily.dailyId == "" || reqDaily.dailyId == undefined) {
            return res.send({ message: 'daily update id is must to update the dailyupdate collection ' })
        }
        else {
            if (reqDaily.department) {
                if ((reqDaily.department != 'MCA') &&
                    (reqDaily.department != 'MSC IT') &&
                    (reqDaily.department != 'MSC CS') &&
                    (reqDaily.department != 'RVSCAS') &&
                    (reqDaily.department != 'BCA') &&
                    (reqDaily.department != 'BSC CS') &&
                    (reqDaily.department != 'BSC IT')) {
                    return res.send({ status: true, message: 'please check your department value must be like MCA,MSC-IT ,MSC-CS ,RVSCAS' })
                }
                else if (reqDaily.description) {
                    var des = new String(reqDaily.description)
                    if (des.length < 30) {
                        return res.send({ message: 'we want more details in the description ' })
                    }
                    else {

                        Daily.updateOne({ _id: reqDaily.dailyId, user_Ref: user.id },{ $set: {  department: reqDaily.department,  description: reqDaily.description} },{ runValidators: true },).then(dat => {
                            if (dat.nModified) {
                                Daily.findOne({ _id: reqDaily.dailyId, user_Ref: user.id }).then(data => {
                                    res.status(200).send({ message: 'dailyupdate document updated successfully ', data: data })
                                }).catch(err => {
                                    res.status(400).send({ message: 'sorry something wrong to find dailyupdate', err: err })
                                })
                            }
                            else {
                                res.status(400).send({ message: 'sorry something wrong to update dailyupdate' })
                            }
                        }).catch(err => {
                            res.status(400).send({ message: 'sorry something wrong to update dailyupdate', err: err })
                        })
                    }
                }
            }
        }
    }
    else {
        return res.send({ message: 'Sorry admin only update this daily update' })
    }
}

//delete dailyupdate
module.exports.DeleteDailyUpdate = async (req, res) => {
    let reqDaily = req.body;
    let user = req.user;
    if (user.usertype == "Admin") {
        if (reqDaily.dailyId == "" || reqDaily.dailyId == undefined) {
            return res.send({ message: 'daily update id is must to update the dailyupdate collection ' })
        }
        else {
            Daily.find({ _id: reqDaily.dailyId, user_Ref: user.id }).then(dal => {
                Daily.deleteOne({ _id: reqDaily.dailyId, user_Ref: user.id }).then(data => {
                    if (data.deletedCount) {
                        res.status(200).send({ message: 'dailyupdate document deleted successfully ', data: dal })
                    }
                    else {
                        res.status(400).send({ message: 'sorry something wrong to delete dailyupdate' })
                    }
                }).catch(err => {
                    res.status(400).send({ message: 'sorry something wrong to delete dailyupdate', err: err })
                })
            }).catch(err => {
                res.status(400).send({ message: 'sorry something wrong to find dailyupdate', err: err })
            })
        }
    }
    else {
        return res.send({ message: 'Sorry admin only update this daily update' })
    }
}