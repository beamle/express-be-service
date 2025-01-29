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
    let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : "";
    return Object.assign(Object.assign({}, sortingDataBase), { searchNameTerm });
}
function generateUsersSortingDataObject(req) {
    const sortingDataBase = generateSortingDataBase(req);
    let searchLoginTerm = req.query.searchLoginTerm && String(req.query.searchLoginTerm);
    let searchEmailTerm = req.query.searchEmailTerm && String(req.query.searchEmailTerm);
    return Object.assign(Object.assign({}, sortingDataBase), { searchLoginTerm, searchEmailTerm });
}
function createFilter(filterData) {
    const filter = {};
    const orConditions = [];
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
