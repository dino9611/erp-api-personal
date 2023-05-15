import { IDatabaseAdapter } from "@src/database/connection";

export const name = "items";

export const restrictedFields = [];

const isExists = async (db: IDatabaseAdapter) => {
  const collections = (await db.listCollections()) as [];
  return collections.some(function (el: any) {
    return el.name === name;
  });
};

export async function createCollection(db: IDatabaseAdapter) {
  try {
    if (!(await isExists(db))) {
      await db.createCollection(name);
    }

    await db.updateSchema(name, {
      bsonType: "object",
      required: ["name", "chartOfAccount", "unit"],
      properties: {
        createdAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        code: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        chartOfAccount: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        hasProductionNumber: {
          bsonType: "bool",
          description: "must be a boolean and is required",
        },
        hasExpiryDate: {
          bsonType: "bool",
          description: "must be a boolean and is required",
        },
        unit: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        createdBy_id: {
          bsonType: "objectId",
          description: "must be a objectId and is required",
        },
        updatedBy_id: {
          bsonType: "objectId",
          description: "must be a objectId and is required",
        },
        isArchived: {
          bsonType: "bool",
          description: "must be a boolean and is required",
        },
        converter: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: {
                bsonType: "string",
              },
              multiply: {
                bsonType: "number",
              },
            },
          },
        },
      },
    });
    await db.createIndex(
      name,
      { name: -1, code: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
    await db.createIndex(
      name,
      { name: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
    await db.createIndex(
      name,
      { code: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    if (await isExists(db)) {
      await db.dropCollection(name);
    }
  } catch (error) {
    throw error;
  }
}
