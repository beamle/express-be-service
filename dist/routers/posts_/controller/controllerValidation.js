"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostValidation = createPostValidation;
exports.updatePostValidation = updatePostValidation;
exports.validateDeletePost = validateDeletePost;
function validatePostInput(data, id) {
    const errors = {
        errorsMessages: []
    };
    const { name, description, websiteUrl } = data;
    if (!name) {
        errors.errorsMessages.push({ message: "Name is mandatory", field: "name" });
    }
    if (!name || name.length > 15) {
        errors.errorsMessages.push({ message: "Name should less or equal to 15 symbols", field: "name" });
    }
    if (!name || name.trim().length < 1) {
        errors.errorsMessages.push({ message: "Name should be at least 1 symbol long", field: "name" });
    }
    if (!description) {
        errors.errorsMessages.push({ message: "Description is mandatory", field: "description" });
    }
    if (!description || description.length > 500) {
        errors.errorsMessages.push({ message: "Description should be maximum 500 symbols long", field: "description" });
    }
    if (!description || description.trim().length < 1) {
        errors.errorsMessages.push({ message: "Description should be at least 1 symbol long", field: "description" });
    }
    if (!websiteUrl) {
        errors.errorsMessages.push({ message: "WebsiteUrl is mandatory", field: "websiteUrl" });
    }
    if (!websiteUrl || websiteUrl.length < 1) {
        errors.errorsMessages.push({ message: "Invalid URL. Url should be at least 1 symbol long", field: "description" });
    }
    if (id !== undefined && String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
function createPostValidation(req) {
    return validatePostInput(Object.assign({}, req.body));
}
function updatePostValidation(req) {
    const { id } = req.params;
    return validatePostInput(Object.assign({}, req.body), id);
}
function validateDeletePost(id) {
    const errors = { errorsMessages: [] };
    if (!id || String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
