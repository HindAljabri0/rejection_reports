export class ClaimError {
  errorCode: string;
  errorDescription: string;
  fieldName: string;
  constructor(body: {}) {
    if(body != null){
      this.errorCode = body['errorCode'];
      this.errorDescription = body['errorDescription'];
      this.fieldName = body ['fieldName'];
    }
  }
}