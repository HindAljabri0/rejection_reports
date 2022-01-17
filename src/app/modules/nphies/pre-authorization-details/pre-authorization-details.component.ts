import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { SharedServices } from 'src/app/services/shared.services';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-pre-authorization-details',
  templateUrl: './pre-authorization-details.component.html',
  styles: []
})
export class PreAuthorizationDetailsComponent implements OnInit {

  @Input() data: any;
  currentSelectedItem = -1;
  paymentAmount = 0;

  constructor(
    private sharedDataService: SharedDataService,
    private sharedServices: SharedServices,
    private sanitizer: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit() {
    this.readNotification();
    this.setDescriptions();
  }

  readNotification() {
    if (this.data.notificationStatus === 'unread') {
      const notificationId: string = this.data.notificationId;
      if (this.data.communicationId) {
        this.sharedServices.unReadComunicationRequestCount = this.sharedServices.unReadComunicationRequestCount - 1;
      } else {
        this.sharedServices.unReadProcessedCount = this.sharedServices.unReadProcessedCount - 1;
      }
      if (notificationId) {
        this.sharedServices.markAsRead(notificationId, this.sharedServices.providerId);
      }
    }
  }

  toggleItem(index) {
    if (this.currentSelectedItem === index) {
      this.currentSelectedItem = -1;
    } else {
      this.currentSelectedItem = index;
    }
  }

  setDescriptions() {

    if (this.data.accident && this.data.accident.date) {
      this.data.accident.date = moment(this.data.accident.date).format('DD-MM-YYYY');
    }

    if (this.data && this.data.preAuthorizationInfo.dateOrdered) {
      this.data.preAuthorizationInfo.dateOrdered = moment(this.data.preAuthorizationInfo.dateOrdered).format('DD-MM-YYYY');
    }

    if (this.data.visionPrescription && this.data.visionPrescription.dateWritten) {
      this.data.visionPrescription.dateWritten = moment(this.data.visionPrescription.dateWritten).format('DD-MM-YYYY');
    }



    this.data.preAuthorizationInfo.typeName = this.sharedDataService.claimTypeList.filter(
      x => x.value === this.data.preAuthorizationInfo.type)[0]
      ? this.sharedDataService.claimTypeList.filter(x => x.value === this.data.preAuthorizationInfo.type)[0].name
      : '';

    this.data.preAuthorizationInfo.subTypeName = this.sharedDataService.subTypeList.filter(
      x => x.value === this.data.preAuthorizationInfo.subType)[0]
      ? this.sharedDataService.subTypeList.filter(x => x.value === this.data.preAuthorizationInfo.subType)[0].name
      : '';

    if (this.data.accident) {
      this.data.accident.accidentTypeName = this.sharedDataService.accidentTypeList.filter(
        x => x.value === this.data.accident.accidentType)[0]
        ? this.sharedDataService.accidentTypeList.filter(x => x.value === this.data.accident.accidentType)[0].name
        : '';
    }

    if (this.data.careTeam && this.data.careTeam.length > 0) {
      this.data.careTeam.forEach(i => {
        i.practitionerRoleName = this.sharedDataService.practitionerRoleList.filter(x => x.value === i.practitionerRole)[0]
          ? this.sharedDataService.practitionerRoleList.filter(x => x.value === i.practitionerRole)[0].name
          : '';
        i.careTeamRoleName = this.sharedDataService.careTeamRoleList.filter(x => x.value === i.careTeamRole)[0]
          ? this.sharedDataService.careTeamRoleList.filter(x => x.value === i.careTeamRole)[0].name
          : '';
      });
    }

    if (this.data.diagnosis && this.data.diagnosis.length > 0) {
      this.data.diagnosis.forEach(i => {
        i.typeName = this.sharedDataService.diagnosisTypeList.filter(x => x.value === i.type)[0]
          ? this.sharedDataService.diagnosisTypeList.filter(x => x.value === i.type)[0].name
          : '';
        i.onAdmissionName = this.sharedDataService.onAdmissionList.filter(x => x.value === i.onAdmission)[0]
          ? this.sharedDataService.onAdmissionList.filter(x => x.value === i.onAdmission)[0].name
          : '';
      });
    }

    if (this.data.visionPrescription && this.data.visionPrescription.prescriber) {
      // tslint:disable-next-line:max-line-length
      this.data.visionPrescription.prescriberName = this.data.careTeam.filter(x => x.sequence === this.data.visionPrescription.prescriber)[0] ? this.data.careTeam.filter(x => x.sequence === this.data.visionPrescription.prescriber)[0].practitionerName : '';
    }

    if (this.data.visionPrescription && this.data.visionPrescription.lensSpecifications
      && this.data.visionPrescription.lensSpecifications.length > 0) {
      this.data.visionPrescription.lensSpecifications.forEach(i => {
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

    if (this.data.supportingInfo && this.data.supportingInfo.length > 0) {
      this.data.supportingInfo.forEach(i => {
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

    if (this.data && this.data.items) {
      this.data.items.forEach(x => {

        // tslint:disable-next-line:max-line-length
        x.bodySiteName = this.sharedDataService.getBodySite(this.data.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0] ? this.sharedDataService.getBodySite(this.data.preAuthorizationInfo.type).filter(y => y.value === x.bodySite)[0].name : '';
        // tslint:disable-next-line:max-line-length
        x.subSiteName = this.sharedDataService.getSubSite(this.data.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0] ? this.sharedDataService.getSubSite(this.data.preAuthorizationInfo.type).filter(y => y.value === x.subSite)[0].name : '';

        if (x.itemDetails && x.itemDetails.length > 0) {
          x.itemDetails.forEach(y => {
            y.typeName = this.sharedDataService.claimTypeList.filter(
              z => z.value === y.type)[0]
              ? this.sharedDataService.claimTypeList.filter(z => z.value === y.type)[0].name
              : '';
          });
        }

        // tslint:disable-next-line:max-line-length
        x.typeName = this.sharedDataService.itemTypeList.filter(i => i.value === x.type)[0] ? this.sharedDataService.itemTypeList.filter(i => i.value === x.type)[0].name : '';
        this.paymentAmount += x.net;
        x.startDate = moment(moment(x.startDate, 'YYYY-MM-DD')).format('DD-MM-YYYY');

        // x.supportingInfoSequence = x.supportingInfoSequence ? x.supportingInfoSequence.toString() : '-';
        // x.careTeamSequence = x.careTeamSequence ? x.careTeamSequence.toString() : '';
        // x.diagnosisSequence = x.diagnosisSequence ? x.diagnosisSequence.toString() : '';

        if (x.supportingInfoSequence) {
          x.supportingInfoNames = '';
          x.supportingInfoSequence.forEach(s => {
            x.supportingInfoNames += ', [' + this.data.supportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
          });
          x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
        }

        if (x.careTeamSequence) {
          x.careTeamNames = '';
          x.careTeamSequence.forEach(s => {
            x.careTeamNames += ', [' + this.data.careTeam.filter(y => y.sequence === s)[0].practitionerName + ']';
          });
          x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
        }

        if (x.diagnosisSequence) {
          x.diagnosisNames = '';
          x.diagnosisSequence.forEach(s => {
            x.diagnosisNames += ', [' + this.data.diagnosis.filter(y => y.sequence === s)[0].diagnosisCode + ']';
          });
          x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
        }

        if (this.data.approvalResponseId) {
          x.isPackage = x.isPackage === true ? 1 : 2;
        }

      });
    }
  }

  getImageOfBlob(attachmentName, attachment) {
    const fileExt = attachmentName.split('.').pop();
    if (fileExt.toLowerCase() === 'pdf') {
      const objectURL = `data:application/pdf;base64,` + attachment;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      const objectURL = `data:image/${fileExt};base64,` + attachment;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  get period() {
    if (this.data.period) {
      return this.data.period.replace('P', '').replace('D', ' Days').replace('M', ' Months').replace('Y', ' Years');
    } else {
      return this.data.period;
    }
  }

  viewAttachment(e, item) {
    e.preventDefault();
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: {
        filename: item.attachmentName, attachment: item.attachment
      }, panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

}
