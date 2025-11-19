import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'auds' })
export class Aud {
  @Prop()
  title!: string;
}

export type AudDocument = HydratedDocument<Aud>;
export const AudSchema = SchemaFactory.createForClass(Aud);


