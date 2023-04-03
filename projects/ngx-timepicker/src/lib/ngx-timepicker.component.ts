import { CommonModule, Time } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
// import { MaterialModule } from 'src/app/material.module';
// import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

interface TimeRangeValidation {
  status: boolean;
  beforeMin: boolean;
  afterMax: boolean;
}

@Component({
  // standalone: true,
  // imports: [CommonModule, FormsModule, NgxMatTimepickerModule, MaterialModule],
  selector: 'app-time-picker',
  templateUrl: './ngx-timepicker.component.html',
  styleUrls: ['./ngx-timepicker.component.scss'],
  exportAs: 'pickerMenu',
})
export class NgxTimepickerComponent {
  hours: number[] = [];
  minutes: number[] = [];
  selectedHour: string = '09';
  selectedMinute: string = '00';
  selectedTime: string = '';
  selectedMeridian: 'AM' | 'PM' = 'AM';
  showTimePicker: boolean = false;
  @Input('trigger') timePickerTriger!: MatMenuTrigger;
  // @Input() triggerElement!: HTMLInputElement;
  @Output() onerror = new EventEmitter();
  @ViewChild(MatMenu, { static: true }) menu!: MatMenu;
  onClose;
  isDisabled: boolean = false;
  hasMeridian: boolean = false;
  minTime: string = '';
  maxTime: string = '';
  minTimeError: string = '';
  maxTimeError: string = '';

  @Input() showError: boolean = true;
  @Input() minErrorMessage: string = '';
  @Input() maxErrorMessage: string = '';

  constructor(private cdRef: ChangeDetectorRef) {
    for (let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    for (let i = 0; i <= 59; i++) {
      this.minutes.push(i);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.timePickerTriger.menuOpened.subscribe((res) => {
      console.log(
        'kbt ~ file: time-picker.component.ts:52 ~ TimePickerComponent ~ this.timePickerTriger.menuOpened.subscribe ~ res:',
        res
      );
    });
  }

  setValue(value, hasMeridian, minTime, maxTime) {
    console.log(
      'kbt ~ file: ngx-timepicker.component.ts:61 ~ NgxTimepickerComponent ~ setValue ~ value:',
      value,
      hasMeridian,
      minTime,
      maxTime
    );
    this.minTime = minTime;
    this.maxTime = maxTime;
    const [hhmm, meridian] = value ? value?.split(' ') : [];
    if (hasMeridian) this.selectedMeridian = meridian || 'AM';

    if (hhmm?.includes(':')) {
      const [hour, minute] = hhmm?.split(':');
      this.selectedHour = hour;
      this.selectedMinute = minute;
    }
    this.hasMeridian = hasMeridian;
    this.selectedTime = `${this.selectedHour}:${this.selectedMinute}`;
  }

  setOnClose(cb) {
    this.onClose = cb;
  }

  onDigitInput(event: KeyboardEvent, type?) {
    this.resetError();

    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';

    if (arrowUp || arrowDown) {
      event.preventDefault();
      event.stopPropagation();
      if (arrowUp) this.increment(type);
      else this.decrement(type);
    }

    setTimeout(() => {
      (event.target as HTMLInputElement).value =
        type === 'hour' ? this.selectedHour : this.selectedMinute;
    }, 300);
  }

  increment(type) {
    this.resetError();

    const isHour = type === 'hour';
    if (isHour) {
      const hour = this.selectedHour ? +this.selectedHour + 1 : '';
      this.selectedHour = this.calculateHour(hour);
    } else {
      let minute = this.selectedMinute ? +this.selectedMinute + 1 : '';
      this.selectedMinute = this.calculateMinute(minute);
    }
  }
  decrement(type) {
    this.resetError();

    const isHour = type === 'hour';
    if (isHour) {
      const hour = this.selectedHour ? +this.selectedHour - 1 : '';
      this.selectedHour = this.calculateHour(hour);
    } else {
      const minute = this.selectedMinute ? +this.selectedMinute - 1 : '';
      this.selectedMinute = this.calculateMinute(minute);
    }
  }

  calculateMinute(minute, manualEntry?: boolean) {
    const minMinute = 0;
    const maxMinute = 59;

    let modifiedMinute = this.calculateTime(
      minute,
      minMinute,
      maxMinute,
      manualEntry
    );

    if (manualEntry) return modifiedMinute ? modifiedMinute.toString() : '';
    return this.padWithZero(modifiedMinute);
  }

  calculateHour(hour, manualEntry?: boolean) {
    const minHour = this.hasMeridian ? 1 : 0;
    const maxHour = this.hasMeridian ? 12 : 23;

    let modifiedHour = this.calculateTime(hour, minHour, maxHour, manualEntry);
    if (manualEntry) return modifiedHour ? modifiedHour.toString() : '';
    return this.padWithZero(modifiedHour);
  }

  calculateTime(val, min, max, manualEntry) {
    console.log('KBT CALCULATE TIME ', { val, min, max, manualEntry });
    return val > max
      ? manualEntry
        ? max
        : min
      : val < min
      ? manualEntry
        ? min
        : max
      : val;
  }

  isTimeInRange(
    currentTime,
    minTime: string | null = null,
    maxTime: string | null = null
  ): TimeRangeValidation {
    const currentTimeObj = this.parseTime(currentTime);
    const currentInMinutes =
      currentTimeObj?.hours * 60 + currentTimeObj?.minutes;

    const minInMinutes = minTime
      ? this.parseTime(minTime)?.hours * 60 + this.parseTime(minTime)?.minutes
      : -Infinity;
    const maxInMinutes = maxTime
      ? this.parseTime(maxTime)?.hours * 60 + this.parseTime(maxTime)?.minutes
      : Infinity;

    return {
      status:
        currentInMinutes >= minInMinutes && currentInMinutes <= maxInMinutes,
      beforeMin: currentInMinutes < minInMinutes,
      afterMax: currentInMinutes > maxInMinutes,
    };
  }

  parseTime(timeStr) {
    if (!timeStr) return;
    const [time, meridiem] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (meridiem) {
      if (meridiem.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
    }
    return { hours, minutes };
  }

  onBlur(event, type) {
    const value = event.target.value;
    const modifiedVal = this.padWithZero(value);
    if (type === 'hour') this.selectedHour = modifiedVal;
    else this.selectedMinute = modifiedVal;
  }

  padWithZero(value) {
    return value
      ? (value + '').length === 1
        ? `0${value}`
        : value + ''
      : '00';
  }

  validate(val, type?) {
    if (val != 0 && !val) return;
    if (type === 'hour') {
      const hour = this.calculateHour(val, true);
      this.selectedHour = hour;
    }

    if (type === 'minute') {
      const minute = this.calculateMinute(val, true);
      this.selectedMinute = minute;
    }
  }

  handleError(timeInRange: TimeRangeValidation) {
    this.resetError();
    if (this.showError) {
      const minErr =
        this.minErrorMessage || `Time should be greater than ${this.minTime}`;
      const maxErr =
        this.maxErrorMessage || `Time should be less than ${this.maxTime}`;

      if (timeInRange.beforeMin) this.minTimeError = minErr;
      else if (timeInRange.afterMax) this.maxTimeError = maxErr;
    }
    this.onerror.emit(timeInRange);
  }

  resetError() {
    this.minTimeError = '';
    this.maxTimeError = '';
  }

  onDone() {
    let selectedTime =
      this.padWithZero(this.selectedHour) +
      ':' +
      this.padWithZero(this.selectedMinute);
    if (this.hasMeridian) {
      selectedTime += ` ${this.selectedMeridian}`;
    }

    const timeInRange = this.isTimeInRange(
      selectedTime,
      this.minTime,
      this.maxTime
    );
    if (!timeInRange.status) {
      this.handleError(timeInRange);
      if(this.showError) return;
    }

    this.selectedTime = selectedTime;

    this.timePickerTriger.closeMenu();
    this.onClose && this.onClose(this.selectedTime);
    this.selectedTime = '';
    // this.valueChange.emit(this.selectedTime);
    // this.timePicker.closeMenu();
  }
}
