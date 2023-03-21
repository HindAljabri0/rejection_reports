import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-add-edit-vision-lens-specifications',
  templateUrl: './add-edit-vision-lens-specifications.component.html',
  styles: []
})
export class AddEditVisionLensSpecificationsComponent implements OnInit {

  FormVisionSpecification: FormGroup = this.formBuilder.group({
    product: ['', Validators.required],
    eye: ['right'],
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
    //new fields
    left_sphere: [''],
    left_cylinder: [''],
    left_axis: [''],
    left_multifocalPower: [''],
    left_lensPower: [''],
    left_lensBackCurve: [''],
    left_lensDiameter: [''],
    left_lensDuration: [''],
    left_lensDurationUnit: [''],
    left_prismAmount: [''],
    left_prismBase: [''],
    lensNote: ['']
  });

  productList = this.sharedDataService.productList;
  // [
  //   { value: 'lens', name: 'Lens' },
  //   { value: 'contact', name: 'Contact' },
  // ];

  baseList = this.sharedDataService.baseList;
  // [
  //   { value: 'up', name: 'Up' },
  //   { value: 'down', name: 'Down' },
  //   { value: 'in', name: 'In' },
  //   { value: 'out', name: 'Out' }
  // ];

  durationUnitList = this.sharedDataService.durationUnitList;
  // [
  //   { value: 'D', name: 'Day' },
  //   { value: 'WK', name: 'Week' },
  //   { value: 'MO', name: 'Month' }
  // ];

  isSubmitted = false;

  sphereError = '';
  powerError = '';
  cylinderError = '';
  addError = '';
  prismAmountError = '';
  axisError = '';

  left_sphereError = '';
  left_powerError = '';
  left_cylinderError = '';
  left_addError = '';
  left_prismAmountError = '';
  left_axisError = '';
  IsCylinderRequired = false;
  IsAxisRequired = false;

  constructor(
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<AddEditVisionLensSpecificationsComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder, private adminService: AdminService) { }

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
        //new fields
        left_sphere: this.data.item.left_sphere,
        left_cylinder: this.data.item.left_cylinder,
        left_axis: this.data.item.left_axis,
        left_multifocalPower: this.data.item.left_multifocalPower,
        left_lensPower: this.data.item.left_lensPower,
        left_lensBackCurve: this.data.item.left_lensBackCurve,
        left_lensDiameter: this.data.item.left_lensDiameter,
        left_lensDuration: this.data.item.left_lensDuration,
        left_lensDurationUnit: this.data.item.left_lensDurationUnit ? this.data.item.left_lensDurationUnit : '',
        left_prismAmount: this.data.item.left_prismAmount,
        left_prismBase: this.data.item.left_prismBase ? this.data.item.left_prismBase : '',
        lensNote: this.data.item.lensNote,
      });
      //new Feilds
      if (this.data.item.prismBase) {
        this.FormVisionSpecification.patchValue({
          prismBase: this.baseList.filter(x => x.value === this.data.item.prismBase)[0]
        });
      }
      if (this.data.item.left_prismBase) {
        this.FormVisionSpecification.patchValue({
          left_prismBase: this.baseList.filter(x => x.value === this.data.item.left_prismBase)[0]
        });
      }

      if (this.data.item.lensDurationUnit) {
        this.FormVisionSpecification.patchValue({
          lensDurationUnit: this.durationUnitList.filter(x => x.value === this.data.item.lensDurationUnit)[0]
        });
      }

      if (this.data.item.left_lensDurationUnit) {
        this.FormVisionSpecification.patchValue({
          left_lensDurationUnit: this.durationUnitList.filter(x => x.value === this.data.item.left_lensDurationUnit)[0]
        });
      }
    }
  }

  checkSphere(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.sphere.value :this.FormVisionSpecification.controls.left_sphere.value;
    let error='';
    if (value) {
      if (value < -30) {
        error = 'Value can not be less than -30';
      } else if (value > 30) {
        error = 'Value can not be greater than 30';
      } else if (value % 0.25 !== 0) {
        error = 'Value should be the multiple of 0.25';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye =="Left"){
      this.left_sphereError = error;
    }else{
      this.sphereError = error;
    }
  }

  checkPower(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.lensPower.value : this.FormVisionSpecification.controls.left_lensPower.value;
    let error='';
    if (value) {
      if (value < -12) {
        error = 'Value can not be less than -12';
      } else if (value > 12) {
        error = 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        error = 'Value should be the multiple of 0.25';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye =="Left"){
      this.left_powerError=error;
    }else{
      this.powerError = error;
    }
  }

  checkCylinder(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.cylinder.value : this.FormVisionSpecification.controls.left_cylinder.value;
    let error='';
    if (value) {
      if (value < -12) {
        error= 'Value can not be less than -12';
      } else if (value > 12) {
        error= 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        error = 'Value should be the multiple of 0.25';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye == "Left"){
      this.left_cylinderError = error;
    }else{
      this.cylinderError = error;
    }
  }

  checkAdd(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.multifocalPower.value : this.FormVisionSpecification.controls.left_multifocalPower.value;
    let error='';
    if (value) {
      if (value < -12) {
        error = 'Value can not be less than -12';
      } else if (value > 12) {
        error = 'Value can not be greater than 12';
      } else if (value % 0.25 !== 0) {
        error = 'Value should be the multiple of 0.25';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye =="Left"){
      this.left_addError =error;
    }else{
      this.addError = error;
    }
  }

  checkPrismAmount(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.prismAmount.value : this.FormVisionSpecification.controls.left_prismAmount.value;
    let error='';
    if (value != undefined || value != null) {
      if (value < 0.25) {
        error = 'Value can not be less than 0.25';
      } else if (value > 30) {
        error = 'Value can not be greater than 30';
      } else if (value % 0.25 !== 0) {
        error = 'Value should be the multiple of 0.25';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye =="Left"){
      this.left_prismAmountError = error;
    }else{
      this.prismAmountError = error;
    }
  }

  checkAxis(eye = "Right") {
    const value = eye &&  eye =="Right" ? this.FormVisionSpecification.controls.axis.value : this.FormVisionSpecification.controls.left_axis.value;
    let error='';
    if (value !== null && value !== undefined && value !== '') {
      if (value < 1) {
        error = 'Value can not be less than 1';
      } else if (value > 180) {
        error = 'Value can not be greater than 180';
      } else {
        error = '';
      }
    } else {
      error = '';
    }
    if(eye &&  eye =="Left"){
      this.left_axisError =error;
    }else{
      this.axisError =error;
    }
  }

  changeProduct() {
    // if (!(this.data.item && this.data.item.product)) {
    //   this.FormVisionSpecification.controls.sphere.setValue('');
    // }

    this.FormVisionSpecification.controls.sphere.reset();
    this.FormVisionSpecification.controls.prismAmount.reset();
    this.FormVisionSpecification.controls.prismBase.setValue('');
    this.FormVisionSpecification.controls.lensPower.reset();
    this.FormVisionSpecification.controls.lensBackCurve.reset();
    this.FormVisionSpecification.controls.lensDiameter.reset();
    this.FormVisionSpecification.controls.lensDuration.reset();
    this.FormVisionSpecification.controls.lensDurationUnit.setValue('');
    //new Fields
    this.FormVisionSpecification.controls.left_sphere.reset();
    this.FormVisionSpecification.controls.left_prismAmount.reset();
    this.FormVisionSpecification.controls.left_prismBase.setValue('');
    this.FormVisionSpecification.controls.left_lensPower.reset();
    this.FormVisionSpecification.controls.left_lensBackCurve.reset();
    this.FormVisionSpecification.controls.left_lensDiameter.reset();
    this.FormVisionSpecification.controls.left_lensDuration.reset();
    this.FormVisionSpecification.controls.left_lensDurationUnit.setValue('');

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

    this.isSubmitted = true;

    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'lens') {
      this.FormVisionSpecification.controls.sphere.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.sphere.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.sphere.clearValidators();
      this.FormVisionSpecification.controls.sphere.updateValueAndValidity();
    }
    //left validation
    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'lens') {
      this.FormVisionSpecification.controls.left_sphere.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_sphere.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.left_sphere.clearValidators();
      this.FormVisionSpecification.controls.left_sphere.updateValueAndValidity();
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
    //left validation
    if (this.FormVisionSpecification.controls.product.value &&
      this.FormVisionSpecification.controls.product.value.value &&
      this.FormVisionSpecification.controls.product.value.value === 'contact') {
      this.FormVisionSpecification.controls.left_lensPower.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_lensPower.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.left_lensPower.clearValidators();
      this.FormVisionSpecification.controls.left_lensPower.updateValueAndValidity();
    }
    if (this.FormVisionSpecification.controls.prismAmount.value) {
      this.FormVisionSpecification.controls.prismBase.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.prismBase.clearValidators();
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    }
    //left validation
    if (this.FormVisionSpecification.controls.left_prismAmount.value) {
      this.FormVisionSpecification.controls.left_prismBase.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_prismBase.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.left_prismBase.clearValidators();
      this.FormVisionSpecification.controls.left_prismBase.updateValueAndValidity();
    }

    if (this.FormVisionSpecification.controls.lensDuration.value) {
      this.FormVisionSpecification.controls.lensDurationUnit.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.lensDurationUnit.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.lensDurationUnit.clearValidators();
      this.FormVisionSpecification.controls.lensDurationUnit.updateValueAndValidity();
    }
    //left validation
    if (this.FormVisionSpecification.controls.left_lensDuration.value) {
      this.FormVisionSpecification.controls.left_lensDurationUnit.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_lensDurationUnit.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.left_lensDurationUnit.clearValidators();
      this.FormVisionSpecification.controls.left_lensDurationUnit.updateValueAndValidity();
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
    //left validation
    if (this.FormVisionSpecification.controls.left_axis.value) {
      this.FormVisionSpecification.controls.left_cylinder.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_cylinder.updateValueAndValidity();
      this.IsCylinderRequired = true;
    } else {
      this.FormVisionSpecification.controls.left_cylinder.clearValidators();
      this.FormVisionSpecification.controls.left_cylinder.updateValueAndValidity();
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
    //left validation
    if (this.FormVisionSpecification.controls.left_cylinder.value) {
      this.FormVisionSpecification.controls.left_axis.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.left_axis.updateValueAndValidity();
      this.IsAxisRequired = true;
    } else {
      this.FormVisionSpecification.controls.left_axis.clearValidators();
      this.FormVisionSpecification.controls.left_axis.updateValueAndValidity();
      this.IsAxisRequired = false;
    }

    if (
      this.sphereError !== '' ||
      this.powerError !== '' ||
      this.cylinderError !== '' ||
      this.addError !== '' ||
      this.prismAmountError !== '' ||
      this.axisError !== '' ||
      this.left_sphereError !== '' ||
      this.left_powerError !== '' ||
      this.left_cylinderError !== '' ||
      this.left_addError !== '' ||
      this.left_prismAmountError !== '' ||
      this.left_axisError !== '') {
      return;
    }

    if (this.FormVisionSpecification.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.product = this.FormVisionSpecification.controls.product.value.value;
      model.productName = this.FormVisionSpecification.controls.product.value.name;
      //model.eye = this.FormVisionSpecification.controls.eye.value;
      model.lensColor = this.FormVisionSpecification.controls.lensColor.value;
      model.lensBrand = this.FormVisionSpecification.controls.lensBrand.value;
      model.cylinder = this.FormVisionSpecification.controls.cylinder.value;
      model.axis = this.FormVisionSpecification.controls.axis.value;
      model.multifocalPower = this.FormVisionSpecification.controls.multifocalPower.value;
      //new Fields
      model.left_cylinder = this.FormVisionSpecification.controls.left_cylinder.value;
      model.left_axis = this.FormVisionSpecification.controls.left_axis.value;
      model.left_multifocalPower = this.FormVisionSpecification.controls.left_multifocalPower.value;
      
      model.lensNote = this.FormVisionSpecification.controls.lensNote.value;

      if (this.FormVisionSpecification.controls.product.value &&
        this.FormVisionSpecification.controls.product.value.value &&
        this.FormVisionSpecification.controls.product.value.value === 'lens') {

        model.sphere = this.FormVisionSpecification.controls.sphere.value;
        model.prismAmount = this.FormVisionSpecification.controls.prismAmount.value;
        //new Fields
        model.left_sphere = this.FormVisionSpecification.controls.left_sphere.value;
        model.left_prismAmount = this.FormVisionSpecification.controls.left_prismAmount.value;

        if (this.FormVisionSpecification.controls.prismBase.value) {
          model.prismBase = this.FormVisionSpecification.controls.prismBase.value.value;
          model.prismBaseName = this.FormVisionSpecification.controls.prismBase.value.name;
        }
        //new Fields
        if (this.FormVisionSpecification.controls.left_prismBase.value) {
          model.left_prismBase = this.FormVisionSpecification.controls.left_prismBase.value.value;
          model.left_prismBaseName = this.FormVisionSpecification.controls.left_prismBase.value.name;
        }


      } else if (this.FormVisionSpecification.controls.product.value &&
        this.FormVisionSpecification.controls.product.value.value &&
        this.FormVisionSpecification.controls.product.value.value === 'contact') {

        model.lensPower = this.FormVisionSpecification.controls.lensPower.value;
        model.lensBackCurve = this.FormVisionSpecification.controls.lensBackCurve.value;
        model.lensDiameter = this.FormVisionSpecification.controls.lensDiameter.value;
        model.lensDuration = this.FormVisionSpecification.controls.lensDuration.value;
        //new Fields
        model.left_lensPower = this.FormVisionSpecification.controls.left_lensPower.value;
        model.left_lensBackCurve = this.FormVisionSpecification.controls.left_lensBackCurve.value;
        model.left_lensDiameter = this.FormVisionSpecification.controls.left_lensDiameter.value;
        model.left_lensDuration = this.FormVisionSpecification.controls.left_lensDuration.value; 
        if (this.FormVisionSpecification.controls.lensDuration.value) {
          model.lensDurationUnit = this.FormVisionSpecification.controls.lensDurationUnit.value.value;
          model.lensDurationUnitName = this.FormVisionSpecification.controls.lensDurationUnit.value.name;
        }
        //new Fields
        if (this.FormVisionSpecification.controls.left_lensDuration.value) {
          model.left_lensDurationUnit = this.FormVisionSpecification.controls.left_lensDurationUnit.value.value;
          model.left_lensDurationUnitName = this.FormVisionSpecification.controls.left_lensDurationUnit.value.name;
        }

      }
      console.log(model);
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
