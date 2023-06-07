import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FeedbackSurveySelectProviderComponent } from '../feedback-survey-select-provider/feedback-survey-select-provider.component';

@Component({
  selector: 'app-feedback-survey-details',
  templateUrl: './feedback-survey-details.component.html',
  styles: []
})
export class FeedbackSurveyDetailsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openSelectProviderDialog() {
    const dialogRef = this.dialog.open(FeedbackSurveySelectProviderComponent, {
      panelClass: ['primary-dialog']
    });
  }

}
