export abstract class CRUDController<T> {
  public abstract create(entry: T): Promise<unknown>

  public abstract read(id: string): Promise<T>

  public abstract readAll(): Promise<T[]>

  public abstract update(id: string, entry: T): Promise<unknown>

  public abstract delete(id: string): Promise<unknown>
}
