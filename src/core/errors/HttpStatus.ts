/**
 * HTTP Status Codes
 * @readonly
 */
export enum HttpStatus {
  ok = 200,
  /**
   * The request succeeded, and a new resource was created as a result.
   */
  created = 201,
  /**
   * The server cannot process the request due to perceived client errors,
   * like malformed syntax or deceptive routing.
   */
  badRequest = 400,
  /**
   * The client is not authorized to access the resource. Semantically this
   * response means "unauthenticated". That is, the client must authenticate
   * itself to get the requested response.
   */
  unauthorized = 401,
  /**
   * The client does not have access rights to the content, so the server is
   * refusing to give the requested resource. Unlike 401 Unauthorized, the
   * client's identity is known to the server.
   */
  forbidden = 403,
  /**
   * The requested resource could not be found on the server.
   */
  notFound = 404,
  /**
   * The request could not be processed because of conflict in the current
   * state of the resource.
   */
  conflict = 409,
  /**
   * The server has encountered a situation it does not know how to handle.
   */
  internalServerError = 500,
}
