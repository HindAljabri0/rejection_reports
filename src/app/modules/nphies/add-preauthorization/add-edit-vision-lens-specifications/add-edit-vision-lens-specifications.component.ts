import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { AdminService } from 'src/app/services/adminService/admin.service';

@Component({
  selector: 'app-add-edit-vision-lens-specifications',
  templateUrl: './add-edit-vision-lens-specifications.component.html',
  styles: []
})
export class AddEditVisionLensSpecificationsComponent implements OnInit {

  FormVisionSpecification: FormGroup = this.formBuilder.group({
    product: ['', Validators.required],
    eye: [''],
    lenseColor: [''],
    lenseBrand: [''],
    sphere: [''],
    cylinder: [''],
    axis: [''],
    multifocalPower: [''],
    lensePower: [''],
    lenseBackCurve: [''],
    lenseDiameter: [''],
    lenseDuration: [''],
    lenseDurationUnit: [''],
    prismAmount: [''],
    prismBase: [''],
    lenseNote: ['']
  });

  productList = [
    { value: 'lens', name: 'Lens' },
    { value: 'contact', name: 'Contact' },
  ];

  baseList = [
    { value: 'up', name: 'Up' },
    { value: 'down', name: 'Down' },
    { value: 'in', name: 'In' },
    { value: 'out', name: 'Out' }
  ];

  durationUnitList = [
    { value: 'D', name: 'Day' },
    { value: 'WK', name: 'Week' },
    { value: 'MO', name: 'Month' }
  ];

  isSubmitted = false;

  sphereError = '';
  powerError = '';
  cylinderError = '';
  addError = '';
  prismAmountError = '';
  axisError = '';

  IsCylinderRequired = false;
  IsAxisRequired = false;

  constructor(
    private dialogRef: MatDialogRef<AddEditVisionLensSpecificationsComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private sharedServices: SharedServices, private formBuilder: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    if (this.data.item && this.data.item.product) {
      this.FormVisionSpecification.patchValue({
        product: this.productList.filter(x => x.value === this.data.item.product)[0],
        eye: this.data.item.eye,
        lenseColor: this.data.item.lenseColor,
        lenseBrand: this.data.item.lenseBrand,
        sphere: this.data.item.sphere,
        cylinder: this.data.item.cylinder,
        axis: this.data.item.axis,
        multifocalPower: this.data.item.multifocalPower,
        lensePower: this.data.item.lensePower,
        lenseBackCurve: this.data.item.lenseBackCurve,
        lenseDiameter: this.data.item.lenseDiameter,
        lenseDuration: this.data.item.lenseDuration,
        lenseDurationUnit: this.data.item.lenseDurationUnit ? this.data.item.lenseDurationUnit : '',
        prismAmount: this.data.item.prismAmount,
        prismBase: this.data.item.prismBase ? this.data.item.prismBase : '',
        lenseNote: this.data.item.lenseNote,
      });

      if (this.data.item.prismBase) {
        this.FormVisionSpecification.patchValue({
          prismBase: this.baseList.filter(x => x.value === this.data.item.prismBase)[0]
        });
      }

      if (this.data.item.lenseDurationUnit) {
        this.FormVisionSpecification.patchValue({
          lenseDurationUnit: this.durationUnitList.filter(x => x.value === this.data.item.lenseDurationUnit)[0]
        });
      }
    }
  }

  checkSphere() {
    const value = this.FormVisionSpecification.controls.sphere.value;

    if (value) {
      if (value < -30) {
        this.sphereError = 'Value can not be less than -30';
      } else if (value > 30) {
        this.sphereError = 'Value can not be greater than 30';
      } else if (value % 0.25 !== 0) {
        this.sphereError = 'Value should be the multiple of 0.25';
      } else {
        this.sphereError = '';
      }
    } else {
      this.sphereError = '';
    }
  }

  checkPower() {
    const value = this.FormVisionSpecification.controls.lensePower.value;

    if (value) {
      if (value < -12) {
        this.powerError = 'Value can not be less than -12';
      } else if (value > 12) {
        this.powerError = 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        this.powerError = 'Value should be the multiple of 0.25';
      } else {
        this.powerError = '';
      }
    } else {
      this.powerError = '';
    }
  }

  checkCylinder() {
    const value = this.FormVisionSpecification.controls.cylinder.value;

    if (value) {
      if (value < -12) {
        this.cylinderError = 'Value can not be less than -12';
      } else if (value > 12) {
        this.cylinderError = 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        this.cylinderError = 'Value should be the multiple of 0.25';
      } else {
        this.cylinderError = '';
      }
    } else {
      this.cylinderError = '';
    }
  }

  checkAdd() {
    const value = this.FormVisionSpecification.controls.multifocalPower.value;

    if (value) {
      if (value < -12) {
        this.addError = 'Value can not be less than -12';
      } else if (value > 12) {
        this.addError = 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        this.addError = 'Value should be the multiple of 0.25';
      } else {
        this.addError = '';
      }
    } else {
      this.addError = '';
    }
  }

  checkPrismAmount() {
    const value = this.FormVisionSpecification.controls.prismAmount.value;

    if (value) {
      if (value < 0) {
        this.prismAmountError = 'Value can not be less than 0';
      } else if (value > 10) {
        this.prismAmountError = 'Value can not be greater than 10';
      } else if (value % 0.5 !== 0) {
        this.prismAmountError = 'Value should be the multiple of 0.50';
      } else {
        this.prismAmountError = '';
      }
    } else {
      this.prismAmountError = '';
    }
  }

  checkAxis() {
    const value = this.FormVisionSpecification.controls.axis.value;

    if (value !== null && value !== undefined && value !== '') {
      if (value < 1) {
        this.axisError = 'Value can not be less than 1';
      } else if (value > 180) {
        this.axisError = 'Value can not be greater than 180';
      } else {
        this.axisError = '';
      }
    } else {
      this.axisError = '';
    }
  }

  changeProduct() {
    if (!(this.data.item && this.data.item.product)) {
      this.FormVisionSpecification.controls.sphere.setValue('');
    }
  }

  IsSphereRequired() {
    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'lens') {
      return true;
    } else {
      return false;
    }
  }

  IsPowerRequired() {
    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'contact') {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {

    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'lens') {
      this.FormVisionSpecification.controls.sphere.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.sphere.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.sphere.clearValidators();
      this.FormVisionSpecification.controls.sphere.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'contact') {
      this.FormVisionSpecification.controls.lensePower.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.lensePower.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.lensePower.clearValidators();
      this.FormVisionSpecification.controls.lensePower.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.prismAmount.value) {
      this.FormVisionSpecification.controls.prismBase.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.prismBase.clearValidators();
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.lenseDuration.value) {
      this.FormVisionSpecification.controls.lenseDurationUnit.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.lenseDurationUnit.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.lenseDurationUnit.clearValidators();
      this.FormVisionSpecification.controls.lenseDurationUnit.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.axis.value) {
      this.FormVisionSpecification.controls.cylinder.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.cylinder.updateValueAndValidity();
      this.IsCylinderRequired = true;
    } else {
      this.FormVisionSpecification.controls.cylinder.clearValidators();
      this.FormVisionSpecification.controls.cylinder.updateValueAndValidity();
      this.IsCylinderRequired = false;
    }

    if (this.FormVisionSpecification.controls.cylinder.value) {
      this.FormVisionSpecification.controls.axis.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.axis.updateValueAndValidity();
      this.IsAxisRequired = true;
    } else {
      this.FormVisionSpecification.controls.axis.clearValidators();
      this.FormVisionSpecification.controls.axis.updateValueAndValidity();
      this.IsAxisRequired = false;
    }

    this.isSubmitted = true;
    if (this.FormVisionSpecification.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.product = this.FormVisionSpecification.controls.product.value.value;
      model.productName = this.FormVisionSpecification.controls.product.value.name;
      model.eye = this.FormVisionSpecification.controls.eye.value;

      if (this.FormVisionSpecification.controls.product.value &&
        this.FormVisionSpecification.controls.product.value.value &&
        this.FormVisionSpecification.controls.product.value.value === 'lens') {
        model.sphere = this.FormVisionSpecification.controls.sphere.value;
      } else {
        model.sphere = '';
      }

      model.cylinder = this.FormVisionSpecification.controls.cylinder.value;
      model.axis = this.FormVisionSpecification.controls.axis.value;
      model.prismAmount = this.FormVisionSpecification.controls.prismAmount.value;

      if (this.FormVisionSpecification.controls.prismBase.value) {
        model.prismBase = this.FormVisionSpecification.controls.prismBase.value.value;
        model.prismBaseName = this.FormVisionSpecification.controls.prismBase.value.name;
      }

      if (this.FormVisionSpecification.controls.lenseDuration.value) {
        model.lenseDurationUnit = this.FormVisionSpecification.controls.lenseDurationUnit.value.value;
        model.lenseDurationUnitName = this.FormVisionSpecification.controls.lenseDurationUnit.value.name;
      }

      model.multifocalPower = this.FormVisionSpecification.controls.multifocalPower.value;

      if (this.FormVisionSpecification.controls.product.value &&
        this.FormVisionSpecification.controls.product.value.value &&
        this.FormVisionSpecification.controls.product.value.value === 'contact') {
        model.lensePower = this.FormVisionSpecification.controls.lensePower.value;
      } else {
        model.lensePower = '';
      }

      model.lenseBackCurve = this.FormVisionSpecification.controls.lenseBackCurve.value;
      model.lenseDiameter = this.FormVisionSpecification.controls.lenseDiameter.value;
      model.lenseDuration = this.FormVisionSpecification.controls.lenseDuration.value;
      model.lenseColor = this.FormVisionSpecification.controls.lenseColor.value;
      model.lenseBrand = this.FormVisionSpecification.controls.lenseBrand.value;

      model.lenseNote = this.FormVisionSpecification.controls.lenseNote.value;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
