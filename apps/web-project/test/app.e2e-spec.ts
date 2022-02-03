/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const gql = '/graphql';
  let token = '';

  describe('AppController (e2e)', () => {
    let app: INestApplication;
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = moduleFixture.createNestApplication();
      await app.init();
    });
    afterAll(async () => {
      await app.close();
    });
  });
  describe(gql, () => {
    describe('auth', () => {
      it('should login a user', () =>
        request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation{
              login(credentialsInput: {
    	    username: "zouaghi.test1919@gmail.com",
    	    password: "admin123"
  	    }
        ) 
        {
          access_token,
          refresh_token
        }}`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.login.access_token).toBeDefined();
            token = res.body.data.login.access_token;
          }));
      it('should reject the user login because password and username are not correct!', () =>
        request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation{
              login(credentialsInput: {
    	    username: "zouaghi.test1919@gmail.com",
    	    password: "admin123456789"
  	    }
        ) 
        {
          access_token,
          refresh_token
        }}`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
          }));
    });
    describe('users', () => {
      it('should return array of users', () =>
        request(app.getHttpServer())
          .post(gql)
          .set('authorization', `bearer ${token}`)
          .send({query: '{users {id email username firstname lastname}}'})
          .expect(200)
          .expect((res) => {
            expect(res.body.data.users.length).toBeGreaterThanOrEqual(100);
          }));
    });

    describe('user', () => {
      it('should return a user by id', () =>
        request(app.getHttpServer())
          .post(gql)
          .set('authorization', `bearer ${token}`)
          .send({query: '{user(id:5) {id email username firstname lastname}}'})
          .expect(200)
          .expect((res) => {
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.user.id).toEqual(5);
          }));
      it('should return an error for wrong/bad id', () =>
        request(app.getHttpServer())
          .post(gql)
          .set('authorization', `bearer ${token}`)
          .send({
            query: '{user(id:-1) {id email username firstname lastname}}',
          })
          .expect((res) => {
            expect(res.body.data).toBe(null);
            expect(res.body.errors[0].message).toBeDefined();
          }));
    });
    describe('Sign Up', () => {
      it('should return an error because the email is not unique', () =>
        request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
        mutation {
          firstStageSignUp(firstStageDTOInput:{
            username:"oussema1999",
            email:"mellywins.wow1919@gmail.com",
            password:"pass123"
        }) {id, username, email}
        `,
          })
          .expect(400));
    });
  });
});
