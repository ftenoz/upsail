import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { User } from "../../src/modules/auth/user.entity";
import { CompanyProfile } from "../../src/modules/company/company-profile.entity";
import type { Repository } from "typeorm";

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDb("Company profile", () => {
  let app: INestApplication;
  let users: Repository<User>;
  let profiles: Repository<CompanyProfile>;

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

    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    profiles = moduleRef.get<Repository<CompanyProfile>>(
      getRepositoryToken(CompanyProfile)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await profiles.clear();
    await users.clear();
  });

  const registerAndLogin = async (email: string) => {
    const server = app.getHttpServer() as unknown as import("http").Server;

    await request(server)
      .post("/auth/register")
      .send({
        email,
        password: "password123",
        role: "company"
      })
      .expect(201);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email,
        password: "password123",
        role: "company"
      })
      .expect(200);

    const loginBody = loginRes.body as { token: string };
    const user = await users.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not created for test.");
    }

    return { token: loginBody.token, userId: user.id, server };
  };

  it("creates, updates, and reads a company profile", async () => {
    const { token, userId, server } = await registerAndLogin("company@example.com");

    const createRes = await request(server)
      .post("/company/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dockside Logistics",
        description: "We support port operations worldwide.",
        contactEmail: "ops@dockside.com",
        location: "Rotterdam"
      })
      .expect(201);

    expect(createRes.body.name).toBe("Dockside Logistics");
    expect(createRes.body.userId).toBe(userId);

    const getRes = await request(server)
      .get("/company/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(getRes.body.profile?.contactEmail).toBe("ops@dockside.com");

    await request(server)
      .put("/company/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dockside Logistics",
        description: "Global maritime logistics.",
        contactEmail: "ops@dockside.com",
        location: "Singapore"
      })
      .expect(200);

    const publicRes = await request(server)
      .get(`/company/${userId}`)
      .expect(200);

    expect(publicRes.body.location).toBe("Singapore");
  });

  it("blocks non-company users from writing profiles", async () => {
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
    const loginBody = loginRes.body as { token: string };

    await request(server)
      .post("/company/profile")
      .set("Authorization", `Bearer ${loginBody.token}`)
      .send({
        name: "Harborline",
        description: "Freelancer test",
        contactEmail: "hello@harborline.com",
        location: "Oslo"
      })
      .expect(403);
  });
});
