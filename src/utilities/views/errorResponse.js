class DataForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "Data Forbidden";
    this.code = "403";
    this.status = "FORBIDDEN";
  }
}

class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "Data Not Found";
    this.code = "404";
    this.status = "NOT FOUND";
  }
}

class DataDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = "Data Duplicate";
    this.code = "409";
    this.status = "CONFLICT";
  }
}

module.exports = {
  DataForbiddenError,

  DataNotFoundError,

  DataDuplicateError,
};
