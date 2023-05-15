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

afterEach(() => {
  CleanUp();
});

describe("create item", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    // send request to create item
    const response = await request(app).post("/v1/items").send({});
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
    const response = await request(app).post("/v1/items").send({}).set("Authorization", `Bearer ${accessToken}`);

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
    const response = await request(app).post("/v1/items").send({}).set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    // console.log(response.body);
    expect(response.body.message).toBe("Unprocessable Entity");

    expect(response.body.errors.name).toEqual(["name is required"]);
    expect(response.body.errors.chartOfAccount).toEqual(["chart of account is required"]);
    expect(response.body.errors.unit).toEqual(["unit is required"]);

    // expect(response.body.errors.name).toBe(["name is required"]);
    // expect(response.body.errors.chartOfAccount).toBe(["chart of account is required"]);
    // expect(response.body.errors.unit).toBe(["unit is required"]);

    // only send 1 required fields
    const response2 = await request(app)
      .post("/v1/items")
      .send({
        name: "item A",
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response2.statusCode).toEqual(422);
    expect(response2.body.message).toBe("Unprocessable Entity");

    expect(response.body.errors.chartOfAccount).toEqual(["chart of account is required"]);
    expect(response.body.errors.unit).toEqual(["unit is required"]);

    // expect(response2.body.errors.chartOfAccount).toBe(["chart of account is required"]);
    // expect(response2.body.errors.unit).toBe(["unit is required"]);
  });
  it("should check unique fields", async () => {
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
    // const data2 = {
    //   code: "A1",
    //   name: "item A",
    //   chartOfAccount: "Goods",
    //   hasProductionNumber: true,
    //   hasExpiryDate: false,
    //   unit: "pcs",
    //   converter: [
    //     {
    //       name: "dozen",
    //       multiply: 12,
    //     },
    //   ],
    // };
    await request(app).post("/v1/items").send(data).set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app).post("/v1/items").send(data).set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.message).toBe("Unprocessable Entity");
    // expect(response.body.errors.code).toBe(["code is exists"]);
    // expect(response.body.errors.name).toBe(["name is exists"]);
  });
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
      code: "A3",
      name: "item A3",
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
    // expected response status
    expect(response.statusCode).toEqual(201);
    // expected response body
    expect(response.body._id).not.toBeNull();
    // expected database data by user input
    console.log(response.body._id, "155");
    console.log(typeof response.body._id, "155");
    const itemService = new ReadItemService(db);
    const result = await itemService.handle(response.body._id);
    console.log(result.createdBy_id, "158");
    console.log(typeof result._id.toString(), "158");

    expect(result._id.toJSON()).toEqual(response.body._id);
    expect(result.code).toEqual(data.code);
    expect(result.name).toEqual(data.name);
    expect(result.chartOfAccount).toEqual(data.chartOfAccount);
    expect(result.hasProductionNumber).toEqual(data.hasProductionNumber);
    expect(result.hasExpiryDate).toEqual(data.hasExpiryDate);
    expect(result.unit).toEqual(data.unit);
    expect(result.converter).toEqual(data.converter);
    // expected database data generated by system
    expect(result.createdAt instanceof Date).toBeTruthy();
    expect((result.createdBy_id as ObjectId).toJSON()).toEqual(authResponse.body._id);
  });
});
