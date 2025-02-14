import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from 'stripe';

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "https://deliveyfood-user.onrender.com";
    try {
        // Create a new order in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clear the cart after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for Stripe
        let line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100*80 // Price of the item
            },
            quantity: item.quantity // Quantity of the item in the cart
        }));

        // Add delivery charge as a line item
        const deliveryCharge = 200*80; // Delivery fee is $2.00 (200 cents)

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charge"
                },
                unit_amount: deliveryCharge // Delivery fee (e.g., $2.00)
            },
            quantity: 1 // Delivery charge is typically one per order
        });

        // Calculate the total amount
        const totalAmount = line_items.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0);

        // Ensure that the total amount is at least $0.50 (50 cents) for Stripe to accept the session
        if (totalAmount < 50*80) {
            return res.json({
                success: false,
                message: "The total amount is too small. Please ensure the order value is at least $0.50 USD."
            });
        }

        // Create a Stripe session for the payment
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Send back the session URL to the frontend
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred during order processing" });
    }
};
const verifyOrder=async(req,res)=>{
    const {orderId,success}=req.body;
    try{
       if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
       }
       else{
        await orderModel.findByIdAndUpdate(orderId);
        res.json({success:false,message:"Not Paid"})
       }
    }catch(error){
         console.log(error);
         res.json({success:false,message:"error"})
    }
}
//users order for frontend

const userOrders=async(req,res)=>{
    try{
        const orders=await orderModel.find({userId:req.body.userId});
        res.json({success:true,orders})
    }catch(error){
       console.log(error);
       res.json({success:false,message:"error"});
    }
}

// lISTING OREDERS FROM ADMIN PANEL

const listOrders=async(req,res)=>{
    try{
     const orders=await orderModel.find({});
     res.json({success:true,data:orders});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"error"});
    }
}

//Api forupdating status

const updateStatus=async(req,res)=>{
   try{
      const order=await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
      console.log(order);
      res.json({success:true,message:"status updated"})
   }catch(error){
       console.log(error);
       res.json({success:false,message:"error"})
   }
}

export { placeOrder ,verifyOrder,userOrders,listOrders,updateStatus};
