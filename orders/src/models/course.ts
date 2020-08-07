import mongoose from "mongoose";
import { OrderStatus } from "@fangman/common";
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CourseAttrs {
  id: string;
  title: string;
  price: number;
}

export interface CourseDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface CourseModel extends mongoose.Model<CourseDoc> {
  build(attrs: CourseAttrs): CourseDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CourseDoc | null>;
}

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

courseSchema.set("versionKey", "version");
courseSchema.plugin(updateIfCurrentPlugin);

courseSchema.statics.build = (attrs: CourseAttrs) => {
  // make sure the course _id is the same as the one in the Course service
  return new Course({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

courseSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Course.findOne({ _id: event.id, version: event.version - 1 });
};

courseSchema.methods.isReserved = async function () {
  const order = await Order.findOne({
    course: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.Pending, OrderStatus.Complete],
    },
  });
  return !!order;
};

const Course = mongoose.model<CourseDoc, CourseModel>("Course", courseSchema);

export { Course };
