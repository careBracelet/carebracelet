import { Router } from "express";
import * as caregiversController from "./controller/caregivers.js"
import {authDoctor, authGuardian } from "../../middleware/auth.js";


const router = Router()

//add patient
router.patch("/:patientId",
authDoctor,caregiversController.addPatientDoctor)


//add patient
router.post("/:patientId",
authGuardian,caregiversController.addPatientGuardian)

export default router