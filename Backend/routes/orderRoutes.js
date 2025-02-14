import express from 'express';
import authmiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controllers/orderControl.js';

const orderRouter=express.Router();

orderRouter.post("/place",authmiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authmiddleware,userOrders);
orderRouter.post("/admlist",listOrders);
orderRouter.post("/status",updateStatus);
export default orderRouter;