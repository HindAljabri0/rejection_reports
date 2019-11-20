export class ClaimError {
  code: string;
  description: string;
  fieldName: string;
  constructor(body: {}) {
    if(body != null){
      this.code = body['errorCode'];
      this.description = body['errorDescription'];
      this.fieldName = body ['fieldName'];
    }
  }
}