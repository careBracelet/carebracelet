
import { asyncHandler } from "../../../utils/errorHandling.js";

import guardianModel from '../../../../DB/model/guardian.model.js'
import doctorModel from '../../../../DB/model/doctor.model.js'
import complaintModel from "../../../../DB/model/complaint.model.js";
import patientModel from '../../../../DB/model/patient.model.js'
import sendEmail from "../../../utils/email.js";
import adminModel from "../../../../DB/model/admin.model.js";
export const getComplaintModule = asyncHandler(async (req, res, next) => {
  const Complaints = await complaintModel.find()
  return res.status(201).json({ message: 'Done', Complaints })
});

export const sendComplaintDoctor = asyncHandler(async (req, res, next) => {
 // const { email, complaint } = req.body;
 const {  complaint } = req.body;
  const doctor = await doctorModel.findById(req.doctor._id)
  if (!doctor) {
    return next(new Error("Not  llp register account", { cause: 404 }))
  }
  if (!doctor.isLogin) {
    return next(new Error("please login", { cause: 404 }))
  }
  const createComplaint = await complaintModel.create({ complaint, role: doctor.role, email:doctor.email})
  return res.status(201).json({ message: 'Done', createComplaint })
});
export const sendComplaintPatient = asyncHandler(async (req, res, next) => {

  const {  complaint } = req.body;
  const patient = await patientModel.findById(req.patient._id)
  if (!patient) {
    return next(new Error("Not register account", { cause: 404 }))
  }
  if (!patient.isLogin) {
    return next(new Error("please login", { cause: 404 }))

  }
  const createComplaint = await complaintModel.create({ complaint, email:patient.email, role: patient.role })
  return res.status(201).json({ message: 'Done', createComplaint })
});

export const sendComplaintGuardian = asyncHandler(async (req, res, next) => {

  const {  complaint } = req.body;
  const guardian = await guardianModel.findById(req.guardian._id)
  if (!guardian) {
    return next(new Error("Not register account", { cause: 404 }))
  }
  if (!guardian.isLogin) {
    return next(new Error("please login", { cause: 404 }))

  }
  const createComplaint = await complaintModel.create({ complaint, email:guardian.email, role: guardian.role })
  return res.status(201).json({ message: 'Done', createComplaint })
});




export const sendReply =asyncHandler( async (req, res, next) => {
  const { description } = req.body
  const { complaintId } = req.params
  const complaint = await complaintModel.findById(complaintId)
  if (!complaint) {
      return next(new Error('In-valid complaint Id', { cause: 400 }))

  }
  const admin = await adminModel.findById(req.admin._id)
  if (!admin) {
    return next(new Error("Not  llp register account", { cause: 404 }))
  }
  
  complaint.replyComplaint = description
  await complaint.save()

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

<h3 style=" text-align:center;padding-top:25px; color:#630E2B">complaint:<span style="color:black">${complaintId}</span> </h3>
<h1 style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${complaint.complaint}</h1>
</td>
</tr>
<tr>
<td>
<h3 style="text-align: center; color:#630E2B">reply complaint</h3>
<h1  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${description}</h1>

</td>
</tr>
<tr>
<td>
<p style="padding:0px 100px;">
</p>
</td>
</tr>


</table>
</td>
</tr>
<tr>
<td>
</td>
</tr>
</table>
</body>
</html>`


if (!await sendEmail({ to:complaint.email, subject: 'reply complaint', html })) {

    return next(new Error("fail to send this email", { cause: 400 }))

}
 
  return res.status(200).json({ message: "Done reply",complaint })
})
