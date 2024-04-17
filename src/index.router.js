import connectDB from '../DB/connection.js'
import patientRouter from './modules/patient/patient.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import doctorRouter from './modules/doctor/doctor.router.js'
import adminRouter from './modules/admin/admin.router.js'
//import guardianRouter from './modules/guardian/guardian.router.js'
import complaintRouter from './modules/complaint/complaint.router.js'

import caregiverRouter from './modules/caregivers/caregivers.router.js'
import cors from 'cors'

const initApp = (app, express) => {
    //convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing 
    app.use(cors())
    app.use(`/patient`, patientRouter)
  //  app.use(`/guardian`, guardianRouter)
    app.use(`/doctor`, doctorRouter)
    app.use(`/admin`, adminRouter)
    app.use(`/complaint`, complaintRouter)
    app.use(`/caregivers`, caregiverRouter)

    app.get('/', (req, res) => res.send('hello world'))
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)
    connectDB()

}

export default initApp