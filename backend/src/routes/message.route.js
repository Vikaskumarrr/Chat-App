import express from "express"; 
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessage, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router(); 

router.get("/user", protectRoute, getUserForSidebar); 
router.get("/:id", protectRoute, getMessage);


router.post("/send/:id", protectRoute, sendMessage)


export default router ; 