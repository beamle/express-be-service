import { log } from "console";
import requestCasesRepository from "./request-cases.repository";

export class RequestCasesMetadataController {
  async saveRequestMetadata(req: any, res: Response) {
    const { IP, baseURL, date } = req;
    console.log(IP, baseURL, date);

    try {
      const requestMeta = await requestCasesRepository.create();
      res.status(200).json();
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}
