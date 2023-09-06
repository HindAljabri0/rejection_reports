import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FeedbackDialogComponent } from 'src/app/components/dialogs/feedback-dialog/feedback-dialog.component';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { AddFeedbackDateDialogComponent } from '../feedback-select-date/feedback-select-date.component';
import { FeedbackDate } from '../feedback-select-date/feedback-date.model';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-feedback-survey',
  templateUrl: './feedback-survey.component.html',
  styleUrls: ['./feedback-survey.component.css']
})
export class FeedbackSurveyComponent implements OnInit {
  totalPages: any;
  Surveypage: any[];
  downloadData: any;
  constructor(
    // tslint:disable-next-line:variable-name
    private dialog: MatDialog,
    private feedbackservice: FeedbackService,
    private dialogService: DialogService,
    public authService: AuthService,
    private superAdmin: SuperAdminService
  ) { }
  AccessToken: any;
  surveyFlag = true;
  surveyName: any;
  sharedServices: any;
  token: string;
  duplicateCounter = 0;
  pageSizeOptions = [5, 10, 25, 100];
  page = 0;
  pageSize = 10;
  error = '';
  content: any;
  providersInfo: any[] = [];

  @HostListener('window:message', ['$event'])
  receiveMessage(event: MessageEvent) {
    if (event.origin !== environment.feedbacksurveyUrl) {
      return; // Only accept messages from the specific origin
    }
  }

  ngOnInit() {
    this.getSurvey();
    this.getUserData();
    this.getProviders();
     window.addEventListener('popstate', this.onBackButtonClicked.bind(this));
  }
  onBackButtonClicked(event: PopStateEvent): void {   
    document.getElementById('myIframe').style.display = 'none'
  }

  getUserData() {
    this.authService.evaluateUserPrivileges();
    this.AccessToken = this.authService.getAccessToken();
  }
  reloadPage() {
    window.location.reload();
  }
  preview(survey) {
    this.surveyFlag = false;

    const iframe = document.getElementById('myIframe');
    if (!iframe) {
      // Create the iframe element
      // tslint:disable-next-line:no-shadowed-variable
      const iframe = document.createElement('iframe');
      iframe.id = 'myIframe';
      iframe.src = environment.feedbacksurveyUrl + '/preview';
      iframe.width = '100%'; // Set the width to 400 pixels
      iframe.height = '600px'; // Set the height to 300 pixels

      // Add the iframe to the desired container or the document's body
      document.body.appendChild(iframe);
      const token = this.authService.getAccessToken();
      const user = this.authService.getAuthUsername();
      // Optionally, you can add an onload event to the iframe to perform actions once it's loaded
      iframe.onload = function () {
        const authorizationData = {
          token,
          Title: survey,
          userName: user,
        };
        iframe.contentWindow.postMessage(authorizationData, iframe.src);
      };
    }
  }

  getSurvey() {
    this.feedbackservice.getSurvey(this.page, this.pageSize).subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.content = event.body;       
        this.totalPages = event.body["totalElements"] as string;
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
      }
    });

  }

  getProviders() {

    this.superAdmin.getProviders().subscribe(
      (event) => {
        if (event instanceof HttpResponse) {
          if (event.body instanceof Array) {
            this.providersInfo = event.body;
          }
        }
      },
      (error) => {
        this.error = 'could not load providers, please try again later.';
      }
    );
  }

  downloadSheetFormat(survey: any){   
    this.feedbackservice.downloadExcel(survey.surveyId).subscribe((event) => {
      
      if (event instanceof HttpResponse) {
        this.downloadData = event.body; 
        const formattedData =  this.downloadData.map(item => {
          const result = JSON.parse(item.result);
          return { FEEDBACKID: item.surveyResponseId, PROVIDERID: item.providerId,USERNAME:item.userName, QUESTION_1: result.question1, QUESTION_2: result.question2, CREATED_DATE: item.dateCreated };
        });
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, survey.name +'.xlsx');
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
      }
    });

  }
  getChecked(survey: any) {
    this.surveyFlag = false;

    // tslint:disable-next-line:no-shadowed-variable
    const iframe = document.createElement('iframe');
    iframe.id = 'myIframe';
    iframe.src = environment.feedbacksurveyUrl + '/edit';
    iframe.width = '100%'; // Set the width to 400 pixels
    iframe.height = '600px'; // Set the height to 300 pixels

    // Add the iframe to the desired container or the document's body
    document.body.appendChild(iframe);
    const token = this.authService.getAccessToken();
    const user = this.authService.getAuthUsername();
    // Optionally, you can add an onload event to the iframe to perform actions once it's loaded
    iframe.onload = function () {
      const authorizationData = {
        token,
        Title: survey,
        userName: user,
      };
      iframe.contentWindow.postMessage(authorizationData, iframe.src);
    };
  }

  openPreviewDialog(value: any) {
    const dialogRef = this.dialog.open(AddFeedbackDateDialogComponent, {
      data: {
        surveyId: value.surveyId,
        providersInfo: this.providersInfo,
        status: value.isActive,
        details: value,
      },
      panelClass: ['primary-dialog', 'dialog-lg'],
    });
  }
  handlePageChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSurvey();
  }
}

