"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const unauthorized_error_1 = __importDefault(require("../../domian/errors/unauthorized-error"));
const isAuthenticated = (req, res, next) => {
    if (!(req === null || req === void 0 ? void 0 : req.auth.userId)) {
        throw new unauthorized_error_1.default("Unauthorized");
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authentication-middleware.js.map