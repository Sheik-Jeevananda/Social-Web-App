const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected");
  }catch(e){
    console.log("DB Error : " ,e.message);
    process.exit(1);
  }
}

module.exports = ConnectDB;