import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-reuse-approval-modal',
  templateUrl: './reuse-approval-modal.component.html',
  styleUrls: ['./reuse-approval-modal.component.css']
})
export class ReuseApprovalModalComponent implements OnInit {

  IsDescriptionLoaded = false;

  constructor(
    private dialogRef: MatDialogRef<ReuseApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sharedDataService: SharedDataService,
  ) { }

  ngOnInit() {
    this.setDescriptions();
  }

  setDescriptions() {

    if (this.data.preAuthDetails) {
      this.data.preAuthDetails = this.data.preAuthDetails.join(',');
    }

    if (this.data.detailsModel.accident && this.data.detailsModel.accident.date) {
      this.data.detailsModel.accident.date = moment(this.data.detailsModel.accident.date).format('DD-MM-YYYY');
    }

    if (this.data.detailsModel && this.data.detailsModel.preAuthorizationInfo.dateOrdered) {
      // tslint:disable-next-line:max-line-length
      this.data.detailsModel.preAuthorizationInfo.dateOrdered = moment(this.data.detailsModel.preAuthorizationInfo.dateOrdered).format('DD-MM-YYYY');
    }

    if (this.data.detailsModel.visionPrescription && this.data.detailsModel.visionPrescription.dateWritten) {
      // tslint:disable-next-line:max-line-length
      this.data.detailsModel.visionPrescription.dateWritten = moment(this.data.detailsModel.visionPrescription.dateWritten).format('DD-MM-YYYY');
    }

    this.data.detailsModel.preAuthorizationInfo.typeName = this.sharedDataService.claimTypeList.filter(
      x => x.value === this.data.detailsModel.preAuthorizationInfo.type)[0]
      ? this.sharedDataService.claimTypeList.filter(x => x.value === this.data.detailsModel.preAuthorizationInfo.type)[0].name
      : '';

    this.data.detailsModel.preAuthorizationInfo.subTypeName = this.sharedDataService.subTypeList.filter(
      x => x.value === this.data.detailsModel.preAuthorizationInfo.subType)[0]
      ? this.sharedDataService.subTypeList.filter(x => x.value === this.data.detailsModel.preAuthorizationInfo.subType)[0].name
      : '';

    if (this.data.detailsModel.accident) {
      this.data.detailsModel.accident.accidentTypeName = this.sharedDataService.accidentTypeList.filter(
        x => x.value === this.data.detailsModel.accident.accidentType)[0]
        ? this.sharedDataService.accidentTypeList.filter(x => x.value === this.data.detailsModel.accident.accidentType)[0].name
        : '';
    }

    if (this.data.detailsModel.careTeam && this.data.detailsModel.careTeam.length > 0) {
      this.data.detailsModel.careTeam.forEach(i => {
        i.practitionerRoleName = this.sharedDataService.practitionerRoleList.filter(x => x.value === i.practitionerRole)[0]
          ? this.sharedDataService.practitionerRoleList.filter(x => x.value === i.practitionerRole)[0].name
          : '';
        i.careTeamRoleName = this.sharedDataService.careTeamRoleList.filter(x => x.value === i.careTeamRole)[0]
          ? this.sharedDataService.careTeamRoleList.filter(x => x.value === i.careTeamRole)[0].name
          : '';
      });
    }

    if (this.data.detailsModel.diagnosis && this.data.detailsModel.diagnosis.length > 0) {
      this.data.detailsModel.diagnosis.forEach(i => {
        i.typeName = this.sharedDataService.diagnosisTypeList.filter(x => x.value === i.type)[0]
          ? this.sharedDataService.diagnosisTypeList.filter(x => x.value === i.type)[0].name
          : '';
        i.onAdmissionName = this.sharedDataService.onAdmissionList.filter(x => x.value === i.onAdmission)[0]
          ? this.sharedDataService.onAdmissionList.filter(x => x.value === i.onAdmission)[0].name
          : '';
      });
    }

    if (this.data.detailsModel.visionPrescription && this.data.detailsModel.visionPrescription.prescriber) {
      // tslint:disable-next-line:max-line-length
      this.data.detailsModel.visionPrescription.prescriberName = this.data.detailsModel.careTeam.filter(x => x.sequence === this.data.detailsModel.visionPrescription.prescriber)[0] ? this.data.detailsModel.careTeam.filter(x => x.sequence === this.data.detailsModel.visionPrescription.prescriber)[0].practitionerName : '';
    }

    if (this.data.detailsModel.visionPrescription && this.data.detailsModel.visionPrescription.lensSpecifications
      && this.data.detailsModel.visionPrescription.lensSpecifications.length > 0) {
      this.data.detailsModel.visionPrescription.lensSpecifications.forEach(i => {
        i.productName = this.sharedDataService.productList.filter(x => x.value === i.product)[0]
          ? this.sharedDataService.productList.filter(x => x.value === i.product)[0].name
          : '';
        i.lensDurationUnitName = this.sharedDataService.durationUnitList.filter(x => x.value === i.lensDurationUnit)[0]
          ? this.sharedDataService.durationUnitList.filter(x => x.value === i.lensDurationUnit)[0].name
          : '';
        i.prismBaseName = this.sharedDataService.baseList.filter(x => x.value === i.prismBase)[0]
          ? this.sharedDataService.baseList.filter(x => x.value === i.prismBase)[0].name
          : '';
      });
    }

    if (this.data.detailsModel.supportingInfo && this.data.detailsModel.supportingInfo.length > 0) {
      this.data.detailsModel.supportingInfo.forEach(i => {
        i.categoryName = this.sharedDataService.categoryList.filter(x => x.value === i.category)[0]
          ? this.sharedDataService.categoryList.filter(x => x.value === i.category)[0].name
          : '';
        i.reasonName = this.sharedDataService.reasonList.filter(x => x.value === i.reason)[0]
          ? this.sharedDataService.reasonList.filter(x => x.value === i.reason)[0].name
          : '';

        const codeList = this.sharedDataService.getCodeName(i.category);

        // tslint:disable-next-line:max-line-length
        if ((i.category === 'missingtooth' || i.category === 'reason-for-visit' || i.category === 'chief-complaint' || i.category === 'onset') && codeList) {
          if (i.category === 'chief-complaint' || i.category === 'onset') {
            // tslint:disable-next-line:max-line-length
            i.codeName = codeList.filter(y => y.diagnosisCode === i.code)[0] ? codeList.filter(y => y.diagnosisCode === i.code)[0].diagnosisDescription : '';
          } else {
            i.codeName = codeList.filter(y => y.value === i.code)[0] ? codeList.filter(y => y.value === i.code)[0].name : '';
          }
        }

        if (i.fromDate) {
          i.fromDateStr = moment(i.fromDate).format('DD-MM-YYYY');
        }
        if (i.toDate) {
          i.toDateStr = moment(i.toDate).format('DD-MM-YYYY');
        }

        i.unit = this.sharedDataService.durationUnitList.filter(y => y.value === i.unit)[0];
        i.byteArray = i.attachment;
        // i.file = this.getImageOfBlob();
      });
    }

    if (this.data.detailsModel && this.data.detailsModel.items) {
      this.data.detailsModel.items.forEach(x => {

        // tslint:disable-next-line:max-line-length
        x.bodySiteName = this.sharedDataService.getBodySite(this.data.detailsModel.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0] ? this.sharedDataService.getBodySite(this.data.detailsModel.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0].name : '';
        // tslint:disable-next-line:max-line-length
        x.subSiteName = this.sharedDataService.getSubSite(this.data.detailsModel.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0] ? this.sharedDataService.getSubSite(this.data.detailsModel.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0].name : '';

        if (x.itemDetails && x.itemDetails.length > 0) {
          x.itemDetails.forEach(y => {
            // tslint:disable-next-line:max-line-length
            y.typeName = this.sharedDataService.itemTypeList.filter(z => z.value === y.type)[0] ? this.sharedDataService.itemTypeList.filter(z => z.value === y.type)[0].name : '';
            y.itemCode = y.code;
            y.itemDescription = y.description;
            y.display = y.nonStandardDesc;
          });
        }

        // tslint:disable-next-line:max-line-length
        x.typeName = this.sharedDataService.itemTypeList.filter(i => i.value === x.type)[0] ? this.sharedDataService.itemTypeList.filter(i => i.value === x.type)[0].name : '';
        x.startDate = moment(x.startDate).format('YYYY-MM-DD');


        // x.supportingInfoSequence = x.supportingInfoSequence ? x.supportingInfoSequence.toString() : '-';
        // x.careTeamSequence = x.careTeamSequence ? x.careTeamSequence.toString() : '';
        // x.diagnosisSequence = x.diagnosisSequence ? x.diagnosisSequence.toString() : '';

        if (x.supportingInfoSequence) {
          x.supportingInfoNames = '';
          x.supportingInfoSequence.forEach(s => {
            x.supportingInfoNames += ', [' + this.data.detailsModel.supportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
          });
          x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
        }

        if (x.careTeamSequence) {
          x.careTeamNames = '';
          x.careTeamSequence.forEach(s => {
            x.careTeamNames += ', [' + this.data.detailsModel.careTeam.filter(y => y.sequence === s)[0].practitionerName + ']';
          });
          x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
        }

        if (x.diagnosisSequence) {
          x.diagnosisNames = '';
          x.diagnosisSequence.forEach(s => {
            x.diagnosisNames += ', [' + this.data.detailsModel.diagnosis.filter(y => y.sequence === s)[0].diagnosisCode + ']';
          });
          x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
        }

        // if (this.data.detailsModel.approvalResponseId) {
        //   x.isPackage = x.isPackage === true ? 1 : 2;
        // }

      });
    }

    this.IsDescriptionLoaded = true;
  }

  closeDialog($event = null) {
    if ($event && $event.IsReuse) {
      this.dialogRef.close($event);
    } else {
      this.dialogRef.close(true);
    }
  }
}
