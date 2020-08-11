import { Component, OnInit, Type } from '@angular/core';
import Chart from 'chart.js';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NonSubmittedClaimsComponent } from './components/non-submitted-claims/non-submitted-claims.component';
import { SubmittedClaimsComponent } from './components/submitted-claims/submitted-claims.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardSections: { label: string, key: Type<any> }[] = [
    { label: 'All Claims Before Submission', key: NonSubmittedClaimsComponent },
    { label: 'All Claims After Submission', key: SubmittedClaimsComponent },
  ];
  
  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dashboardSections, event.previousIndex, event.currentIndex);
  }

}
