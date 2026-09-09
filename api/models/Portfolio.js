import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    client: { type: String, default: '' },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
