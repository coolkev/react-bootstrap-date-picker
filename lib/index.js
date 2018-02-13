"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var React = require("react");
var ReactDOM = require("react-dom");
var FormControl = require("react-bootstrap/lib/FormControl");
var InputGroup = require("react-bootstrap/lib/InputGroup");
var Overlay = require("react-bootstrap/lib/Overlay");
var Popover = require("react-bootstrap/lib/Popover");
var Button = require("react-bootstrap/lib/Button");
var moment = require("moment");
var instanceCount = 0;
var CalendarHeader = (function (_super) {
    __extends(CalendarHeader, _super);
    function CalendarHeader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayingMinMonth = function () {
            if (!_this.props.minDate)
                return false;
            var displayDate = new Date(_this.props.displayDate);
            var minDate = new Date(_this.props.minDate);
            return minDate.getFullYear() == displayDate.getFullYear() && minDate.getMonth() == displayDate.getMonth();
        };
        _this.displayingMaxMonth = function () {
            if (!_this.props.maxDate)
                return false;
            var displayDate = new Date(_this.props.displayDate);
            var maxDate = new Date(_this.props.maxDate);
            return maxDate.getFullYear() == displayDate.getFullYear() && maxDate.getMonth() == displayDate.getMonth();
        };
        _this.handleClickPrevious = function () {
            var newDisplayDate = new Date(_this.props.displayDate);
            newDisplayDate.setDate(1);
            newDisplayDate.setMonth(newDisplayDate.getMonth() - 1);
            _this.props.onChange(newDisplayDate);
        };
        _this.handleClickNext = function () {
            var newDisplayDate = new Date(_this.props.displayDate);
            newDisplayDate.setDate(1);
            newDisplayDate.setMonth(newDisplayDate.getMonth() + 1);
            _this.props.onChange(newDisplayDate);
        };
        return _this;
    }
    CalendarHeader.prototype.render = function () {
        return React.createElement("div", { className: "text-center" },
            React.createElement("div", { className: "text-muted pull-left datepicker-previous-wrapper", onClick: this.handleClickPrevious, style: { cursor: 'pointer' } }, this.displayingMinMonth() ? null : this.props.previousButtonElement),
            React.createElement("span", null,
                this.props.monthLabels[this.props.displayDate.getMonth()],
                " ",
                this.props.displayDate.getFullYear()),
            React.createElement("div", { className: "text-muted pull-right datepicker-next-wrapper", onClick: this.handleClickNext, style: { cursor: 'pointer' } }, this.displayingMaxMonth() ? null : this.props.nextButtonElement));
    };
    CalendarHeader.displayName = 'DatePickerHeader';
    CalendarHeader.propTypes = {
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
    return CalendarHeader;
}(React.Component));
exports.CalendarHeader = CalendarHeader;
var Calendar = (function (_super) {
    __extends(Calendar, _super);
    function Calendar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (date) {
            _this.props.onChange(date);
        };
        _this.handleClickToday = function () {
            var newSelectedDate = new Date();
            _this.props.onChange(newSelectedDate);
        };
        return _this;
    }
    Calendar.prototype.render = function () {
        var _this = this;
        var selectedDate = this.props.selectedDate && moment(this.props.selectedDate);
        var minDate = this.props.minDate && moment(this.props.minDate);
        var maxDate = this.props.maxDate && moment(this.props.maxDate);
        var today = moment();
        var displayDate = this.props.displayDate ? moment(this.props.displayDate) : today;
        var year = displayDate.year();
        var month = displayDate.month();
        var firstDay = displayDate.clone().date(1);
        var startingDay = this.props.weekStartsOn > 1
            ? firstDay.day() - this.props.weekStartsOn + 7
            : this.props.weekStartsOn === 1
                ? (firstDay.day() === 0 ? 6 : firstDay.day() - 1)
                : firstDay.day();
        var monthLength = displayDate.daysInMonth();
        var weeks = [];
        var day = 1;
        var beforeMinDate = minDate ? function (date) { return date.isBefore(minDate); } : function () { return false; };
        var afterMaxDate = maxDate ? function (date) { return date.isBefore(maxDate); } : function () { return false; };
        for (var i = 0; i < 9; i++) {
            var week = [];
            for (var j = 0; j <= 6; j++) {
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    var date = moment({ year: year, month: month, date: day });
                    if (beforeMinDate(date) || afterMaxDate(date)) {
                        week.push(React.createElement("td", { key: j, style: { padding: this.props.cellPadding }, className: "text-muted" }, day));
                    }
                    else {
                        var className = 'cal-day';
                        if (selectedDate && date.isSame(selectedDate)) {
                            className += ' bg-primary';
                        }
                        else if (date.isSame(today, 'day')) {
                            className += ' text-primary';
                        }
                        week.push(React.createElement("td", { key: j, onClick: this.handleClick.bind(this, date.toDate()), style: { cursor: 'pointer', padding: this.props.cellPadding, borderRadius: this.props.roundedCorners ? 5 : 0 }, className: className }, day));
                    }
                    day++;
                }
                else {
                    week.push(React.createElement("td", { key: j }));
                }
            }
            weeks.push(React.createElement("tr", { key: i }, week));
            if (day > monthLength) {
                break;
            }
        }
        return React.createElement("table", { className: "text-center calendar" },
            React.createElement("thead", null,
                React.createElement("tr", null, this.props.dayLabels.map(function (label, index) {
                    return React.createElement("td", { key: index, className: "text-muted", style: { padding: _this.props.cellPadding } },
                        React.createElement("small", null, label));
                }))),
            React.createElement("tbody", null, weeks),
            this.props.showTodayButton && React.createElement("tfoot", null,
                React.createElement("tr", null,
                    React.createElement("td", { colSpan: this.props.dayLabels.length, style: { paddingTop: '9px' } },
                        React.createElement(Button, { block: true, bsSize: "xsmall", className: "u-today-button", onClick: this.handleClickToday }, this.props.todayButtonLabel)))));
    };
    Calendar.displayName = 'DatePickerCalendar';
    Calendar.propTypes = {
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
    return Calendar;
}(React.Component));
exports.Calendar = Calendar;
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.makeDateValues = function (dateString) {
            var newDate = moment(dateString);
            if (dateString && newDate.isValid()) {
                return { selectedDate: newDate, inputValue: newDate.format(_this.props.dateFormat), displayDate: newDate.toDate() };
            }
            else {
                return { selectedDate: null, inputValue: dateString, displayDate: moment().toDate() };
            }
        };
        _this.clear = function () {
            if (_this.props.onClear) {
                _this.props.onClear();
            }
            else {
                _this.setState(_this.makeDateValues(null));
            }
            if (_this.props.onChange) {
                _this.props.onChange(null, null);
            }
        };
        _this.handleHide = function () {
            if (_this.state.inputFocused) {
                return;
            }
            _this.setState({
                focused: false
            });
            if (_this.props.onBlur) {
                var event_1 = document.createEvent('CustomEvent');
                event_1.initEvent('Change Date', true, false);
                ReactDOM.findDOMNode(_this.refs.hiddenInput).dispatchEvent(event_1);
                _this.props.onBlur(event_1);
            }
        };
        _this.handleKeyDown = function (e) {
            if (e.which === 9 && _this.state.inputFocused) {
                _this.setState({
                    focused: false
                });
                if (_this.props.onBlur) {
                    var event_2 = document.createEvent('CustomEvent');
                    event_2.initEvent('Change Date', true, false);
                    ReactDOM.findDOMNode(_this.refs.hiddenInput).dispatchEvent(event_2);
                    _this.props.onBlur(event_2);
                }
            }
        };
        _this.handleFocus = function () {
            if (_this.state.focused === true) {
                return;
            }
            var placement = _this.getCalendarPlacement();
            _this.setState({
                inputFocused: true,
                focused: true,
                calendarPlacement: placement
            });
            if (_this.props.onFocus) {
                var event_3 = document.createEvent('CustomEvent');
                event_3.initEvent('Change Date', true, false);
                ReactDOM.findDOMNode(_this.refs.hiddenInput).dispatchEvent(event_3);
                _this.props.onFocus(event_3);
            }
        };
        _this.handleBlur = function () {
            //console.log('handleBlur', this.state.selectedDate);
            if (_this.state.selectedDate) {
                var newValue_1 = _this.state.selectedDate.format(_this.props.dateFormat);
                if (newValue_1 != _this.state.inputValue) {
                    _this.setState({
                        inputValue: newValue_1,
                        inputFocused: false
                    }, function () { return _this.props.onChange(_this.state.selectedDate.toDate(), newValue_1); });
                }
                else {
                    _this.setState({
                        inputFocused: false
                    });
                }
            }
            else {
                if (_this.props.value) {
                    _this.props.onChange(null, null);
                }
                _this.setState({
                    inputFocused: false
                });
            }
        };
        _this.getCalendarPlacement = function () {
            //const tag = Object.prototype.toString.call(this.props.calendarPlacement);
            //const isFunction = tag === '[object AsyncFunction]' || tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
            if (typeof (_this.props.calendarPlacement) === 'string') {
                return _this.props.calendarPlacement;
            }
            else {
                return _this.props.calendarPlacement();
            }
        };
        _this.handleInputChange = function (e) {
            var newValue = e.currentTarget.value;
            var newDate = moment(newValue);
            //console.log('handleInputChange', { newValue, isValid: newValue && newValue.length >= 6 && newDate.isValid() });
            if (newValue && newValue.length >= 6 && newDate.isValid()) {
                var yearLength = newDate.year().toString().length;
                //console.log('yearLength', yearLength);
                if (yearLength == 2 || yearLength == 4) {
                    _this.setState({ selectedDate: newDate, displayDate: newDate.toDate(), inputValue: newValue }, function () { return _this.props.onChange(newDate.toDate(), newValue); });
                    return;
                }
            }
            _this.setState({ selectedDate: null, inputValue: newValue });
        };
        _this.onChangeMonth = function (newDisplayDate) {
            _this.setState({
                displayDate: newDisplayDate
            });
        };
        _this.onChangeDate = function (newSelectedDate) {
            var inputValue = moment(newSelectedDate).format(_this.props.dateFormat);
            //console.log('onChangeDate', { newSelectedDate, inputValue });
            _this.setState({
                inputValue: inputValue,
                selectedDate: moment(newSelectedDate),
                displayDate: newSelectedDate,
                focused: false
            });
            if (_this.props.onBlur) {
                var event_4 = document.createEvent('CustomEvent');
                event_4.initEvent('Change Date', true, false);
                ReactDOM.findDOMNode(_this.refs.hiddenInput).dispatchEvent(event_4);
                _this.props.onBlur(event_4);
            }
            if (_this.props.onChange) {
                _this.props.onChange(newSelectedDate, inputValue);
            }
        };
        //console.log('DatePicker constructor', props);
        if (props.value && props.defaultValue) {
            throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
        }
        var state = _this.makeDateValues(props.value || props.defaultValue);
        if (props.weekStartsOn > 1) {
            state.dayLabels = props.dayLabels
                .slice(props.weekStartsOn)
                .concat(props.dayLabels.slice(0, props.weekStartsOn));
        }
        else if (props.weekStartsOn === 1) {
            state.dayLabels = props.dayLabels.slice(1).concat(props.dayLabels.slice(0, 1));
        }
        else {
            state.dayLabels = props.dayLabels;
        }
        state.focused = false;
        state.inputFocused = false;
        state.placeholder = props.placeholder || props.dateFormat;
        //state.separator = props.dateFormat.match(/[^A-Z]/)[0];
        _this.state = state;
        return _this;
    }
    default_1.prototype.shouldComponentUpdate = function (_nextProps, nextState) {
        return !(this.state.inputFocused === true && nextState.inputFocused === false);
    };
    default_1.prototype.componentWillReceiveProps = function (newProps) {
        var value = newProps.value;
        if (!this.state.selectedDate || !this.state.selectedDate.isSame(moment(value))) {
            this.setState(this.makeDateValues(value));
        }
    };
    default_1.prototype.render = function () {
        var _this = this;
        var calendarHeader = React.createElement(CalendarHeader, { previousButtonElement: this.props.previousButtonElement, nextButtonElement: this.props.nextButtonElement, displayDate: this.state.displayDate, minDate: this.props.minDate, maxDate: this.props.maxDate, onChange: this.onChangeMonth, monthLabels: this.props.monthLabels, dateFormat: this.props.dateFormat });
        var control = this.props.customControl
            ? React.cloneElement(this.props.customControl, {
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
            : React.createElement(FormControl, { onKeyDown: this.handleKeyDown, value: this.state.inputValue || '', required: this.props.required, ref: "input", type: "text", className: this.props.className, style: this.props.style, autoFocus: this.props.autoFocus, disabled: this.props.disabled, placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder, onFocus: this.handleFocus, onBlur: this.handleBlur, onChange: this.handleInputChange, autoComplete: this.props.autoComplete });
        return React.createElement(InputGroup, { ref: "inputGroup", bsClass: this.props.showClearButton ? this.props.bsClass : '', bsSize: this.props.bsSize, id: this.props.id ? this.props.id + "_group" : null },
            control,
            React.createElement(Overlay, { rootClose: true, onHide: this.handleHide, show: this.state.focused, container: function () { return _this.props.calendarContainer || ReactDOM.findDOMNode(_this.refs.overlayContainer); }, target: function () { return ReactDOM.findDOMNode(_this.refs.input); }, placement: this.state.calendarPlacement, delayHide: 200 },
                React.createElement(Popover, { id: "date-picker-popover-" + this.props.instanceCount, className: "date-picker-popover", title: calendarHeader },
                    React.createElement(Calendar, { cellPadding: this.props.cellPadding, selectedDate: this.state.selectedDate && this.state.selectedDate.toDate(), displayDate: this.state.displayDate, onChange: this.onChangeDate, dayLabels: this.state.dayLabels, weekStartsOn: this.props.weekStartsOn, showTodayButton: this.props.showTodayButton, todayButtonLabel: this.props.todayButtonLabel, minDate: this.props.minDate, maxDate: this.props.maxDate, roundedCorners: this.props.roundedCorners }))),
            React.createElement("div", { ref: "overlayContainer", style: { position: 'relative' } }),
            React.createElement("input", { ref: "hiddenInput", type: "hidden", id: this.props.id, name: this.props.name, value: this.state.inputValue || '', "data-formattedvalue": this.state.selectedDate ? this.state.inputValue : '' }),
            this.props.showClearButton && !this.props.customControl && React.createElement(InputGroup.Addon, { onClick: this.props.disabled ? null : this.clear, style: { cursor: (this.state.inputValue && !this.props.disabled) ? 'pointer' : 'not-allowed' } },
                React.createElement("div", { style: { opacity: (this.state.inputValue && !this.props.disabled) ? 1 : 0.5 } }, this.props.clearButtonElement)),
            this.props.children);
    };
    default_1.displayName = 'DatePicker';
    default_1.propTypes = {
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
        weekStartsOnMonday: function (props, propName, componentName) {
            if (props[propName]) {
                return new Error("Prop '" + propName + "' supplied to '" + componentName + "' is obsolete. Use 'weekStartsOn' instead.");
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
        dateFormat: PropTypes.string,
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
    default_1.defaultProps = function () {
        var language = typeof window !== 'undefined' && window.navigator ? (window.navigator.userLanguage || window.navigator.language || '').toLowerCase() : '';
        var dateFormat = !language || language === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
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
    return default_1;
}(React.Component));
exports.default = default_1;
