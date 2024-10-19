import {app} from '../src/app/app'
import {agent} from 'supertest'

export const req = agent(app)

export const dummyBlogs = [
  {id: String(Math.random() * 0.2332), name: "dummy1", description: "desct1", websiteUrl: "https://someurl.com"},
  {id: String(Math.random() * 0.23333), name: "dummy2", description: "desct2", websiteUrl: "https://someurl.com"},
  {id: String(Math.random() * 0.23312), name: "dummy3", description: "desct3", websiteUrl: "https://someurl.com"}
]