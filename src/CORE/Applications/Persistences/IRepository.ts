export interface IRepository<T, TCreate = T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: TCreate): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}
