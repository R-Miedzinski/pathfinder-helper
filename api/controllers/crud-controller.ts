export abstract class CRUDController<T extends { id: string }> {
  public abstract create(entry: T): string

  public abstract read(id: string): T

  public abstract readAll(): T[]

  public abstract update(id: string, entry: T): T

  public abstract delete(id: string): string
}
