
import adminModel from '../../../../DB/model/admin.model.js'
  import doctorModel from '../../../../DB/model/doctor.model.js'
import { generateToken } from '../../../utils/GenerateAndVerifyToken.js'
import { compare, hash } from '../../../utils/HashAndCompare.js'
import { asyncHandler } from '../../../utils/errorHandling.js'


export const admin = async (req, res, next) => {
    const admin = await adminModel.find()
    return res.status(200).json({ message: "Done", admin })
}




export const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    
    
    //check email exist
    const admin = await adminModel.findOne({ email })
    if (!admin) {
        return next(new Error(`email not exist`, { cause: 404 }))
    }
   
 
    const match = compare({ plaintext: password, hashValue: admin.password })
    if (!match) {
        return next(new Error(`IN-valid login data`, { cause: 400 }))
    }
    
    const access_Token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 30 * 24
    })
    const refresh_token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 60 * 24 * 365
    })
    const adminID_token = { id: admin._id }
    await admin.save()
    return res.status(200).json({
        message: "Done admin login",
        access_Token,
        refresh_token,
        adminID_token
    })
})


//approveAdmin
export const approveAdmin = async (req, res, next) => {
    const { doctorId } = req.params
    const doctor = await doctorModel.findById(doctorId)
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 400 }))

    }
    doctor.isApproved = true
    await doctor.save()
    return res.status(200).json({ message: "Done Approved" })
}

//get all doctor request
export const GetAllDoctorsApprovedFalse = async (req, res, next) => {

    const doctors = await doctorModel.find({ isApproved: false })

    return res.status(200).json({ message: "Done not Approved", doctors })
}












// export const signUpAdmin = asyncHandler(async (req, res, next) => {
//     const { email,userName, password } = req.body
//     const checkAdmin = await adminModel.findOne({ email: email.toLowerCase() })
//     if (checkAdmin) {
//         return next(new Error(`Email exist`, { cause: 404 }))
//     }
//     const hashPassword = hash({ plaintext: password })
//     const { _id } = await adminModel.create({
//         userName  , email, password: hashPassword,
//     })
//     return res.status(200).json({ message: "Done admin signUp",_id})
// })