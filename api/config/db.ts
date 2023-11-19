import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb://mongo:27017`, {
        })
        if (conn) console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDB
