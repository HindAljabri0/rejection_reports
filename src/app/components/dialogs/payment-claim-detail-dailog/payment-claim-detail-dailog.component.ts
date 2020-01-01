import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PaymentClaimDetail } from 'src/app/models/paymentClaimDetail';

@Component({
  selector: 'app-payment-claim-detail-dailog',
  templateUrl: './payment-claim-detail-dailog.component.html',
  styleUrls: ['./payment-claim-detail-dailog.component.css']
})
export class PaymentClaimDetailDailogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PaymentClaimDetailDailogComponent>, @Inject(MAT_DIALOG_DATA) public claim:PaymentClaimDetail) { }

  ngOnInit() {
  }

}
