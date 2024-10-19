"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = void 0;
exports.createBlogValidation = createBlogValidation;
exports.updateBlogValidation = updateBlogValidation;
exports.validateDeleteBlog = validateDeleteBlog;
exports.urlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
function validateBlogInput(data, id) {
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
    if (!websiteUrl || websiteUrl.length > 100 || !exports.urlRegex.test(websiteUrl)) {
        errors.errorsMessages.push({
            message: "Invalid URL. Url should be maximum 100 symbols long and correspond to " +
                `${exports.urlRegex} pattern `, field: "websiteUrl"
        });
    }
    if (!websiteUrl || websiteUrl.length < 1) {
        errors.errorsMessages.push({ message: "Invalid URL. Url should be at least 1 symbol long", field: "description" });
    }
    if (id !== undefined && String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
function createBlogValidation(req) {
    return validateBlogInput(Object.assign({}, req.body));
}
function updateBlogValidation(req) {
    const { id } = req.params;
    return validateBlogInput(Object.assign({}, req.body), id);
}
function validateDeleteBlog(id) {
    const errors = { errorsMessages: [] };
    if (!id || String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
