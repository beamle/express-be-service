import { dummyBlogs, dummyPostInput1, dummyPosts, req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { db } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/authorization.middleware";

describe("test /posts path", () => {
  beforeAll(async () => {
    await req.delete(SETTINGS.PATH.TESTING)
  })
  const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
  afterEach(() => {
    db.posts = []
  })

  test("GET should return all posts", async() => {
    db.posts = dummyPosts

    await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200)
      .expect(dummyPosts)
  })

  test( "POST should create new post", async() => {
    db.blogs = dummyBlogs
    const createdPostInDb = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(dummyPostInput1)
      .expect(201)

    expect(db.posts).toHaveLength(1);
    expect(db.posts[0].title).toBe(createdPostInDb.body.title);
    expect(db.posts[0].shortDescription).toBe(createdPostInDb.body.shortDescription);
    expect(db.posts[0].content).toBe(createdPostInDb.body.content);
    expect(db.posts[0].blogId).toBe(db.blogs[0].id);
    expect(db.posts[0].blogName).toBe(db.blogs[0].name);
    expect(db.posts[0].id).toBeDefined()
    expect(db.blogs[0].id).toBe(createdPostInDb.body.blogId)
    expect(db.blogs[0].name).toBe(createdPostInDb.body.blogName)

  })

  test( "POST should throw error", async() => {
    const inputForCreatingPost = {
      name: "",
      description: "",
      websiteUrl: ""
    }
    const response = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForCreatingPost)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        { message: "Name should exist and should be less or equal to 15 symbols", field: "name" },
        { message: "Description should exist and should be less or equal to 15 symbols", field: "description" },
        { message: "Website URL should exist and should be less or equal to 100 symbols", field: "websiteUrl" },
      ]
    });

    expect(db.posts).toHaveLength(0);

  })

  test( "POST should throw only one blogId error", async() => {
    const { blogId, ...rest } = dummyPostInput1
    const newPostInput = { ...rest, blogId: '10'}
    const response = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(newPostInput)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        { message: "No blog with such id has been found!", field: "blogId" },
      ]
    });

    expect(db.posts).toHaveLength(0)

  })

  test("PUT should update existing post",  async() => {
    const { blogId, ...rest } = dummyPostInput1
    const newPostInput = { ...rest, blogId: '1'}
    const createdNewPost = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(newPostInput)

    const inputForUpdatingPost = {
      title: "UPDATE",
      shortDescription: "UPDATE",
      content: "UPDATED",
      blogId: '1',
      randomProperty: "allala"
    }

    const updatePost = await req
      .put(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForUpdatingPost)
      .expect(204)

    const updatedPost = await req.get(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)

    expect(updatedPost.body.title).toBe(inputForUpdatingPost.title);
    expect(updatedPost.body.shortDescription).toBe(inputForUpdatingPost.shortDescription);
    expect(updatedPost.body.content).toEqual(inputForUpdatingPost.content);
    expect(updatedPost.body.randomProperty).toBeUndefined();
    expect(updatedPost.body.blogId).toBe(inputForUpdatingPost.blogId);
    expect(db.blogs).toHaveLength(3)
    expect(db.blogs[0].id).toBe(updatedPost.body.blogId)

  })

  test("DELETE should remove post", async() => {
    db.blogs = dummyBlogs
    const { blogId, ...rest } = dummyPostInput1
    const newPostInput = { ...rest, blogId: '1'}

    console.log(newPostInput, "INPUT")

    const createdNewPost = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(newPostInput)
    console.log(createdNewPost.body, "CREATED FROM INPUT INPUT")

    const deletedPost = await req
      .delete(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(204)

    expect(db.posts).toHaveLength(0)
    expect(db.blogs).toHaveLength(3)
  })
})