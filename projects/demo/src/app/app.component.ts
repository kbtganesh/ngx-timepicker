import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';
  selectedTime = '1:00 PM';
  minTime = '';
  maxTime = '11:00 PM';
  enableMeridian: boolean = true;
  onTimePickerError(status) {
    console.log("kbt ~ file: app.component.ts:15 ~ AppComponent ~ onTimePickerError ~ status:", status)
    
  }
}
