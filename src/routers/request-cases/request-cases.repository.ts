import { ObjectId } from "mongodb";
import { requestCasesMetadataCollection } from "../../app/db";

class RequestCasesMetadataRepository {
  async create(IP: string, URL: string, date: Date): Promise<ObjectId> {
    const metadataObj = { URL, IP, date };
    const result = await requestCasesMetadataCollection.insertOne(metadataObj);
    return result.insertedId;
  }
}

export default new RequestCasesMetadataRepository();
