import { ItemRepository } from "../repositories/item.repository.js";
// import { ItemEntity } from "./../entities/item.entity.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.update(id, doc, { session });
  }
}
