import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FeedbackDialogComponent } from "src/app/components/dialogs/feedback-dialog/feedback-dialog.component";
import { FeedbackService } from "src/app/services/feedback/feedback.service";
import { AddFeedbackDateDialogComponent } from "../feedback-select-date/feedback-select-date.component";
import { FeedbackDate } from "../feedback-select-date/feedback-date.model";

@Component({
  selector: "app-feedback-survey",
  templateUrl: "./feedback-survey.component.html",
  styles: [],
})
export class FeedbackSurveyComponent implements OnInit {
  content: any;
  sharedServices: any;

  constructor(
    // tslint:disable-next-line:variable-name
    private dialog: MatDialog,
    private _feedbackservice: FeedbackService
  ) {}

  ngOnInit() {
    this._feedbackservice.getSurvey().subscribe((event) => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        this.content = event.body;
      }
    });
  }
  getChecked(survey: any) {
    const postData: FeedbackDate = {
      surveyName: survey.surveyName,
      content: survey.content,
      surveyId: survey.surveyId,
      startDate: undefined,
      closeDate: undefined,
      providerIds: undefined,
    };

    this._feedbackservice.postSurvey(postData).subscribe(
      (event) => {
        if (event) {
            const response = event;
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
      },
      panelClass: ["primary-dialog", "dialog-lg"],
    });
  }
}
