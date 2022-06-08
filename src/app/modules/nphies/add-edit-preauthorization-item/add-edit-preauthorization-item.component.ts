import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
    quantityCode: [''],
    unitPrice: ['', Validators.required],
    discountPercent: [''],
    discount: [''],
    factor: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
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
    invoiceNo: [''],
    IsTaxApplied: [false],
    searchQuery: ['']
  });

  isSubmitted = false;
  typeListSearchResult = [];
  SearchRequest;
  typeList = this.sharedDataService.itemTypeList;
  bodySiteList = [];
  subSiteList = [];
  IscareTeamSequenceRequired = false;

  IsSupportingInfoSequenceRequired = false;
  supportingInfoError = '';

  showQuantityCode = true;

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
        quantityCode: this.data.item.quantityCode,
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
        startDate: this.data.item.startDate,
        invoiceNo: this.data.item.invoiceNo
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
      if (this.data.beneficiaryPatientShare) {
        this.FormItem.controls.patientSharePercent.setValue(this.data.beneficiaryPatientShare);
      }
      if (this.data.documentId && this.data.documentId === 'NI') {
        this.FormItem.controls.IsTaxApplied.setValue(false);
      } else {
        this.FormItem.controls.IsTaxApplied.setValue(true);
      }

      if (this.data.subType === 'op') {
        this.FormItem.controls.quantityCode.setValue('{package}');
        this.FormItem.controls.quantityCode.disable();
      }
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

  selectItem(type) {
    if (type) {

      if (type.itemType && type.itemType === 'medication-codes') {
        this.FormItem.controls.quantityCode.setValidators([Validators.required]);
        this.FormItem.controls.quantityCode.updateValueAndValidity();
      } else {
        this.FormItem.controls.quantityCode.clearValidators();
        this.FormItem.controls.quantityCode.updateValueAndValidity();
        this.FormItem.controls.quantityCode.setValue('');
        this.FormItem.controls.quantityCode.disable();
        this.showQuantityCode = false;
      }

      this.FormItem.patchValue({
        type: this.typeList.filter(x => x.value === type.itemType)[0],
        nonStandardCode: type.nonStandardCode,
        display: type.nonStandardDescription,
        unitPrice: type.unitPrice,
        factor: type.factor,
      });
      this.SetSingleRecord(type);
      this.updateFactor();
      this.updateDiscountPercent();
      this.updateDiscount();
      this.updateTax();
      this.updateNet();
    }
  }
  SetSingleRecord(type = null) {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
      this.FormItem.controls.quantityCode.setValidators([Validators.required]);
      this.FormItem.controls.quantityCode.updateValueAndValidity();
    } else {
      this.FormItem.controls.quantityCode.clearValidators();
      this.FormItem.controls.quantityCode.updateValueAndValidity();
    }
    this.FormItem.controls.item.setValue('');
    this.itemList = [{ "code": type.code, "description": type.display }];

    if (type) {
      this.FormItem.patchValue({
        item: this.itemList.filter(x => x.code === type.code)[0]
      });
    }

    this.filteredItem.next(this.itemList.slice());

  }
  typeChange(type = null) {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
      this.FormItem.controls.quantityCode.setValidators([Validators.required]);
      this.FormItem.controls.quantityCode.updateValueAndValidity();
    } else {
      this.FormItem.controls.quantityCode.clearValidators();
      this.FormItem.controls.quantityCode.updateValueAndValidity();
      this.FormItem.controls.quantityCode.setValue('');
      this.FormItem.controls.quantityCode.disable();
      this.showQuantityCode = false;
    }
    this.FormItem.controls.item.setValue('');
    if (type) {
      this.getItemList(type);
    } else {
      this.getItemList();
    }
  }

  getItemList(type = null) {
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
          } else {
            if (type) {
              this.FormItem.patchValue({
                item: this.itemList.filter(x => x.code === type.code)[0]
              });
            }
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

  updateFactor() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.discountPercent.value && parseFloat(this.FormItem.controls.discountPercent.value) > 0 && parseFloat(this.FormItem.controls.discountPercent.value) < 100) {
      const factorValue: number = (1 - (parseFloat(this.FormItem.controls.discountPercent.value) / 100));
      this.FormItem.controls.factor.setValue(parseFloat(factorValue.toFixed(2)));
    } else {
      if (!this.FormItem.controls.factor.value) {
        this.FormItem.controls.factor.setValue(1);
      }
    }
  }

  updateDiscount() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.discountPercent.value) {
      // tslint:disable-next-line:max-line-length
      const discountValue = ((parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.discountPercent.value)) / 100;
      this.FormItem.controls.discount.setValue(parseFloat(discountValue.toFixed(2)));
    } else {
      this.FormItem.controls.discount.setValue(0);
    }
  }

  updateNet() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
      // tslint:disable-next-line:max-line-length
      const netValue = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

      // tslint:disable-next-line:max-line-length
      // const netValue = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value) + parseFloat(this.FormItem.controls.tax.value);
      this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
    } else {
      this.FormItem.controls.net.setValue('');
    }

    // tslint:disable-next-line:max-line-length
    // if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
    //   // tslint:disable-next-line:max-line-length
    //   // const netValue = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + parseFloat(this.FormItem.controls.tax.value);

    //   let discount = 0;

    //   if (this.FormItem.controls.discount.value) {
    //     discount = parseFloat(this.FormItem.controls.discount.value);
    //   }
    //   // tslint:disable-next-line:max-line-length
    //   const netValue = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - discount + parseFloat(this.FormItem.controls.tax.value);
    //   this.FormItem.controls.net.setValue(parseFloat(netValue.toFixed(2)));
    // } else {
    //   this.FormItem.controls.net.setValue('');
    // }
  }

  updatePatientShare() {
    if (this.FormItem.controls.IsTaxApplied.value) {
      if (this.FormItem.controls.net.value && this.FormItem.controls.patientSharePercent.value) {
        // tslint:disable-next-line:max-line-length
        const patientShareValue = (parseFloat(this.FormItem.controls.net.value) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
        this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
      } else {
        this.FormItem.controls.patientShare.setValue('');
      }
    } else {
      // tslint:disable-next-line:max-line-length
      if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && this.FormItem.controls.patientSharePercent.value) {
        // tslint:disable-next-line:max-line-length
        const grossAmount = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value));

        // tslint:disable-next-line:max-line-length
        const patientShareValue = (parseFloat(grossAmount.toFixed(2)) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
        this.FormItem.controls.patientShare.setValue(parseFloat(patientShareValue.toFixed(2)));
      } else {
        this.FormItem.controls.patientShare.setValue('');
      }
    }
  }

  updateTax() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.taxPercent.value) {

      let taxValue = 0;
      if (this.FormItem.controls.discount.value) {
        // tslint:disable-next-line:max-line-length
        taxValue = (((parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - parseFloat(this.FormItem.controls.discount.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
      } else {
        // tslint:disable-next-line:max-line-length
        taxValue = ((parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
      }
      this.FormItem.controls.tax.setValue(parseFloat(taxValue.toFixed(2)));
    } else {
      this.FormItem.controls.tax.setValue(0);
    }
  }

  updatePayerShare() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
      // tslint:disable-next-line:max-line-length
      const payerShareValue = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
      this.FormItem.controls.payerShare.setValue(parseFloat(payerShareValue.toFixed(2)));
    } else {
      this.FormItem.controls.payerShare.setValue('');
    }
  }

  updatePatientSharePercent() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
      // tslint:disable-next-line:max-line-length
      const patientSharePercentValue = (parseFloat(this.FormItem.controls.patientShare.value) * 100) / (parseFloat(this.FormItem.controls.net.value));
      this.FormItem.controls.patientSharePercent.setValue(parseFloat(patientSharePercentValue.toFixed(2)));
    } else {
      this.FormItem.controls.patientSharePercent.setValue('');
    }
  }

  updateTaxPercent() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.tax.value) {
      let discount = 0;
      if (this.FormItem.controls.discount.value) {
        discount = parseFloat(this.FormItem.controls.discount.value);
      }
      // tslint:disable-next-line:max-line-length
      const taxPerValue = (parseFloat(this.FormItem.controls.tax.value) * 100) / ((parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) - discount);
      this.FormItem.controls.taxPercent.setValue(parseFloat(taxPerValue.toFixed(2)));
    } else {
      this.FormItem.controls.taxPercent.setValue(0);
    }
  }

  updateDiscountPercent() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.factor.value && parseFloat(this.FormItem.controls.factor.value) >= 0 && parseFloat(this.FormItem.controls.factor.value) <= 1) {
      const discountPercentValue: number = (1 - parseFloat(this.FormItem.controls.factor.value)) * 100;

      this.FormItem.controls.discountPercent.setValue(parseFloat(discountPercentValue.toFixed(2)));
    } else {
      this.FormItem.controls.discountPercent.setValue(1);
    }
  }

  Calculate(value) {
    switch (value) {

      case 'Factor':

        this.updateFactor();
        this.updateDiscount();
        this.updateTax();
        this.updateNet();
        this.updatePatientShare();

        break;

      case 'Tax':

        this.updateTax();
        this.updateNet();
        this.updatePatientShare();
        this.updatePayerShare();

        break;

      case 'PatientShare':

        this.updatePatientShare();
        this.updatePayerShare();

        break;

      case 'PatientSharePercent':

        this.updatePatientSharePercent();
        this.updatePayerShare();

        break;

      case 'PatientShareFromPayerShare':

        this.updatePatientShare();
        this.updatePatientSharePercent();

        break;


      case 'TaxPercent':

        this.updateTaxPercent();
        this.updateNet();
        this.updatePatientShare();
        this.updatePayerShare();

        break;

      case 'Discount':

        this.updateDiscountPercent();
        this.updateDiscount();
        this.updateTax();
        this.updateNet();
        this.updatePatientShare();

        break;

      case 'DiscountPercent':

        this.updateDiscount();
        this.updateFactor();
        this.updateTax();
        this.updateNet();
        this.updatePatientShare();

        break;

      case 'Other':

        this.updateDiscount();
        this.updateTax();
        this.updateNet();
        this.updatePatientShare();
        this.updatePayerShare();

        break;
    }
  }

  changeTaxApplied() {
    this.updatePatientShare();
    this.updatePayerShare();
  }

  searchItems() {
    if (this.SearchRequest) {
      this.SearchRequest.unsubscribe();
    }
    const itemType = this.FormItem.controls.itemType == null ? null : this.FormItem.controls.itemType.value;
    const searchStr = this.FormItem.controls.searchQuery.value;
    const claimType = this.data.type;
    const RequestDate = this.data.dateOrdered;
    const payerNphiesId = this.data.payerNphiesId;

    // tslint:disable-next-line:max-line-length
    this.SearchRequest = this.providerNphiesSearchService.getItemList(this.sharedServices.providerId, itemType, searchStr, payerNphiesId, claimType, RequestDate, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        this.typeListSearchResult = body['content'];
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  checkItemsCodeForSupportingInfo() {
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.type.value.value === 'medication-codes') {

      if (this.data.supportingInfos.filter(x => x.category === 'days-supply').length === 0) {
        // tslint:disable-next-line:max-line-length
        // this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any medication-code is used', 'alert', true, 'OK');

        this.FormItem.controls.supportingInfoSequence.setValidators([Validators.required]);
        this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();

        this.IsSupportingInfoSequenceRequired = true;
        this.supportingInfoError = 'Days-Supply is required in Supporting Info if any medication-code is used';

        return false;
      } else {
        const seqNo = this.data.supportingInfos.filter(x => x.category === 'days-supply')[0].sequence;

        if (this.FormItem.controls.type.value.value === 'medication-codes') {
          // tslint:disable-next-line:max-line-length
          if (!this.FormItem.controls.supportingInfoSequence.value || (this.FormItem.controls.supportingInfoSequence.value && this.FormItem.controls.supportingInfoSequence.value.filter((x) => x.sequence === seqNo).length === 0)) {
            // tslint:disable-next-line:max-line-length
            // this.dialogService.showMessage('Error', 'Supporting Info with Days-Supply must be linked with Item of type medication-code', 'alert', true, 'OK');

            this.FormItem.controls.supportingInfoSequence.setValidators([Validators.required]);
            this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();

            this.IsSupportingInfoSequenceRequired = true;
            this.supportingInfoError = 'Supporting Info with Days-Supply must be linked with Item of type medication-code';
            return false;
          } else {
            this.IsSupportingInfoSequenceRequired = false;
            this.supportingInfoError = '';
            this.FormItem.controls.supportingInfoSequence.clearValidators();
            this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
            return true;
          }
        } else {
          this.IsSupportingInfoSequenceRequired = false;
          this.supportingInfoError = '';
          this.FormItem.controls.supportingInfoSequence.clearValidators();
          this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
          return true;
        }
      }

    } else {
      this.IsSupportingInfoSequenceRequired = false;
      this.supportingInfoError = '';
      this.FormItem.controls.supportingInfoSequence.clearValidators();
      this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
      return true;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.checkItemsCodeForSupportingInfo()) {
      return;
    }

    if (this.FormItem.valid) {

      const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

      if (!pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString())) {
        return;
      }

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
      model.quantity = parseFloat(this.FormItem.controls.quantity.value);
      model.quantityCode = this.FormItem.controls.quantityCode.value;
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

  get IsQuantityCodeRequired() {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
      return true;
    } else {
      return false;
    }
  }

  get IsInvalidQuantity() {
    const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;
    pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString());
    return !pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString());
  }

  selectTooth(number) {
    let val=this.bodySiteList.filter(x => x.value === number)[0];
    this.FormItem.controls.bodySite.setValue(val);
    //this.controllers[this.expandedInvoice].services[this.expandedService].toothNumber.setValue(number);
}
  closeDialog() {
    this.dialogRef.close();
  }

}
