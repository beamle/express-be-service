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
exports.refreshTokenBlacklistCollection = exports.sessionCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = void 0;
exports.runDb = runDb;
const mongodb_1 = require("mongodb");
const settings_1 = require("./settings");
const { CollectionMongoClient, ServerApiVersion } = require('mongodb');
function runDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(url, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        try {
            yield client.connect();
            // Send a ping to confirm a successful connection
            const db = client.db(settings_1.SETTINGS.DB_NAME);
            yield db.command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            exports.postsCollection = db.collection(settings_1.SETTINGS.PATH.POSTS);
            exports.blogsCollection = db.collection(settings_1.SETTINGS.PATH.BLOGS);
            exports.usersCollection = db.collection(settings_1.SETTINGS.PATH.USERS);
            exports.commentsCollection = db.collection(settings_1.SETTINGS.PATH.COMMENTS);
            // sessionCollection = db.collection<SessionDBType>(SETTINGS.PATH.SESSION)
            exports.refreshTokenBlacklistCollection = db.collection(settings_1.SETTINGS.PATH.REFRESH_TOKEN_BLACKLIST);
            console.log("Conntected to collections!");
        }
        catch (e) {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
}
