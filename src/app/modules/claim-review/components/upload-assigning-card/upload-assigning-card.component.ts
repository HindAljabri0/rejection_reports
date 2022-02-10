import { Component, Input, OnInit } from '@angular/core';
import { Upload } from '../../models/upload.model';

@Component({
    selector: 'app-upload-assigning-card',
    templateUrl: './upload-assigning-card.component.html'
})
export class UploadAssigningCardComponent implements OnInit {

    @Input()
    data: Upload = new Upload();

    constructor() { }

    ngOnInit() {
    }

}
