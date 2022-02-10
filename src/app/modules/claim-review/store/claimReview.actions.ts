import { MatTabChangeEvent, PageEvent } from "@angular/material";
import { createAction, props } from "@ngrx/store";


export const uploadsReviewPageAction = createAction("[ Claims Review ] page changing action in uploads page", props<PageEvent>());
export const uploadsReviewTabAction = createAction("[ Claims Review ] on tab changed action in uploads page", props<{ index: number }>());
export const loadUploadsUnderReviewOfSelectedTab = createAction("[ Claims Review ] load uploads of the selected tab from backend");