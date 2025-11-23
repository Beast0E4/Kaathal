const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    image: {
        url: { type: String },
        filename: { type: String }
    },
    name: {
        type: String,
        required: [true, 'Name cannot be empty']
    },
    username: {
        type: String,
        required: [true, 'Name cannot be empty'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty'],
        unique : true
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function() {
    const hashedPassword = bcrypt.hashSync(this.password, 11);
    this.password = hashedPassword;
});


const User = mongoose.model('User', userSchema);
module.exports = User;