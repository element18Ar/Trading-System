// 1. FIX: Use ES Module 'import' instead of CommonJS 'require()'
import mongoose from 'mongoose';

// 2. Define the Schema
const ItemSchema = new mongoose.Schema({
    // General Product Information
    name: {
        type: String,
        required: [true, 'An item must have a name'],
        trim: true,
        maxlength: [100, 'Item name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'An item must have a description'],
        trim: true
    },
    // Trading/Pricing Information
    price: {
        type: Number,
        required: [true, 'An item must have a price'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        default: 1, // Default to 1 item if not specified
        min: [0, 'Quantity cannot be negative']
    },
    // Listing/Status Information
    isListed: {
        type: Boolean,
        default: true // Is the item currently available for trading?
    },
    // Reference to the Seller/User (Relational link to the auth-service data)
    seller: {
        // Assuming your seller IDs are stored as MongoDB ObjectIds
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model (likely in auth-service)
        required: true
    },
    // Timestamps are managed automatically by the options below
}, 
// Options for the Schema: adds 'createdAt' and 'updatedAt' fields automatically
{
    timestamps: true
});

// 3. Export the Model
// The model name 'Item' will be used by Mongoose to create the 'items' collection
const Item = mongoose.model('Item', ItemSchema);

// This line is already correct for ES Modules!
export default Item;