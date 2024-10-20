import { ADMIN_AUTH } from "../../src/authorization/authorization.middleware";
import { req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { db } from "../../src/app/db";

describe('Basic Authorization', () => {
  test("POST should create new object", async () => {
    db.blogs = []

    const inputForCreatingBlog = {
      name: "banan",
      description: "tasty",
      websiteUrl: "https://example.com"
    }

    const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)
      .expect(201)
  })
})