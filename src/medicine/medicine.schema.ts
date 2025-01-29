import { Schema } from 'mongoose';

export const MedicineSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
});
