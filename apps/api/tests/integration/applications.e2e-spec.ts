import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HttpExceptionFilter } from "../../src/common/filters/http-exception.filter";
import { User } from "../../src/modules/auth/user.entity";
import { CompanyProfile } from "../../src/modules/company/company-profile.entity";
import { FreelancerProfile } from "../../src/modules/freelancer/freelancer-profile.entity";
import { Job } from "../../src/modules/jobs/job.entity";
import { Application } from "../../src/modules/applications/application.entity";
import type { Repository } from "typeorm";

const describeWithDb = process.env.DATABASE_URL ? describe : describe.skip;

describeWithDb("Applications", () => {
  let app: INestApplication;
  let users: Repository<User>;
  let companies: Repository<CompanyProfile>;
  let freelancers: Repository<FreelancerProfile>;
  let jobs: Repository<Job>;
  let applications: Repository<Application>;

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
    freelancers = moduleRef.get<Repository<FreelancerProfile>>(
      getRepositoryToken(FreelancerProfile)
    );
    jobs = moduleRef.get<Repository<Job>>(getRepositoryToken(Job));
    applications = moduleRef.get<Repository<Application>>(
      getRepositoryToken(Application)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await applications.clear();
    await jobs.clear();
    await freelancers.clear();
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
    const res = await request(server)
      .post("/company/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Seaworthy Co.",
        description: "Maritime ops.",
        contactEmail: "ops@seaworthy.co",
        location: "Oslo"
      })
      .expect(201);
    return res.body as CompanyProfile;
  };

  const createFreelancerProfile = async (
    token: string,
    server: import("http").Server
  ) => {
    const res = await request(server)
      .post("/freelancer/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        skills: ["Engineering"],
        certifications: ["STCW"],
        location: "Oslo",
        availability: "Q2 2026",
        linkedInUrl: "https://linkedin.com/in/example"
      })
      .expect(201);
    return res.body as FreelancerProfile;
  };

  const createJob = async (token: string, server: import("http").Server) => {
    const res = await request(server)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Chief engineer",
        description: "Manage vessel operations.",
        requirements: ["Operations"],
        location: "Bergen",
        duration: "6 months",
        timing: "Q3 2026"
      })
      .expect(201);
    return res.body as Job;
  };

  it("allows freelancers to apply and companies to list applications", async () => {
    const companySession = await registerAndLogin(
      "company-apps@example.com",
      "company"
    );
    await createCompanyProfile(companySession.token, companySession.server);
    const job = await createJob(companySession.token, companySession.server);

    const freelancerSession = await registerAndLogin(
      "freelancer-apps@example.com",
      "freelancer"
    );
    const freelancerProfile = await createFreelancerProfile(
      freelancerSession.token,
      freelancerSession.server
    );

    const applyRes = await request(freelancerSession.server)
      .post("/applications")
      .set("Authorization", `Bearer ${freelancerSession.token}`)
      .send({ jobId: job.id, note: "Ready to join." })
      .expect(201);

    const created = applyRes.body as Application;
    expect(created.jobId).toBe(job.id);
    expect(created.freelancerId).toBe(freelancerProfile.id);
    expect(created.status).toBe("applied");

    const listRes = await request(companySession.server)
      .get(`/jobs/${job.id}/applications`)
      .set("Authorization", `Bearer ${companySession.token}`)
      .expect(200);

    const listBody = listRes.body as Application[];
    expect(listBody).toHaveLength(1);
    expect(listBody[0]?.id).toBe(created.id);
  });

  it("prevents duplicate applications to the same job", async () => {
    const companySession = await registerAndLogin(
      "company-dupe@example.com",
      "company"
    );
    await createCompanyProfile(companySession.token, companySession.server);
    const job = await createJob(companySession.token, companySession.server);

    const freelancerSession = await registerAndLogin(
      "freelancer-dupe@example.com",
      "freelancer"
    );
    await createFreelancerProfile(
      freelancerSession.token,
      freelancerSession.server
    );

    await request(freelancerSession.server)
      .post("/applications")
      .set("Authorization", `Bearer ${freelancerSession.token}`)
      .send({ jobId: job.id, note: "First attempt." })
      .expect(201);

    await request(freelancerSession.server)
      .post("/applications")
      .set("Authorization", `Bearer ${freelancerSession.token}`)
      .send({ jobId: job.id, note: "Second attempt." })
      .expect(400);
  });
});
