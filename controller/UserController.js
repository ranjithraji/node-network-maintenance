// require the requirements
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
//create app 
const app = express();
//use cors
app.use(cors());

//create module for register user
module.exports.Register = async (req, res) => {
    const reqUser = req.body;
    //validation for name
    if (reqUser.name == '' || reqUser.name == 'undefined') {
        return res.send({ status: true, message: 'name is must please enter your name' })
    }
    //validation for email
    else if (reqUser.email == "" || reqUser.email == "undefined") {
        return res.send({ status: true, message: 'email is must please enter your email' })
    }
    //validation for phone number
    else if (reqUser.phoneNumber == "" || reqUser.phoneNumber == "undefined") {
        return res.send({ status: true, message: 'phone number is must please enter your phone no' })
    }
    //validation for password
    else {
        var phone = new String(reqUser.phoneNumber)
        var phoneCheck = Number(phone)
        console.log(phoneCheck)
        if (isNaN(phoneCheck)) {
            return res.send({ status: true, message: 'phone number is invalid be number only' })
        }
        else {
            if (phone.length == 10) {
                reqUser.phoneNumber =  reqUser.phoneNumber;
            }
            else {
                return res.send({ status: true, message: 'phone number is invalid' })
            }
        }
        if (reqUser.password == "" || reqUser.password == "undefined") {
            return res.send({ status: true, message: 'password is must please enter your password' })
        }
        //validation for usertype
        else {
            var password = new String(reqUser.password)
            if (password.length >= 6) {
                // hashing the password to the help of bcrypt hash method
                const salt = await (bcrypt.genSalt(10));
                reqUser.password = await (bcrypt.hash(reqUser.password, salt));
            }
            else {
                return res.send({ status: true, message: 'password is must have more then characters' })
            }
            if (reqUser.usertype == "" || reqUser.usertype == "undefined") {
                return res.send({ status: true, message: 'usertype is must to create your account' })
            }
            else {
                if ((reqUser.usertype != 'User') &&
                    (reqUser.usertype != 'Admin')) {
                    return res.send({ status: true, message: 'usertype is must then mention like this User or Admin' })
                }
                else {
                    //check the user was already exists
                    User.findOne({ $or: [{ email: reqUser.email }, { phoneNumber: reqUser.phoneNumber }] }, async function (err, data) {
                        if (!data) {
                            //validate user was admin are note
                            if (reqUser.usertype == "Admin") {
                                //validate admin code was currect are not
                                if (reqUser.adminCode === "12345") {
                                    //validation for position
                                    if (reqUser.position == "" || reqUser.position == "undefined") {
                                        return res.send({ status: true, message: 'your position is must please enter your postion' })
                                    }
                                    else {
                                        if ((reqUser.position != 'Network engineer') &&
                                            (reqUser.position != 'Network maintentance') &&
                                            (reqUser.position != 'System Maintentance')) {
                                                return res.send({ status: true, message: 'please check your department value must be like Network engineer,Network maintentance,System Maintentance' })
                                            }
                                        else {

                                            //create constructor admin
                                            const admin = new User({
                                                name: reqUser.name,
                                                email: reqUser.email,
                                                phoneNumber: reqUser.phoneNumber,
                                                password: reqUser.password,
                                                position: reqUser.position
                                            })

                                            // create collection and insert the data 
                                            User.create(admin)
                                                .then(data => {
                                                    return res.status(200).send({ status: true, message: 'successfully create admin', data: data })
                                                })
                                                .catch(err => {
                                                    return res.status(400).send({ status: false, message: 'same thing wrong', error: err })
                                                })
                                        }
                                    }
                                }
                                else {
                                    //admin code validation return statement
                                    return res.send({ status: true, message: 'please enter valid admin code' })
                                }
                            }
                            //validate usertpe was user are note
                            else if (reqUser.usertype == "User") {
                                //validation for department
                                if (reqUser.department == "" || reqUser.department == "undefined") {
                                    return res.send({ status: true, message: 'department is must please enter your department' })
                                }
                                else {
                                    if ((reqUser.department != 'MCA') &&
                                        (reqUser.department != 'MSC IT') &&
                                        (reqUser.department != 'MSC CS') &&
                                        (reqUser.department != 'RVSCAS') &&
                                        (reqUser.department != 'BCA') &&
                                        (reqUser.department != 'BSC CS') &&
                                        (reqUser.department != 'BSC IT')) {
                                        return res.send({ status: true, message: 'please check your department value must be like MCA,MSC-IT ,MSC-CS ,RVSCAS' })
                                    }
                                    else {
                                        //create constructor user
                                        const user = new User({
                                            name: reqUser.name,
                                            email: reqUser.email,
                                            phoneNumber: reqUser.phoneNumber,
                                            password: reqUser.password,
                                            department: reqUser.department
                                        })
                                        // create collection and insert the data 
                                        User.create(user).then(data => {
                                            return res.status(200).send({ status: true, message: 'successfully create user', data: data })
                                        })
                                            .catch(err => {
                                                return res.status(400).send({ status: false, message: 'same thing wrong', error: err })
                                            })

                                    }
                                }

                            }
                        }
                        else {
                            return res.send({ status: true, message: 'user already exists' })
                        }
                    })
                        .catch(err => {
                            return res.send({ status: false, message: 'samething wrong', error: err })
                        })
                }
            }
        }
    }
}
//Admin code verfication api
module.exports.Verify = async (req, res) => {
    let reqUser = req.body;
    if ((reqUser.usertype == "" || reqUser.usertype == 'undefine')) {
        return res.send({ status: true, message: 'your usertype is must so please enter', success: false })
    }
    else {
        if ((reqUser.usertype == "Admin")) {
            if ((reqUser.adminCode == "" || reqUser.adminCode == 'undefine')) {
                return res.send({ status: true, message: 'your admin code must so please enter', success: false })
            }
            else {
                if (reqUser.adminCode == "12345") {
                    return res.status(200).send({ status: true, message: 'your admin code was correct so your are allow to login', success: true })
                }
                else {
                    return res.send({ status: true, message: 'your admin code was invalid so please check', success: false })
                }
            }
        }
        else {
            return res.status(400).send({ status: true, message: 'your are not a admin ', success: false })
        }
    }
}

//Login for users api
module.exports.Login = async (req, res) => {
    let reqUser = req.body;

    if ((reqUser.email == '' || reqUser.email == 'undefine') || (reqUser.phoneNumber == '' || reqUser.phoneNumber == 'undefine')) {
        return res.send({ status: true, message: 'Email Id or Phone is must to login in your account' })
    }
    else {
        if (reqUser.password == '' || reqUser.password == '') {
            return res.send({ status: true, message: 'password is must please enter your password' })
        }
        else {
            User.findOne({ $or: [{ email: reqUser.email }, { phoneNumber:reqUser.phoneNumber }] }, (err, data) => {
                if (!data) {
                    return res.send({ status: true, message: 'email Id or phone no was invalid', error: err })
                }
                else {
                    bcrypt.compare(reqUser.password, data.password, function (err, result) {
                        if (result == true) {
                            var payload = {};
                            if (data.department) {
                                payload = {
                                    id: data.id,
                                    name: data.name,
                                    email: data.email,
                                    phoneNumber: data.phoneNumber,
                                    usertype: 'User',
                                    department: data.department,
                                }
                            }
                            else {
                                payload = {
                                    id: data.id,
                                    name: data.name,
                                    email: data.email,
                                    phoneNumber: data.phoneNumber,
                                    usertype: 'Admin',
                                    position: data.position
                                }
                            }
                            console.log(payload);

                            jwt.sign(payload, 'secret', { expiresIn: '10h' }, (err, jwt) => {
                                if (jwt) {
                                    return res.status(200).send({ status: true, data: data, message: 'your are welcome', token: 'Bearer  ' + jwt })
                                }
                                else {
                                    return res.status(400).send({ status: true, message: 'jwt  was notworking', error: err })
                                }
                            })
                        }
                        else {
                            return res.send({ status: true, message: 'password  was invalid', error: err })
                        }
                    })
                }
            })
                .catch(err => {
                    return res.status(400).send({ status: true, message: 'samething wrong on find your data', error: err })
                })
        }
    }
}

//profile get
module.exports.GetAllprofile = async (req, res) => {
    User.find({}).then(data => {
        return res.status(200).send({ status: true, message: 'database datas', data: data })
    })
        .catch(err => {
            return res.status(400).send({ status: false, message: 'samthing wrong', error: err })
        })

}
//update profile

module.exports.UpdateProfile = async (req, res) => {
    let reqUser = req.body;
    let user = req.user;
    var updatUser;
    console.log(user);

    if (reqUser.email) {
        return res.send({ status: true, message: 'sorry you cannot update your email id' })
    }
    else {
        if (reqUser.phoneNumber) {
            return res.send({ status: true, message: 'sorry you cannot update your phone number id' })
        }
        else {
            if (reqUser.password) {
                return res.send({ status: true, message: 'sorry you cannot update your password' })
            }
            else {

                if (user.position) {
                    if (reqUser.department) {
                        return res.send({ status: true, message: 'sorry you cannot update department' })
                    }
                    else {
                        if (reqUser.position) {
                            if ((reqUser.position != 'Network engineer') &&
                                (reqUser.position != 'Network maintentance') &&
                                (reqUser.position != 'System Maintentance')) {
                                return res.send({ status: true, message: 'please check your department value must be like Network engineer,Network maintentance,System Maintentance' })
                            }
                            else {
                                updatUser = {
                                    name: reqUser.name,
                                    position: reqUser.position
                                }
                            }
                        }
                    }
                }
                else {
                    if (user.department) {
                        if (reqUser.position) {
                            return res.send({ status: true, message: 'sorry you cannot update position' })
                        }
                        else {
                            if (reqUser.department) {
                                if ((reqUser.department != 'MCA') &&
                                    (reqUser.department != 'MSC IT') &&
                                    (reqUser.department != 'MSC CS') &&
                                    (reqUser.department != 'RVSCAS') &&
                                    (reqUser.department != 'BCA') &&
                                    (reqUser.department != 'BSC CS') &&
                                    (reqUser.department != 'BSC IT')) {
                                    return res.send({ status: true, message: 'please check your department value must be like MCA,MSC-IT ,MSC-CS ,RVSCAS..ect' })
                                }
                                else {
                                    updatUser = {
                                        name: reqUser.name,
                                        department: reqUser.department
                                    }
                                }
                            }

                        }
                    }
                }
                console.log(updatUser);
                User.updateOne({ email: user.email, phoneNumber: user.phoneNumber }, updatUser, (err, data) => {
                    if (data) {
                        User.find({ $or: [{ email: user.email }, { phoneNumber: user.phoneNumber }] }).then(data => {
                            return res.status(200).send({ status: true, message: 'updated successfully', data: data })
                        }).catch(err => {
                            return res.status(200).send({ status: true, message: 'updated successfully but cannot find your data', error: err })
                        })
                    }
                    else {
                        return res.send({ status: true, message: 'cannot updated your profile ', error: err })
                    }
                }).catch(err => {
                    return res.status(400).send({ status: true, message: 'updated successfully', error: err })
                })
            }
        }
    }

}

/*Delete account api*/
module.exports.DeleteUser = async (req, res) => {
    let reqUser = req.body;
    let user = req.user;

    User.deleteOne({ $or: [{ email: user.email }, { phoneNumber: user.phoneNumber }] }, (err, data) => {
        if (data.deletedCount != 0) {
            console.log(reqUser.phoneNumber)
            return res.status(200).send({ status: true, message: 'deleted successfully', data: user })

        }
        else {
            return res.send({ status: true, message: 'cannot find your data please check your email id or phone' })
        }
    })
        .catch(err => {
            return res.status(200).send({ status: true, message: ' cannot find your data', error: err })
        })
}