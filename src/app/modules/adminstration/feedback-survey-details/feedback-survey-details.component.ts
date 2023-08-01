import { Component, OnInit, HostListener } from '@angular/core';

import { AuthService } from 'src/app/services/authService/authService.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedback-survey-details',
  templateUrl: './feedback-survey-details.component.html',
  styles: [],
})
export class FeedbackSurveyDetailsComponent implements OnInit {
  AccessToken: string;
  feedbacksurveyUrl: string;

  @HostListener('window:message', ['$event'])
  receiveMessage(event: MessageEvent) {
    if (event.origin !== environment.feedbacksurveyUrl) {
      return; // Only accept messages from the specific origin
    }
  }

  constructor(public authService: AuthService) {}
  ngOnInit(): void {
    this.getUserData();
    this.feedbacksurveyUrl = environment.feedbacksurveyUrl;
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
