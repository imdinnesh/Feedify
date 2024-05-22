import mongoose from "mongoose";
const connection={};
async function dbConnect(){
    if(connection.isConnected){
        console.log('Database is already connected');
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI|| '',{})
        connection.isConnected=db.connections[0].readyState;
        console.log('Database connected');
    } catch (error) {
        console.log('Error connecting to database',error);
        process.exit(1);
        
    }
}

export default dbConnect;