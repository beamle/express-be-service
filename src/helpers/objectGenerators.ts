import { Request } from "express";
import { SortDirection } from "mongodb";
import { SortingDataBase, UsersSortingData } from "../app/db";

function generateSortingDataBase(req): SortingDataBase {
  let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10
  let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt'
  let sortDirection: SortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc'

  return { pageNumber, pageSize, sortBy, sortDirection }
}

export function generateSortingDataObject(req: Request): SortingDataBase & Partial<{ searchNameTerm: string | null }>  {
  const sortingDataBase = generateSortingDataBase(req)
  let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null

  return { ...sortingDataBase, searchNameTerm }
}

export function generateUsersSortingDataObject(req: Request): UsersSortingData {
  const sortingDataBase = generateSortingDataBase(req)
  let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null
  let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null

  return { ...sortingDataBase, searchLoginTerm, searchEmailTerm }
}

export function createFilter(sortingData) {
  const filter: any = {};

  if (sortingData.searchNameTerm) {
    filter.name = { $regex: sortingData.searchNameTerm, $options: 'i' } // ignore Cc
  }

  if (sortingData.searchEmailTerm) {
    filter.email = { $regex: sortingData.searchEmailTerm, $options: 'i' };
  }
  if (sortingData.searchLoginTerm) {
    filter.login = { $regex: sortingData.searchLoginTerm, $options: 'i' };
  }

  return filter;
}
