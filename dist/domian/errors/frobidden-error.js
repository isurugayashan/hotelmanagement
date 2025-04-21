"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FrobiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "FrobiddenError";
    }
}
exports.default = FrobiddenError;
//# sourceMappingURL=frobidden-error.js.map