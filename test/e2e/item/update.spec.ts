import { ObjectId } from "mongodb";
import request from "supertest";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";
import { DestroyAllItemService } from "@src/modules/items/services/destroy-all.service.js";
import { ReadItemService } from "@src/modules/items/services/read.service.js";

async function CleanUp() {
  const session = db.startSession();
  const deleteAllItemService = new DestroyAllItemService(db);
  await deleteAllItemService.handle(session);
  await db.endSession();
}

describe("update item", () => {
  let _id = "";
  afterAll(() => {
    CleanUp();
  });
  beforeAll(async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      code: "A1",
      name: "item A",
      chartOfAccount: "Goods",
      hasProductionNumber: true,
      hasExpiryDate: false,
      unit: "pcs",
      converter: [
        {
          name: "dozen",
          multiply: 12,
        },
      ],
    };
    const response = await request(app).post("/v1/items").send(data).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({});
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toBe("Unauthorized Access");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.message).toBe("Forbidden Access");
  });
  it("should check required fields", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    // send request to create item
    const accessToken = authResponse.body.accessToken;

    // do not send all required fields
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toEqual("Unprocessable Entity");
    expect(response.body.errors.name).toEqual(["name is required"]);
    expect(response.body.errors.chartOfAccount).toEqual(["chart of account is required"]);
    expect(response.body.errors.unit).toEqual(["unit is required"]);

    // only send 1 required fields this test contradictive because in positive case we allow to give one items
    // const response2 = await request(app)
    //   .patch("/v1/items/" + _id)
    //   .send({
    //     name: "item A",
    //   })
    //   .set("Authorization", `Bearer ${accessToken}`);
    // expect(response2.statusCode).toEqual(422);
    // expect(response2.body.message).toBe("Unprocessable Entity");
    // expect(response2.body.errors.chartOfAccount).toBe(["chart of account is required"]);
    // expect(response2.body.errors.unit).toBe(["unit is required"]);
  });
  // it("should check unique fields", async () => {
  //   const app = await createApp();
  //   // get access token for authorization request
  //   const authResponse = await request(app).post("/v1/auth/signin").send({
  //     username: "admin",
  //     password: "admin2024",
  //   });
  //   const accessToken = authResponse.body.accessToken;
  //   // send request to create item
  //   const data = {
  //     code: "A1",
  //     name: "item A",
  //     chartOfAccount: "Goods",
  //     hasProductionNumber: true,
  //     hasExpiryDate: false,
  //     unit: "pcs",
  //     converter: [
  //       {
  //         name: "dozen",
  //         multiply: 12,
  //       },
  // ],
  //   };

  //   const response = await request(app)
  //     .patch("/v1/items/" + _id)
  //     .send(data)
  //     .set("Authorization", `Bearer ${accessToken}`);

  //   expect(response.statusCode).toEqual(422);
  //   expect(response.body.message).toBe("Unprocessable Entity");
  //   expect(response.body.errors.code).toBe(["code is exists"]);
  //   expect(response.body.errors.name).toBe(["name is exists"]);
  // });
  it("should save to database", async () => {
    const app = await createApp();
    // get access token for authorization request
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2024",
    });
    const accessToken = authResponse.body.accessToken;
    // send request to create item
    const data = {
      name: "item AAA",
    };
    const response = await request(app)
      .patch("/v1/items/" + _id)
      .send(data)
      .set("Authorization", `Bearer ${accessToken}`);
    // expected response status
    console.log(response.statusCode);
    console.log(_id);
    expect(response.statusCode).toEqual(204);
    // expected database data by user input
    const readItemService = new ReadItemService(db);
    const result = await readItemService.handle(_id);
    expect(result.name).toEqual("item AAA");
    // // expected database data generated by system
    expect(result.updatedAt instanceof Date).toBeTruthy();
    expect((result.updatedBy_id as ObjectId).toJSON()).toEqual(authResponse.body._id);
  });
});
