import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to db successfully`);
  } catch (error) {
    console.log("connect to db is faild");
  }
};

export default connectToDb;
