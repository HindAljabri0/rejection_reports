import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger, MatTabChangeEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { UploadsPage } from '../../models/claimReviewState.model';
import { SwitchUser } from '../../models/SwitchUser.model';
import { loadCoderList, loadDoctorList, loadProviderList, loadUploadsUnderReviewOfSelectedTab, setDoctorAndCoderData, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { completedClaimsUnderReviewPage, getCoderList, getDoctorList, getProviderList, inProgressClaimsUnderReviewPage, newClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
    selector: 'app-uploads-assigning',
    templateUrl: './uploads-assigning.component.html',
    styles: []
})
export class UploadsAssigningComponent implements OnInit {

    newUploads$: Observable<UploadsPage>;
    inProgressUploads$: Observable<UploadsPage>;
    completedUploads$: Observable<UploadsPage>;
    doctorList$: Observable<SwitchUser[]>;
    coderList$: Observable<SwitchUser[]>;
    selectedDoctor: string;
    selectedCoder: string;
    providerList$: Observable<any[]>;
    providerController: FormControl = new FormControl();
    doctorController: FormControl = new FormControl();
    coderController: FormControl = new FormControl();
    selectedProvider: string;
    errors: string;
    providers: any[] = [];
    filteredProviders: any[] = [];
    
    @ViewChild(MatMenuTrigger,{static:false}) filterMenu: MatMenuTrigger;

    constructor(private store: Store) { }

    ngOnInit() {
        this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
        this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
        this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
        this.store.dispatch(loadDoctorList());
        this.store.dispatch(loadCoderList());
        this.store.dispatch(loadProviderList());
        this.doctorList$ = this.store.select(getDoctorList);
        this.coderList$ = this.store.select(getCoderList);
        this.providerList$ = this.store.select(getProviderList);
        // Pending Code
        this.providerList$.subscribe(providers => {
            this.providers = providers
            this.filteredProviders = this.providers;
        });

        this.clearData();
    }

    dispatchTabChangeEvent(event: MatTabChangeEvent) {
        this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

    onDoctorSelectionChanged(data: string) {
        this.selectedDoctor = data
    }

    onCoderSelectionChanged(data: string) {
        this.selectedCoder = data;
    }

    filterData() {
        if (this.selectedCoder == '-1' || this.selectedCoder == null) {
            this.selectedCoder = '';
        }
        if (this.selectedDoctor == '-1' || this.selectedDoctor == null) {
            this.selectedDoctor = '';
        }
        this.selectProvider();
        if (this.providerController.value != '' && this.selectedProvider == '')
            return;
        if (this.selectedCoder == '' && this.selectedDoctor == '' && this.selectedProvider == '') {
            return this.store.dispatch(showSnackBarMessage({ message: "Please Select at least one filter." }));
        }
        this.store.dispatch(setDoctorAndCoderData({ selectedDoctorId: this.selectedDoctor, selectedCoderId: this.selectedCoder, selectedProvider: this.selectedProvider }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
        this.filterMenu.closeMenu()

    }

    selectProvider(providerId: string = null) {
        if (providerId !== null)
            this.selectedProvider = providerId;
        else {
            if (this.providerController.value != null && this.providerController.value != '') {
                const providerId = this.providerController.value.split('|')[0].trim();
                if (!isNaN(providerId) && !isNaN(parseFloat(providerId))) {
                    this.selectedProvider = providerId;
                } else {
                    this.selectedProvider = '';
                    return this.store.dispatch(showSnackBarMessage({ message: "Please Select a Valid Provider." }));
                }
            }
            else {
                this.selectedProvider = '';
            }
        }
    }

    updateFilter() {
        this.filteredProviders = this.providers.filter(provider =>
            `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
        );
    }

    clearData() {
        this.providerController.setValue("");
        this.coderController.setValue("-1");
        this.doctorController.setValue("-1");
        this.selectedCoder = "-1";
        this.selectedDoctor = "-1";
        this.store.dispatch(setDoctorAndCoderData({ selectedDoctorId: "", selectedCoderId: "", selectedProvider: "" }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
        this.filterMenu.closeMenu()
    }
}
