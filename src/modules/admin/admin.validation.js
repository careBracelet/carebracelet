import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const loginAdmin = joi.object({

    email: generalFields.email.required(),
    password: generalFields.password.required(),
}).required()
