export class RejectionCardData {
    rejectionBy: string;
    total: number;
    topFive: { label: string, total: number }[] = [];
  
    constructor(rejectionBy?: string, body?) {
      if (body != undefined && body instanceof Array && body.length > 0) {
        console.log(body);
      } else {
        this.total = 0;
        this.rejectionBy = rejectionBy || '';
        this.topFive = [{ label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }];
      }
    }
  }