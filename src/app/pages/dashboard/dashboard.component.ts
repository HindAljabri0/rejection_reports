import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardSections: { label: string, key: string }[] = [
    { label: 'All Claims Before Submission', key: 'nonSubmittedClaims' },
    { label: 'All Claims After Submission', key: 'submittedClaims' },
  ];

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dashboardSections, event.previousIndex, event.currentIndex);
  }

}
