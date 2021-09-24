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
    lensColor: [''],
    lensBrand: [''],
    sphere: [''],
    cylinder: [''],
    axis: [''],
    multifocalPower: [''],
    lensPower: [''],
    lensBackCurve: [''],
    lensDiameter: [''],
    lensDuration: [''],
    lensDurationUnit: [''],
    prismAmount: [''],
    prismBase: [''],
    lensNote: ['']
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
        lensColor: this.data.item.lensColor,
        lensBrand: this.data.item.lensBrand,
        sphere: this.data.item.sphere,
        cylinder: this.data.item.cylinder,
        axis: this.data.item.axis,
        multifocalPower: this.data.item.multifocalPower,
        lensPower: this.data.item.lensPower,
        lensBackCurve: this.data.item.lensBackCurve,
        lensDiameter: this.data.item.lensDiameter,
        lensDuration: this.data.item.lensDuration,
        lensDurationUnit: this.data.item.lensDurationUnit ? this.data.item.lensDurationUnit : '',
        prismAmount: this.data.item.prismAmount,
        prismBase: this.data.item.prismBase ? this.data.item.prismBase : '',
        lensNote: this.data.item.lensNote,
      });

      if (this.data.item.prismBase) {
        this.FormVisionSpecification.patchValue({
          prismBase: this.baseList.filter(x => x.value === this.data.item.prismBase)[0]
        });
      }

      if (this.data.item.lensDurationUnit) {
        this.FormVisionSpecification.patchValue({
          lensDurationUnit: this.durationUnitList.filter(x => x.value === this.data.item.lensDurationUnit)[0]
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
    const value = this.FormVisionSpecification.controls.lensPower.value;

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
      this.FormVisionSpecification.controls.lensPower.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.lensPower.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.lensPower.clearValidators();
      this.FormVisionSpecification.controls.lensPower.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.prismAmount.value) {
      this.FormVisionSpecification.controls.prismBase.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.prismBase.clearValidators();
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.lensDuration.value) {
      this.FormVisionSpecification.controls.lensDurationUnit.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.lensDurationUnit.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.lensDurationUnit.clearValidators();
      this.FormVisionSpecification.controls.lensDurationUnit.updateValueAndValidity();
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

      if (this.FormVisionSpecification.controls.lensDuration.value) {
        model.lensDurationUnit = this.FormVisionSpecification.controls.lensDurationUnit.value.value;
        model.lensDurationUnitName = this.FormVisionSpecification.controls.lensDurationUnit.value.name;
      }

      model.multifocalPower = this.FormVisionSpecification.controls.multifocalPower.value;

      if (this.FormVisionSpecification.controls.product.value &&
        this.FormVisionSpecification.controls.product.value.value &&
        this.FormVisionSpecification.controls.product.value.value === 'contact') {
        model.lensPower = this.FormVisionSpecification.controls.lensPower.value;
      } else {
        model.lensPower = '';
      }

      model.lensBackCurve = this.FormVisionSpecification.controls.lensBackCurve.value;
      model.lensDiameter = this.FormVisionSpecification.controls.lensDiameter.value;
      model.lensDuration = this.FormVisionSpecification.controls.lensDuration.value;
      model.lensColor = this.FormVisionSpecification.controls.lensColor.value;
      model.lensBrand = this.FormVisionSpecification.controls.lensBrand.value;

      model.lensNote = this.FormVisionSpecification.controls.lensNote.value;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
