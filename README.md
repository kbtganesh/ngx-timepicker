# ngx-timepicker

`ngx-timepicker` is a user-friendly and versatile time picker library designed specifically for Angular applications. It streamlines the process of selecting and validating time inputs, providing a seamless experience for both developers and end-users.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Step 1: Import the NgxTimepickerModule](#step-1-import-the-ngxtimepickermodule)
  - [Step 2: Add the ngx-timepicker component and directive to your template](#step-2-add-the-ngx-timepicker-component-and-directive-to-your-template)
- [NGModel value](#ngmodel-time-should-be-in-below-format)
- [Configure the directive](#configure-the-directive)
- [Customization](#customization)
- [Events](#events)
- [License](#license)

## Installation

```
npm install ngx-timepicker
```

## Usage
### Step 1: Import the NgxTimepickerModule

Import the `NgxTimepickerModule` in your app module:

```typescript
import { NgxTimepickerModule } from 'ngx-timepicker';

@NgModule({
  imports: [
    // ...
    NgxTimepickerModule,
  ],
  // ...
})
export class AppModule {}
```

### Step 2: Add the ngx-timepicker component and directive to your template

In your component's template, add the following HTML code:

```html
<mat-form-field>
  <input
    matInput
    #timePickerTrigger="matMenuTrigger"
    [matMenuTriggerFor]="timepicker.menu"
    [ngxTimepicker]="timepicker"
    [(ngModel)]="selectedTime"
    placeholder="Start Time"
    type="text"
    readonly
  />
</mat-form-field>
<app-time-picker
  #timepicker
  [trigger]="timePickerTrigger"
></app-time-picker>
```

### ngModel value should be in below format
- **For 24 Hour Format** - `HH:mm` (23:00)
- **For 12 Hour Format** - `hh:mm a` (11:00 PM)

## Configure the directive

In your component's TypeScript file, you can set the following properties:
- **minTime**: The minimum allowed time (e.g., '09:00 AM').
- **maxTime**: The maximum allowed time (e.g., '06:00 PM').
- **meridian**: A boolean value to enable or disable the 12-hour format with meridian (AM/PM).

## Customization

You can customize the error messages and error display behavior by setting the following inputs on the app-time-picker component:

- **showError**: A boolean value to show or hide error messages (default: true).
- **minErrorMessage**: The error message to display when the selected time is before the minimum allowed time (default: 'Set time greater than ' + minTime).
- **maxErrorMessage**: The error message to display when the selected time is after the maximum allowed time (default: 'Set time before ' + maxTime).

## Events

- **onerror** _(EventEmitter)_: This event is emitted when the selected time is not within the specified range. It returns an object with the following properties:
    - **status**: Returns `true` if there is an error in time range validation.
    - **beforeMin**: A boolean indicating whether the selected time is before the minimum time.
    - **afterMax**: A boolean indicating whether the selected time is after the maximum time.

That's it! You have successfully integrated the `ngx-timepicker` library into your Angular application.

## License

MIT
