import { Publisher, Subjects, CourseCreatedEvent } from "@fangman/common";

export class CourseCreatedPublisher extends Publisher<CourseCreatedEvent> {
  subject: Subjects.CourseCreated = Subjects.CourseCreated;
}
