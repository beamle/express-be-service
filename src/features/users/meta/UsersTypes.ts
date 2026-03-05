import { UserTypeViewModel } from "../../../app/db";

export type UsersViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserTypeViewModel[];
}

export type EmailConfirmationType = {
  isConfirmed: boolean
  confirmationCode: string
  expirationDate: Date
  sentEmails: SendEmailType[]
}

export type RegistrationDataType = {
  ip: string
}

export type SendEmailType = {
  sentDate: Date

}
