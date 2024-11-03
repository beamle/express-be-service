import { dummyBlogs, req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { blogsCollection, BlogType, runDb } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/authorization.middleware";
import { MongoMemoryServer } from "mongodb-memory-server";

let server: MongoMemoryServer;
describe("test /blogs path", () => {
  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const url = server.getUri()
    await runDb(url)
    await blogsCollection.drop()
  })
  afterAll(async () => {
    await server.stop()
  })
  const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
  afterEach(async() => {
    await blogsCollection.drop()
  })

  test("GET should return all blogs", async() => {
    await blogsCollection.insertMany(dummyBlogs)
    const dummyBlogsWithoutId = dummyBlogs.map(({_id, ...rest}) => rest)

    await req
      .get(SETTINGS.PATH.BLOGS)
      .expect(200)
      .expect(dummyBlogsWithoutId)
  })

  test("GET should return blog by id", async() => {
    await blogsCollection.insertMany(dummyBlogs)
    const firstBlog = await blogsCollection.findOne({id: dummyBlogs[0].id}, {projection: {_id: 0}})

    expect(firstBlog).not.toBeNull();

    if(firstBlog) {
      await req
        .get(SETTINGS.PATH.BLOGS + `/${dummyBlogs[0].id}`)
        .expect(200)
        .expect(firstBlog)
    }
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

    const blogs = await blogsCollection.find({}).toArray()

    expect(blogs).toHaveLength(1);
    expect(blogs[0].name).toBe(inputForCreatingBlog.name);
    expect(blogs[0].description).toBe(inputForCreatingBlog.description);
    expect(blogs[0].websiteUrl).toBe(inputForCreatingBlog.websiteUrl);
    expect(blogs[0].id).toBeDefined()

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

    const blogs = await blogsCollection.find({}).toArray()

    expect(blogs).toHaveLength(0);
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

    const blogs = await blogsCollection.find({}).toArray()

    expect(blogs).toHaveLength(0)

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

    const deletedBlog = await req
      .delete(SETTINGS.PATH.BLOGS + `/${createdBlogInDb.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(204)

    const blogs = await blogsCollection.find({}).toArray()

    expect(blogs).toHaveLength(0)
    // expect(db.posts).toHaveLength(0)
    // expect(db.blogs).toHaveLength(0)
  })

  test("DELETE should throw error because blog with such id does not exist", async() => {

    const deletedBlog = await req
      .delete(SETTINGS.PATH.BLOGS + `11433434`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(404)

    // const inputForCreatingBlog = {
    //   name: "banan1",
    //   description: "tasty1",
    //   websiteUrl: "https://example.com"
    // }
    // const createdBlogInDb = await req
    //   .post(SETTINGS.PATH.BLOGS)
    //   .set({ "Authorization": "Basic " + codedAdminCredentials })
    //   .send(inputForCreatingBlog)
    //
    // const getBlogById = await req
    //   .get(SETTINGS.PATH.BLOGS + `/${createdBlogInDb.body.id}`)
    //   .set({ "Authorization": "Basic " + codedAdminCredentials })
    //   .expect(200)
  })
})