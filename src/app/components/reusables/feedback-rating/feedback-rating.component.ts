import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-rating',
  templateUrl: './feedback-rating.component.html',
  styles: [
    './feedback-rating.component.css',
  ]
})
export class FeedbackRatingComponent implements OnInit {

  @Input() rating: number;
  @Input() suggestion: string;
  @Output() newRating: EventEmitter<number> = new EventEmitter();
  @Output() newSuggestion: EventEmitter<string> = new EventEmitter();
  rated:boolean = false;
  

    ngOnInit() {
      console.log('we are in the rating component!')
    }
  
    setRating(newRating:number): void{
      if(newRating !== null){
        this.rating = newRating;
        this.addRating();
        console.log(`the new rating is ${this.rating}`);
      }else if(newRating == null){
        console.log(`Rating cannot be null!`);
      }
    }
  
    setSuggestion(newSugg:string):void{
      if(newSugg !== null){
        this.suggestion = newSugg;
        this.addSugg();
        console.log(`the new rating is ${this.rating}`);
      }else if(newSugg == null){
        console.log(`Rating cannot be null!`);
    }}
  
    addRating(): void{
      this.newRating.emit(this.rating);
      console.log(`Rating emitted successfuly!\n Rating:${this.newRating}`);
    }
    addSugg(): void{
      this.newSuggestion.emit(this.suggestion);
      console.log(`Suggestion emitted successfuly!\n Suggestion:${this.newSuggestion}`);
    }
  
}
