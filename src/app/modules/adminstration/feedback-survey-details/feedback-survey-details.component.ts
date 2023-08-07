import { Component, OnInit, HostListener } from '@angular/core';

import { AuthService } from 'src/app/services/authService/authService.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-survey-details',
  templateUrl: './feedback-survey-details.component.html',
  styles: [],
})
export class FeedbackSurveyDetailsComponent implements OnInit {
  AccessToken: string;
  feedbacksurveyUrl: string;
  iframeSrc: SafeResourceUrl;

  @HostListener('window:message', ['$event'])
  receiveMessage(event: MessageEvent) {   
    if (event.origin !== environment.versionCheckURL) {
      return; // Only accept messages from the specific origin
    }
  }

  constructor(public authService: AuthService,private sanitizer: DomSanitizer) { 
    this.feedbacksurveyUrl = environment.feedbacksurveyUrl;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.feedbacksurveyUrl);
  }
  ngOnInit(): void {
    this.getUserData();   

  }

  getUserData() {
    this.authService.evaluateUserPrivileges();
    this.AccessToken = this.authService.getAccessToken();
  }
  onIframeLoad(event: Event) {
    const iframe: HTMLIFrameElement = event.target as HTMLIFrameElement;

    // Send authorization data to the iframe
    const authorizationData = {
      token: this.AccessToken,
    };
    iframe.contentWindow.postMessage(authorizationData, iframe.src);
  }
}
