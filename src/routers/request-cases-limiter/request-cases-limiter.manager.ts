import { ObjectId } from 'mongodb';
import { requestCasesMetadataCollection } from '../../app/db';

class RequestCasesLimiterManager {
  async create(metadataObj: { IP: string; baseURL: string; date: Date }): Promise<ObjectId> {
    const result = await requestCasesMetadataCollection.insertOne(metadataObj);
    return result.insertedId;
  }
}

export default new RequestCasesLimiterManager();
