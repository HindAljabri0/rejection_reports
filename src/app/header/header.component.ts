import { Component, OnInit } from '@angular/core';
import {CommenServicesService} from '../commen-services.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;

  constructor(private commen:CommenServicesService) { }

  get loading():boolean{
    return this.commen.loading;
  }

  ngOnInit() {
  }

}
