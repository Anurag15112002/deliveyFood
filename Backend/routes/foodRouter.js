import express from "express";
import { addFood , listFood , removeFood} from "../controllers/foodControl.js";
import upload from "../middleware/foodaddmidl.js";
const Router = express.Router();

// Add food route with image upload middleware
Router.post("/add", upload.single("image"), addFood);
Router.get("/list",listFood);
Router.post("/remove",removeFood)
export default Router;
