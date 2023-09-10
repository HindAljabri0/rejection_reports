import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router} from '@angular/router';

@Component({
  selector: 'app-bupa-rejection-list',
  templateUrl: './credit-report-list.component.html',
  styleUrls: ['./credit-report-list.component.css']
})
export class CreditReportListComponent implements OnInit {
  communicationportalUrl: string;
  constructor( private router: Router,) {
    this.communicationportalUrl = environment.communicationportalUrl;
  }
  ngOnInit(): void {   
    setTimeout(() => {    
      window.open(this.communicationportalUrl, '_blank');
    }, 2000);
  }
  redirectToDashboard() {
    this.router.navigate(['/']);
  }
}