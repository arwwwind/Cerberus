import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Auth extends Document {
  _id: ObjectId; // Explicitly define the _id field as ObjectId

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
