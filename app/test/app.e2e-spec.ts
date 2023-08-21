import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDto } from './../src/auth/dto';
import { EditUserDto } from "./../src/user/dto";
import { EditScooterDto } from '../src/scooter/dto/edit-scooter.dto';
import { EditRentDto } from '../src/rent/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(3333)

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/api')
  }, 50000);

  afterAll(async () => {
    app.close();
  });

  // ========================================
  // =============== Auth api ===============
  // ========================================
  describe('Auth', () => {
    let current_dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123456',
    }

    const wrong_dto: AuthDto = {
      email: 'test123@gmail.com',
      password: '123456789',
    }

    // =============== Sign up ===============
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec()
          .post('/auth/signup',).withBody({ password: current_dto.password }).expectStatus(400)
      }, 20000)

      it('should throw if password empty', () => {
        return pactum.spec()
          .post('/auth/signup',).withBody({ email: current_dto.email }).expectStatus(400)
      }, 20000)

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup',).expectStatus(400);
      }, 20000);

      it('should signup', () => {
        return pactum.spec().post('/auth/signup',).withBody(current_dto).expectStatus(201)
      }, 20000)
    })

    // =============== Sign in ===============
    describe('Signin', () => {
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin',)
          .expectStatus(400);
      }, 20000);

      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signin',)
          .withBody({ password: current_dto.password }).expectStatus(400);
      }, 20000);

      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signin',)
          .withBody({ email: current_dto.email }).expectStatus(400);
      }, 20000);

      it('should throw if provided wrong email address', () => {
        return pactum.spec().post('/auth/signin',)
          .withBody({ email: wrong_dto.email, password: current_dto.password }).expectStatus(403)
          .expectBodyContains('The provided email address is incorrect. Please check your credentials and try again.');
      }, 20000);

      it('should throw if provided wrong password', () => {
        return pactum.spec().post('/auth/signin',)
          .withBody({ email: current_dto.email, password: wrong_dto.password }).expectStatus(403)
          .expectBodyContains('The provided password is incorrect. Please check your credentials and try again.');
      }, 20000);

      it('Should sign in.', () => {
        return pactum.spec().post('/auth/signin',)
          .withBody(current_dto).expectStatus(200).stores('token', 'access_token');
      }, 20000);
    });

  });

  // ========================================
  // =============== User api ===============
  // ========================================
  describe('User', () => {

    // =============== Get ===============
    describe('Get User', () => {
      it('should throw if without Authorization(BearerToken)', () => {
        return pactum.spec().get('/user/get')
          .expectStatus(401);
      }, 20000);

      it('should get current user', () => {
        return pactum.spec().get('/user/get')
          .withBearerToken('$S{token}').expectStatus(200)
          .stores('userId', 'id'); //stores userId
      }, 20000);
    });

    // =============== Edit ===============
    describe('Edit User', () => {
      const edit_dto: EditUserDto = {
        email: 'edit_test@gmail.com',
        password: '123456789',
        firstName: 'test',
        lastName: 'account',
      }

      it('should throw if without data(EditUserDto)', () => {
        return pactum.spec().patch('/user/update')
          .withBearerToken('$S{token}').expectStatus(400);
      }, 20000);

      it('should update the user with a password change.', () => {
        return pactum.spec().patch('/user/update')
          .withBearerToken('$S{token}').withBody({ password: edit_dto.password })
          .expectStatus(200);
      }, 20000);

      it('should update the user with a firstName change.', () => {
        return pactum.spec().patch('/user/update')
          .withBearerToken('$S{token}').withBody({ firstName: edit_dto.firstName })
          .expectStatus(200);
      }, 20000);

      it('should update the user with a lastName change.', () => {
        return pactum.spec().patch('/user/update')
          .withBearerToken('$S{token}').withBody({ lastName: edit_dto.lastName })
          .expectStatus(200);
      }, 20000);

      it('should update the user with a email change.', () => {
        return pactum.spec().patch('/user/update')
          .withBearerToken('$S{token}').withBody({ email: edit_dto.email })
          .expectStatus(200);
      }, 20000);
    });
  });

  // ========================================
  // ============= Scooter api ==============
  // ========================================
  describe('Scooter', () => {

    // =============== Create ===============
    describe('Create three Scooter', () => {
      it('should create scooter No.1', () => {
        return pactum.spec().get('/scooter/create')
          .withBearerToken('$S{token}')
          .expectStatus(200).stores('scooterId', 'id'); //stores scooterId
      }, 20000);

      it('should create scooter No.2', () => {
        return pactum.spec().get('/scooter/create')
          .withBearerToken('$S{token}')
          .expectStatus(200).stores('scooterId2', 'id'); //stores scooterId2
      }, 20000);

      it('should create scooter No.3', () => {
        return pactum.spec().get('/scooter/create')
          .withBearerToken('$S{token}')
          .expectStatus(200).stores('scooterId3', 'id'); //stores scooterId3
      }, 20000);
    });

    // =============== Get ===============
    describe('Get Scooter', () => {
      it('should get all scooter and lenght will be 3', () => {
        return pactum.spec().get('/scooter/getall')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectJsonLength(3);
      }, 20000);

      it('should get No.1 scooter by ID.', () => {
        return pactum.spec().get('/scooter/get/{id}')
          .withPathParams('id', '$S{scooterId}')
          .withBearerToken('$S{token}')
          .expectStatus(200);
      }, 20000);
    });

    // =============== Edit ===============
    describe('Edit Scooter', () => {
      const edit_Dto: EditScooterDto = {
        isRenting: true,
      };

      it('should throw if without data(EditScooterDto)', () => {
        return pactum.spec().patch('/scooter/update/{id}')
          .withPathParams('id', '$S{scooterId}')
          .withBearerToken('$S{token}')
          .expectStatus(400);
      }, 20000);

      it('should update No.1 scooter', () => {
        return pactum.spec().patch('/scooter/update/{id}')
          .withPathParams('id', '$S{scooterId}')
          .withBearerToken('$S{token}')
          .withJson(edit_Dto)
          .expectStatus(200);
      }, 20000);
    });

    // =============== Delete ===============
    describe('Delete Scooter', () => {
      it('should delete the No.3 scooter', () => {
        return pactum.spec().delete('/scooter/delete/{id}')
          .withPathParams('id', '$S{scooterId3}')
          .withBearerToken('$S{token}')
          .expectStatus(204);
      }, 20000);

      it('should get all scooter and lenght will be 2', () => {
        return pactum.spec().get('/scooter/getall')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectJsonLength(2);
      }, 20000);
    });
  });


  // ========================================
  // ============= Rent api =================
  // ========================================
  describe('Rent', () => {

    // =============== Create ===============
    describe('Create Rent', () => {
      it('should throw if without scooterId', () => {
        return pactum.spec().get('/rent/create/{id}')
          // .withPathParams('id', '$S{scooterId}')
          .withBearerToken('$S{token}')
          .expectStatus(400);
      }, 20000);

      it('should create a rent record', () => {
        return pactum.spec().get('/rent/create/{id}')
          .withPathParams('id', '$S{scooterId}')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .stores('rentId', 'id'); //stores rentId
      }, 20000);

      it('should throw if rent another scooter when alreadly rented one', () => {
        return pactum.spec().get('/rent/create/{id}')
          .withPathParams('id', '$S{scooterId2}')
          .withBearerToken('$S{token}')
          .expectStatus(403);
      }, 20000);
    });

    // =============== Edit ===============
    describe('Edit Rent', () => {
      const editDto: EditRentDto = {
        statu: false,
      };    

      it('should throw if without rentId', () => {
        return pactum.spec().patch('/rent/update/{id}')
          .withBearerToken('$S{token}')
          .withBody(editDto)
          .expectStatus(400);
      }, 20000);

      it('should throw if without data(EditRentDto)', () => {
        return pactum.spec().patch('/rent/update/{id}')
          .withPathParams('id', '$S{rentId}')
          .withBearerToken('$S{token}')
          .expectStatus(400);
      }, 20000);

      it('should update rent', () => {
        return pactum.spec().patch('/rent/update/{id}')
          .withPathParams('id', '$S{rentId}')
          .withBearerToken('$S{token}')
          .withBody(editDto)
          .expectStatus(200);
      }, 20000);
    });

    // =============== Delete ===============
    describe('Delete Rent', () => {
      it('should throw if without rent ID', () => {
        return pactum.spec().delete('/rent/delete/{id}')
          .withPathParams('id', '$S{rentId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(401);
      }, 20000);

      // it('should delete a rent', () => {
      //   return pactum.spec().delete('/rent/delete/{id}')
      //     .withPathParams('id', '$S{rentId}')
      //     .withBearerToken('$S{userAt}')
      //     .expectStatus(204);
      // }, 20000);
    });

    describe('finally, delete the user', () => {
      it('should delete the user', () => {
        return pactum.spec().delete('/user/delete')
          .withBearerToken('$S{token}').expectStatus(204);
      }, 20000);
    });
  });
});
