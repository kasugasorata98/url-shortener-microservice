import mongoose, { Schema, Document, Types } from 'mongoose'

export interface RedirectMappings extends Document {
  urlMappings: {
    _id: string
    shortId: string
    targetUrl: string
  }
}

const RedirectMappingsSchema: Schema = new Schema<RedirectMappings>(
  {
    urlMappings: {
      _id: {
        type: String,
        unique: true,
        required: true,
      },
      shortId: {
        type: String,
        unique: true,
        required: true,
      },
      targetUrl: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<RedirectMappings>(
  'RedirectMappings',
  RedirectMappingsSchema
)
