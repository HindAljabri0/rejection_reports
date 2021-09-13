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
    cyclinder: [''],
    axis: [''],
    multifocalPower: [''],
    lensePower: [''],
    lenseBackCurve: [''],
    lenseDiameter: [''],
    lenseDuration: [''],
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

  isSubmitted = false;

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
        cyclinder: this.data.item.cyclinder,
        axis: this.data.item.axis,
        multifocalPower: this.data.item.multifocalPower,
        lensePower: this.data.item.lensePower,
        lenseBackCurve: this.data.item.lenseBackCurve,
        lenseDiameter: this.data.item.lenseDiameter,
        lenseDuration: this.data.item.lenseDuration,
        prismAmount: this.data.item.prismAmount,
        prismBase: this.data.item.prismBase,
        lenseNote: this.data.item.lenseNote,
      });

      if (this.data.item.prismBase) {
        this.FormVisionSpecification.patchValue({
          prismBase: this.baseList.filter(x => x.value === this.data.item.prismBase)[0]
        });
      }
    }
  }

  onSubmit() {

    if (this.FormVisionSpecification.controls.prismAmount.value) {
      this.FormVisionSpecification.controls.prismBase.setValidators([Validators.required]);
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    } else {
      this.FormVisionSpecification.controls.prismBase.clearValidators();
      this.FormVisionSpecification.controls.prismBase.updateValueAndValidity();
    }

    this.isSubmitted = true;
    if (this.FormVisionSpecification.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.product = this.FormVisionSpecification.controls.product.value.value;
      model.productName = this.FormVisionSpecification.controls.product.value.name;
      model.eye = this.FormVisionSpecification.controls.eye.value;
      model.sphere = this.FormVisionSpecification.controls.sphere.value;
      model.cyclinder = this.FormVisionSpecification.controls.cyclinder.value;
      model.axis = this.FormVisionSpecification.controls.axis.value;
      model.prismAmount = this.FormVisionSpecification.controls.prismAmount.value;
      model.prismBase = this.FormVisionSpecification.controls.prismBase.value.value;
      model.multifocalPower = this.FormVisionSpecification.controls.multifocalPower.value;
      model.lensePower = this.FormVisionSpecification.controls.lensePower.value;
      model.lenseBackCurve = this.FormVisionSpecification.controls.lenseBackCurve.value;
      model.lenseDiameter = this.FormVisionSpecification.controls.lenseDiameter.value;
      model.lenseDuration = this.FormVisionSpecification.controls.lenseDuration.value;
      model.lenseColor = this.FormVisionSpecification.controls.lenseColor.value;
      model.lenseBrand = this.FormVisionSpecification.controls.lenseBrand.value;
      model.prismBaseName = this.FormVisionSpecification.controls.prismBase.value.name;
      model.lenseNote = this.FormVisionSpecification.controls.lenseNote.value;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
