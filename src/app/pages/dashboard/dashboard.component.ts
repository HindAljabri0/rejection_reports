import { Component, OnInit, Type } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NonSubmittedClaimsComponent } from './components/non-submitted-claims/non-submitted-claims.component';
import { SubmittedClaimsComponent } from './components/submitted-claims/submitted-claims.component';
import { TopFiveRejectionsComponent } from './components/top-five-rejections/top-five-rejections.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  dashboardSections: { label: string, key: Type<any>, index: string }[] = [
    { label: 'All Claims Before Submission', key: NonSubmittedClaimsComponent, index: '0' },
    { label: 'All Claims After Submission', key: SubmittedClaimsComponent, index: '1' },
    { label: 'Top 5 Rejections', key: TopFiveRejectionsComponent, index: '2' },
  ];

  ngOnInit() {
    let order = localStorage.getItem('defaultDashboardSectionsOrder');
    let newOrderedDashboard = [];
    if (order != null) {
      let splitedValues = order.split(',');
      if (splitedValues.length == this.dashboardSections.length) {
        splitedValues.forEach((index, j) => {
          let i = Number.parseInt(index);
          if (Number.isInteger(i) && this.dashboardSections.length > i && i >= 0 && this.dashboardSections.length > j) {
            newOrderedDashboard[j] = this.dashboardSections[i];
          }
        });
        if (newOrderedDashboard.map(section => Number.parseInt(section.index)).reduce((i, j) => i + j) == this.dashboardSections.map(section => Number.parseInt(section.index)).reduce((i, j) => i + j) && newOrderedDashboard.length == this.dashboardSections.length)
          this.dashboardSections = newOrderedDashboard;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dashboardSections, event.previousIndex, event.currentIndex);
    localStorage.setItem('defaultDashboardSectionsOrder', this.dashboardSections.map(section => section.index).toString());
  }

}
