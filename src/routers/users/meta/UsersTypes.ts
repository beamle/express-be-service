import { UserType } from "../../../app/db";

export type UsersViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserType[];
}
