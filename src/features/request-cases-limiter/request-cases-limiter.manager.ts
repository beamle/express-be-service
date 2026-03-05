import { Types } from 'mongoose';
import { RequestCasesModel } from '../request-cases/request-cases.schema';

class RequestCasesLimiterManager {
  async create(metadataObj: { IP: string; baseURL: string; date: Date }): Promise<Types.ObjectId> {
    const newRequestCase = new RequestCasesModel(metadataObj);
    const result = await newRequestCase.save();
    return new Types.ObjectId(result._id.toString());
  }
}

export default new RequestCasesLimiterManager();
