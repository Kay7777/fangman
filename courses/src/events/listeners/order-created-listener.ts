import { Subjects, OrderCreatedEvent, Listener } from "@fangman/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Course } from "../../models/course";
import { CourseUpdatedPublisher } from "../publishers/course-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // when order has been created, we should lock down the ticket
    // we add one entry in the course database => orderId

    // find the course that the order is reserving
    const course = await Course.findById(data.course.id);
    // if no course, throw error
    if (!course) {
      throw new Error("Course not found");
    }
    // mark the course as being reserved by setting its orderId
    course.set({ orderId: data.id });
    // save the course
    await course.save();
    // emit and event saying this ticket has been changed
    // to update version in other services.
    await new CourseUpdatedPublisher(this.client).publish({
      id: course.id,
      title: course.title,
      price: course.price,
      userId: course.userId,
      orderId: course.orderId,
      version: course.version,
    });
    // ack the message
    msg.ack();
  }
}
