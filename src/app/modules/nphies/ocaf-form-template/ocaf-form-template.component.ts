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

  lensData: any = {};
  contactData: any = {};
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService, private sharedServices: SharedServices, public datepipe: DatePipe) { }

  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId, this.preAuthId).subscribe((res: any) => {
      this.sharedServices.loadingChanged.next(true);
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.OCAF = body;
          this.getLensSpecifications();
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
    this.lensData.left = [];
    this.lensData.right = [];

    this.contactData.left = [];
    this.contactData.right = [];

    this.OCAF.visionPrescription.lensSpecifications.forEach(res => {
      debugger;
      if (res.product === 'lens') {

        if (res.eye === 'left') {
          let left: any = {};          
          left.product = res.product;
          left.eye = res.eye;
          left.sphere = res.sphere;
          left.cylinder = res.cylinder;
          left.axis = res.axis;
          left.prismAmount = res.prismAmount;
          left.lensNote = res.lensNote;
          left.lensPower = res.lensPower;

          this.lensData.left.push(left);

          let right: any = {};
          right.isDistance = res.sphere < 0 ? true : false;
          right.product = "-";
          right.eye = "-";
          right.sphere = "-";
          right.cylinder = "-";
          right.axis = "-";
          right.prismAmount = "-";
          right.lensNote = "-";
          right.lensPower = "-";
          this.lensData.right.push(right);
        }

        if (res.eye === 'right') {
          let right: any = {};
          right.isDistance = res.sphere < 0 ? true : false;
          right.product = res.product;
          right.eye = res.eye;
          right.sphere = res.sphere;
          right.cylinder = res.cylinder;
          right.axis = res.axis;
          right.prismAmount = res.prismAmount;
          right.lensNote = res.lensNote;
          right.lensPower = res.lensPower;
          this.lensData.right.push(right);

          let left: any = {};          
          left.product = "-";
          left.eye = "-";
          left.sphere = "-";
          left.cylinder = "-";
          left.axis = "-";
          left.prismAmount = "-";
          left.lensNote = "-";
          left.lensPower = "-";
          this.lensData.left.push(left)
        }

      }
      if (res.product === 'contact') {

     

        if (res.eye === 'left') {
          let left: any = {};          
          left.product = res.product;
          left.eye = res.eye;
          left.sphere = res.sphere;
          left.cylinder = res.cylinder;
          left.axis = res.axis;
          left.prismAmount = res.prismAmount;
          left.lensNote = res.lensNote;
          left.lensPower = res.lensPower;

          this.contactData.left.push(left);

          let right: any = {};
          right.isDistance = res.lensPower < 0 ? true : false;
          right.product = "-";
          right.eye = "-";
          right.sphere = "-";
          right.cylinder = "-";
          right.axis = "-";
          right.prismAmount = "-";
          right.lensNote = "-";
          right.lensPower = "-";
          this.contactData.right.push(right);
        }

        if (res.eye === 'right') {
          let right: any = {};
          right.isDistance = res.lensPower < 0 ? true : false;
          right.product = res.product;
          right.eye = res.eye;
          right.sphere = res.sphere;
          right.cylinder = res.cylinder;
          right.axis = res.axis;
          right.prismAmount = res.prismAmount;
          right.lensNote = res.lensNote;
          right.lensPower = res.lensPower;
          this.contactData.right.push(right);

          let left: any = {};          
          left.product = "-";
          left.eye = "-";
          left.sphere = "-";
          left.cylinder = "-";
          left.axis = "-";
          left.prismAmount = "-";
          left.lensNote = "-";
          left.lensPower = "-";
          this.contactData.left.push(left)
        }
      }
    });

    console.log('contactDataList', this.contactData);
    console.log('lensDataList', this.lensData);

  }

}
