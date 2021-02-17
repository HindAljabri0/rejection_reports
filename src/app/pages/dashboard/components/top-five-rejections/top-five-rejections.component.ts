import { Component, OnInit } from '@angular/core';
import { getRejectionByDepartment, getRejectionByDoctor, getRejectionByService } from '../../store/dashboard.reducer';

@Component({
  selector: 'app-top-five-rejections',
  templateUrl: './top-five-rejections.component.html',
  styles: []
})
export class TopFiveRejectionsComponent implements OnInit {

  constructor() { }

  departmentRejectionSelector = getRejectionByDepartment;
  doctorRejectionSelector = getRejectionByDoctor;
  ServiceRejectionSelector = getRejectionByService;

  ngOnInit() {
  }

}
