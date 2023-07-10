import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-feedback-survey-select-provider',
  templateUrl: './feedback-survey-select-provider.component.html',
  styles: []
})
export class FeedbackSurveySelectProviderComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FeedbackSurveySelectProviderComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
