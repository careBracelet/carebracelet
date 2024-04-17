import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const complaint = joi.object({

    complaint: generalFields.complaint,
}).required()


export const reply = joi.object({

    description: generalFields.complaint,
}).required()



