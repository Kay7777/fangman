import { Publisher, OrderCancelledEvent, Subjects } from "@fangman/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
