export class Task {
  id: string | undefined;
  title!: string;
  description?: string | null;
  userId?: string;
  status: string = 'todo';
  createdAt!: Date;
  updatedAt!: Date;
}
