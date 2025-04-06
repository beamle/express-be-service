import { Request } from "express";
import { SortDirection } from "mongodb";
import { SortingBase, UsersSortingData } from "../app/db";

type FilterData = Partial<{
  searchNameTerm: string,
  searchEmailTerm: string,
  searchLoginTerm: string
  id: string
}>

function generateSortingDataBase(req: Request): SortingBase {
  let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
  let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
  let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

  return { pageNumber, pageSize, sortBy, sortDirection }
}

export function generateSortingDataObject(req: Request): SortingBase & Partial<{ searchNameTerm: string }> {
  const sortingDataBase = generateSortingDataBase(req)
  let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : ""

  return { ...sortingDataBase, searchNameTerm }
}

export function generateUsersSortingDataObject(req: Request): UsersSortingData {
  const sortingDataBase = generateSortingDataBase(req)
  let searchLoginTerm = req.query.searchLoginTerm && String(req.query.searchLoginTerm)
  let searchEmailTerm = req.query.searchEmailTerm && String(req.query.searchEmailTerm)

  return { ...sortingDataBase, searchLoginTerm, searchEmailTerm }
}



export function createFilter(filterData: FilterData) {
  const filter: any = {};
  const orConditions: any[] = [];

  if (filterData.searchNameTerm) {
    orConditions.push({ name: { $regex: filterData.searchNameTerm, $options: 'i' } });
  }
  if (filterData.searchEmailTerm) {
    orConditions.push({ email: { $regex: filterData.searchEmailTerm, $options: 'i' } });
  }
  if (filterData.searchLoginTerm) {
    orConditions.push({ login: { $regex: filterData.searchLoginTerm, $options: 'i' } });
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }

  if (filterData.id) {
    filter._id = filterData.id;
  }

  return filter;
}