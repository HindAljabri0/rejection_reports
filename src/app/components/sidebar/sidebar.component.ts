import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/authService.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  providerId:string;

  constructor(private auth:AuthService) {
    this.auth.isUserNameUpdated.subscribe(updated=>{
      this.providerId = this.auth.getProviderId();
    });
  }

  ngOnInit() {
    this.providerId = this.auth.getProviderId();
  }

}
