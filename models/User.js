const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    isReset: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
  
    return _.pick(userObject, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'avatar',
        'role',
        'verified',
        'date',
    ]);
};

UserSchema.methods.generateAuthToken = async function () {
    let users = this;
    const access = 'auth';
    const token = jwt.sign({_id: users._id.toHexString(), access}, 'bearer').toString();
  
    users.tokens = users.tokens.concat([{access, token}]);
    
    await users.save();
    
    return token;
};

UserSchema.statics.findByToken = function (token) {
    let Users = this;
    let decoded;
  
    try{
      decoded = jwt.verify(token, 'bearer');
    } catch(e) {
      return Promise.reject();
    }
  
    return Users.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
  
    return user.update({
      $pull: {
        tokens: {token}
      }
    });
};

module.exports = mongoose.model('user', UserSchema);
