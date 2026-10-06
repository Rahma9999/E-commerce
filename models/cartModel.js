const mongoose = require("mongoose");
const AppError = require('../utils/appError')

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    image: String,
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
    }
    },
);

cartItemSchema.virtual("subtotal").get(function () {
  return this.price * this.quantity;
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, 
    },
    items: {
        type: [ cartItemSchema ],
        validate: [(v) => v.length <= 100, "Cart cannot exceed 100 items"],
    },
},
{ 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
}
);

cartSchema.virtual("totalItems").get(function () {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
});

cartSchema.virtual("totalPrice").get(function () {
    const total = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return Math.max(total, 0);
});

// Add item or increase quantity if the same product already exists
cartSchema.methods.addItem = function (item) {
    const existing = this.items.find(
        (i) => i.product.equals(item.product)
    );
    if (existing) 
        existing.quantity += item.quantity || 1;
    else this.items.push(item);
    return this.save();
};

cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
    const item = this.items.id(itemId);
    if (!item) throw new AppError("Item not found in cart", 404);
    item.quantity = quantity;
    return this.save();
};

cartSchema.methods.removeItem = function (itemId) {
    this.items.pull(itemId);
    return this.save();
};

cartSchema.methods.clear = function () {
    this.items = [];
    return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);