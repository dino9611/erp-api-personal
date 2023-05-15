import { ItemEntity } from "../entities/item.entity.js";
import { ItemRepository } from "../repositories/item.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class CreateItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(doc: DocumentInterface, session: unknown) {
    // try {
    const itemEntity = new ItemEntity({
      name: doc.name,
      code: doc.code,
      chartOfAccount: doc.chartOfAccount,
      hasProductionNumber: doc.hasProductionNumber,
      hasExpiryDate: doc.hasExpiryDate,
      unit: doc.unit,
      converter: doc.converter,
      createdBy_id: doc.createdBy_id,
      isArchived: false,
    });

    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.create(itemEntity.item, { session });
    // } catch (error) {
    //   console.log(error, "di service");
    //   return { _id: "000" };
    // }
  }
}
