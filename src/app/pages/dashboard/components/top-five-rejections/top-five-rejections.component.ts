import { Component, OnInit } from '@angular/core';
import { RejectionCardData } from '../rejection-card/rejection-card.component';

@Component({
  selector: 'app-top-five-rejections',
  templateUrl: './top-five-rejections.component.html',
  styleUrls: ['./top-five-rejections.component.css']
})
export class TopFiveRejectionsComponent implements OnInit {

  constructor() { }

  departmentRejection: RejectionCardData = {
    total: 5000,
    rejectionBy: 'Department',
    topFive: [
      {label: 'CTS', total: 2500},
      {label: 'Cardio', total: 1500},
      {label: 'Urology', total: 500},
      {label: 'ETS', total: 250},
      {label: 'Dental', total: 100},
    ]
  };
  doctorRejection: RejectionCardData = {
    total: 6000,
    rejectionBy: 'Doctors',
    topFive: [
      {label: 'Dr. Ahmed', total: 4000},
      {label: 'Dr. Hasan', total: 1000},
      {label: 'Dr. Salah', total: 600},
      {label: 'Dr. Mohammad', total: 200},
      {label: 'Dr. Jassim', total: 100},
    ]
  };
  ServiceRejection: RejectionCardData = {
    total: 20000,
    rejectionBy: 'Services',
    topFive: [
      {label: 'NC084SK0001', total: 11000},
      {label: 'MA001LD0003', total: 7000},
      {label: 'AB0000004', total: 700},
      {label: 'NC136CZ0002', total: 200},
      {label: 'MA008SY0010s', total: 100},
    ]
  };

  ngOnInit() {
  }

}
