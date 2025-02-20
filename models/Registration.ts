// models/Registration.ts

import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  registrationCode: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Registration || mongoose.model('Registration', registrationSchema);