"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSortingDataObject = generateSortingDataObject;
exports.generateUsersSortingDataObject = generateUsersSortingDataObject;
exports.createFilter = createFilter;
function generateSortingDataBase(req) {
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    let sortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
    return { pageNumber, pageSize, sortBy, sortDirection };
}
function generateSortingDataObject(req) {
    const sortingDataBase = generateSortingDataBase(req);
    let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null;
    return Object.assign(Object.assign({}, sortingDataBase), { searchNameTerm });
}
function generateUsersSortingDataObject(req) {
    const sortingDataBase = generateSortingDataBase(req);
    let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null;
    let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null;
    return Object.assign(Object.assign({}, sortingDataBase), { searchLoginTerm, searchEmailTerm });
}
function createFilter(sortingData) {
    const filter = {};
    if (sortingData.searchNameTerm) {
        filter.name = { $regex: sortingData.searchNameTerm, $options: 'i' }; // ignore Cc
    }
    if (sortingData.searchEmailTerm) {
        filter.email = { $regex: sortingData.searchEmailTerm, $options: 'i' };
    }
    if (sortingData.searchLoginTerm) {
        filter.login = { $regex: sortingData.searchLoginTerm, $options: 'i' };
    }
    return filter;
}
