import { Injectable } from "@angular/core";




@Injectable({
    providedIn: 'root'
  })
export class HttpRequestExceptionHandler{
    getErrorMessage(error: any): string {
        switch (error.status) {
          case 400: { 
              return `Bad Request error message: ${error.message}`;
          }
          case 404: {
              return `Not Found: ${error.message}`;
          }
          case 403: {
              return `Access Denied: ${error.message}`;
          }
          case 500: {
              return `Internal Server Error: ${error.message}`;
          }
          default: {
              return `status Code:${error.status} Server Error: ${error.message}`;
          }
      }
      }
}