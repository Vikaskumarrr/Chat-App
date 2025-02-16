import {v2 as Cloudnary} from "cloudinary"; 

import {config} from "dotenv"; 

config(); 

Cloudnary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECERT_KEY
}); 

export default Cloudnary ; 