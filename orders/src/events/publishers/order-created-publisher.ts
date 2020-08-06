import { Publisher, OrderCreatedEvent, Subjects } from "@fangman/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
