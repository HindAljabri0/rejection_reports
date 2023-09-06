import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authService/authService.service';
import { FeedbackClass } from './feedback.model.component';
import { FeedbackService } from '../../../services/feedback/feedback.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { HttpRequestExceptionHandler } from '../../reusables/feedbackExceptionHandling/HttpRequestExceptionHandler';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component(
  {
    selector: 'app-feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.css'],
  }
)

export class FeedbackDialogComponent implements OnInit {

  feedback = new FeedbackClass();
  providerId: string;
  userName: string;
  authUsername: string;
  providerName: string;
  required = true;
  AccessToken: string;
  feedbacksurveyUrl: any;
  isLoading: boolean;

  constructor(
    private _feedbackservice: FeedbackService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private dialogService: DialogService,
    private requestExceptionHandler: HttpRequestExceptionHandler,
    private sanitizer : DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  this.getUserData(); }
  @HostListener('window:message', ['$event'])
  receiveMessage(event: MessageEvent) {
    if (event.origin !== environment.feedbacksurveyUrl) {
      return; // Only accept messages from the specific origin
    }
  }

  ngOnInit(): void {
    this.isLoading = true; // Show the spinner
    this.getUserData();
    this.feedbacksurveyUrl = this.getSanitizedURL();
  }
  getSanitizedURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(environment.feedbacksurveyUrl + '/preview');
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

  // setOverallQRating(newRating: number): void {

  //   if (this.isRating(newRating)) {
  //     this.feedback.overallSatisfaction = newRating;

  //     this.feedback.isOverallSatisfactionValid = true;
  //   } else {
  //     this.feedback.isOverallSatisfactionValid = false;
  //   }
  // }

  // setRecommendQRating(newRating: number): void {
  //   if (this.isRating(newRating)) {
  //     this.feedback.recommendToFriend = newRating;

  //     this.feedback.isRecommendToFriend = true;
  //   } else {
  //     this.feedback.isRecommendToFriend = false;
  //   }
  // }

  // setSuggestion(): void {
  //   if (this.feedback.suggestion != null && this.feedback.suggestion.length > 5000) {

  //     this.dialogService.showMessage('Suggestion is to long', 'The suggestion should not exceed 5000 characters.', 'alert', true, 'OK', null, true);
  //     this.feedback.isSuggestionValid = false;
  //   } else {
  //     this.feedback.isSuggestionValid = true;
  //   }
  // }

  onIframeLoad(event: Event) {
    const iframe: HTMLIFrameElement = event.target as HTMLIFrameElement;
    const token = this.authService.getAccessToken();
    const providerId = this.authService.getProviderId();
    // Optionally, you can add an onload event to the iframe to perform actions once it's loaded

    const authorizationData = {
      token,
      providerId,
      username: this.feedback.userName

    };
    this.isLoading = false; // Show the spinner  
    iframe.contentWindow.postMessage(authorizationData, iframe.src);

  }

  // submit() {
  //   this.setOverallQRating(0); // set the Overall question to 0 as a default value as it will not be withen this month feedbacks Qs!
  //   this.setSuggestion();


  //   if (this.feedback.isSuggestionValid && this.feedback.isOverallSatisfactionValid && this.feedback.isRecommendToFriend) {

  //     this._feedbackservice.addFeedback(this.feedback).subscribe({
  //       next: data => {
  //         catchError(error => {
  //           let errorMsg: string;
  //           if (error.error instanceof ErrorEvent) {
  //             try {
  //               errorMsg = `\nError: ${this.requestExceptionHandler.getErrorMessage(error)}`;
  //               console.error('Add feedback service error message:\n' + errorMsg);
  //             } catch (error) { }
  //           } else {
  //             try {
  //               errorMsg = `\nError: ${this.requestExceptionHandler.getErrorMessage(error)}`;
  //               console.error('Add feedback service error message:\n' + errorMsg);
  //             } catch (error) { }
  //           }

  //           return throwError(errorMsg);
  //         })
  //       }
  //     })
  //     //Feedback submitted Successfully
  //     this.dialogService.showMessage('Thank you for your feedback', 'We appreciate your feedback and will take it into consideration.', 'success', true, 'OK', null, true);
  //     this.dialogRef.close();

  //   } else if (!this.feedback.isOverallSatisfactionValid || !this.feedback.isRecommendToFriend) {
  //     //one of the required fields not filled.
  //     this.dialogService.showMessage('Required Fields', 'The first question is mendatory', 'alert', true, 'OK', null, true);
  //   }
  // }

  close() {
    this.dialogRef.close();
  }


  // //--------------------------Validation section--------------------------
  // isRating(num: number): Boolean {
  //   if (num == null) {
  //     return false;
  //   }
  //   return true
  // }

  // isSubmitted(providerId: string, userName: string): Boolean {
  //   let submitted: Boolean = true;

  //   this._feedbackservice.UserFeedbackable(providerId, userName).subscribe((event: any) => {
  //     if (event instanceof HttpResponse) {
  //       const body = event.body;
  //       if (body instanceof Boolean) {
  //         submitted = body;
  //       }
  //     }
  //   });

  //   return submitted;
  // }
}
