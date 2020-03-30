export class MessageDialogData{
    title:string;
    message:string;
    isError:boolean = false;
    withButtons?:boolean = false;
    constructor(title:string, message:string, isError:boolean, withButtons?:boolean){
      this.title = title;
      this.message = message;
      this.isError = isError;
      this.withButtons = withButtons || false;
    }
  }