import express from 'express';
import authmiddleware from '../middleware/auth.js';
import { addToCart,removeFromCart,getCart } from '../controllers/cartControl.js';
 const cartRouter=express.Router();

 cartRouter.post("/add",authmiddleware, addToCart);
 cartRouter.post("/remove",authmiddleware, removeFromCart);
 cartRouter.post("/get",authmiddleware, getCart);

 export default cartRouter; 