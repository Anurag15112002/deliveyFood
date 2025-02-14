import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// add food
 const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null; 
    if (!image) {
      return res.status(400).json({ message: "Image is required!" });
    }
    const newFood = new foodModel({
      name,
      description,
      price,
      category,
      image, 
    });
    const savedFood = await newFood.save();
    return res.status(201).json({
      success: true,
      message: "Food added successfully!",
      food: savedFood,
    });
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get all food List

const listFood = async (req, res) => {
    try {
     
      const foods = await foodModel.find({});
      return res.json({
        success: true,
        data: foods,
      });
    } catch (error) {
      console.error("Error fetching food items:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching food items. Please try again later.",
      });
    }
  };

  //remove food
  const removeFood = async (req, res) => {
    try {
        console.log("jshfeufiuegfewig")
      const foodId = req.body.id;
      console.log(foodId);
      const food = await foodModel.findById(foodId);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found." });
      }
      const imagePath = path.join(__dirname, "uploads", food.image); // Make sure the 'uploads' folder is in the same directory
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
      await foodModel.findByIdAndDelete(foodId);
      res.json({ success: true, message: "Food item removed successfully!" });
    } catch (error) {
      console.error("Error removing food item:", error);
      res.status(500).json({ success: false, message: "An error occurred while removing the food item." });
    }
  };

export {addFood ,listFood, removeFood}

