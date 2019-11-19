export class MessageDialogData{
    title:string;
    message:string;
    isError:boolean = false;
    constructor(title:string, message:string, isError:boolean){
      this.title = title;
      this.message = message;
      this.isError = isError;
    }
  }