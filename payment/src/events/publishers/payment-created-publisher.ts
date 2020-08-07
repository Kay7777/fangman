import { Subjects, Publisher, PaymentCreatedEvent } from "@fangman/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
