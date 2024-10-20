import { dummyBlogs, req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { db } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/authorization.middleware";

describe("test /blogs path", () => {
  const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
  afterEach(() => {
    db.blogs = []
  })

  test("GET should return all blogs", async() => {
    db.blogs = dummyBlogs

    await req
      .get(SETTINGS.PATH.BLOGS)
      .expect(200)
      .expect(dummyBlogs)
  })

  test( "POST should create new blog", async() => {
    const inputForCreatingBlog = {
      name: "banan",
      description: "tasty",
      websiteUrl: "https://example.com"
    }
    const createdBlogInDb = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)
      .expect(201)

    expect(db.blogs).toHaveLength(1);
    expect(db.blogs[0].name).toBe(inputForCreatingBlog.name);
    expect(db.blogs[0].description).toBe(inputForCreatingBlog.description);
    expect(db.blogs[0].websiteUrl).toBe(inputForCreatingBlog.websiteUrl);
    expect(db.blogs[0].id).toBeDefined()

  })

  test( "POST should throw error", async() => {
    const inputForCreatingBlog = {
      name: "",
      description: "",
      websiteUrl: ""
    }
    const response = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        { message: "Name should exist and should be less or equal to 15 symbols", field: "name" },
        { message: "Description should exist and should be less or equal to 15 symbols", field: "description" },
        { message: "Website URL should exist and should be less or equal to 100 symbols", field: "websiteUrl" },
      ]
    });

    expect(db.blogs).toHaveLength(0);

  })

  test( "POST should throw only one websiteUrl error", async() => {
    const inputForCreatingBlog = {
      name: "saassa",
      description: "asassa",
      websiteUrl: "      "
    }
    const response = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        { message: "Website URL should exist and should be less or equal to 100 symbols", field: "websiteUrl" },
      ]
    });
    expect(response.body).not.toEqual({
      errorsMessages: [
        { message: "Website URL should exist and should be less or equal to 100 symbols", field: "websiteUrl" },
        { message: "Invalid URL format", field: "websiteUrl" },
      ]
    })

    expect(db.blogs).toHaveLength(0)

  })

  test("PUT should update existing blog",  async() => {
    const inputForCreatingBlog = {
      name: "banan",
      description: "tasty",
      websiteUrl: "https://example.com"
    }
    const createdBlogInDb = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)
      .expect(201)

    const inputForUpdatingBlog = {
      name: "UPDATED ban",
      description: "UPDATED tasty",
      websiteUrl: "https://example.com",
      randomProperty: "should not be added to db"
    }
    const updateBlog = await req
      .put(SETTINGS.PATH.BLOGS + `/${createdBlogInDb.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForUpdatingBlog)
      .expect(204)

    const updatedBlog = await req.get(SETTINGS.PATH.BLOGS + `/${createdBlogInDb.body.id}`)

    expect(updatedBlog.body.name).toBe(inputForUpdatingBlog.name);
    expect(updatedBlog.body.description).toBe(inputForUpdatingBlog.description);
    expect(updatedBlog.body.websiteUrl).toEqual(inputForUpdatingBlog.websiteUrl);
    expect(updatedBlog.body.randomProperty).toBeUndefined();
    expect(updatedBlog.body.id).toBe(createdBlogInDb.body.id);
  })

  test("DELETE should remove both blog and its posts", async() => {
    const inputForCreatingBlog = {
      name: "banan1",
      description: "tasty1",
      websiteUrl: "https://example.com"
    }

    const createdBlogInDb = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingBlog)

    const inputForCreatingPost = {
      title: "TITLE",
      shortDescription: "Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum",
      content: "xxx",
      blogId: createdBlogInDb.body.id,
      blogName: "xxx",
    }

    const createdPostInDb = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingPost)

    console.log(createdBlogInDb.body)
    console.log(db)

    const deletedBlog = await req
      .delete(SETTINGS.PATH.BLOGS + `/${createdBlogInDb.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(204)

    console.log(db, "DB AFTER")

    expect(db.blogs).toHaveLength(0)
    // expect(db.posts).toHaveLength(0)
    // expect(db.blogs).toHaveLength(0)
  })
})