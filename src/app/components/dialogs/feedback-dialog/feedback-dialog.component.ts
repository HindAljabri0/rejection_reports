import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/authService.service';
import { FeedbackClass } from './feedback.model.component';
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { HttpRequestExceptionHandler } from '../../reusables/feedbackExceptionHandling/HttpRequestExceptionHandler';

@Component(
  {
    selector: 'app-feedback-dialog',
    templateUrl:'./feedback-dialog.component.html',
    styles: [
             '.\feedback-dialog.component.css',
           ]
  }
)

export class FeedbackDialogComponent implements OnInit {

  feedback = new FeedbackClass();
  providerId: string;
  userName: string;
  authUsername: string;
  providerName: string;
  required: boolean = true

  constructor(
    private _feedbackservice: FeedbackService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private dialogService: DialogService,
    private requestExceptionHandler: HttpRequestExceptionHandler, 

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.getUserData();
  }


  getUserData() {
    /**
     * Get the authorized user data and set it to the local variables.
     */
    
    this.userName = this.authService.getUserName();
    this.feedback.userName = this.authService.getAuthUsername();
    this.providerName = this.authService.getProviderName();
    this.feedback.providerId = this.authService.getProviderId();
  }

  setOverallQRating(newRating: number): void {
    
    if (this.isRating(newRating)) {
        this.feedback.overallSatisfaction = newRating;
        
        this.feedback.isOverallSatisfactionValid = true;
    }else{
      this.feedback.isOverallSatisfactionValid = false;
    }
  }

  setRecommendQRating(newRating: number): void {
    if (this.isRating(newRating)) {
      this.feedback.recommendToFriend = newRating;
     
      this.feedback.isRecommendToFriend = true;
    }else{
      this.feedback.isRecommendToFriend = false;
    }
  }

  setSuggestion(): void {
    if (this.feedback.suggestion != null && this.feedback.suggestion.length > 5000) {
      
      this.dialogService.showMessage('Suggestion is to long', 'The suggestion should not exceed 5000 characters.', 'alert', true, 'OK', null, true);
      this.feedback.isSuggestionValid = false;
    }else{
      this.feedback.isSuggestionValid = true;
    }
  }


  submit() {
    this.setSuggestion();
   

    if (this.feedback.isSuggestionValid && this.feedback.isOverallSatisfactionValid && this.feedback.isRecommendToFriend) {
      
      this._feedbackservice.addFeedback(this.feedback).subscribe({
        next: data => {
          catchError(error => {
            let errorMsg: string;
            if (error.error instanceof ErrorEvent) {
              try {
                errorMsg = `\nError: ${this.requestExceptionHandler.getErrorMessage(error)}`;
                console.error('Add feedback service error message:\n' + errorMsg);
               } catch(error) { }
            } else {
              try {
                errorMsg = `\nError: ${this.requestExceptionHandler.getErrorMessage(error)}`;
                console.error('Add feedback service error message:\n' + errorMsg);
               } catch(error) { }
            }

            return throwError(errorMsg);
          })
        }
      })
      //Feedback submitted Successfully
      this.dialogService.showMessage('Thank you for your feedback', 'We appreciate your feedback and will take it into consideration.', 'success', true, 'OK', null, true);
      this.dialogRef.close();

    }else if(!this.feedback.isOverallSatisfactionValid || !this.feedback.isRecommendToFriend){
      //one of the required fields not filled.
      this.dialogService.showMessage('Required Fields', 'The first two questions are mendatory', 'alert', true, 'OK', null, true);
    }
  }

  close() {
    this.dialogRef.close();
  }


  //--------------------------Validation section--------------------------
  isRating(num: number): Boolean {
    if (num == null) {
      return false;
    }
    return true
  }

  isSubmitted(providerId: string, userName: string): Boolean {
    let submitted: Boolean = true;

    this._feedbackservice.UserFeedbackable(providerId, userName).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Boolean) {
          submitted = body;
        }
      }
    });

    return submitted;
  }
}

