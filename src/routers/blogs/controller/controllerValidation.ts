import { OutputErrorsType } from "../blogs.types";
import { Request } from "express";

export const urlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

function validateBlogInput(data: { name: string, description: string, websiteUrl: string }, id?: string) {
  const errors: OutputErrorsType = {
    errorsMessages: []
  }

  const { name, description, websiteUrl } = data
  if (!name) {
    errors.errorsMessages.push({ message: "Name is mandatory", field: "name" })
  }
  if (!name || name.length > 15) {
    errors.errorsMessages.push({ message: "Name should less or equal to 15 symbols", field: "name" })
  }
  if (!name || name.trim().length < 1) {
    errors.errorsMessages.push({ message: "Name should be at least 1 symbol long", field: "name" })
  }
  if (!description) {
    errors.errorsMessages.push({ message: "Description is mandatory", field: "description" })
  }
  if (!description || description.length > 500) {
    errors.errorsMessages.push({ message: "Description should be maximum 500 symbols long", field: "description" })
  }
  if (!description || description.trim().length < 1) {
    errors.errorsMessages.push({ message: "Description should be at least 1 symbol long", field: "description" })
  }
  if (!websiteUrl) {
    errors.errorsMessages.push({ message: "WebsiteUrl is mandatory", field: "websiteUrl" })
  }
  if (!websiteUrl || websiteUrl.length > 100 || !urlRegex.test(websiteUrl)) {
    errors.errorsMessages.push({
      message: "Invalid URL. Url should be maximum 100 symbols long and correspond to " +
        `${urlRegex} pattern `, field: "websiteUrl"
    })
  }
  if (!websiteUrl || websiteUrl.length < 1) {
    errors.errorsMessages.push({ message: "Invalid URL. Url should be at least 1 symbol long", field: "description" })
  }

  if (id !== undefined && String(id).trim().length < 1) {
    errors.errorsMessages.push({ message: "No id provided", field: "id" })
  }
  return errors
}


export function createBlogValidation(req: Request) {
  return validateBlogInput({ ...req.body })
}

export function updateBlogValidation(req: Request) {
  const { id } = req.params
  return validateBlogInput({ ...req.body }, id)
}

export function validateDeleteBlog(id: string) {
  const errors: OutputErrorsType = { errorsMessages: [] };

  if (!id || String(id).trim().length < 1) {
    errors.errorsMessages.push({ message: "No id provided", field: "id" });
  }

  return errors;
}