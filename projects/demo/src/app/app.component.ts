import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  selectedTime = '09:00 AM';
  minTime = '09:00 AM';
  maxTime = '11:00 PM';
  enableMeridian: boolean = true;
  showError: boolean = true;

  templateUsage: string = '';

  errorEmitted = '';
  ngOnInit() {
    this.setTemplate();
  }

  ngOnChanges(c) {
    console.log("CHANGE", c);
  }
  onTimePickerError(status) {
    this.errorEmitted = JSON.stringify(status);
  }
  remove(target) {
    if (target === 'min') this.minTime = '';
    if (target === 'max') this.maxTime = '';
  }
  setTemplate() {
    this.templateUsage = `
<mat-form-field>
  <input
    matInput
    #timepickerTrigger="matMenuTrigger"
    [ngxTimepicker]="timepicker"
    [matMenuTriggerFor]="timepicker.menu"
    [(ngModel)]="selectedTime"
    [minTime]="${this.minTime}"
    [maxTime]="${this.maxTime}"
    [meridian]="${this.enableMeridian}"
    placeholder="Selected Time"
    type="text"
    readonly
  />
</mat-form-field>
<app-time-picker
  #timepicker
  [trigger]="timepickerTrigger"
  [showError]="${this.showError}"
  (onerror)="onTimePickerError($event)"
></app-time-picker>
    `;
  }
}
