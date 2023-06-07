import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FeedbackDialogComponent } from 'src/app/components/dialogs/feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'app-feedback-survey',
  templateUrl: './feedback-survey.component.html',
  styles: []
})
export class FeedbackSurveyComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openPreviewDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });
  }

}
