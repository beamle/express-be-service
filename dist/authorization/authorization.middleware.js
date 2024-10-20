"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_AUTH = void 0;
exports.authMiddleware = authMiddleware;
exports.ADMIN_AUTH = "admin:qwerty";
function authMiddleware(req, res, next) {
    const auth = req.headers["authorization"];
    if (!auth) {
        res.status(401).json({ message: "No authorization header" });
        return;
    }
    if (!auth.startsWith("Basic")) {
        res.status(401).json({ message: "Invalid authorization type" });
    }
    const encodedCredentials = Buffer.from(auth.slice(6), "base64").toString("utf8");
    if (exports.ADMIN_AUTH === encodedCredentials) {
        next();
    }
}
