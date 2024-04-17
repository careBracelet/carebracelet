

import mongoose, { Schema, Types, model } from "mongoose";

const doctorSchema = new Schema({
  firstName: { type: String, required: [true,'firstName is required']
  ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
  ,lower:true,trim:true},
  lastName: {type: String,required: [true,'lastName is required']
 ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
 ,lower:true,trim:true },
  email: { type: String, required: true, unique: true ,lower:true,trim:true},
  confirmEmail: { type: Boolean, default: false },
  emailCode: { type: Number, default: null },
  verifyEmail:{type:Boolean,default:false},
  EmailPasswordCode:{type:Number,default:null},
  changePasswordTime: { type: Date },
  password: { type: String, required: true, },
  clinicAddress: { type: String, required: true },
  phone_one: {   type: String,required: true,},
  phone_two: {type: String,required: true,},
  unionCard: { type: Object, required: true },
  certificate: { type: Object, required: true },
  specialization: { type: String, required: true },
  isApproved:{type:Boolean,default:false},
  isLogin:{type:Boolean,default:false},
  status: { type: String,default: 'offline',enum: ['offline', 'online', 'block']},
  patientId:{type:Types.ObjectId,ref:'Patient'},
  role:{type : String,default:'Doctor'},
}, {
  timestamps: true
});

const doctorModel = mongoose.models.Doctor || model('Doctor', doctorSchema)

export default doctorModel