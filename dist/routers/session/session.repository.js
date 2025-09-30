"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRepository = void 0;
const db_1 = require("../../app/db");
exports.sessionRepository = {
    addRefreshTokenToBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.refreshTokenBlacklistCollection.insertOne({ refreshToken });
        });
    },
    checkIfRefreshTokenInBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield db_1.refreshTokenBlacklistCollection.findOne({
                refreshToken,
            });
            return !!found;
        });
    },
    create(sessionMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.userSessionsCollection.insertOne(sessionMeta);
        });
    },
    findByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    updateIat(deviceId, newIat) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    deleteByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    findAllSessionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.userSessionsCollection.find({}, { projection: { _id: 0 } });
        });
    },
};
