import { ItemRepository } from "../repositories/item.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class RestoreItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const itemRepository = new ItemRepository(this.db);
    const doc: DocumentInterface = {
      isArchived: false,
    };
    return await itemRepository.update(id, doc, { session });
  }
}
