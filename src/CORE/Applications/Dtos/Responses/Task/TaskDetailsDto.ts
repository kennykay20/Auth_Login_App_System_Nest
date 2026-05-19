export class TaskDetailsDto {
  id: string | undefined;
  title!: string;
  description?: string | null;
  userId?: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
