import * as React from 'react';
import * as moment from 'moment';


export as namespace DatePicker;

export = DatePicker;

declare const DatePicker: DatePicker;
type DatePicker = React.ComponentClass<DatePicker.DatePickerProps>;

declare namespace DatePicker {

    type ChangeCallback = (value: Date, formattedValue: string) => void;

    interface DatePickerProps {
        value?: string;
        defaultValue?: string;
        minDate?: string;
        maxDate?: string;
        style?: React.CSSProperties;
        className?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        onChange?: ChangeCallback;
        onFocus?: React.FocusEventHandler<any>;
        onBlur?: React.FocusEventHandler<any>;
        dateFormat?: string;
        clearButtonElement?: React.ReactNode;
        showClearButton?: boolean;
        onClear?: () => void;
        previousButtonElement?: React.ReactNode;
        nextButtonElement?: React.ReactNode;
        cellPadding?: string;
        dayLabels?: string[];
        monthLabels?: string[];
        calendarPlacement?: string | (() => string);
        calendarContainer?: any;
        showTodayButton?: boolean;
        todayButtonLabel?: string;
        customControl?: React.StatelessComponent<any> | React.ComponentClass<any>;
        roundedCorners?: boolean;
        name?: string;
        id?: string;
        weekStartsOn?: number;
        instanceCount?: number;
        bsSize?: string;
        bsClass?: string;
        autoComplete?: string;
        required?: boolean;

    }



    interface DatePickerState {
        //value: string;

        //only used to determine which month/year to show
        displayDate: Date,

        //the current value in the input (may or may not be a valid date)
        inputValue: string,

        //If the current inputValue is a valid date, this will be set, otherwise null
        selectedDate: moment.Moment;
        dayLabels?: string[];

        focused?: boolean;
        inputFocused?: boolean;
        placeholder?: string;
        //separator?: string;
        calendarPlacement?: string;
    }


    interface CalendarProps {
        selectedDate: Date,
        displayDate: Date,
        minDate: string,
        maxDate: string,
        onChange: (newSelectedDate: Date) => void,

        cellPadding?: string;
        dayLabels?: string[];

        showTodayButton?: boolean;
        todayButtonLabel?: string;
        roundedCorners?: boolean;
        weekStartsOn?: number;

    }

}