import { PageEvent } from "@angular/material";
import { createAction, props } from "@ngrx/store";
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { ClaimDetails } from "../models/ClaimDetails.model";
import { UploadsPage } from "../models/claimReviewState.model";
import { SwitchUser } from "../models/SwitchUser.model";
import { Upload } from "../models/upload.model";
import { UploadClaimSummaryList } from "../models/UploadClaimSummaryList.model";
import { DiagnosisRemarksUpdateRequest, FieldError, MarkAsDone, UploadClaimsList } from "./claimReview.reducer";


export const uploadsReviewPageAction = createAction("[ Claims Review ] page changing action in uploads page", props<PageEvent>());
export const uploadsReviewTabAction = createAction("[ Claims Review ] on tab changed action in uploads page", props<{ index: number }>());
export const loadUploadsUnderReviewOfSelectedTab = createAction("[ Claims Review ] load uploads of the selected tab from backend");
export const setUploadsPageOfSelectedTab = createAction("[ Claims Review ] update the state with the incoming uploads after calling backend", props<UploadsPage>())
export const setUploadsPageErrorOfSelectedTab = createAction("[ Claims Review ] set error of selected tab page", props<{ message: string }>());
export const loadUploadClaimsList = createAction("[ Claims Review ] load upload claims list ", props<{ data: {uploadId: number, payload: UploadClaimsList} }>());
export const setLoadUploadClaimsList = createAction("[ Claims Review ] set load upload claims list ", props<{ data: {uploadClaimSummaryList: UploadClaimSummaryList} }>());
export const loadSingleClaim = createAction("[ Claims Review ] load single claim", props<{ data: {uploadId: number, provClaimNo: string} }>());
export const setSingleClaim = createAction("[ Claims Review ] set single claim", props<Claim>());
export const loadSingleClaimErrors = createAction("[ Claims Review ] load claim errors", props<{ data: {uploadId: number, provClaimNo: string} }>());
export const setSingleClaimErrors = createAction("[ Claims Review ] set claim errors", props<{errors: FieldError[]}>());
export const setMarkAsDoneReturn = createAction("[ Claims Review ] set Mark As Done Return", props<{data: {claimDetails: ClaimDetails, nextAvailableClaimRow: number}}>());
export const setMarkSelectedAsDoneReturn = createAction("[ Claims Review ] set Mark Selected As Done Return", props<{selectedClaims: string[]}>());
export const setMarkAllAsDone = createAction("[ Claims Review ] set Mark All As Done ");
export const loadDoctorList = createAction("[ Claims Review ] Loading Doctor List Data");
export const loadCoderList = createAction("[ Claims Review ] Loading Coder List Data");
export const setDoctorListReturn = createAction("[ Claims Review ] Setting Up the Doctor List Coming from Backend", props<{ list : SwitchUser[] }>());
export const setCoderListReturn = createAction("[ Claims Review ] Setting up the Coder List Coming From Backend", props<{ list : SwitchUser[] }>());
export const setDoctorAndCoderData = createAction("[ Claims Review ] Setting Up the Doctor and Coder Id For Search", props<{ selectedDoctorId: string, selectedCoderId: string, selectedProvider: string }>());
export const loadProviderList = createAction("[ Claims Review ] Get Provider List");
export const setProviderList = createAction("[ Claims Review ] Set Provider List", props<{ list : any[] }>());


export const setDiagnnosisRemarks = createAction("[ Claims Review ] set diagnosis remarks", props<{data: DiagnosisRemarksUpdateRequest}>());
export const setDiagnosisRemarksReturn = createAction("[ Claims Review ] set diagnosis remarks Return", props<{data: DiagnosisRemarksUpdateRequest}>());
export const setClaimDetailsRemarks = createAction("[ Claims Review ] set claim details remarks", props<{data: DiagnosisRemarksUpdateRequest}>());
export const markAsDone = createAction("[ Claims Review ] mark claim as done", props<{data: MarkAsDone}>());
export const markAsDoneAll = createAction("[ Claims Review ] mark claim as done For all", props<{data: MarkAsDone}>());
export const markAsDoneSelected = createAction("[ Claims Review ] mark claim as done For Selected", props<{data: MarkAsDone}>());
export const deleteUpload = createAction("[ Claims Review ] Delete the Selected Upload", props<{upload : Upload}>());