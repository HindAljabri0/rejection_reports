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
    isPackage: ['', Validators.required],
    quantity: [''],
    unitPrice: ['', Validators.required],
    discount: ['', Validators.required],
    factor: ['', Validators.required],
    taxPercent: ['', Validators.required],
    patientSharePercent: ['', Validators.required],
    tax: [''],
    net: [''],
    patientShare: [''],
    payerShare: [''],
    startDate: ['', Validators.required],
    supportingInfoSequence: [''],
    supportingFilter: [''],
    careTeamSequence: ['', Validators.required],
    careTeamFilter: [''],
    diagnosisSequence: [''],
    diagnosisFilter: ['']
  });

  isSubmitted = false;

  typeList = [
    { value: 'medicalDevices', name: 'Medical Devices' },
    { value: 'medicationCode', name: 'MedicationCodes' },
    { value: 'transporationService', name: 'Transportation Srca' },
    { value: 'imagingService', name: 'Imaging' },
    { value: 'procedures', name: 'Procedures' },
    { value: 'services', name: 'Services' },
    { value: 'laboratory', name: 'Laboratory' },
    { value: 'oralHealth', name: 'Oral Health Op' },
  ];

  constructor(
    private dialogRef: MatDialogRef<AddEditPreauthorizationItemComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
    private sharedServices: SharedServices, private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService) { }

  ngOnInit() {
    if (this.data.item && this.data.item.itemCode) {
      this.FormItem.patchValue({
        type: this.typeList.filter(x => x.value === this.data.item.type)[0],
        nonStandardCode: this.data.item.nonStandardCode,
        isPackage: this.data.item.isPackage,
        quantity: this.data.item.quantity,
        unitPrice: this.data.item.unitPrice,
        discount: this.data.item.discount,
        factor: this.data.item.factor,
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
          careTeamSequence: this.data.careTeams.filter(x => this.data.item.careTeamSequence.find(y => y === x.sequence) !== undefined)
        });
      }

      if (this.data.diagnosises) {
        this.FormItem.patchValue({
          diagnosisSequence: this.data.diagnosises.filter(x => this.data.item.diagnosisSequence.find(y => y === x.sequence) !== undefined)
        });
      }

      if (this.data.supportingInfos) {
        this.FormItem.patchValue({
          // tslint:disable-next-line:max-line-length
          supportingInfoSequence: this.data.supportingInfos.filter(x => this.data.item.supportingInfoSequence.find(y => y === x.sequence) !== undefined)
        });
      }

      this.getItemList();
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

  getItemList() {
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
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });
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
      this.itemList.filter(item => item.name.toLowerCase().indexOf(search) > -1)
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
        if (this.FormItem.controls.discount.value && parseFloat(this.FormItem.controls.discount.value) > 0 && parseFloat(this.FormItem.controls.discount.value) < 100) {
          const factorValue: number = (1 - (parseFloat(this.FormItem.controls.discount.value) / 100));
          this.FormItem.controls.factor.setValue(parseFloat(factorValue.toFixed(2)));
        } else {
          this.FormItem.controls.factor.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && this.FormItem.controls.tax.value) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + this.FormItem.controls.tax.value;
          this.FormItem.controls.net.setValue(netValue);
        } else {
          this.FormItem.controls.net.setValue('');
        }
        break;
      case 'Tax':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.taxPercent.value) {
          // tslint:disable-next-line:max-line-length
          const taxValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
          this.FormItem.controls.tax.setValue(taxValue);
        } else {
          this.FormItem.controls.tax.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && this.FormItem.controls.tax.value) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + this.FormItem.controls.tax.value;
          this.FormItem.controls.net.setValue(netValue);
        } else {
          this.FormItem.controls.net.setValue('');
        }

        break;
      case 'PatientShare':
        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(patientShareValue);
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        break;
      case 'Other':

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.taxPercent.value) {
          // tslint:disable-next-line:max-line-length
          const taxValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.taxPercent.value)) / 100;
          this.FormItem.controls.tax.setValue(taxValue);
        } else {
          this.FormItem.controls.tax.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && this.FormItem.controls.tax.value) {
          // tslint:disable-next-line:max-line-length
          const netValue = (parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + this.FormItem.controls.tax.value;
          this.FormItem.controls.net.setValue(netValue);
        } else {
          this.FormItem.controls.net.setValue('');
        }

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.patientSharePercent.value) {
          // tslint:disable-next-line:max-line-length
          const patientShareValue = ((parseInt(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value)) * parseFloat(this.FormItem.controls.patientSharePercent.value)) / 100;
          this.FormItem.controls.patientShare.setValue(patientShareValue);
        } else {
          this.FormItem.controls.patientShare.setValue('');
        }

        break;
    }
  }

  onSubmit() {
    debugger;
    this.isSubmitted = true;
    if (this.FormItem.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.type = this.FormItem.controls.type.value.value;
      model.typeName = this.FormItem.controls.type.value.name;
      model.itemCode = this.FormItem.controls.item.value.code;
      model.itemDescription = this.FormItem.controls.item.value.description;
      model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
      model.isPackage = this.FormItem.controls.isPackage.value;
      // tslint:disable-next-line:radix
      model.quantity = parseInt(this.FormItem.controls.quantity.value);
      model.unitPrice = parseFloat(this.FormItem.controls.unitPrice.value);
      model.discount = parseFloat(this.FormItem.controls.discount.value);
      model.factor = this.FormItem.controls.factor.value;
      model.taxPercent = parseFloat(this.FormItem.controls.taxPercent.value);
      model.patientSharePercent = parseFloat(this.FormItem.controls.patientSharePercent.value);
      model.tax = this.FormItem.controls.tax.value;
      model.net = this.FormItem.controls.net.value;
      model.patientShare = this.FormItem.controls.patientShare.value;
      model.payerShare = parseFloat(this.FormItem.controls.payerShare.value);
      model.startDate = this.datePipe.transform(this.FormItem.controls.startDate.value, 'yyyy-MM-dd');

      if (this.FormItem.controls.supportingInfoSequence.value && this.FormItem.controls.supportingInfoSequence.value.length > 0) {
        model.supportingInfoSequence = this.FormItem.controls.supportingInfoSequence.value.map((x) => { return x.sequence });
      }

      if (this.FormItem.controls.careTeamSequence.value && this.FormItem.controls.careTeamSequence.value.length > 0) {
        model.careTeamSequence = this.FormItem.controls.careTeamSequence.value.map((x) => { return x.sequence });
      }

      if (this.FormItem.controls.diagnosisSequence.value && this.FormItem.controls.diagnosisSequence.value.length > 0) {
        model.diagnosisSequence = this.FormItem.controls.diagnosisSequence.value.map((x) => { return x.sequence });
      }

      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
