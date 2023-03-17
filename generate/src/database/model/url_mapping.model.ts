import mongoose, { Schema, Document } from 'mongoose'

export interface URLMappings extends Document {
  shortId: string
  targetUrl: string
  titleTag: string
}

const URLMappingsSchema: Schema = new Schema<URLMappings>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    targetUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<URLMappings>('URLMappings', URLMappingsSchema)
