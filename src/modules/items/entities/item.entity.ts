import { ObjectId } from "mongodb";

export interface ItemInterface extends CreateItemInterface {
  _id: string | ObjectId;
}

export interface ConvertInterface {
  name: string;
  multiply: number;
}

export interface CreateItemInterface {
  code: string;
  name: string;
  chartOfAccount: string;
  hasProductionNumber: boolean;
  hasExpiryDate: boolean;
  unit: string;
  converter: ConvertInterface[];
  createdBy_id: string | ObjectId;
  isArchived: boolean;
  // updatedBy_id: string | ObjectId;
}

export const restricted = [];

export class ItemEntity {
  public item: ItemInterface | CreateItemInterface;

  constructor(item: ItemInterface | CreateItemInterface) {
    this.item = item;
  }
}
