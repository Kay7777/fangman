import { Publisher, Subjects, CourseUpdatedEvent } from "@fangman/common";

export class CourseUpdatedPublisher extends Publisher<CourseUpdatedEvent> {
  subject: Subjects.CourseUpdated = Subjects.CourseUpdated;
}
