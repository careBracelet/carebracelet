import mongoose, { Schema, Types, model} from "mongoose";

const guardianSchema = new Schema({
  firstName: { type: String, required: [true,'firstName is required']
  ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
  ,lower:true,trim:true},

  lastName: {type: String,required: [true,'lastName is required']
 ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
 ,lower:true,trim:true },
  
 email: { type: String, required: true, unique: true,lower:true,trim:true},
  confirmEmail: { type: Boolean, default: false },
  emailCode: { type: Number, default: null },
  verifyEmail:{type:Boolean,default:false},
  EmailPasswordCode:{type:Number,default:null},
  phone_one: {   type: String,required: true,},
  phone_two: {type: String,required: true,},
  
  password: { type: String, required: true, },
  gender: { type: String, enum: ['Male', 'Female'], required: true, default: 'Male' },
  homeAddress: { type: String, required: true },
  birthDate: { type: Date, required: true },
  status: { type: String,default: 'offline',enum: ['offline', 'online', 'block']},
  role:{type : String,default:'Guardian'},
  isLogin:{type:Boolean,default:false},
  patientId:{type:Types.ObjectId,ref:'Patient'},
  },{
    timestamps: true
});
  
  const guardianModel = mongoose.models.Guardian || model('Guardian', guardianSchema)
  export default guardianModel
