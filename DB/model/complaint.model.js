
import { Schema, model, Types } from 'mongoose'

const complaintSchema = new Schema({

  email: { type: String, required: true, },
    complaint: { type: String, required: true },
    replyComplaint: { type: String },
    role: { type: String }

}, {
    timestamps: true
})

const complaintModel = model('Complaint', complaintSchema)
export default complaintModel