// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, },
  title: { type: String, required: true, },
  note: { type: String, required: true, },
  id: { type: String, required: true },
}, { timestamps: true });


export default mongoose.models.User || mongoose.model('User', UserSchema);
