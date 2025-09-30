import { CustomError } from "../../helpers/CustomError";

export const SessionsErrors = {
  NO_SESSIONS_FOR_USER_ID: {
    message: "No sessions for such userId was found!",
    field: "id",
    status: 404,
  },
  NOT_OWNER_OF_COMMENT: {
    message: "You are not owner of the comment",
    field: "",
    status: 403,
  },
};

export class SecurityService {
  async updateComment(userId) {
    const result = await securityRepository.getAllSessions(userId);

    if (!result) {
      throw new CustomError(SessionsErrors.NO_SESSIONS_FOR_USER_ID);
    }

    return result;
  }
}

export default new SecurityService();
