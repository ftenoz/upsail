"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_entity_1 = require("./user.entity");
const getJwtSecret = () => process.env.JWT_SECRET ?? "dev-secret";
let AuthService = class AuthService {
    constructor(users) {
        this.users = users;
    }
    async register(dto) {
        const existingUser = await this.users.findOne({
            where: { email: dto.email }
        });
        if (existingUser) {
            throw new common_1.BadRequestException("Email already registered.");
        }
        const passwordHash = await bcrypt_1.default.hash(dto.password, 10);
        const user = this.users.create({
            email: dto.email,
            passwordHash,
            role: dto.role,
            name: null,
            companyName: null
        });
        const savedUser = await this.users.save(user);
        return {
            token: this.signToken(savedUser),
            role: savedUser.role
        };
    }
    async login(dto) {
        const user = await this.users.findOne({
            where: { email: dto.email }
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials.");
        }
        const passwordMatch = await bcrypt_1.default.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException("Invalid credentials.");
        }
        if (dto.role && dto.role !== user.role) {
            throw new common_1.UnauthorizedException("Role does not match this account.");
        }
        return {
            token: this.signToken(user),
            role: user.role
        };
    }
    signToken(user) {
        return jsonwebtoken_1.default.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        }, getJwtSecret(), { expiresIn: "1h" });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [Function])
], AuthService);
