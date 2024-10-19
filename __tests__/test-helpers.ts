import {app} from '../src/app/app'
import {agent} from 'supertest'

export const req = agent(app)