export class RequestCasesMetadataController {
  async saveRequestMetadata(req: any, res: Response) {
    const { id: searchableCommentId } = req.params
    try {
      const requestMeta = await requestCaseMetadata.saveRequestMetadata(new ObjectId(searchableCommentId))
      res.status(200).json(comment)
      return
    } catch (e) {
      handleError(res, e)
    }
  }
}