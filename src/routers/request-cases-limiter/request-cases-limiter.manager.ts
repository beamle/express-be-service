import { ObjectId } from 'mongodb';
import { RequestCasesModel } from '../request-cases/request-cases.schema';

class RequestCasesLimiterManager {
  async create(metadataObj: { IP: string; baseURL: string; date: Date }): Promise<ObjectId> {
    const newRequestCase = new RequestCasesModel(metadataObj);
    const result = await newRequestCase.save();
    return new ObjectId(result._id.toString());
  }
}

export default new RequestCasesLimiterManager();
