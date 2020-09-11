// require the requirements
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Issuse = require('../model/inquiry')
const User = require('../model/user');
//create app 
const app = express();
//use cors
app.use(cors());

//create Issuse module
module.exports.CreateIssue = async (req, res) => {
    let reqInquery = req.body;
    let user = req.user;
    if (user.usertype != 'User') {
        return res.status(400).send({ message: 'your are not a user' })
    }
    else if (reqInquery.issueType == '' || reqInquery.issueType == undefined) {
        return res.send({ message: 'issuetype is must to create an issue' })
    }
    else if ((reqInquery.issueType != 'No internet') &&
        (reqInquery.issueType != 'Slow Internet') &&
        (reqInquery.issueType != 'System maintenance')) {
        return res.send({ message: 'issuetype is must being like this No internet , Slow Internet, System maintenance ' })
    }
    else if (reqInquery.location == '' || reqInquery.location == undefined) {
        return res.send({ message: 'location is must to create an issue' })
    }
    else if ((reqInquery.location != 'Lap') &&
        (reqInquery.location != 'Department') &&
        (reqInquery.location != '101') &&
        (reqInquery.location != '102')) {
        return res.send({ message: 'location is must being like this Lap , Department, 101, 102' })
    }
    else if (reqInquery.description == '' || reqInquery.description == undefined) {
        return res.send({ message: 'description is must to create an issue' })
    }
    else {
        var des = new String(reqInquery.description)
        console.log(des.length)
        var ok = des.length
        if (des.length >= 30) {
            var issue = new Issuse({
                user_Ref: user.id,
                issueType: reqInquery.issueType,
                location: reqInquery.location,
                description: reqInquery.description
            })
            Issuse.create(issue).then(issue => {
                console.log(issue);
                if (issue) {
                    Issuse.find({ user_Ref: user.id }, async (err, data) => {
                        if (data) {
                            await User.updateOne({ _id: user.id }, { $set: { issue: data } }, (err, user) => {
                                if (!user) {
                                    return res.send({ message: 'sorry cannot join your issue', error: err })
                                }
                                else {
                                    return res.status(200).send({ message: 'issue created successfully', data: issue })
                                }
                            })
                        }
                        else {
                            return res.send({ message: 'sorry cannot create your issue', error: err })
                        }
                    }).catch(err => {
                        return res.status(400).send({ message: 'something wrong to create your issue', error: err })
                    })
                }
            })
        }
        else {
            return res.send({ message: 'description have more then 10 word but your letters', length: ok })
        }
    }
}

//Issuse getAll module

module.exports.GetAllIssue = async (req, res) => {
    let reqInquery = req.body;
    let user = req.user;

    if (user.usertype == "User") {

        Issuse.find({ user_Ref: user.id }).sort({'_id': -1}).populate('user_Ref').populate('taskAssignedTo').then(data => {
            if (data) {
                return res.status(200).send({ message: 'this is your issues', data: data })
            }
            else {
                return res.send({ message: 'cannot find your issue' })
            }
        }).catch(err => {
            return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
        })
    }
    else if (user.usertype == "Admin") {
        Issuse.find({}).sort({'_id': -1}).populate('user_Ref').populate('taskAssignedTo').then(data => {
            if (data) {
                return res.status(200).send({ message: 'this is your issues', data: data })
            }
            else {
                return res.send({ message: 'cannot find your issue' })
            }
        }).catch(err => {
            return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
        })

    }
    else {
        return res.status(400).send({ message: 'please mention your Id' })
    }
}

//Issuse update module

module.exports.UpdateIssue = async (req, res) => {
    let reqInquery = req.body;
    let user = req.user;
    var issuse;

    if (user.usertype == "User") {
        if (reqInquery.issueID == '' || reqInquery.issueID == undefined) {
            return res.send({ message: 'Please give your issue id then only find your issue' })
        }
        if (reqInquery.issueType) {
            if (reqInquery.issueType == '' || reqInquery.issueType == undefined) {
                return res.send({ message: 'issuetype is must to create an issue' })
            }
            else if ((reqInquery.issueType != 'No internet') &&
                (reqInquery.issueType != 'Slow Internet') &&
                (reqInquery.issueType != 'Slow Internet')) {
                return res.send({ message: 'issuetype is must being like this No internet , Slow Internet, System maintenance ' })
            }
        }
        if (reqInquery.location) {
            if (reqInquery.location == '' || reqInquery.location == undefined) {
                return res.send({ message: 'location is must to create an issue' })
            }
            else if ((reqInquery.location != 'Lap') &&
                (reqInquery.location != 'Department') &&
                (reqInquery.location != '101') &&
                (reqInquery.location != '102')) {
                return res.send({ message: 'location is must being like this Lap , Department, 101, 102' })
            }
        }
        if (reqInquery.description) {
            if (reqInquery.description == '' || reqInquery.description == undefined) {
                return res.send({ message: 'description is must to create an issue' })
            }
            else {
                var des = new String(reqInquery.description)
                console.log(des.length)
                var ok = des.length
                if (des.length <= 30) {
                    return res.send({ message: 'description have more then 10 word but your letters', length: ok })
                }
            }
        }
        if (reqInquery.InquiryStatus) {
            Issuse.findOne({ _id: reqInquery.issueID }, async (err, data) => {
                if (data) {
                    if (data.InquiryStatus != "COMPLETED") {
                        return res.send({ message: 'sorry you allow update your inquiry status because is not complete ' ,data:data})
                    }
                    else {
                        if (reqInquery.InquiryStatus !="CLOSED") {
                            return res.send({ message: 'sorry you allow update your inquiry status CLOSED only' })
                        }
                    }
                }
                else {
                    return res.send({ message: 'cannot find your issue' })
                }
            }).catch(err => {
                return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
            })
        }
        Issuse.updateOne({ _id: reqInquery.issueID,user_Ref:user.id }, { $set: {InquiryStatus:reqInquery.InquiryStatus} }, { runValidators: true }, (err, data) => {
            if (data) {
                Issuse.findOne({ _id: reqInquery.issueID }).then(data => {
                    if (data) {
                        return res.status(200).send({ message: 'this is your issues', data: data })
                    }
                    else {
                        return res.send({ message: 'cannot find your issue' })
                    }
                }).catch(err => {
                    return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
                })
            }
            else {
                return res.status(400).send({ message: 'cannot to update  your issue', error: err })
            }
        }).catch(err => {
            return res.status(400).send({ message: 'something wrong to update  your issue', error: err })
        })

    }
    else if (user.usertype == "Admin") {
        if (reqInquery.issueID == '' || reqInquery.issueID == undefined) {
            return res.send({ message: 'Please give your issue id then only find your issue' })
        }
        else if (reqInquery.InquiryStatus) {
            Issuse.findOne({ _id: reqInquery.issueID }, async (err, data) => {
                if (data) {
                    if ((data.InquiryStatus != 'NOTASSIGNED') && (data.InquiryStatus != 'ASSIGNED')) {
                        return res.send({ message: 'sorry you are allow to update your inquiry status only' })
                    }
                    else {
                        if ((reqInquery.InquiryStatus != 'ASSIGNED') && (reqInquery.InquiryStatus != 'COMPLETED')) {
                            return res.send({ message: 'sorry you not allow to update your other inquiry  status only you Complete or Assign' })
                        }
                        else {
                            if (reqInquery.InquiryStatus=="ASSIGNED") {
                                issuse = {
                                    InquiryStatus: reqInquery.InquiryStatus,
                                    taskAssignedTo: user.id
                                }
                            }
                            else if (reqInquery.InquiryStatus =="COMPLETED") {
                                issuse = {
                                    InquiryStatus: reqInquery.InquiryStatus,
                                    completedAt:Date.now()
                                }
                            }
                            else {
                                return res.send({ message: 'sorry you allow update your inquiry status Completed and Assigned only' })
                            }
                            Issuse.updateOne({ _id: reqInquery.issueID }, { $set: issuse },{ runValidators:true },(err, data) => {
                                if (data) {
                                    Issuse.findOne({ _id: reqInquery.issueID }).then(data => {
                                        if (data) {
                                            return res.status(200).send({ message: 'this is your issues', data: data })
                                        }
                                        else {
                                            return res.send({ message: 'cannot find your issue' })
                                        }
                                    }).catch(err => {
                                        return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
                                    })
                                }
                                else {
                                    return res.status(400).send({ message: 'cannot to update  your issue', error: err })
                                }
                            })
                                .catch(err => {
                                    return res.status(400).send({ message: 'something wrong to update  your issue', error: err })
                                })
                        }
                    }
                }
            }).catch(err => {
                return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
            })

        }
        else{
            return res.send({ message: 'Please give your issue status' })
        }
    }
    else {
        return res.status(400).send({ message: 'please mention your Id' })
    }

}
//Issue Delete module
module.exports.IssueDelete = async (req, res) => {
    let reqInquery = req.body;
    let user = req.user;

    if (user.usertype == "User") {
        if (reqInquery.issueID == '' || reqInquery.issueID == undefined) {
            return res.send({ message: 'Please give your issue id then only find your issue' })
        }
        else {
            Issuse.findOne({ _id: reqInquery.issueID }).then(issues => {
                if (issues) {
                    Issuse.deleteOne({ _id: reqInquery.issueID }, async (err, issuse) => {
                        if (issuse) {
                            Issuse.find({ user_Ref: user.id }, async (err, data) => {
                                if (data) {
                                    await User.updateOne({ _id: user.id }, { $set: { issue: data } }, (err, user) => {
                                        if (!user) {
                                            return res.send({ message: 'sorry cannot join your issue', error: err })
                                        }
                                        else {
                                            return res.status(200).send({ message: 'issue deleted successfully', data: issues })
                                        }
                                    })
                                }
                                else {
                                    return res.send({ message: 'sorry cannot create your issue', error: err })
                                }
                            }).catch(err => {
                                return res.status(400).send({ message: 'something wrong to create your issue', error: err })
                            })
                        }
                        else {
                            return res.send({ message: 'cannot find your issue' })
                        }
                    })
                        .catch(err => {
                            return res.status(400).send({ message: 'something wrong to delete  your issue', error: err })
                        })
                }
                else {
                    return res.send({ message: 'cannot find your issue' })
                }
            }).catch(err => {
                return res.status(400).send({ message: 'something wrong to find  your issue', error: err })
            })
        }
    }
}
