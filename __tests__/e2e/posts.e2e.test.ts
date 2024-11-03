import { dummyBlogID1, dummyBlogs, dummyPostInput1, dummyPosts, req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { blogsCollection, postsCollection, runDb } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/authorization.middleware";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ObjectId } from "mongodb";

let server: MongoMemoryServer;
describe("test /posts path", () => {
  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const url = server.getUri()
    await runDb(url)
    await blogsCollection.drop()
  })
  const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
  afterAll(async () => {
    await server.stop()
  })
  afterEach(async() => {
    await blogsCollection.drop()
    await postsCollection.drop()
  })

  test("GET should return all posts", async() => {
    await postsCollection.insertMany(dummyPosts)
    const dummyPostsWithoutId = dummyPosts.map(({_id, ...rest}) => rest)

    await req
      .get(SETTINGS.PATH.POSTS)
      .expect(200)
      .expect(dummyPostsWithoutId)
  })

  test( "POST should create new post", async() => {
    await blogsCollection.insertMany(dummyBlogs)

    const createdPostInBlog = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(dummyPostInput1)
      .expect(201)

    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()
    const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe(createdPostInBlog.body.title);
    expect(posts[0].shortDescription).toBe(createdPostInBlog.body.shortDescription);
    expect(posts[0].content).toBe(createdPostInBlog.body.content);
    expect(posts[0].blogId).toBe(blogs[0].id);
    expect(posts[0].blogName).toBe(blogs[0].name);
    expect(posts[0].id).toBeDefined()
    expect(blogs[0].id).toBe(createdPostInBlog.body.blogId)
    expect(blogs[0].name).toBe(createdPostInBlog.body.blogName)

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

    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(posts).toHaveLength(0);

  })

  test( "POST should throw only one blogId error", async() => {
    await blogsCollection.insertMany(dummyBlogs)
    const { blogId, ...rest } = dummyPostInput1
    const newPostInput = { ...rest, blogId: new ObjectId()}
    const response = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(newPostInput)
      .expect(400);

    expect(response.body).toEqual({ message: "No blog with such id has been found!", field: "blogId" });

    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(posts).toHaveLength(0)

  })

  test("PUT should update existing post",  async() => {
    await blogsCollection.insertMany(dummyBlogs)

    const createdNewPost = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(dummyPostInput1)

    const inputForUpdatingPost = {
      title: "UPDATE",
      shortDescription: "UPDATE",
      content: "UPDATED",
      blogId: dummyPostInput1.blogId.toString() ,
      randomProperty: "allala"
    }

    const updatePost = await req
      .put(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(inputForUpdatingPost)
      .expect(204)

    const updatedPost = await req.get(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)

    const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(updatedPost.body.title).toBe(inputForUpdatingPost.title);
    expect(updatedPost.body.shortDescription).toBe(inputForUpdatingPost.shortDescription);
    expect(updatedPost.body.content).toEqual(inputForUpdatingPost.content);
    // expect(updatedPost.body.randomProperty).toBeUndefined();
    expect(updatedPost.body.blogId).toBe(inputForUpdatingPost.blogId);
    expect(blogs).toHaveLength(3)
    expect(blogs[0].id).toBe(updatedPost.body.blogId)

  })

  test("DELETE should remove post", async() => {
    await blogsCollection.insertMany(dummyBlogs)

    const createdNewPost = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(dummyPostInput1)

    const deletedPost = await req
      .delete(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(204)

    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()
    const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(posts).toHaveLength(0)
    expect(blogs).toHaveLength(3)
  })

  test("DELETE should throw error if no id passed", async() => {
    await blogsCollection.insertMany(dummyBlogs)

    const createdNewPost = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .send(dummyPostInput1)

    const deletedPostResponse = await req
      .delete(SETTINGS.PATH.POSTS + `/${createdNewPost.body.id.slice(1)+'3'}`)
      .set({ "Authorization": "Basic " + codedAdminCredentials })
      .expect(404)

    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()
    const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray()

    expect(posts).toHaveLength(1)
    expect(blogs).toHaveLength(3)
    expect(deletedPostResponse.body).toEqual({ message: "Post with such id was not found!", field: "id" });
  })
})