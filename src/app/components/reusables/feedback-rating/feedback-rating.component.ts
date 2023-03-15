import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
     
    }
  
    setRating(newRating:number): void{
      if(newRating !== null){
        this.rating = newRating;
        this.addRating();
  
      }else if(newRating == null){
       
      }
    }
  
    setSuggestion(newSugg:string):void{
      if(newSugg !== null){
        this.suggestion = newSugg;
        this.addSugg();
       
      }else if(newSugg == null){
       
    }}
  
    addRating(): void{
      this.newRating.emit(this.rating); 
    }
    addSugg(): void{
      this.newSuggestion.emit(this.suggestion);
    }
  
}
