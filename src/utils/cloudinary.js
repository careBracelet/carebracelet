
import path from 'path'
import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url))
import * as dotenv from 'dotenv'
dotenv.config({path:path.join(__dirname,'../../config/.env')})
import cloudinary from 'cloudinary';


cloudinary.v2.config({
   // cloud_name:process.env.cloud_name,
    //api_key:process.env.api_key,
 //   api_secret:process.env.api_secret,
 
cloud_name:"driicz8ge",
api_key:"572199224579533",
api_secret:"XgHcDWa_KL4jxR-vNPkT77yjjN4",  
 secure: true
})


export default cloudinary.v2;
