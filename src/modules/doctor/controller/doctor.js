import mongoose, { Schema, Types, model } from "mongoose";
import { hash, compare } from '../../../utils/HashAndCompare.js'
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
import doctorModel from '../../../../DB/model/doctor.model.js'
import patientModel from '../../../../DB/model/patient.model.js'
import cloudinary from '../../../utils/cloudinary.js'
import adminModel from '../../../../DB/model/admin.model.js'

//all doctors
export const doctors = async (req, res, next) => {
    const doctors = await doctorModel.find()
    return res.status(200).json({ message: "Done", doctors })
}


//get doctor by Id
export const doctorById = asyncHandler(async (req, res, next) => {
    const doctor = await doctorModel.findById(req.params.id)
    if (!doctor) { return next(new Error(`IN-valid doctorId `, { cause: 400 })) }
    return res.status(200).json({ message: "Done", doctor })
})
//update doctor
export const updateDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await doctorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) { return next(new Error(`doctor not found `, { cause: 404 })) }
    return res.status(200).json({ message: "Done updated" })
})
//delete doctor
export const deleteDoctor = asyncHandler(async (req, res, next) => {
    const { doctorId } = req.params
    const doctor = await doctorModel.findByIdAndDelete(doctorId);
    if (!doctor) {
        return next(new Error(`doctor not found `, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done doctor deleted", })
})



//signUp
export const signupDoctor = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, clinicAddress, phone_one, phone_two, unionCard, certificate, specialization, email, password } = req.body
    //check email exist
    const checkDoctor = await doctorModel.findOne({ email: email.toLowerCase() })
    const checkAdmin = await adminModel.findOne({ email: email.toLowerCase() })
    const checkPatient = await patientModel.findOne({ email: email.toLowerCase() })
    if (checkDoctor) {
        return next(new Error(`Email exist`, { cause: 404 }))
    }
    if (checkDoctor !== checkPatient) {
        return next(new Error(`duplicated  patient email`, { cause: 409 }))
    }
    if (checkDoctor !== checkAdmin) {
        return next(new Error(`duplicated admin email`, { cause: 409 }))
    }
    //send email()
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">confirm email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) { return next(new Error(`fail to send this email`, { cause: 400 })) }
    ///hash password
    const hashPassword = hash({ plaintext: password })
    //save//create doctor 
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files?.certificate[0].path,
        { folder: `${process.env.APP_NAME}/doctor/certificate` })
    req.body.certificate = { secure_url, public_id }
    const { url, id } = await cloudinary.uploader.upload(req.files?.unionCard[0].path,
        { folder: `${process.env.APP_NAME}/doctor/unionCard` })
    req.body.unionCard = { url, id }
    const { _id } = await doctorModel.create({
        firstName, lastName, clinicAddress, phone_one, phone_two,
        certificate: { secure_url, public_id }, unionCard: { url, id },
        emailCode, specialization, email, password: hashPassword,
    })
    return res.status(201).json({ message: "Done", _id })
})



export const generateRefreshToken = asyncHandler(async (req, res, next) => {


    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN })
    if (!email) {
        return next(new Error('In-valid token payload', { cause: 400 }))
        // return res.status(200).redirect(`${process.env.FE_URL}/#/In-validEmail`)
        // return res.status(400).json({ message: "invalid token payload", })

    }
    const doctor = await doctorModel.findOne({ email: email.toLowerCase() })
    if (!doctor) {
        return next(new Error("Not register account", { cause: 400 }))
        //  return res.status(404).json({ message: "Not register account", })

    }
    if (!doctor.confirmEmail) {
        return res.status(404).json({ message: "Not confirm email", })
    }
    const newToken = generateToken({ payload: { email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 2 })


    const link = `${req.protocol}://${req.headers.host}/doctor/confirmEmail/${newToken}`
    const rfLink = `${req.protocol}://${req.headers.host}/doctor/NewConfirmEmail/${token}`

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0"  style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    <br>
    <br>
    <br>
    <br>
    <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
    
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">


    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
    if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) {

        return next(new Error("fail to send this Email", { cause: 400 }))
        //  return res.status(400).json({ message: "fail to send", })

    }
    // return res.status(200).redirect(`${process.env.FE_URL}/#/ConfirmEmail`)
    return res.status(200).send('<h1>New Confirmation Email have been to your inbox please check it asap</h1>')
})

//login
export const loginDoctor = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    //check email exist
    const doctor = await doctorModel.findOne({ email: email.toLowerCase() })
    if (!doctor) {
        return next(new Error(`email  exist`, { cause: 404 }))
    }
    if (!doctor.isApproved) {
        return next(new Error(`Please accept from admin.`, { cause: 400 }))
    }
    if (!doctor.confirmEmail) {
        return next(new Error(`please confirm your Email first.`, { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: doctor.password })
    if (!match) {
        return next(new Error(`IN-valid login data`, { cause: 400 }))
    }
    const access_Token = generateToken({
        payload: { id: doctor._id },
        expiresIn: 60 * 30
    })
    const refresh_token = generateToken({
        payload: { id: doctor._id },
        expiresIn: 60 * 60 * 24 * 365
    })
    const doctorID_token = { id: doctor._id }

    doctor.isLogin = true
    
    doctor.status = 'online'
    await doctor.save()
    return res.status(200).json({
        message: "Done",
        access_Token,
        refresh_token,
        doctorID_token
    })
})


//logout
export const logoutDoctor = async (req, res, next) => {
   
    const doctor = await doctorModel.updateOne({_id:req.doctor._id },{status:'offline',isLogin:'false'})
    
    return res.status(200).json({ message: "Done is logout"})
}

//profile
export const profile = asyncHandler(async (req, res, next) => {

    const doctor = await doctorModel.findById(req.doctor._id)

    return res.json({
        message: "Done",
        doctor
    })


})



//addPatient
export const addPatient = asyncHandler(async (req, res, next) => {
    const { patientId } = req.params;
    
    const patient = await patientModel.findById(patientId)
    if (!patient) {
        return next(new Error("Not llregister account", { cause: 404 }))
    }
    if (!patient.isLogin) {
        return next(new Error("No login", { cause: 404 }))
    
    }
    const doctor = await doctorModel.findById(req.doctor._id)
    patient.doctorId = req.doctor._id
    await patient.save()
    return res.status(201).json({ message: 'Done', patient })
})

//send code email
export const sendCodeEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const doctor = await doctorModel.findOneAndUpdate({  email: email.toLowerCase() }, { emailCode })
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))

    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">verify email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`


    if (!await sendEmail({ to: email, subject: 'verify email', html })) {

        return next(new Error("fail to send this email", { cause: 400 }))

    }
    return res.status(200).json({ message: "Done send code email" })
})


//confirm email

export const confirmEmailDoctor = asyncHandler(async (req, res, next) => {
    const {  emailCode } = req.body

    const doctor = await doctorModel.findOne({ emailCode })
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    // if (doctor.emailCode != emailCode) {

    if (doctor.emailCode !== parseInt(emailCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    doctor.emailCode = null;

    doctor.confirmEmail = true
    await doctor.save()

    return res.status(200).json({ message: "Done" })
})





//sendCode forget password

export const sendCodeDoctor = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const doctor = await doctorModel.findOne({  email: email.toLowerCase() })
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    const EmailPasswordCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">check your email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${EmailPasswordCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">verify code</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: 'con-email', html })) {
        return next(new Error(`fail to send this email`, { cause: 400 }))
    }
    doctor.EmailPasswordCode = EmailPasswordCode;

    await doctor.save()

    return res.status(200).json({ message: "Done" })
})

//check your email verifyCode forgetPassword
export const CodeForgetPasswordDoctor = asyncHandler(async (req, res, next) => {
    const {  EmailPasswordCode } = req.body

    const doctor = await doctorModel.findOne({ EmailPasswordCode })
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (doctor.EmailPasswordCode !== parseInt(EmailPasswordCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    doctor.EmailPasswordCode = null;
    doctor.verifyEmail = true
    await doctor.save()
    return res.status(200).json({ message: "Done" })
})


// forgetPassword set a new password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;
    
    
    const doctor = await doctorModel.findOne({ verifyEmail:true })
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (doctor.verifyEmail != true) {
        return next(new Error('In valid verify email'))
    }
    const hashPassword = hash({ plaintext: newPassword });
    doctor.password = hashPassword;
    doctor.verifyEmail = false
    await doctor.save();
    return res.status(200).json({ message: "Done reset", newPassword });
})

export const getDataPatients = asyncHandler(async (req, res, next) => {

     const patientDocID = await patientModel.find({doctorId:req.doctor._id})
    return res.status(200).json({ message: "Done", patientDocID })

})

export const getDataOnePatient = asyncHandler(async (req, res, next) => {

    
    const patientDocID = await patientModel.findById(req.params.patientId)
    if (!patientDocID) {
        return next(new Error("Not register account", { cause: 404 }))
    }
    if (!patientDocID.isLogin) {
        return next(new Error("No login", { cause: 404 }))
    
    }
   
   return res.status(200).json({ message: "Done", patientDocID })

})







//update password

export const updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body
  
    const doctor = await doctorModel.findById(req.doctor._id)
    if (!compare({ plaintext: oldPassword, hashValue: doctor.password })) {

        return next(new Error('In-valid old password', { cause: 400 }))

    }
    const hashPassword = hash({ plaintext: newPassword })

    doctor.password = hashPassword
    await doctor.save()
    return res.status(200).json({ message: "Done update password" })
})
  

