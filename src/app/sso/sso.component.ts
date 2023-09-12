import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
})
export class SsoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SsoComponent>,
  private sanitizer : DomSanitizer
  ) { }
  url:any;
  ngOnInit() {
    this.url = this.getSanitizedURL();
  }
  getSanitizedURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data);
  }
  close() {
    this.dialogRef.close();
  }
}
