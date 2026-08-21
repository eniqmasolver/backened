import mongoose, { Types } from "mongoose";
import { user } from "./user.models";


import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";
const videoschema=new mongoose.Schema({


    videoFIle:{
      type:String,
      required:true
    },

    thumbnail:{
      type:String,
      required:true
    },
    title:{
      type:String,
      required:true
    },
    decription:{
      type:String,
      required:true
    },
    dutation:{
      type:Number,
      required:true
    },
    views:{
      type:Number,
      default:0
    },
    isPublished:{
      type:Boolean,
      default:true
    },
    owner:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"user"
    },


},{timestamps:true})

export const video=mongoose.model("video",videoschema)