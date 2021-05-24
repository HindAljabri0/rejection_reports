import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/serchService/search.service';

@Component({
  selector: 'app-uploads-page',
  templateUrl: './uploads-page.component.html',
  styleUrls: ['./uploads-page.component.css']
})
export class UploadsPageComponent implements OnInit {

  constructor(private searchService:SearchService) { }

  ngOnInit() {
  }

}
