import { refreshTokenBlacklistCollection } from "../../app/db";

export const sessionRepository = {
  async findSession() {

    // const posts = await postsCollection
    //   .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
    //   .skip((pageNumber - 1) * pageSize)
    //   .limit(pageSize)
    //   .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
    //   .toArray()

    // return session
  },

  // async addRefreshTokenToBlackList (refreshToken: string) {
  //
  //   const newSession: PostType = {
  //     id: String(Math.floor(Math.random() * 223)),
  //     ...input,
  //     blogName: blog.name,
  //     blogId: input.blogId || String(blogIdAsParam),
  //     createdAt: new Date().toISOString()
  //   }
  //
  //   const posts = await sessionCollection.insertOne(refreshToken)
  // },

  async addRefreshTokenToBlackList(refreshToken: string) {

    const refreshTokenObj = {
      id: String(Math.floor(Math.random() * 223)),
      refreshToken
    }

    const posts = await refreshTokenBlacklistCollection.insertOne(refreshTokenObj)
  },

  async checkIfRefreshTokenInBlackList(refreshToken: string) {
    return await refreshTokenBlacklistCollection.findOne({ refreshToken })
  },


}
