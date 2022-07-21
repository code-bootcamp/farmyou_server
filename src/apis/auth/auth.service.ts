import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SellerService } from '../seller/seller.service';
import { AdminService } from '../admin/admin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, //
        private readonly userService: UserService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
    ) {}

    setRefreshToken({ user, res }) {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'myRefreshKey', expiresIn: '2w' },
        );

        // 개발환경
        // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
        // cors 오류
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,HEAD,OPTIONS,POST,PUT',
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        );
        res.setHeader(
            'Set-Cookie',
            `refreshToken=${refreshToken}; path=/; domain=.farmback.shop; SameSite=None; Secure; httpOnly;`,
        );
    }
    // 

    getAccessToken({ user }) {
        return this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'myAccessKey', expiresIn: '10h' },
        );
    }

    // //소셜 로그인
    // async loginSocial(req, res) {
    //   let user = await this.userService.findOne({ email: req.user.email });

    //   const hashedPassword = await bcrypt.hash(req.user.password, 10); // 비밀번호 숨겨서 보내기
    //   // 2. 회원가입
    //   if (!user) {
    //     user = await this.userService.create({
    //       email: req.user.email,
    //       hashedPassword,
    //       name: req.user.name,
    //       phone: req.user.phone,
    //       addressUser: null
    //     });
    //   }

    //   getAccessToken({ user }) {
    //       return this.jwtService.sign(
    //           { email: user.email, sub: user.id },
    //           { secret: 'myAccessKey', expiresIn: '1h' },
    //       );
    //   }

    //소셜 로그인
    async loginSocial(req, res) {
        let user = await this.userService.findOne({ email: req.user.email });

        const hashedPassword = await bcrypt.hash(req.user.password, 10.2); // 비밀번호 숨겨서 보내기

        // 2. 회원가입
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                hashedPassword,
                name: req.user.name,
                phone: req.user.phone,
                addressUser: {address: null, detailedAddress: null, postalCode: null, isMain: false},
                createFileInput: null
            });
        }

        //3. 로그인
        await this.setRefreshToken({ user, res });

        res.redirect('http://localhost:5500/frontTest/social-login.test.html');
    }

    async findLoggedInType({ currentUser }) {
        console.log(currentUser.id);

        try {
            const thisUser = await this.userRepository.findOne({
                where: {
                    id: currentUser.id,
                },
            });
            return thisUser.type;
        } catch (err) {
            try {
                const thisSeller = await this.sellerRepository.findOne({
                    where: {
                        id: currentUser.id,
                    },
                });
                return thisSeller.type;
            } catch (err) {
                try {
                    const thisAdmin = await this.adminRepository.findOne({
                        where: {
                            id: currentUser.id,
                        },
                    });
                    return thisAdmin.type;
                } catch (err) {
                    return '누구세요???';
                }
            }
        }
    }

    // async findLoggedIn({ currentUser }) {
    //     const thisUser = await this.adminRepository.findOne({
    //       where: {
    //         id: currentUser.id,
    //       },
    //     });

    //     return thisUser.type;
    //   }

    async findLoggedIn({ currentUser }) {
        try {
            const thisUser = await this.userRepository.findOne({
                relations:['sellers', 'directProducts', 'uglyProducts'],
                where: {
                    id: currentUser.id,
                },
            });
            if (!thisUser) {
                throw new NotFoundException('없어요');
            }
            return thisUser;
        } catch (err) {
            try {
                const thisSeller = await this.sellerRepository.findOne({
                    relations:['users'],
                    where: {
                        id: currentUser.id,
                    },
                });
                if (!thisSeller) {
                    throw new NotFoundException('없어요');
                }
                return thisSeller;
            } catch (err) {
                try {
                    const thisAdmin = await this.adminRepository.findOne({
                        relations:['directStore'],
                        where: {
                            id: currentUser.id,
                        },
                    });
                    if (!thisAdmin) {
                        throw new NotFoundException('없어요');
                    }
                    return thisAdmin;
                } catch (err) {
                    throw new NotFoundException('오류가 발생했습니다.');
                }
            }
        }
    }
}
