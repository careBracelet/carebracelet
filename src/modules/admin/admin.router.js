
import { Router } from "express";

import * as adminController from "./controller/admin.js"
import { validation } from "../../middleware/validation.js";

import * as validators from './admin.validation.js'


const router = Router()
//get Admin
router.get("/",adminController.admin)


//login
router.post('/loginAdmin',
validation(validators.loginAdmin),
adminController.loginAdmin)

//update isApproved true 
router.put('/approve/adminTrue/:doctorId',
adminController.approveAdmin)


//get all doctor isApproved false

router.get('/isApprovedFalse',
adminController.GetAllDoctorsApprovedFalse)





// //signUp
// router.post('/signUpAdmin',
// //validation(validators.Admin),
// adminController.signUpAdmin)

export default router