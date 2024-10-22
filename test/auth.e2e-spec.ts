import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signs up a new user', async () => {
    const userEmail = 'test_email@test.com';
    const userPassword = 'testpassword';

    request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email: userEmail,
        password: userPassword,
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(id).toBeDefined();
        expect(email).toEqual(userEmail);
      });
  });

  it('signs up a new user and requests whoami route', async () => {
    const userEmail = 'test_email@test.com';
    const userPassword = 'testpassword';

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: userEmail, password: userPassword })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(userEmail);
  });
});
