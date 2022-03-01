import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ReplaySubject, Subject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { X } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-add-edit-preauthorization-item',
  templateUrl: './add-edit-preauthorization-item.component.html',
  styles: []
})
export class AddEditPreauthorizationItemComponent implements OnInit {

  @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
  itemList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredSupportingInfo: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredCareTeam: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  IsItemLoading = false;

  onDestroy = new Subject<void>();

  FormItem: FormGroup = this.formBuilder.group({
    type: ['', Validators.required],
    item: ['', Validators.required],
    itemFilter: [''],
    // itemCode: ['', Validators.required],
    // itemDescription: ['', Validators.required],
    nonStandardCode: [''],
    display: [''],
    isPackage: [false],
    bodySite: [''],
    subSite: [''],
    quantity: ['', Validators.required],
    unitPrice: ['', Validators.required],
    discountPercent: [''],
    discount: [''],
    factor: ['', Validators.required],
    taxPercent: [''],
    patientSharePercent: [''],
    tax: [''],
    net: [''],
    patientShare: [''],
    payerShare: [''],
    startDate: ['', Validators.required],
    supportingInfoSequence: [''],
    supportingInfoFilter: [''],
    careTeamSequence: [''],
    careTeamFilter: [''],
    diagnosisSequence: [''],
    diagnosisFilter: [''],
    invoiceNo: ['']
  });

  isSubmitted = false;

  typeList = this.sharedDataService.itemTypeList;
  bodySiteList = [];
  subSiteList = [];
  IscareTeamSequenceRequired = false;

  today: Date;
  constructor(
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<AddEditPreauthorizationItemComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
    private sharedServices: SharedServices, private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.today = new Date();
  }

  ngOnInit() {

    if (this.data.source === 'APPROVAL') {
      this.FormItem.controls.invoiceNo.clearValidators();
      this.FormItem.controls.invoiceNo.updateValueAndValidity();
      this.FormItem.controls.invoiceNo.setValue('');
    } else if (this.data.source === 'CLAIM') {
      this.FormItem.controls.invoiceNo.setValidators(Validators.required);
      this.FormItem.controls.invoiceNo.updateValueAndValidity();
      this.FormItem.controls.invoiceNo.setValue('');
    }

    if (this.data.type) {
      this.setTypes(this.data.type);
      this.bodySiteList = this.sharedDataService.getBodySite(this.data.type);
      this.subSiteList = this.sharedDataService.getSubSite(this.data.type);
    }

    if (this.data.item && this.data.item.itemCode) {
      this.FormItem.patchValue({
        type: this.typeList.filter(x => x.value === this.data.item.type)[0],
        nonStandardCode: this.data.item.nonStandardCode,
        display: this.data.item.display,
        isPackage: this.data.item.isPackage,
        bodySite: this.bodySiteList.filter(x => x.value === this.data.item.bodySite)[0],
        subSite: this.subSiteList.filter(x => x.value === this.data.item.subSite)[0],
        quantity: this.data.item.quantity,
        unitPrice: this.data.item.unitPrice,
        discount: this.data.item.discount,
        discountPercent: this.data.item.discountPercent,
        // (this.data.item.discount * 100) / (this.data.item.quantity * this.data.item.unitPrice)
        // dp = d * 100 / (qty * up)
        factor: this.data.item.factor ? this.data.item.factor : 1,
        taxPercent: this.data.item.taxPercent,
        patientSharePercent: this.data.item.patientSharePercent,
        tax: this.data.item.tax,
        net: this.data.item.net,
        patientShare: this.data.item.patientShare,
        payerShare: this.data.item.payerShare,
        startDate: this.data.item.startDate
      });

      if (this.data.careTeams) {
        this.FormItem.patchValue({
          // tslint:disable-next-line:max-line-length
          careTeamSequence: this.data.item.careTeamSequence ? this.data.careTeams.filter(x => this.data.item.careTeamSequence.find(y => y === x.sequence) !== undefined) : []
        });
      }

      if (this.data.diagnosises) {
        this.FormItem.patchValue({
          // tslint:disable-next-line:max-line-length
          diagnosisSequence: this.data.item.diagnosisSequence ? this.data.diagnosises.filter(x => this.data.item.diagnosisSequence.find(y => y === x.sequence) !== undefined) : []
        });
      }

      if (this.data.supportingInfos) {
        this.FormItem.patchValue({
          // tslint:disable-next-line:max-line-length
          supportingInfoSequence: this.data.item.supportingInfoSequence ? this.data.supportingInfos.filter(x => this.data.item.supportingInfoSequence.find(y => y === x.sequence) !== undefined) : []
        });
      }

      this.getItemList();
    } else {
      this.FormItem.controls.factor.setValue(1);
    }



    if (this.data.supportingInfos) {
      this.filteredSupportingInfo.next(this.data.supportingInfos.slice());
      this.FormItem.controls.supportingInfoFilter.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterSupportingInfo();
        });
    }

    if (this.data.careTeams) {
      this.filteredCareTeam.next(this.data.careTeams.slice());
      this.FormItem.controls.careTeamFilter.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterCareTeam();
        });
    }

    if (this.data.diagnosises) {
      this.filteredDiagnosis.next(this.data.diagnosises.slice());
      this.FormItem.controls.diagnosisFilter.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterDiagnosis();
        });
    }

  }

  setTypes(type) {

    switch (type) {
      case 'vision':
        this.typeList = [
          { value: 'medical-devices', name: 'Medical Devices' },
          { value: 'procedures', name: 'Procedures' },
          { value: 'services', name: 'Services' }
        ];
        this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
        this.FormItem.controls.careTeamSequence.updateValueAndValidity();
        this.IscareTeamSequenceRequired = true;
        break;
      case 'professional':
        this.typeList = [
          { value: 'medical-devices', name: 'Medical Devices' },
          { value: 'medication-codes', name: 'Medication Codes' },
          { value: 'transportation-srca', name: 'Transportation SRCA' },
          { value: 'imaging', name: 'Imaging' },
          { value: 'procedures', name: 'Procedures' },
          { value: 'services', name: 'Services' },
          { value: 'laboratory', name: 'Laboratory' }
        ];
        this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
        this.FormItem.controls.careTeamSequence.updateValueAndValidity();
        this.IscareTeamSequenceRequired = true;
        break;
      case 'oral':
        this.typeList = [
          { value: 'medical-devices', name: 'Medical Devices' },
          { value: 'medication-codes', name: 'Medication Codes' },
          { value: 'transportation-srca', name: 'Transportation SRCA' },
          { value: 'imaging', name: 'Imaging' },
          { value: 'services', name: 'Services' },
          { value: 'laboratory', name: 'Laboratory' },
          { value: 'oral-health-op', name: 'Oral Health OP' },
          { value: 'oral-health-ip', name: 'Oral Health IP' }
        ];
        this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
        this.FormItem.controls.careTeamSequence.updateValueAndValidity();
        this.IscareTeamSequenceRequired = true;
        break;
      case 'institutional':
        this.typeList = [
          { value: 'medical-devices', name: 'Medical Devices' },
          { value: 'medication-codes', name: 'Medication Codes' },
          { value: 'transportation-srca', name: 'Transportation SRCA' },
          { value: 'imaging', name: 'Imaging' },
          { value: 'procedures', name: 'Procedures' },
          { value: 'services', name: 'Services' },
          { value: 'laboratory', name: 'Laboratory' },
          { value: 'oral-health-ip', name: 'Oral Health IP' }
        ];
        this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
        this.FormItem.controls.careTeamSequence.updateValueAndValidity();
        this.IscareTeamSequenceRequired = true;
        break;
      case 'pharmacy':
        this.typeList = [
          { value: 'medical-devices', name: 'Medical Devices' },
          { value: 'medication-codes', name: 'Medication Codes' }
        ];
        this.FormItem.controls.careTeamSequence.clearValidators();
        this.FormItem.controls.careTeamSequence.updateValueAndValidity();
        this.IscareTeamSequenceRequired = false;
        break;
    }
  }

  typeChange() {
    this.FormItem.controls.item.setValue('');
    this.getItemList();
  }

  getItemList() {
    if (this.FormItem.controls.type.value) {
      this.sharedServices.loadingChanged.next(true);
      this.IsItemLoading = true;
      this.FormItem.controls.item.disable();
      // tslint:disable-next-line:max-line-length
      this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormItem.controls.type.value.value).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.itemList = event.body;
          if (this.data.item && this.data.item.itemCode) {
            this.FormItem.patchValue({
              item: this.itemList.filter(x => x.code === this.data.item.itemCode)[0]
            });
          }
          this.filteredItem.next(this.itemList.slice());
          this.IsItemLoading = false;
          this.FormItem.controls.item.enable();
          this.FormItem.controls.itemFilter.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.filterItem();
            });
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
        }
      });
    }
  }

  filterItem() {
    if (!this.itemList) {
      return;
    }
    // get the search keyword
    let search = this.FormItem.controls.itemFilter.value;
    if (!search) {
      this.filteredItem.next(this.itemList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredItem.next(
      this.itemList.filter(item => item.description.toLowerCase().indexOf(search) > -1 || item.code.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  filterSupportingInfo() {
    if (!this.data.supportingInfos) {
      return;
    }
    // get the search keyword
    let search = this.FormItem.controls.careTeamFilter.value;
    if (!search) {
      this.filteredSupportingInfo.next(this.data.supportingInfos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredSupportingInfo.next(
      this.data.supportingInfos.filter(item => item.categoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  filterCareTeam() {
    if (!this.data.careTeams) {
      return;
    }
    // get the search keyword
    let search = this.FormItem.controls.careTeamFilter.value;
    if (!search) {
      this.filteredCareTeam.next(this.data.careTeams.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredCareTeam.next(
      this.data.careTeams.filter(item => item.practitionerName.toLowerCase().indexOf(search) > -1)
    );
  }

  filterDiagnosis() {
    if (!this.data.careTeams) {
      return;
    }
    // get the search keyword
    let search = this.FormItem.controls.diagnosisFilter.value;
    if (!search) {
      this.filteredDiagnosis.next(this.data.diagnosises.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredDiagnosis.next(
      this.data.diagnosises.filter(item => item.diagnosisDescription.toLowerCase().indexOf(search) > -1)
    );
  }

  Calculate(value) {
    switch (value) {
      case 'Factor':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.discountPercent.value && parseFloat(this.FormItem.controls.discountPercent.value) > 0 && parseFloat(this.FormItem.controls.discountPercent.value) < 100) {
          const factorValue: number = (1 - (parseFloat(this.FormItem.controls.discountPercent.value) / 100));
          this.FormItem.controls.factor.setValue(parseFloat(factorValue.toFixed(2)));
        } else {
          this.FormItem.controls.factor.setValue(1);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.discountPercent.value) {
          // tslint:disable-next-line:max-line-length
          const discountValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.discountPercent.value)) / 100;
          this.FormItem.controls.discount.setValue(parseFloat(discountValue.toFixed(2)));
        } else {
          this.FormItem.controls.discount.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

          // tslint:disable-next-line:max-line-length
          // const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
          this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
        } else {
          this.FormItem.controls.net.setValue('');
        }

        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        break;
      case 'Tax':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.taxPercent.value) {
          // tslint:disable-next-line:max-line-length
          const taxValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
          this.FormItem.controls.tax.setValue(parseFloat(taxValue.toFixed(2)));
        } else {
          this.FormItem.controls.tax.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

          // tslint:disable-next-line:max-line-length
          // const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
          this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
        } else {
          this.FormItem.controls.net.setValue('');
        }

        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
          this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.payerShare.setValue('');
        }

        break;
      case 'PatientShare':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
          this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.payerShare.setValue('');
        }

        break;
      case 'PatientSharePercent':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const patientSharePercentValue = (parseFloat(this.FormItem.controls.patientShare.value) * 100) / (parseFloat(this.FormItem.controls.net.value));
          this.FormItem.controls.patientSharePercent.setValue(parseFloat(patientSharePercentValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientSharePercent.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
          this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.payerShare.setValue('');
        }

        break;

      case 'PatientShareFromPayerShare':

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.payerShare.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.payerShare.value);
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const patientSharePercentValue = (parseFloat(this.FormItem.controls.patientShare.value) * 100) / (parseFloat(this.FormItem.controls.net.value));
          this.FormItem.controls.patientSharePercent.setValue(parseFloat(patientSharePercentValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientSharePercent.setValue('');
        }

        break;


      case 'TaxPercent':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.tax.value) {
          // tslint:disable-next-line:max-line-length
          const taxPerValue = (parseFloat(this.FormItem.controls.tax.value) * 100) / (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value));
          this.FormItem.controls.taxPercent.setValue(parseFloat(taxPerValue.toFixed(2)));
        } else {
          this.FormItem.controls.taxPercent.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

          // tslint:disable-next-line:max-line-length
          // const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
          this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
        } else {
          this.FormItem.controls.net.setValue('');
        }

        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
          this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.payerShare.setValue('');
        }
        break;

      case 'DiscountPercent':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.discount.value) {
          // tslint:disable-next-line:max-line-length
          const discountPerValue = (parseFloat(this.FormItem.controls.discount.value) * 100) / (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value));
          this.FormItem.controls.discountPercent.setValue(parseFloat(discountPerValue.toFixed(2)));
        } else {
          this.FormItem.controls.discount.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.discountPercent.value && parseFloat(this.FormItem.controls.discountPercent.value) > 0 && parseFloat(this.FormItem.controls.discountPercent.value) < 100) {
          const factorValue: number = (1 - (parseFloat(this.FormItem.controls.discountPercent.value) / 100));
          this.FormItem.controls.factor.setValue(parseFloat(factorValue.toFixed(2)));
        } else {
          this.FormItem.controls.factor.setValue(1);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

          // tslint:disable-next-line:max-line-length
          // const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
          this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
        } else {
          this.FormItem.controls.net.setValue('');
        }

        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        break;
      case 'Other':

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.discountPercent.value) {
          // tslint:disable-next-line:max-line-length
          const discountValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.discountPercent.value)) / 100;
          this.FormItem.controls.discount.setValue(parseFloat(discountValue.toFixed(2)));
        } else {
          this.FormItem.controls.discount.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.taxPercent.value) {
          // tslint:disable-next-line:max-line-length
          const taxValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
          this.FormItem.controls.tax.setValue(parseFloat(taxValue.toFixed(2)));
        } else {
          this.FormItem.controls.tax.setValue(0);
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

          // tslint:disable-next-line:max-line-length
          // const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
          this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
        } else {
          this.FormItem.controls.net.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
          // tslint:disable-next-line:max-line-length
          const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
          this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
        } else {
          this.FormItem.controls.payerShare.setValue('');
        }

        break;
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.FormItem.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.type = this.FormItem.controls.type.value.value;
      model.typeName = this.FormItem.controls.type.value.name;
      model.itemCode = this.FormItem.controls.item.value.code;
      model.itemDescription = this.FormItem.controls.item.value.description;
      model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
      model.display = this.FormItem.controls.display.value;
      model.isPackage = this.FormItem.controls.isPackage.value;

      model.bodySite = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.value : '';
      model.bodySiteName = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.name : '';

      model.subSite = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.value : '';
      model.subSiteName = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.name : '';
      // tslint:disable-next-line:radix
      model.quantity = parseInt(this.FormItem.controls.quantity.value);
      model.unitPrice = parseFloat(this.FormItem.controls.unitPrice.value);
      model.discount = this.FormItem.controls.discount.value ? parseFloat(this.FormItem.controls.discount.value) : 0;
      model.discountPercent = this.FormItem.controls.discountPercent.value ? parseFloat(this.FormItem.controls.discountPercent.value) : 0;
      model.factor = this.FormItem.controls.factor.value;
      model.taxPercent = this.FormItem.controls.taxPercent.value ? parseFloat(this.FormItem.controls.taxPercent.value) : 0;
      // tslint:disable-next-line:max-line-length
      model.patientSharePercent = this.FormItem.controls.patientSharePercent.value ? parseFloat(this.FormItem.controls.patientSharePercent.value) : 0;
      model.tax = this.FormItem.controls.tax.value;
      model.net = this.FormItem.controls.net.value;
      model.patientShare = this.FormItem.controls.patientShare.value ? parseFloat(this.FormItem.controls.patientShare.value) : 0;
      model.payerShare = this.FormItem.controls.payerShare.value ? parseFloat(this.FormItem.controls.payerShare.value) : 0;
      model.startDate = this.datePipe.transform(this.FormItem.controls.startDate.value, 'yyyy-MM-dd');
      model.startDateStr = this.datePipe.transform(this.FormItem.controls.startDate.value, 'dd-MM-yyyy');

      if (this.FormItem.controls.supportingInfoSequence.value && this.FormItem.controls.supportingInfoSequence.value.length > 0) {
        model.supportingInfoSequence = this.FormItem.controls.supportingInfoSequence.value.map((x) => { return x.sequence });
      }

      if (this.FormItem.controls.careTeamSequence.value && this.FormItem.controls.careTeamSequence.value.length > 0) {
        model.careTeamSequence = this.FormItem.controls.careTeamSequence.value.map((x) => { return x.sequence });
      }

      if (this.FormItem.controls.diagnosisSequence.value && this.FormItem.controls.diagnosisSequence.value.length > 0) {
        model.diagnosisSequence = this.FormItem.controls.diagnosisSequence.value.map((x) => { return x.sequence });
      }

      if (this.data.source === 'CLAIM') {
        model.invoiceNo = this.FormItem.controls.invoiceNo.value;
      }


      model.itemDetails = [];

      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
