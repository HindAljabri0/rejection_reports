import { Component, OnInit } from '@angular/core';
import { CommenServicesService } from 'src/app/services/commen-services.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  status;
  constructor(private commen:CommenServicesService) {
    this.commen.showNotificationCenterChange.subscribe(value => {
      this.toggleNotificationCenter(value);
    });
  }

  ngOnInit() {
  }

  toggleNotificationCenter(show:boolean){
    console.log(show);
    if(show){
      this.status = "show";
    } else this.status = "";
  }

}
