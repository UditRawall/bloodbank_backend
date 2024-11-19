import mongoose from "mongoose";
import colors from 'colors';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongoDb database ${mongoose.connection.host}`.bgGreen.white)
    }
    catch (error) {
        console.log(`Mongoose databse error ${error}`.bgRed.white)
    }
}
// Export the Mongoose connection
export default connectDB;