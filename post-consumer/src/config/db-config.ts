import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose.connect("mongodb://localhost:27017/eda").then(() => {
    console.log("connected to database"); 
  }).catch((error) => {
    console.error("error connecting to db", error);
  })
}
