import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback-rating',
  templateUrl: './feedback-rating.component.html',
  styles: []
})
export class FeedbackRatingComponent implements OnInit {

  rating = -1;

  constructor() { }

  ngOnInit() {
  }

}
