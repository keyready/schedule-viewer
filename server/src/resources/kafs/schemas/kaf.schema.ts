import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'kafs' })
export class Kaf {
  @Prop()
  title!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Aud' }] })
  audsIds!: Types.ObjectId[];
}

export type KafDocument = HydratedDocument<Kaf>;
export const KafSchema = SchemaFactory.createForClass(Kaf);


