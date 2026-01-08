import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { User } from "../../src/modules/auth/user.entity";
import { FreelancerProfile } from "../../src/modules/freelancer/freelancer-profile.entity";
import type { Repository } from "typeorm";

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDb("Freelancer profile", () => {
  let app: INestApplication;
  let users: Repository<User>;
  let profiles: Repository<FreelancerProfile>;

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
    profiles = moduleRef.get<Repository<FreelancerProfile>>(
      getRepositoryToken(FreelancerProfile)
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
        role: "freelancer"
      })
      .expect(201);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email,
        password: "password123",
        role: "freelancer"
      })
      .expect(200);

    const loginBody = loginRes.body as { token: string };
    const user = await users.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not created for test.");
    }

    return { token: loginBody.token, userId: user.id, server };
  };

  it("creates, updates, and reads a freelancer profile", async () => {
    const { token, userId, server } = await registerAndLogin(
      "freelancer@example.com"
    );

    const createRes = await request(server)
      .post("/freelancer/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        skills: ["Navigation", "Maintenance"],
        certifications: ["STCW"],
        location: "Rotterdam",
        availability: "Available in Q2",
        linkedInUrl: "https://www.linkedin.com/in/freelancer"
      })
      .expect(201);

    const createBody = createRes.body as {
      id: string;
      userId: string;
      skills: string[];
      certifications: string[];
      location: string | null;
      availability: string | null;
      linkedInUrl: string | null;
    };

    expect(createBody.userId).toBe(userId);
    expect(createBody.skills).toEqual(["Navigation", "Maintenance"]);

    const getRes = await request(server)
      .get("/freelancer/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const getBody = getRes.body as { profile: typeof createBody | null };
    expect(getBody.profile?.location).toBe("Rotterdam");

    await request(server)
      .put("/freelancer/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        skills: ["Navigation"],
        certifications: ["STCW", "GMDSS"],
        location: "Oslo",
        availability: "Available now",
        linkedInUrl: "https://www.linkedin.com/in/freelancer"
      })
      .expect(200);

    const publicRes = await request(server)
      .get(`/freelancer/${userId}`)
      .expect(200);

    const publicBody = publicRes.body as typeof createBody;
    expect(publicBody.location).toBe("Oslo");
    expect(publicBody.certifications).toEqual(["STCW", "GMDSS"]);
  });

  it("blocks non-freelancer users from writing profiles", async () => {
    const server = app.getHttpServer() as unknown as import("http").Server;

    await request(server)
      .post("/auth/register")
      .send({
        email: "company@example.com",
        password: "password123",
        role: "company"
      })
      .expect(201);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email: "company@example.com",
        password: "password123",
        role: "company"
      })
      .expect(200);
    const loginBody = loginRes.body as { token: string };

    await request(server)
      .post("/freelancer/profile")
      .set("Authorization", `Bearer ${loginBody.token}`)
      .send({
        skills: ["Inspection"],
        certifications: ["STCW"]
      })
      .expect(403);
  });
});
