import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { User } from "../../src/modules/auth/user.entity";
import { CompanyProfile } from "../../src/modules/company/company-profile.entity";
import { Job } from "../../src/modules/jobs/job.entity";
import type { Repository } from "typeorm";

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDb("Jobs", () => {
  let app: INestApplication;
  let users: Repository<User>;
  let companies: Repository<CompanyProfile>;
  let jobs: Repository<Job>;

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
    companies = moduleRef.get<Repository<CompanyProfile>>(
      getRepositoryToken(CompanyProfile)
    );
    jobs = moduleRef.get<Repository<Job>>(getRepositoryToken(Job));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await jobs.clear();
    await companies.clear();
    await users.clear();
  });

  const registerAndLogin = async (
    email: string,
    role: "company" | "freelancer"
  ) => {
    const server = app.getHttpServer() as unknown as import("http").Server;

    await request(server)
      .post("/auth/register")
      .send({
        email,
        password: "password123",
        role
      })
      .expect(201);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({
        email,
        password: "password123",
        role
      })
      .expect(200);

    const loginBody = loginRes.body as { token: string };
    return { token: loginBody.token, server };
  };

  const createCompanyProfile = async (token: string, server: import("http").Server) => {
    await request(server)
      .post("/company/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Seaworthy Co.",
        description: "Maritime ops.",
        contactEmail: "ops@seaworthy.co",
        location: "Oslo"
      })
      .expect(201);
  };

  it("creates, updates, closes, and hides jobs from the feed", async () => {
    const { token, server } = await registerAndLogin(
      "company-jobs@example.com",
      "company"
    );
    await createCompanyProfile(token, server);

    const createRes = await request(server)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Offshore maintenance planner",
        description: "Plan maintenance for offshore assets.",
        requirements: ["Planning", "Offshore ops"],
        location: "Oslo",
        duration: "3 months",
        timing: "Q2 2026"
      })
      .expect(201);

    const createdJob = createRes.body as Job;

    await request(server)
      .put(`/jobs/${createdJob.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Plan maintenance for offshore assets and crews."
      })
      .expect(200);

    const freelancerSession = await registerAndLogin(
      "freelancer-jobs@example.com",
      "freelancer"
    );

    const listRes = await request(freelancerSession.server)
      .get("/jobs")
      .set("Authorization", `Bearer ${freelancerSession.token}`)
      .expect(200);
    const listBody = listRes.body as Job[];
    expect(listBody.some((job) => job.id === createdJob.id)).toBe(true);

    await request(server)
      .delete(`/jobs/${createdJob.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const listAfterClose = await request(freelancerSession.server)
      .get("/jobs")
      .set("Authorization", `Bearer ${freelancerSession.token}`)
      .expect(200);
    const listAfterBody = listAfterClose.body as Job[];
    expect(listAfterBody.some((job) => job.id === createdJob.id)).toBe(false);
  });

  it("blocks non-company users from creating jobs", async () => {
    const { token, server } = await registerAndLogin(
      "freelancer-block@example.com",
      "freelancer"
    );

    await request(server)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Deck officer",
        description: "Deck support",
        requirements: ["STCW"],
        location: "Hamburg",
        duration: "2 months",
        timing: "Q3 2026"
      })
      .expect(403);
  });
});
