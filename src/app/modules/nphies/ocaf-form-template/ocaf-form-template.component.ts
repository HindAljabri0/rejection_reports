import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ocaf-form-template',
  templateUrl: './ocaf-form-template.component.html',
  styles: []
})
export class OcafFormTemplateComponent implements OnInit {
  OCAF: any;
  @Input() preAuthId: any;
  @Input() printFor: any;
  lensData: any = {};
  contactData: any = {};

  totalAmount=0;
  totalApprovedAmount=0;
  totalQuantity=0;
  approvedQuantity=0;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService, private sharedServices: SharedServices, public datepipe: DatePipe) {
    this.lensData.left = [];
    this.lensData.right = [];

    this.contactData.left = [];
    this.contactData.right = [];
  }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId, this.preAuthId, this.printFor).subscribe((res: any) => {
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.OCAF = body;
          this.getLensSpecifications();
          this.countTotal();
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  calculateAge() {
    const ageDifMs = Date.now() - new Date(this.OCAF.beneficiary.dob).getTime();
    const ageDate = new Date(ageDifMs);
    if (Math.abs(ageDate.getUTCFullYear() - 1970) == 0) {
      return `0. ${new Date().getMonth() - new Date(this.OCAF.beneficiary.dob).getMonth() + 1}`
    } else return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getLensSpecifications() {
    if(this.OCAF.visionPrescription!=null ){
    if ( this.OCAF.visionPrescription.lensSpecifications != null) {
      this.OCAF.visionPrescription.lensSpecifications.filter(x => x.product === 'lens').forEach((x, index) => {
        x.sequence = index + 1;
        x.isDistance = x.sphere < 0 ? true : false;
      });

      let lensArr: any = this.OCAF.visionPrescription.lensSpecifications.filter(x => x.product === 'lens').map(x => {
        return x
      });

      let lensLeftArr: any = lensArr.filter(x => x.eye === 'left');
      let lensRightArr: any = lensArr.filter(x => x.eye === 'right');

      this.OCAF.visionPrescription.lensSpecifications.filter(x => x.product === 'contact').forEach((x, index) => {
        x.sequence = index + 1;
        x.isDistance = x.lensPower < 0 ? true : false;
      });

      let contactArr: any = this.OCAF.visionPrescription.lensSpecifications.filter(x => x.product === 'contact').map(x => {
        return x
      });

      let contactLeftArr: any = contactArr.filter(x => x.eye === 'left');
      let contactRightArr: any = contactArr.filter(x => x.eye === 'right');

      lensLeftArr.forEach(x => {
        if (!this.lensData.left.find(y => y.sequence === x.sequence)) {
          this.lensData.left.push(x);

          let right: any = {};
          right.isDistance = x.isDistance
          right.product = "-";
          right.eye = "-";
          right.sphere = "-";
          right.cylinder = "-";
          right.axis = "-";
          right.prismAmount = "-";
          right.lensNote = "-";
          right.lensPower = "-";

          if (x.isDistance) {
            if (lensRightArr.find(y => y.isDistance === true && !this.lensData.right.find(z => z.sequence === y.sequence))) {
              this.lensData.right.push(lensRightArr.filter(y => y.isDistance === true && !this.lensData.right.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.lensData.right.push(right);
            }
          } else {
            if (lensRightArr.find(y => y.isDistance === false && !this.lensData.right.find(z => z.sequence === y.sequence))) {
              this.lensData.right.push(lensRightArr.filter(y => y.isDistance === false && !this.lensData.right.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.lensData.right.push(right);
            }
          }
        }

      });

      lensRightArr.forEach(x => {

        if (!this.lensData.right.find(y => y.sequence === x.sequence)) {
          this.lensData.right.push(x);

          let left: any = {};
          left.isDistance = x.isDistance
          left.product = "-";
          left.eye = "-";
          left.sphere = "-";
          left.cylinder = "-";
          left.axis = "-";
          left.prismAmount = "-";
          left.lensNote = "-";
          left.lensPower = "-";

          if (x.isDistance) {
            if (lensLeftArr.find(y => y.isDistance === true && !this.lensData.left.find(z => z.sequence === y.sequence))) {
              this.lensData.left.push(lensLeftArr.filter(y => y.isDistance === true && !this.lensData.left.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.lensData.left.push(left);
            }
          } else {
            if (lensLeftArr.find(y => y.isDistance === false && !this.lensData.left.find(z => z.sequence === y.sequence))) {
              this.lensData.left.push(lensLeftArr.filter(y => y.isDistance === false && !this.lensData.left.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.lensData.left.push(left);
            }
          }
        }

      });



      contactLeftArr.forEach(x => {
        if (!this.contactData.left.find(y => y.sequence === x.sequence)) {
          this.contactData.left.push(x);

          let right: any = {};
          right.isDistance = x.isDistance
          right.product = "-";
          right.eye = "-";
          right.sphere = "-";
          right.cylinder = "-";
          right.axis = "-";
          right.prismAmount = "-";
          right.lensNote = "-";
          right.lensPower = "-";

          if (x.isDistance) {
            if (contactRightArr.find(y => y.isDistance === true && !this.contactData.right.find(z => z.sequence === y.sequence))) {
              this.contactData.right.push(contactRightArr.filter(y => y.isDistance === true && !this.contactData.right.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.contactData.right.push(right);
            }
          } else {
            if (contactRightArr.find(y => y.isDistance === false && !this.contactData.right.find(z => z.sequence === y.sequence))) {
              this.contactData.right.push(contactRightArr.filter(y => y.isDistance === false && !this.contactData.right.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.contactData.right.push(right);
            }
          }
        }

      });

      contactRightArr.forEach(x => {

        if (!this.contactData.right.find(y => y.sequence === x.sequence)) {
          this.contactData.right.push(x);

          let left: any = {};
          left.isDistance = x.isDistance
          left.product = "-";
          left.eye = "-";
          left.sphere = "-";
          left.cylinder = "-";
          left.axis = "-";
          left.prismAmount = "-";
          left.lensNote = "-";
          left.lensPower = "-";

          if (x.isDistance) {
            if (contactLeftArr.find(y => y.isDistance === true && !this.contactData.left.find(z => z.sequence === y.sequence))) {
              this.contactData.left.push(contactLeftArr.filter(y => y.isDistance === true && !this.contactData.left.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.contactData.left.push(left);
            }
          } else {
            if (contactLeftArr.find(y => y.isDistance === false && !this.contactData.left.find(z => z.sequence === y.sequence))) {
              this.contactData.left.push(contactLeftArr.filter(y => y.isDistance === false && !this.contactData.left.find(z => z.sequence === y.sequence))[0]);
            } else {
              this.contactData.left.push(left);
            }
          }
        }

      });
    }
}
  }

  getVisitReason(code: string) {
    const index = this.OCAF.supportingInfo.findIndex(res => res.category === "reason-for-visit");
    if (index !== -1) {
      console.log(this.OCAF.supportingInfo[index].code === code);
      return this.OCAF.supportingInfo[index].code === code;
    } else return false
  }
  countTotal(){
    let total = 0;
     this.OCAF.items.forEach(i => {
        this.totalAmount += i.netAmount;
        this.totalApprovedAmount+=i.benfit!=null?Number(i.benfit):0;
        this.totalQuantity+=i.quantity;
        this.approvedQuantity+=i.approvedQuantity!=null?Number(i.approvedQuantity):0;
        
    });
  }
}
