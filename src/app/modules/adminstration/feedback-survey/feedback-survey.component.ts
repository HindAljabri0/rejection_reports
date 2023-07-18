import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FeedbackDialogComponent } from 'src/app/components/dialogs/feedback-dialog/feedback-dialog.component';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';

@Component({
  selector: 'app-feedback-survey',
  templateUrl: './feedback-survey.component.html',
  styles: [],
})
export class FeedbackSurveyComponent implements OnInit {
  content: any;

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

  openPreviewDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
    });
  }
}
