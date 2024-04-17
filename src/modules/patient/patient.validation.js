import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signUpPatient = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    homeAddress: joi.string().min(2).max(50).required(),
    phone_one: joi.number().positive().required(),
    phone_two: joi.number().positive().required(),
     birthDate: joi.date().required(),
    gender:joi.string().min(2).max(50).required()
}).required()
export const loginPatient = joi.object({

    email: generalFields.email,
    password: generalFields.password,
}).required()


export const sendCodeForgetPasswordPatient = joi.object({

    email: generalFields.email,

}).required()

export const sendCodeEmailAgain = joi.object({

    email: generalFields.email,

}).required()

export const sendCodeEmail = joi.object({

    
    emailCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),

}).required()

export const CodeForgetPasswordPatient = joi.object({

     EmailPasswordCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
 }).required()

export const token = joi.object({

    token: joi.string().required(),
}).required()


export const ForgetPassword = joi.object({
    
    newPassword: generalFields.password,
    cNewPassword: generalFields.cPassword.valid(joi.ref("newPassword")),
 
}).required()