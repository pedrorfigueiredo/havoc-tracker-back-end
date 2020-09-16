const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const People = require("../models/people");
let newSurvivor1;
let newSurvivor2;
const testSurvivor1 = {
  name: "test-survivor-1",
  age: 20,
  gender: "male",
  lastLocationLat: 20,
  lastLocationLng: 15,
  fijiWater: 10,
  campbellSoup: 10,
  firstAidPouch: 10,
  ak47: 10,
};

const testSurvivor2 = {
  name: "test-survivor-2",
  age: 30,
  gender: "female",
  lastLocationLat: 17,
  lastLocationLng: 12,
  fijiWater: 15,
  campbellSoup: 15,
  firstAidPouch: 15,
  ak47: 15,
};

describe("API routes", () => {
  beforeAll(async (done) => {
    done();
    const res1 = await request(app).post("/api/people").send(testSurvivor1);
    const res2 = await request(app).post("/api/people").send(testSurvivor2);
    newSurvivor1 = await res1.body;
    newSurvivor2 = await res2.body;
  });

  afterAll(async (done) => {
    await People.deleteMany({ name: "test-survivor-1" });
    await People.deleteMany({ name: "test-survivor-2" });
    mongoose.connection.close();
    done();
  });

  describe("GET /api/people", () => {
    it("should succeed", async () => {
      const res = await request(app).get("/api/people");
      expect(res.statusCode).toBe(200);
    });

    it("should return a list of survivors", async () => {
      const res = await request(app).get("/api/people");
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/people", () => {
    it("should succeed", async () => {
      const res = await request(app).post("/api/people").send(testSurvivor1);
      expect(res.statusCode).toBe(200);
    });

    it("should return a new survivor with an _id", async () => {
      const res = await request(app).post("/api/people").send(testSurvivor1);
      expect(res.body).toHaveProperty("_id");
    });
  });

  describe("GET /api/people/:id", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/people/${newSurvivor1._id}`)
        .send(testSurvivor1);
      expect(res.statusCode).toBe(200);
    });

    it("should return the desired survivor with his name", async () => {
      const res = await request(app).get(`/api/people/${newSurvivor1._id}`);
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("PATCH /api/people/:id", () => {
    const newLocation = { lastLocationLat: 44, lastLocationLng: 44 }

    it("should succeed", async () => {
      const res = await request(app)
        .patch(`/api/people/${newSurvivor1._id}`)
        .send(newLocation);
      expect(res.statusCode).toBe(200);
    });

    it("should update location coords", async () => {
      const res = await request(app)
        .patch(`/api/people/${newSurvivor1._id}`)
        .send(newLocation);
      expect(res.body.lastLocation.lat).toBe(newLocation.lastLocationLat);
      expect(res.body.lastLocation.lng).toBe(newLocation.lastLocationLng);
    });
  });

  describe("POST /api/people/:id/report-infection", () => {
    it("should succeed", async () => {
      const res1 = await request(app).post("/api/people").send(testSurvivor1);
      const newSurvivor1 = res1.body;
      const res2 = await request(app).post("/api/people").send(testSurvivor1);
      const newSurvivor2 = res2.body;

      const res = await request(app)
        .post(`/api/people/${newSurvivor1._id}/report-infection`)
        .send({infected: newSurvivor2.name});
      expect(res.statusCode).toBe(200);
    });
  });

  describe("POST /api/people/:id/properties/trade-item", () => {
    it("should succeed", async () => {
      const res1 = await request(app).post("/api/people").send(testSurvivor1);
      const newSurvivor1 = res1.body;
      const res2 = await request(app).post("/api/people").send(testSurvivor1);
      const newSurvivor2 = res2.body;

      const data = {
        id: newSurvivor1._id,
        user1FijiWater: 3,
        user2FijiWater: 3,
        user1CampbellSoup: 0,
        user2CampbellSoup: 0,
        user1FirstAidPouch: 0,
        user2FirstAidPouch: 0,
        user1Ak47: 0,
        user2Ak47: 0
      }

      const res = await request(app)
        .post(`/api/people/${newSurvivor2._id}/properties/trade-item`)
        .send(data);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /api/people/:id/properties", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/people/${newSurvivor1._id}/properties`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have ak47 property", async () => {
      const res = await request(app)
        .get(`/api/people/${newSurvivor1._id}/properties`)
        expect(res.body).toHaveProperty("ak47");
    });
  });

  describe("GET /api/report/infected", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/report/infected`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have infectedPercentage property", async () => {
      const res = await request(app)
        .get(`/api/report/infected`)
        expect(res.body).toHaveProperty("infectedPercentage");
    });

  });

  describe("GET /api/report/non-infected", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/report/non-infected`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have nonInfectedPercentage property", async () => {
      const res = await request(app)
        .get(`/api/report/non-infected`)
        expect(res.body).toHaveProperty("nonInfectedPercentage");
    });
  });

  describe("GET /api/report/people-inventory", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/report/people-inventory`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have averageItems property", async () => {
      const res = await request(app)
        .get(`/api/report/people-inventory`)
        expect(res.body).toHaveProperty("averageItems");
    });
  });

  describe("GET /api/report/infected-points", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/report/infected-points`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have infectedPoints property", async () => {
      const res = await request(app)
        .get(`/api/report/infected-points`)
        expect(res.body).toHaveProperty("infectedPoints");
    });
  });

  describe("GET /api/report", () => {
    it("should succeed", async () => {
      const res = await request(app)
        .get(`/api/report`)
      expect(res.statusCode).toBe(200);
    });

    it("response body should have availableReports property", async () => {
      const res = await request(app)
        .get(`/api/report`)
        expect(res.body).toHaveProperty("availableReports");
    });
  });
})
