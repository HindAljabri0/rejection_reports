export class RejectionCardData {
    rejectionBy: string;
    total: number;
    
    topFive: { label: string, total: number, percent?: number }[] = [];
  
    constructor(rejectionBy?: string, body?) {
      if (body != undefined && body instanceof Array && body.length > 0) {
        this.rejectionBy = rejectionBy;
        this.topFive = body.map(item => ({label: item['categoryName'], total: item['rejectedNumber'], percent: item['rejectedPercent'] * 100}));
        for(let i = this.topFive.length; i < 5; i++){
            this.topFive[i] = { label: '', total: 0 };
        }
      } else {
        this.total = 0;
        this.rejectionBy = rejectionBy || '';
        this.topFive = [{ label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }, { label: '', total: 0 }];
      }
    }
  }