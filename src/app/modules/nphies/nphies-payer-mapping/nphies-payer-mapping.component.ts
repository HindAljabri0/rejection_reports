import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-nphies-payer-mapping',
    templateUrl: './nphies-payer-mapping.component.html',
    styleUrls: []
})
export class NphiesPayerMappingComponent implements OnInit {
    associatedNphiePayers = [];
    addNphiesPayerMappingList: any[] = [];
    deleteNphiesPayerMappingList: any[] = [];
    existingNphiePayers: any[] = [];
    selectedProvider = this.sharedServices.providerId;
    newNphiesPayerMappingValue: { [key: number]: string } = {};
    providerMappingController: FormControl = new FormControl('');
    componentLoading = {
        NphiesPayerMapping: true,
    };
    errors: {
        NphiespayerMappingError?: string,
        providerMappingError?: string,
        providerMappingSaveError?: string,
        providerTypeConfigurationSaveError?: string,
        NphiesMappingSaveError?: string,
        NphiesPayerError?: string,
        providerTypeConfigurationError?: string
    } = {};

    success: {
        NphiesPayerMappingSuccess?: string
    } = {};
    newNphiesPayerMappingEnable: { [key: number]: boolean } = {};
    newNphiesPayerName: { [key: number]: string } = {};
    newNphiesPayerTpaId: { [key: number]: string } = {};
    newNphiesPayerTpaName: { [key: number]: string } = {};
    constructor(private sharedServices: SharedServices, private providerNphiesSearchService: ProviderNphiesSearchService,
        private dbMapping: DbMappingService,private dialogService: DialogService) { }

    ngOnInit() {
        this.getLovPayers();
        
    }
    get selectedProviderName() {
        return this.sharedServices.providerId;
    }
    get selectedProviderCode() {
        return this.sharedServices.providerId;
    }
    save() {
        this.resetUserMessages();
        const nphiesPayerFlag = this.saveNphiesPayerMapping();
        if ( nphiesPayerFlag ) {
            this.dialogService.openMessageDialog({
                title: '',
                message: 'There is no changes to save!',
                withButtons: false,
                isError: false
            });
        }
    }
    saveNphiesPayerMapping() {

        this.errors.NphiesMappingSaveError = null;
        this.success.NphiesPayerMappingSuccess = null;

        const newNphiesPayerMapping = this.existingNphiePayers.filter(payer =>
            // tslint:disable-next-line:max-line-length
            this.newNphiesPayerMappingValue[payer.combination] && ((this.newNphiesPayerMappingValue[payer.combination].trim() != '' && this.newNphiesPayerMappingValue[payer.combination] != payer.mappingPayerValue))
        );

        this.addNphiesPayerMappingList = newNphiesPayerMapping.map(payer => payer.combination);

        this.addNphiesPayerMappingList = [...this.addNphiesPayerMappingList, ...this.associatedNphiePayers.filter(x => this.newNphiesPayerMappingValue[x.combination] && !this.addNphiesPayerMappingList.find(y => y == x.combination) && !this.existingNphiePayers.find(z => z.combination == x.combination)).map(x => x.combination)];

        const toDeleteNphiesPayerMapping = this.existingNphiePayers.filter(payer =>
            payer.mappingPayerValue !== '' && !this.newNphiesPayerMappingValue[payer.combination]
        );
        this.deleteNphiesPayerMappingList = toDeleteNphiesPayerMapping.map(payer => payer.combination);

        if (this.addNphiesPayerMappingList.length == 0 && this.deleteNphiesPayerMappingList.length == 0) {
            return true;
        }

        const selectedNphiesPayer = [];
        if (this.addNphiesPayerMappingList.length > 0) {
            this.addNphiesPayerMappingList.forEach(id => {
                const data = {
                    nphiesPayerId: id.split(':')[1],
                    tpaNphiesId: this.newNphiesPayerTpaId[id],
                    payerName: this.newNphiesPayerName[id],
                    tpaName: this.newNphiesPayerTpaName[id],
                    mappingPayerValue: this.newNphiesPayerMappingValue[id]
                };
                selectedNphiesPayer.push(data);
            });
            this.componentLoading.NphiesPayerMapping = true;
            this.dbMapping.saveNphiesPayerMapping(this.selectedProvider, selectedNphiesPayer).subscribe(event => {
                if (event instanceof HttpResponse) {
                    const body: any = event.body;
                    if (body.response) {
                        this.getNphiesPayerMapping();
                        if (body.message.indexOf('Data save successfully') > -1) {
                            // this.success.NphiesPayerMappingSuccess = body.message;
                            this.success.NphiesPayerMappingSuccess = 'Settings were saved successfully.';
                        } else {
                            this.errors.NphiesMappingSaveError = body.message;
                        }
                    } else {
                        this.errors.NphiesMappingSaveError = 'Could not save nphies payer mapping details !';
                    }
                    this.componentLoading.NphiesPayerMapping = false;
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status != 404) {
                        this.errors.NphiesMappingSaveError = 'Could not change nphies payer mapping, please try again later.';
                    }
                }
                this.componentLoading.NphiesPayerMapping = false;
            });
        }

        const deleteNphiesPayers = [];
        if (this.deleteNphiesPayerMappingList.length > 0) {
            this.deleteNphiesPayerMappingList.forEach(id => {
                const data = {
                    nphiesPayerId: id.split(':')[1],
                    tpaNphiesId: this.newNphiesPayerTpaId[id],
                };
                deleteNphiesPayers.push(data);
            });
            this.componentLoading.NphiesPayerMapping = true;
            // call delete function
            this.dbMapping.deleteNphiesPayerMapping(this.selectedProvider, deleteNphiesPayers).subscribe(event => {
                this.deleteNphiesPayerMappingList = [];
                if (event instanceof HttpResponse) {
                    const data = event.body['response'];
                    if (data) {
                        this.getNphiesPayerMapping();
                        this.success.NphiesPayerMappingSuccess = 'Settings were saved successfully.';
                    } else {
                        this.errors.NphiesMappingSaveError = 'Could not save nphies payer mapping details !';
                    }
                    this.componentLoading.NphiesPayerMapping = false;
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status != 404) {
                        this.errors.NphiesMappingSaveError = 'Could not change nphies payer mapping, please try again later.';
                    }
                }
                this.componentLoading.NphiesPayerMapping = false;
            });
        }
        return false;
    }
    resetUserMessages() {
        this.success = {};
        this.errors = {};
    }
    getNphiesPayerMapping() {
        this.componentLoading.NphiesPayerMapping = true;
        this.errors.NphiesMappingSaveError = null;
        this.errors.NphiesPayerError = null;
        this.success.NphiesPayerMappingSuccess = null;
        this.dbMapping.getNphiesPayerMapping(this.selectedProvider).subscribe(event => {
            if (event instanceof HttpResponse) {
                const response = event.body['response'];

                if (response) {
                    const mappingList = event.body['mappingList'];
                    this.existingNphiePayers = [];
                    if (mappingList.length > 0) {
                        mappingList.forEach(x => {
                            x.combination = x.tpaNphiesId + ':' + x.nphiesPayerId;
                            this.newNphiesPayerMappingValue[x.combination] = x.mappingPayerValue;
                            this.newNphiesPayerTpaId[x.combination] = x.tpaNphiesId;
                            this.newNphiesPayerName[x.combination] = x.payerName;
                            this.newNphiesPayerTpaName[x.combination] = x.tpaName != 'None' ? x.tpaName : null;

                            this.addNphiesPayerMappingList.push(x.combination);
                            this.existingNphiePayers.push(x);
                        });
                    }
                }
                this.componentLoading.NphiesPayerMapping = false;
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status != 404) {
                    this.errors.NphiespayerMappingError = 'Could not load payer mapping, please try again later.';
                }
            }
            this.componentLoading.NphiesPayerMapping = false;

        });

    }
    getLovPayers() {
        this.componentLoading.NphiesPayerMapping = true;
        this.providerNphiesSearchService.getPayers().subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.associatedNphiePayers = [];
                    body.forEach(x => {
                        x.subList.forEach(y => {
                            y.nphiesPayerId = y.code;
                            y.payerName = y.display;
                            y.tpaNphiesId = x.code;
                            y.tpaName = x.display;
                            y.combination = x.code + ':' + y.code;
                        });
                        this.associatedNphiePayers = [...this.associatedNphiePayers, ...x.subList];
                    });

                    this.associatedNphiePayers.forEach(x => {
                        this.newNphiesPayerMappingValue[x.combination] = '';
                        this.newNphiesPayerName[x.combination] = x.display;
                        this.newNphiesPayerTpaId[x.combination] = x.tpaNphiesId;
                        this.newNphiesPayerTpaName[x.combination] = x.tpaName != 'None' ? x.tpaName : null;
                        this.addNphiesPayerMappingList = [];
                    });
                    this.getNphiesPayerMapping();
                    this.componentLoading.NphiesPayerMapping = false;
                }
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status != 404) {
                    this.errors.NphiespayerMappingError = 'Could not load payer mapping, please try again later.';
                }
            }
            this.componentLoading.NphiesPayerMapping = false;
        });
    }
}
