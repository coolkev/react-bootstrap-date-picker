import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as InputGroup from 'react-bootstrap/lib/InputGroup';
import * as Overlay from 'react-bootstrap/lib/Overlay';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as Button from 'react-bootstrap/lib/Button';
import * as moment from 'moment';
import { CalendarProps, DatePickerProps, DatePickerState } from "./declarations";


let instanceCount = 0;


export class CalendarHeader extends React.Component<any, never> {
    static displayName = 'DatePickerHeader';

    static propTypes = {
        displayDate: PropTypes.object.isRequired,
        minDate: PropTypes.string,
        maxDate: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        monthLabels: PropTypes.array.isRequired,
        previousButtonElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
        nextButtonElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
    };

    displayingMinMonth = () => {
        if (!this.props.minDate) return false;

        const displayDate = new Date(this.props.displayDate);
        const minDate = new Date(this.props.minDate);
        return minDate.getFullYear() == displayDate.getFullYear() && minDate.getMonth() == displayDate.getMonth();
    };

    displayingMaxMonth = () => {
        if (!this.props.maxDate) return false;

        const displayDate = new Date(this.props.displayDate);
        const maxDate = new Date(this.props.maxDate);
        return maxDate.getFullYear() == displayDate.getFullYear() && maxDate.getMonth() == displayDate.getMonth();
    };

    handleClickPrevious = () => {
        const newDisplayDate = new Date(this.props.displayDate);
        newDisplayDate.setDate(1);
        newDisplayDate.setMonth(newDisplayDate.getMonth() - 1);
        this.props.onChange(newDisplayDate);
    };

    handleClickNext = () => {
        const newDisplayDate = new Date(this.props.displayDate);
        newDisplayDate.setDate(1);
        newDisplayDate.setMonth(newDisplayDate.getMonth() + 1);
        this.props.onChange(newDisplayDate);
    };

    render() {
        return <div className="text-center">
            <div className="text-muted pull-left datepicker-previous-wrapper" onClick={this.handleClickPrevious} style={{ cursor: 'pointer' }}>
                {this.displayingMinMonth() ? null : this.props.previousButtonElement}
            </div>
            <span>{this.props.monthLabels[this.props.displayDate.getMonth()]} {this.props.displayDate.getFullYear()}</span>
            <div className="text-muted pull-right datepicker-next-wrapper" onClick={this.handleClickNext} style={{ cursor: 'pointer' }}>
                {this.displayingMaxMonth() ? null : this.props.nextButtonElement}
            </div>
        </div>;
    }
}

export class Calendar extends React.Component<CalendarProps, never> {
    static displayName = 'DatePickerCalendar';

    static propTypes = {
        selectedDate: PropTypes.object,
        displayDate: PropTypes.object.isRequired,
        minDate: PropTypes.string,
        maxDate: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        dayLabels: PropTypes.array.isRequired,
        cellPadding: PropTypes.string.isRequired,
        weekStartsOn: PropTypes.number,
        showTodayButton: PropTypes.bool,
        todayButtonLabel: PropTypes.string,
        roundedCorners: PropTypes.bool
    };

    handleClick = (date: Date) => {
        this.props.onChange(date);
    };

    handleClickToday = () => {
        const newSelectedDate = new Date();
        this.props.onChange(newSelectedDate);
    };

    render() {
        const selectedDate = this.props.selectedDate && moment(this.props.selectedDate);
        const minDate = this.props.minDate && moment(this.props.minDate);
        const maxDate = this.props.maxDate && moment(this.props.maxDate);
        
        const today = moment();
        const displayDate = this.props.displayDate ? moment(this.props.displayDate) : today;
        const year = displayDate.year();
        const month = displayDate.month();

        const firstDay = displayDate.clone().date(1);
        
        const startingDay = this.props.weekStartsOn > 1
            ? firstDay.day() - this.props.weekStartsOn + 7
            : this.props.weekStartsOn === 1
                ? (firstDay.day() === 0 ? 6 : firstDay.day() - 1)
                : firstDay.day();
        const monthLength = displayDate.daysInMonth();

        const weeks = [];
        let day = 1;

        const beforeMinDate = minDate ? date => date.isBefore(minDate) : () => false;
        const afterMaxDate = maxDate ? date => date.isBefore(maxDate) : () => false;

        for (let i = 0; i < 9; i++) {
            const week = [];
            for (let j = 0; j <= 6; j++) {
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    const date = moment({ year: year, month: month, date: day })
                    if (beforeMinDate(date) || afterMaxDate(date)) {
                        week.push(<td
                            key={j}
                            style={{ padding: this.props.cellPadding }}
                            className="text-muted"
                        >
                            {day}
                        </td>);
                    } else {
                        let className = 'cal-day';

                        if (selectedDate && date.isSame(selectedDate)) {
                            className += ' bg-primary';
                        } else if (date.isSame(today, 'day')) {
                            className += ' text-primary';
                        }
                        week.push(<td
                            key={j}
                            onClick={this.handleClick.bind(this, date.toDate())}
                            style={{ cursor: 'pointer', padding: this.props.cellPadding, borderRadius: this.props.roundedCorners ? 5 : 0 }}
                            className={className}
                        >
                            {day}
                        </td>);
                    }
                    day++;
                } else {
                    week.push(<td key={j} />);
                }
            }

            weeks.push(<tr key={i}>{week}</tr>);
            if (day > monthLength) {
                break;
            }
        }

        return <table className="text-center calendar">
            <thead>
                <tr>
                    {this.props.dayLabels.map((label, index) => {
                        return <td
                            key={index}
                            className="text-muted"
                            style={{ padding: this.props.cellPadding }}>
                            <small>{label}</small>
                        </td>;
                    })}
                </tr>
            </thead>
            <tbody>
                {weeks}
            </tbody>
            {this.props.showTodayButton && <tfoot>
                <tr>
                    <td colSpan={this.props.dayLabels.length} style={{ paddingTop: '9px' }}>
                        <Button
                            block
                            bsSize="xsmall"
                            className="u-today-button"
                            onClick={this.handleClickToday}>
                            {this.props.todayButtonLabel}
                        </Button>
                    </td>
                </tr>
            </tfoot>}
        </table>;
    }
}


export default class extends React.Component<DatePickerProps, DatePickerState> {
    static displayName = 'DatePicker';

    static propTypes = {
        defaultValue: PropTypes.string,
        value: PropTypes.string,
        required: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        minDate: PropTypes.string,
        maxDate: PropTypes.string,
        cellPadding: PropTypes.string,
        autoComplete: PropTypes.string,
        placeholder: PropTypes.string,
        dayLabels: PropTypes.array,
        monthLabels: PropTypes.array,
        onChange: PropTypes.func,
        onClear: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        autoFocus: PropTypes.bool,
        disabled: PropTypes.bool,
        weekStartsOnMonday: (props, propName, componentName) => {
            if (props[propName]) {
                return new Error(`Prop '${propName}' supplied to '${componentName}' is obsolete. Use 'weekStartsOn' instead.`);
            }
            return undefined;
        },
        weekStartsOn: PropTypes.number,
        clearButtonElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        showClearButton: PropTypes.bool,
        previousButtonElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        nextButtonElement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        calendarPlacement: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        dateFormat: PropTypes.string, // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'
        bsClass: PropTypes.string,
        bsSize: PropTypes.string,
        calendarContainer: PropTypes.object,
        id: PropTypes.string,
        name: PropTypes.string,
        showTodayButton: PropTypes.bool,
        todayButtonLabel: PropTypes.string,
        instanceCount: PropTypes.number,
        customControl: PropTypes.object,
        roundedCorners: PropTypes.bool,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    };

    static defaultProps = function () {
        const language = typeof window !== 'undefined' && window.navigator ? ((window.navigator as any).userLanguage || window.navigator.language || '').toLowerCase() : '';
        const dateFormat = !language || language === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
        return {
            cellPadding: '5px',
            dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthLabels: ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'],
            clearButtonElement: '×',
            previousButtonElement: '<',
            nextButtonElement: '>',
            calendarPlacement: 'bottom',
            dateFormat: dateFormat,
            showClearButton: true,
            autoFocus: false,
            disabled: false,
            showTodayButton: false,
            todayButtonLabel: 'Today',
            autoComplete: 'on',
            instanceCount: instanceCount++,
            style: {
                width: '100%'
            },
            roundedCorners: true
        };
    }();

    constructor(props, context) {
        super(props, context);
        //console.log('DatePicker constructor', props);
        if (props.value && props.defaultValue) {
            throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
        }
        const state = this.makeDateValues(props.value || props.defaultValue);
        if (props.weekStartsOn > 1) {
            state.dayLabels = props.dayLabels
                .slice(props.weekStartsOn)
                .concat(props.dayLabels.slice(0, props.weekStartsOn));
        } else if (props.weekStartsOn === 1) {
            state.dayLabels = props.dayLabels.slice(1).concat(props.dayLabels.slice(0, 1));
        } else {
            state.dayLabels = props.dayLabels;
        }
        state.focused = false;
        state.inputFocused = false;
        state.placeholder = props.placeholder || props.dateFormat;
        //state.separator = props.dateFormat.match(/[^A-Z]/)[0];
        this.state = state;
    }

    makeDateValues = (dateString: string): DatePickerState => {


        var newDate = moment(dateString);

        if (dateString && newDate.isValid()) {
            return { selectedDate: newDate, inputValue: newDate.format(this.props.dateFormat), displayDate: newDate.toDate() };
        }
        else {
            return { selectedDate: null, inputValue: dateString, displayDate: moment().toDate() };
        }


    };

    clear = () => {
        if (this.props.onClear) {
            this.props.onClear();
        }
        else {
            this.setState(this.makeDateValues(null));
        }

        if (this.props.onChange) {
            this.props.onChange(null, null);
        }
    };

    handleHide = () => {
        if (this.state.inputFocused) {
            return;
        }
        this.setState({
            focused: false
        });
        if (this.props.onBlur) {
            const event: any = document.createEvent('CustomEvent');
            event.initEvent('Change Date', true, false);
            ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
            this.props.onBlur(event);
        }
    };

    handleKeyDown = (e) => {
        if (e.which === 9 && this.state.inputFocused) {
            this.setState({
                focused: false
            });

            if (this.props.onBlur) {
                const event: any = document.createEvent('CustomEvent');
                event.initEvent('Change Date', true, false);
                ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
                this.props.onBlur(event);
            }
        }
    };

    handleFocus = () => {
        if (this.state.focused === true) {
            return;
        }

        const placement = this.getCalendarPlacement();

        this.setState({
            inputFocused: true,
            focused: true,
            calendarPlacement: placement
        });

        if (this.props.onFocus) {
            const event: any = document.createEvent('CustomEvent');
            event.initEvent('Change Date', true, false);
            ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
            this.props.onFocus(event);
        }
    };

    handleBlur = () => {
        //console.log('handleBlur', this.state.selectedDate);

        if (this.state.selectedDate) {

            const newValue = this.state.selectedDate.format(this.props.dateFormat);

            if (newValue != this.state.inputValue) {
                this.setState({
                    inputValue: newValue,
                    inputFocused: false
                },
                    () => this.props.onChange(this.state.selectedDate.toDate(), newValue));

            }
            else {
                this.setState({
                    inputFocused: false
                });
            }

        }
        else {
            this.setState({
                inputFocused: false
            });
        }
    };

    shouldComponentUpdate(_nextProps, nextState) {
        return !(this.state.inputFocused === true && nextState.inputFocused === false);
    }

    getCalendarPlacement = () => {
        //const tag = Object.prototype.toString.call(this.props.calendarPlacement);
        //const isFunction = tag === '[object AsyncFunction]' || tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
        if (typeof (this.props.calendarPlacement) === 'string') {
            return this.props.calendarPlacement;
        }
        else {
            return this.props.calendarPlacement();
        }
    };

    handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {

        var newValue = e.currentTarget.value;


        var newDate = moment(newValue);

        //console.log('handleInputChange', { newValue, isValid: newValue && newValue.length >= 6 && newDate.isValid() });

        if (newValue && newValue.length >= 6 && newDate.isValid()) {

            const yearLength = newDate.year().toString().length;
            //console.log('yearLength', yearLength);
            if (yearLength == 2 || yearLength == 4) {

                this.setState({ selectedDate: newDate, displayDate: newDate.toDate(), inputValue: newValue },
                    () => this.props.onChange(newDate.toDate(), newValue));
                return;

            }

        }

        this.setState({ selectedDate: null, inputValue: newValue });
        

    };

    onChangeMonth = (newDisplayDate: Date) => {
        this.setState({
            displayDate: newDisplayDate
        });
    };

    onChangeDate = (newSelectedDate: Date) => {
        const inputValue = moment(newSelectedDate).format(this.props.dateFormat);
        //console.log('onChangeDate', { newSelectedDate, inputValue });
        this.setState({
            inputValue: inputValue,
            selectedDate: moment(newSelectedDate),
            displayDate: newSelectedDate,
            focused: false
        });

        if (this.props.onBlur) {
            const event: any = document.createEvent('CustomEvent');
            event.initEvent('Change Date', true, false);
            ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
            this.props.onBlur(event);
        }

        if (this.props.onChange) {
            this.props.onChange(newSelectedDate, inputValue);
        }
    };

    componentWillReceiveProps(newProps: DatePickerProps) {
        const value = newProps.value;
        if (!this.state.selectedDate || !this.state.selectedDate.isSame(moment(value))) {
            this.setState(this.makeDateValues(value));
        }
    }

    render() {
        const calendarHeader = <CalendarHeader
            previousButtonElement={this.props.previousButtonElement}
            nextButtonElement={this.props.nextButtonElement}
            displayDate={this.state.displayDate}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            onChange={this.onChangeMonth}
            monthLabels={this.props.monthLabels}
            dateFormat={this.props.dateFormat} />;

        const control = this.props.customControl
            ? React.cloneElement(this.props.customControl as any, {
                onKeyDown: this.handleKeyDown,
                value: this.state.inputValue || '',
                required: this.props.required,
                placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder,
                ref: 'input',
                disabled: this.props.disabled,
                onFocus: this.handleFocus,
                onBlur: this.handleBlur,
                onChange: this.handleInputChange,
                className: this.props.className,
                style: this.props.style,
                autoComplete: this.props.autoComplete,
            })
            : <FormControl
                onKeyDown={this.handleKeyDown}
                value={this.state.inputValue || ''}
                required={this.props.required}
                ref="input"
                type="text"
                className={this.props.className}
                style={this.props.style}
                autoFocus={this.props.autoFocus}
                disabled={this.props.disabled}
                placeholder={this.state.focused ? this.props.dateFormat : this.state.placeholder}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleInputChange}
                autoComplete={this.props.autoComplete}
            />;

        return <InputGroup
            ref="inputGroup"
            bsClass={this.props.showClearButton ? this.props.bsClass : ''}
            bsSize={this.props.bsSize}
            id={this.props.id ? `${this.props.id}_group` : null}>
            {control}
            <Overlay
                rootClose={true}
                onHide={this.handleHide}
                show={this.state.focused}
                container={() => this.props.calendarContainer || ReactDOM.findDOMNode(this.refs.overlayContainer)}
                target={() => ReactDOM.findDOMNode(this.refs.input)}
                placement={this.state.calendarPlacement}
                delayHide={200}>
                <Popover id={`date-picker-popover-${this.props.instanceCount}`} className="date-picker-popover" title={calendarHeader}>
                    <Calendar
                        cellPadding={this.props.cellPadding}
                        selectedDate={this.state.selectedDate && this.state.selectedDate.toDate()}
                        displayDate={this.state.displayDate}
                        onChange={this.onChangeDate}
                        dayLabels={this.state.dayLabels}
                        weekStartsOn={this.props.weekStartsOn}
                        showTodayButton={this.props.showTodayButton}
                        todayButtonLabel={this.props.todayButtonLabel}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        roundedCorners={this.props.roundedCorners}
                    />
                </Popover>
            </Overlay>
            <div ref="overlayContainer" style={{ position: 'relative' }} />
            <input ref="hiddenInput" type="hidden" id={this.props.id} name={this.props.name} value={this.state.inputValue || ''} data-formattedvalue={this.state.selectedDate ? this.state.inputValue : ''} />
            {this.props.showClearButton && !this.props.customControl && <InputGroup.Addon
                onClick={this.props.disabled ? null : this.clear}
                style={{ cursor: (this.state.inputValue && !this.props.disabled) ? 'pointer' : 'not-allowed' }}>
                <div style={{ opacity: (this.state.inputValue && !this.props.disabled) ? 1 : 0.5 }}>
                    {this.props.clearButtonElement}
                </div>
            </InputGroup.Addon>}
            {this.props.children}
        </InputGroup>;
    }
}