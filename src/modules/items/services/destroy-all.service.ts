import { ItemRepository } from "../repositories/item.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class DestroyAllItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(session?: unknown) {
    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.deleteAll({ session });
  }
}
