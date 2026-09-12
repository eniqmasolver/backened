
import mongoose,{Schema}from "mongoose"

const subscriptionSchema=new Schema({

subscriber:{
    //one who is subscribing
    type:Schema.Types.ObjectId,
    ref:"user"
},
channel:{
    //one  to whom "subscriber "is subscribing
    type:Schema.Types.ObjectId,
    ref:"user"
}


},{timestamps:true})

export const Subscription= mongoose.model("Subscription",subscriptionSchema)