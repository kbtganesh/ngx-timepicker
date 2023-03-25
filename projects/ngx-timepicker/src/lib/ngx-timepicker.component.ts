import { CommonModule } from '@angular/common';
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
  showTimePicker: boolean = false;
  @Input('trigger') timePickerTriger!: MatMenuTrigger;
  @Input() meridian!: boolean;
  // @Input() triggerElement!: HTMLInputElement;
  // @Output() valueChange = new EventEmitter();
  @ViewChild(MatMenu, { static: true }) menu!: MatMenu;
  onClose;
  isDisabled: boolean = false;
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
      console.log("kbt ~ file: time-picker.component.ts:52 ~ TimePickerComponent ~ this.timePickerTriger.menuOpened.subscribe ~ res:", res)
      
    });

  }

  setValue(value) {
    console.log("kbt ~ SETVALUE:", value)
    if (value?.includes(':')) {
      const [hour, minute] = value?.split(':');
      this.selectedHour = hour;
      this.selectedMinute = minute;
    }
    this.selectedTime = `${this.selectedHour}:${this.selectedMinute}`;
  }

  setOnClose(cb) {
    this.onClose = cb;
  }

  onDigitInput(event: KeyboardEvent, type?) {
    console.log('KBT KEYDOWN');
    console.log(
      'kbt ~ file: time-picker.component.ts:56 ~ TimePickerComponent ~ onDigitInput ~ val:',
      event,
      type
    );
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

  // onKeyDown(event: KeyboardEvent, type): void {
  //   if (event.key === 'ArrowUp') {
  //     console.log('Up arrow key pressed');
  //     // Handle up arrow key action
  //   } else if (event.key === 'ArrowDown') {
  //     console.log('Down arrow key pressed');
  //     // Handle down arrow key action
  //   }
  // }

  increment(type) {
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
    const maxMinute = 59;
    const minMinute = 0;
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
    const maxHour = this.meridian ? 12 : 23;
    const minHour = this.meridian ? 1 : 0;
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
    console.log('KBT NGMODELCHANGE');
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

  showPicker() {
    // this.timePicker.openMenu();
  }

  hidePicker() {
    this.selectedTime =
      this.padWithZero(this.selectedHour) +
      ':' +
      this.padWithZero(this.selectedMinute);
    this.timePickerTriger.closeMenu();
    this.onClose && this.onClose(this.selectedTime);
    this.selectedTime = '';
    // this.valueChange.emit(this.selectedTime);
    // this.timePicker.closeMenu();
  }
}
