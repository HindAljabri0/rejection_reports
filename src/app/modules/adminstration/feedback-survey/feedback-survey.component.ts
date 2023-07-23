import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FeedbackDialogComponent } from "src/app/components/dialogs/feedback-dialog/feedback-dialog.component";
import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { AddFeedbackDateDialogComponent } from "../feedback-select-date/feedback-select-date.component";
import { FeedbackDate } from "../feedback-select-date/feedback-date.model";
import { DialogService } from "src/app/services/dialogsService/dialog.service";
import { AuthService } from 'src/app/services/authService/authService.service';
import { SuperAdminService } from "src/app/services/administration/superAdminService/super-admin.service";

@Component({
  selector: "app-feedback-survey",
  templateUrl: "./feedback-survey.component.html",
  styles: [],
})
export class FeedbackSurveyComponent implements OnInit {


  constructor(
    // tslint:disable-next-line:variable-name
    private dialog: MatDialog,
    private _feedbackservice: FeedbackService,
    private dialogService: DialogService,
    public authService: AuthService,
    private superAdmin: SuperAdminService,
  ) {}
  AccessToken: any;
  surveyFlag: boolean = true;
  surveyName: any;
  sharedServices: any;
  token: string;
  duplicateCounter = 0;
  error = '';
  content: any;
  providersInfo: any[] = [];

  @HostListener('window:message', ['$event'])
  receiveMessage(event: MessageEvent) {
    if (event.origin !== 'http://localhost:5000/') {
      return; // Only accept messages from the specific origin
    }
  }

  ngOnInit() {
   this.getSurvey();
   this.getUserData();
   this.getProviders();
  }


  
  
  getUserData() {
    this.authService.evaluateUserPrivileges();
    this.AccessToken = this.authService.getAccessToken();
  }
  preview(survey){
    this.surveyFlag = false;
  
    const iframe = document.getElementById('myIframe');
    if (!iframe) {
      // Create the iframe element
      const iframe = document.createElement('iframe');
      iframe.id = 'myIframe';
      iframe.src = 'http://localhost:5000/preview';
      iframe.width = '100%'; // Set the width to 400 pixels
      iframe.height = '600px'; // Set the height to 300 pixels

      // Add the iframe to the desired container or the document's body
      document.body.appendChild(iframe);
      const token = this.authService.getAccessToken();
      // Optionally, you can add an onload event to the iframe to perform actions once it's loaded
      iframe.onload = function() {
        const authorizationData = {
          token,
          Title: survey
        };
        iframe.contentWindow.postMessage(authorizationData, iframe.src);
        console.log('The iframe content has been loaded.');

    
      };
    }

  }

  getSurvey() {
    this._feedbackservice.getSurvey().subscribe((event) => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        this.content = event.body;
      }
    });
  }

  getProviders() {
    //  this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providersInfo = event.body;
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });
  }

  getChecked(survey: any) {
    this.duplicateCounter++;
    const postData: FeedbackDate = {
      surveyName: survey.name + 'copy(${this.duplicateCounter})',
      content: survey.content,
      surveyId: undefined,
      startDate: undefined,
      closeDate: undefined,
      providerIds: undefined,
    };

    this._feedbackservice.postSurvey(postData).subscribe(
      (event) => {
        if (event) {
            const response = event;
            this.dialogService.openMessageDialog({
              title: '',
              message: `Survey Cloned Successfully`,
              isError: false
            });
            this.getSurvey();
            console.log(response);          
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.sharedServices.loadingChanged.next(false);
        }
      }
    );
  }

  openPreviewDialog(value: any) {
    const dialogRef = this.dialog.open(AddFeedbackDateDialogComponent, {
     
      data: {
        surveyId: value,
        providersInfo: this.providersInfo,
      },
      panelClass: ["primary-dialog", "dialog-lg"],
    });
  }
}
