import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-uploads-center',
  templateUrl: './uploads-center.component.html',
  styles: []
})
export class UploadsCenterComponent implements OnInit {

  inCenter = true;

  showCenter = false;

  constructor(private commen: SharedServices) {
    this.commen.showUploadsCenterChange.subscribe(value => {
      this.showCenter = value;
    });
  }

  ngOnInit() {
  }

  get dataList() {
    return this.commen.uploadsList;
  }

  get providerId() {
    return this.commen.providerId;
  }

  hideCenter() {
    this.commen.showUploadsCenterChange.next(false);
  }

}
