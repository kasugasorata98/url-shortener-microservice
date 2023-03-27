import mongoose, { Schema, Document } from 'mongoose'

export interface Report extends Document {
  urlMappings: {
    _id: string
    shortId: string
    targetUrl: string
  }
  reportDetails: [
    {
      visitedAt: Date
      region?: string
      country?: string
      city?: string
      longitude?: number
      latitude?: number
      timezone?: string
      ipAddress?: string
    }
  ]
}

const ReportSchema: Schema = new Schema<Report>(
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
    reportDetails: [
      {
        visitedAt: {
          type: Date,
          required: true,
        },
        region: String,
        country: String,
        city: String,
        longitude: Number,
        latitude: Number,
        timezone: String,
        ipAddress: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<Report>('Report', ReportSchema)
