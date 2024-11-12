"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersErrors = void 0;
exports.UsersErrors = {
    NO_USERS: { message: "Something went wrong, try again.", field: "", status: 404 },
    USER_NOT_CREATED: { message: "User was not created!", field: "", status: 404 },
    NO_USER_WITH_SUCH_ID: { message: "User with such id was not found!", field: "id", status: 404 },
    INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 }
};
