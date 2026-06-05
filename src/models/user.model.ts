import { Schema, model, models, Model, InferSchemaType } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Veuillez fournir une adresse email valide.'
      ]
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Hook avant sauvegarde : hachage automatique du mot de passe
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error: any) {
    next(error);
  }
});

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
};

export const UserModel: Model<UserDocument> =
  (models.User as Model<UserDocument> | undefined) ||
  model<UserDocument>('User', userSchema);
