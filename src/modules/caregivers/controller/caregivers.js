import { asyncHandler } from "../../../utils/errorHandling.js";


import doctorModel from '../../../../DB/model/doctor.model.js'
import patientModel from '../../../../DB/model/patient.model.js'
import guardianModel from "../../../../DB/model/guardian.model.js";

//addPatient 


export const addPatientDoctor = asyncHandler(async (req, res, next) => {
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


//addPatient

export const addPatientGuardian = asyncHandler(async (req, res, next) => {
    const { patientId } = req.params;
    const patient = await patientModel.findById(patientId)
    if (!patient) {
     return next(new Error("Not jjj register account", { cause: 404 }))
    }
    if (!patient.isLogin) {
        return next(new Error("No login", { cause: 404 }))
    
    }
    const guardian = await guardianModel.findById(req.guardian._id)
   
    patient.guardianIds.push([req.guardian._id])
   
    await patient.save()
    return res.status(201).json({ message: 'Done', patient })
})
