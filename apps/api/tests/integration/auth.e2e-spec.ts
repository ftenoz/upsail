import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";

describe("Auth flow", () => {
  let app: INestApplication;
  type AuthResponse = { token: string; role: "company" | "freelancer" };

  beforeAll(async () => {
    process.env.JWT_SECRET = "test-secret";
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers and logs in a company user", async () => {
    const server = app.getHttpServer() as unknown as import("http").Server;

    const registerRes = await request(server)
      .post("/auth/register")
      .send({
        email: "company@example.com",
        password: "password123",
        role: "company"
      })
      .expect(201);

    const registerBody = registerRes.body as AuthResponse;
    expect(registerBody.token).toBeDefined();
    expect(registerBody.role).toBe("company");

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email: "company@example.com",
        password: "password123",
        role: "company"
      })
      .expect(200);

    const loginBody = loginRes.body as AuthResponse;
    expect(loginBody.token).toBeDefined();
    expect(loginBody.role).toBe("company");
  });

  it("enforces role-based access", async () => {
    const server = app.getHttpServer() as unknown as import("http").Server;

    await request(server)
      .post("/auth/register")
      .send({
        email: "freelancer@example.com",
        password: "password123",
        role: "freelancer"
      })
      .expect(201);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email: "freelancer@example.com",
        password: "password123",
        role: "freelancer"
      })
      .expect(200);
    const loginBody = loginRes.body as AuthResponse;

    await request(server)
      .get("/auth/role-check")
      .set("Authorization", `Bearer ${loginBody.token}`)
      .expect(403);

    await request(server)
      .post("/auth/register")
      .send({
        email: "company-role@example.com",
        password: "password123",
        role: "company"
      })
      .expect(201);

    const companyLogin = await request(server)
      .post("/auth/login")
      .send({
        email: "company-role@example.com",
        password: "password123",
        role: "company"
      })
      .expect(200);
    const companyBody = companyLogin.body as AuthResponse;

    await request(server)
      .get("/auth/role-check")
      .set("Authorization", `Bearer ${companyBody.token}`)
      .expect(200, { ok: true });
  });
});
