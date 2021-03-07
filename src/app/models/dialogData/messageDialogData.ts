export class MessageDialogData {
  title: string;
  message: string;
  isError = false;
  withButtons?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;

  constructor(
    title: string,
    message: string,
    isError: boolean,
    withButtons?: boolean,
    confirmButtonText?: string,
    cancelButtonText?: string) {
    this.title = title;
    this.message = message;
    this.isError = isError;
    this.withButtons = withButtons || false;
    this.confirmButtonText = confirmButtonText || 'Confirm';
    this.cancelButtonText = cancelButtonText || 'Cancel';
  }

}
