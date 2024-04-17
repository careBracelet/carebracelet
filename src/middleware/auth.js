
import adminModel from "../../DB/model/admin.model.js";
import doctorModel from "../../DB/model/doctor.model.js";

import guardianModel from "../../DB/model/guardian.model.js";

import patientModel from "../../DB/model/patient.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../utils/errorHandling.js";
export const authDoctor = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];

    if (!token) {
      return res.json({ message: "In-valid token" })
    }
    const decoded = verifyToken({ token });

    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authDoctor = await doctorModel
      .findById(decoded.id).select("firstName email password ")

    if (!authDoctor) {
      return res.json({ message: "Not J register account" });
    }
    req.doctor = authDoctor;
    return next();
  } catch (error) {

    return res.json({ message: "catch error", error, stack: error.stack });
  }
};

export const authPatient = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];

    if (!token) {
      return res.json({ message: "In-valid token" })
    }
    const decoded = verifyToken({ token });

    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authPatient = await patientModel
      .findById(decoded.id)

    if (!authPatient) {
      return res.json({ message: "Not register account" });
    }
    req.patient = authPatient;
    return next();
  } catch (error) {

    return res.json({ message: "catch error", error, stack: error.stack });
  }
};

export const authGuardian = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];

    if (!token) {
      return res.json({ message: "In-valid token" })
    }
    const decoded = verifyToken({ token });

    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authGuardian = await guardianModel
      .findById(decoded.id)

    if (!authGuardian) {
      return res.json({ message: "Not ss register account" });
    }
    req.guardian = authGuardian;
    return next();
  } catch (error) {

    return res.json({ message: "catch error", error, stack: error.stack });
  }
};


// export const roles = { Admin: 'Admin' }
// export const authAdmin = (accessRoles = []) => {
//   return asyncHandler(async (req, res, next) => {

//     const { authorization } = req.headers;
//     if (!authorization?.startsWith(process.env.BEARER_KEY)) {
//       return next(new Error(`In-valid bearer key`, { caduse: 400 }))
//     }

//     const token = authorization.split(process.env.BEARER_KEY)[1]

//     if (!token) {
//       return next(new Error(`missing token`, { cause: 400 }))
//     }

//     const decoded = verifyToken({ token })
//     if (!decoded?.id) {
//       return next(new Error(`In-valid token payload`, { cause: 400 }))
//     }
//     const admin = await adminModel.findById(decoded.id).select('userName email role')

//     if (!admin) {
//       return next(new Error(`Not register account`, { cause: 401 }))
//     }
//     if (admin.status == 'blocked') {
//       return next(new Error(`blocked account`, { cause: 403 }))
//     }
//     if (!accessRoles.includes(admin.role)) {
//       return next(new Error(`Not authorized account`, { cause: 403 }))
//     }
//     req.admin = admin
//     return next()


//   })
// }



export const authAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];

    if (!token) {
      return res.json({ message: "In-valid token" })
    }
    const decoded = verifyToken({ token });

    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authAdmin = await adminModel
      .findById(decoded.id)

    if (!authAdmin) {
      return res.json({ message: "Not register account" });
    }
    req.admin = authAdmin;
    return next();
  } catch (error) {

    return res.json({ message: "catch error", error, stack: error.stack });
  }
};



