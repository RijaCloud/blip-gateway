import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const exampleItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 2,
    maxlength: 140
  },
  description: {
    type: String,
    default: null,
    maxlength: 2000
  },
  tags: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  versionKey: false
});

exampleItemSchema.index({ isActive: 1, createdAt: -1 });

export type ExampleItemDocument = InferSchemaType<typeof exampleItemSchema> & {
  _id: string;
};

export const ExampleItemModel: Model<ExampleItemDocument> =
  (models.ExampleItem as Model<ExampleItemDocument> | undefined) ||
  model<ExampleItemDocument>('ExampleItem', exampleItemSchema);
