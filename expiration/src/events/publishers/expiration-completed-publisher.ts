import { Subjects, Publisher, ExpirationCompletedEvent } from "@fangman/common";

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
