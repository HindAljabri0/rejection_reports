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
  OCAF : any;
  @Input() preAuthId: any;
  
  lensDataList =[];
  contactDataList =[];
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,private sharedServices: SharedServices,public datepipe: DatePipe) { }

  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId,this.preAuthId).subscribe((res:any)=>{
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

  calculateAge(){
    const ageDifMs = Date.now() - new Date(this.OCAF.beneficiary.dob).getTime();
    const ageDate = new Date(ageDifMs);
    if(Math.abs(ageDate.getUTCFullYear() - 1970) == 0){
      return `0. ${new Date().getMonth() -  new Date(this.OCAF.beneficiary.dob).getMonth() + 1}` 
    } else return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getLensSpecifications(){
    
    this.OCAF.visionPrescription.lensSpecifications.forEach(res=>{
      if(res.product === 'lens'){
        let model :any ={};
        model.left =[];
        model.right =[];
        
        if(res.eye === 'left'){
          let left :any ={};
          left.distance = res.sphere < 0 ? true:false;
          left.product= res.product;
          left.eye= res.eye;
          left.sphere= res.sphere;
          left.cylinder= res.cylinder;
          left.axis= res.axis;
          left.prismAmount=res.prismAmount;
          left.lensNote= res.lensNote;
          left.lensPower= res.lensPower;
          
          model.left.push(left);

          let right :any ={};
          right.distance = res.sphere < 0 ? true:false;
          right.product= "-";
          right.eye= "-";
          right.sphere= "-";
          right.cylinder= "-";
          right.axis= "-";
          right.prismAmount="-";
          right.lensNote= "-";
          right.lensPower= "-";
          model.right.push(right);
        }

        if(res.eye === 'right'){
          let right :any ={};
          right.distance = res.sphere < 0 ? true:false;
          right.product= res.product;
          right.eye= res.eye;
          right.sphere= res.sphere;
          right.cylinder= res.cylinder;
          right.axis= res.axis;
          right.prismAmount=res.prismAmount;
          right.lensNote= res.lensNote;
          right.lensPower= res.lensPower;
          model.right.push(right);

          let left :any ={};
          left.distance = res.sphere < 0 ? true:false;
          left.product= "-";
          left.eye= "-";
          left.sphere= "-";
          left.cylinder= "-";
          left.axis= "-";
          left.prismAmount="-";
          left.lensNote= "-";
          left.lensPower= "-";
          model.left.push(left)
        }
        this.lensDataList.push(model);
      }
      if(res.product === 'contact'){
        let model :any ={};
        model.left =[];
        model.right =[];
        
        if(res.eye === 'left'){
          let left :any ={};
          left.distance = res.lensPower < 0 ? true:false;
          left.product= res.product;
          left.eye= res.eye;
          left.sphere= res.sphere;
          left.cylinder= res.cylinder;
          left.axis= res.axis;
          left.prismAmount=res.prismAmount;
          left.lensNote= res.lensNote;
          left.lensPower= res.lensPower;
          
          model.left.push(left);

          let right :any ={};
          right.distance = res.lensPower < 0 ? true:false;
          right.product= "-";
          right.eye= "-";
          right.sphere= "-";
          right.cylinder= "-";
          right.axis= "-";
          right.prismAmount="-";
          right.lensNote= "-";
          right.lensPower= "-";
          model.right.push(right);
        }

        if(res.eye === 'right'){
          let right :any ={};
          right.distance = res.sphere < 0 ? true:false;
          right.product= res.product;
          right.eye= res.eye;
          right.sphere= res.sphere;
          right.cylinder= res.cylinder;
          right.axis= res.axis;
          right.prismAmount=res.prismAmount;
          right.lensNote= res.lensNote;
          right.lensPower= res.lensPower;
          model.right.push(right);

          let left :any ={};
          left.distance = res.sphere < 0 ? true:false;
          left.product= "-";
          left.eye= "-";
          left.sphere= "-";
          left.cylinder= "-";
          left.axis= "-";
          left.prismAmount="-";
          left.lensNote= "-";
          left.lensPower= "-";
          model.left.push(left)
        }
        this.contactDataList.push(model);
        }
    });
    console.log('contactDataList',this.contactDataList)
    console.log('lensDataList',this.lensDataList)
	
  }

}
