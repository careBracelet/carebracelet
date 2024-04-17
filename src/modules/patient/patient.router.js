import { Router } from "express";

import * as patientController from "./controller/patient.js"
import * as validators from './patient.validation.js'
import {validation} from'../../middleware/validation.js'
import { authPatient } from "../../middleware/auth.js";

const router = Router()

//all patient
router.get("/",patientController.patients)
//get patient by Id
router.get("/:id",patientController.patientById)
//update patient
router.put('/update/:id', patientController.updatePatient);
//delete patient
router.delete('/:id', patientController.deletePatient);

//signup
router.post('/signupPatient',
validation(validators.signUpPatient),
patientController.signupPatient)
//login
router.post('/loginPatient',
validation(validators.loginPatient),
patientController.loginPatient)
//logout

router.post('/logoutPatient',authPatient,
patientController.logoutPatient)
//confirm email
router.put('/confirmEmailPatient',
validation(validators.sendCodeEmail),
patientController.confirmEmailPatient)


//profile
router.get("/home/profile",authPatient,patientController.profilePatient)


router.patch("/patientQR",authPatient,patientController.QRPatient)

//router.patch("/patientQRGuardian",authPatient,patientController.GuardianPatient)

//router.get("/pp/patientQR",patientController.DoctorPatient)







//router.get("/p/QR",authPatient,patientController.patientQr)


router.get('/NewConfirmEmail/:token',
validation(validators.token),
patientController.generateRefreshToken)

router.patch("/sendCodeEmail",
validation(validators.sendCodeEmailAgain),
patientController.sendCodeEmail)



router.post('/forgetPassword',

validation(validators.sendCodeForgetPasswordPatient),
patientController.sendCodePatient)


router.put("/checkEmailCodePassword",
validation(validators.CodeForgetPasswordPatient),
patientController.CodeForgetPasswordPatient)


router.patch("/newPassword",

validation(validators.ForgetPassword),
patientController.resetPassword)

// router.patch("/updateForget/PasswordPatient",
// validation(validators.updateForgetPassword),

// patientController.updatePassword)



router.post("/rate",authPatient,patientController.Rates)

//router.get("/rate",authPatient,patientController.Rates)


export default router