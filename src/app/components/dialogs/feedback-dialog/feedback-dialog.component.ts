import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { isDateValid } from 'ngx-bootstrap/chronos';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FeedbackClass } from './feedback.model.component';
import { FeedbackService } from './feedback.service.component';
import { SnackBarService } from './SnackBarService';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styles: [
    '.\feedback-dialog.component.css',
  ]
})
export class FeedbackDialogComponent implements OnInit {
   /**
    * To-do:
    * - Warning message(Snackbar)[Done]
    * - Pop-up timing?!           [In-Progress]
    * - Inject the component with the Waseel-GUI app [Done]
    * - 
    */
 feedback = new FeedbackClass();
 //  common: SharedServices = new SharedServices();
    providerId:string;
    userName:string;
    authUsername: string;
    providerName: string;
    required:boolean = true;


constructor(
      private _feedbackservice: FeedbackService,
      private snackBarService: SnackBarService,
      private matSnackBar: MatSnackBar,
      private authService: AuthService,
      public dialogRef: MatDialogRef<DashboardComponent>,
     
      @Inject(MAT_DIALOG_DATA) public data: any
      ){}


 ngOnInit(): void {
  this.getUserData();
 }


 getUserData(){
  /**
   * Get the authorized user data and set it to the local variables.
   */
  this.authService.evaluateUserPrivileges();
  this.userName = this.authService.getUserName();
  this.feedback.userName = this.authService.getAuthUsername();
  this.providerName = this.authService.getProviderName();
  this.feedback.providerId = this.authService.getProviderId();

  console.log(`userName: ${this.feedback.userName},\n providerId: ${this.feedback.providerId}`);
}


 setOverallQRating(newRating: number):void{
   this.feedback.overallSatisfactionQ = newRating;
   console.log("Overall"+newRating);
}


 setRecommendQRating(newRating: number): void{
   if(this.isRating(newRating)){
     this.feedback.RecommendToFriend = newRating;
     console.log("Recommmend"+newRating);
     this.feedback.valid = true;
   }
}

 setSuggestion(): void{
  if(this.feedback.suggestion != null && this.feedback.suggestion.length > 5000 ){
    this.suggetionIsNotValidSnackBar();
    this.feedback.valid = false;
  }
}


submit(){
   this.setSuggestion();
   console.log("\nFeedback is: " + this.feedback.valid);
   if(this.feedback.valid){
    console.log(`PID: ${this.feedback.providerId}`);
       this._feedbackservice.addFeedback(this.feedback).subscribe({
         next: data=>{
           console.log(`feedback: ${data}`);

           catchError(error => {
            let errorMsg: string;
            if (error.error instanceof ErrorEvent) {
                errorMsg = `Error: ${error.error.message}`;
            } else {
                errorMsg = this.getServerErrorMessage(error);
            }

            return throwError(errorMsg);
        })
         }
       })
       this.dialogRef.close();
      //  this.successSnackbar(); //requires design touch.
   }else{
     this.required = false;
     this.requiredSnackbar();
     console.log('feedback is not valid');
  }
 }
 close(){
    this.dialogRef.close();
 }

 // --------------------------Snackbar section--------------------------
 
 successSnackbar() {
   this.matSnackBar.open("Thank you for your feedback ", "Hide",{
    duration: 7000,
    horizontalPosition: "center",
    verticalPosition: "bottom",
   });
  }

 requiredSnackbar() {
   this.matSnackBar.open("the first two questions are required", "Ok", {
    duration: 7000, 
    horizontalPosition: "center",
     verticalPosition: "top"
   });
 }

 suggetionIsNotValidSnackBar() {
  this.matSnackBar.open("The Suggestion should not be longer than 5000 characters.", "Ok",{
   duration: 7000,
   horizontalPosition: "center",
   verticalPosition: "top",
  });
 }



//--------------------------Validation section--------------------------
 isRating(num:number):Boolean{
   if (num == null){
     return false;
   }
   return true
 }

 isSubmitted(providerId: string, userName: string): Boolean{


  let submitted: Boolean = true;

  
  this._feedbackservice.UserFeedbackable(providerId, userName).subscribe((event:any) => {
    if (event instanceof HttpResponse) {
            const body = event.body;
            if (body instanceof Boolean) {
                submitted = body;
          }}
  });



  console.log(`feedback submisstion status: `+ submitted);
  return submitted;
 }


 
// --------------------------Excption Handling section--------------------------
getServerErrorMessage(error: any): string {
  switch (error.status) {
    case 404: {
        return `Not Found: ${error.message}`;
    }
    case 403: {
        return `Access Denied: ${error.message}`;
    }
    case 500: {
        return `Internal Server Error: ${error.message}`;
    }
    default: {
        return `Unknown Server Error: ${error.message}`;
    }
}
}

}

