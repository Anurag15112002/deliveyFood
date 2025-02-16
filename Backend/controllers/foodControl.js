import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// add food
const addFood = async (req, res) => {
  try {
    console.log(req.body);
    const file = req.files.image; // The uploaded image file

    // Upload the image to Cloudinary
    cloudinary.v2.uploader.upload(file.tempFilePath, async (err, result) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }

      // Extracting food data from the request body
      const { name, description, price, category } = req.body;
      
      // Check if an image was uploaded
      const image = result.secure_url; // Get the URL of the uploaded image
      if (!image) {
        return res.status(400).json({ message: "Image upload failed!" });
      }

      // Create a new food item in the database
      const newFood = new foodModel({
        name,
        description,
        price,
        category,
        image,
      });

      // Save the new food item to the database
      const savedFood = await newFood.save();

      // Return success response
      return res.status(201).json({
        success: true,
        message: "Food added successfully!",
        food: savedFood,
      });
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
      console.log("Attempting to remove food item");
  
      const foodId = req.body.id;
      console.log(`Food ID: ${foodId}`);
  
      const food = await foodModel.findById(foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found." });
      }
  
      // Delete image from Cloudinary if it exists
      if (food.image) {
        const publicId = food.image.split('/').pop().split('.')[0]; // Extract public ID from image URL
        cloudinary.v2.uploader.destroy(publicId, (err, result) => {
          if (err) {
            console.error("Error deleting image from Cloudinary:", err);
          } else {
            console.log("Image deleted from Cloudinary:", result);
          }
        });
      }
  
      // Delete the food item from the database
      await foodModel.findByIdAndDelete(foodId);
  
      res.json({ success: true, message: "Food item removed successfully!" });
    } catch (error) {
      console.error("Error removing food item:", error);
      res.status(500).json({ success: false, message: "An error occurred while removing the food item." });
    }
  };

export {addFood ,listFood, removeFood}

