﻿var contentPanels = ['loginPanel', 'calendarPanel'];
function TestButtonHandler() {
    var webMethod = "ProjectServices.asmx/TestConnection";
    var parameters = "{}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            alert(responseFromServer);
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

//this function toggles which panel is showing, and also clears data from all panels
function showPanel(panelId) {
    //clearData();
    for (var i = 0; i < contentPanels.length; i++) {
        if (panelId == contentPanels[i]) {
            $("#" + contentPanels[i]).css("visibility", "visible");
        }
        else {
            $("#" + contentPanels[i]).css("visibility", "hidden");
        }
    }
}

function LogOn(userName, pass) {
    //the url of the webservice we will be talking to
    var webMethod = "ProjectServices.asmx/LogOn";
    //the parameters we will pass the service (in json format because curly braces)
    //note we encode the values for transmission over the web.  All the \'s are just
    //because we want to wrap our keynames and values in double quotes so we have to
    //escape the double quotes (because the overall string we're creating is in double quotes!)
    var parameters = "{\"userName\":\"" + encodeURI(userName) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

    //alert(parameters);

    //jQuery ajax method
    $.ajax({
        //post is more secure than get, and allows
        //us to send big data if we want.  really just
        //depends on the way the service you're talking to is set up, though
        type: "POST",
        //the url is set to the string we created above
        url: webMethod,
        //same with the data
        data: parameters,
        //these next two key/value pairs say we intend to talk in JSON format
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //jQuery sends the data and asynchronously waits for a response.  when it
        //gets a response, it calls the function mapped to the success key here
        success: function (msg) {
            //the server response is in the msg object passed in to the function here
            //since our logon web method simply returns a true/false, that value is mapped
            //to a generic property of the server response called d (I assume short for data
            //but honestly I don't know...)
            if (msg.d) {
                //server replied true, so show the accounts panel
                showPanel('calendarPanel');
                //LoadAccounts();
            }
            else {
                //server replied false, so let the user know
                //the logon failed
                alert("logon failed");
            }
        },
        error: function (e) {
            //if something goes wrong in the mechanics of delivering the
            //message to the server or the server processing that message,
            //then this function mapped to the error key is executed rather
            //than the one mapped to the success key.  This is just a garbage
            //alert becaue I'm lazy
            alert("boo...");
        }
    });
}

//this function executes once jQuery has successfully loaded and is
//ready for business.  Usually, if we're wiring up event handlers via jQuery
//then this is where they go.
jQuery(function () {
    //when the app loads, show the logon panel to start with!
    showPanel('loginPanel');
});


(function () {
    var input = document.getElementById('my-input');

    var datepicker = new TheDatepicker.Datepicker(input);
    datepicker.render();

    var updateSetting = function (settingInput, callback) {
        settingInput.className = '';
        try {
            callback();
            datepicker.render();
        } catch (error) {
            console.error(error);
            settingInput.className = 'invalid';
        }
    };

    var createCallback = function (argumentsString, body) {
        var wrap = function () {
            return '{ return function( ' + argumentsString + ' ){ ' + body + ' } };'
        };
        return (new Function(wrap()))();
    };

    var updateListener = function (eventName, body, argumentsString) {
        eventName = eventName.charAt(0).toUpperCase() + eventName.slice(1);

        datepicker.options['off' + eventName]();

        if (body === '') {
            return;
        }

        datepicker.options['on' + eventName](createCallback(argumentsString, body));
    };

    var initialDateInput = document.getElementById('initialDate');
    initialDateInput.onchange = function () {
        updateSetting(initialDateInput, function () {
            datepicker.options.setInitialDate(initialDateInput.value !== '' ? initialDateInput.value : null);
        });
    };

    var initialMonthInput = document.getElementById('initialMonth');
    initialMonthInput.onchange = function () {
        updateSetting(initialMonthInput, function () {
            datepicker.options.setInitialMonth(initialMonthInput.value !== '' ? initialMonthInput.value : null);
        });
    };

    var openInput = document.getElementById('open');
    openInput.onclick = function () {
        datepicker.open();
    };

    var closeInput = document.getElementById('close');
    closeInput.onclick = function () {
        datepicker.close();
    };

    var destroyInput = document.getElementById('destroy');
    destroyInput.onclick = function () {
        datepicker.destroy();
    };

    var hideOnBlurInput = document.getElementById('hideOnBlur');
    hideOnBlurInput.onchange = function () {
        updateSetting(hideOnBlurInput, function () {
            datepicker.options.setHideOnBlur(hideOnBlurInput.checked);
        });
    };

    var hideOnSelectInput = document.getElementById('hideOnSelect');
    hideOnSelectInput.onchange = function () {
        updateSetting(hideOnSelectInput, function () {
            datepicker.options.setHideOnSelect(hideOnSelectInput.checked);
        });
    };

    var inputFormatInput = document.getElementById('inputFormat');
    inputFormatInput.onchange = function () {
        updateSetting(inputFormatInput, function () {
            datepicker.options.setInputFormat(inputFormatInput.value);
        });
    };

    var firstDayOfWeekInput = document.getElementById('firstDayOfWeek');
    firstDayOfWeekInput.onchange = function () {
        updateSetting(firstDayOfWeekInput, function () {
            datepicker.options.setFirstDayOfWeek(firstDayOfWeekInput.value);
        });
    };

    var minDateInput = document.getElementById('minDate');
    minDateInput.onchange = function () {
        updateSetting(minDateInput, function () {
            datepicker.options.setMinDate(minDateInput.value !== '' ? minDateInput.value : null);
        });
    };

    var maxDateInput = document.getElementById('maxDate');
    maxDateInput.onchange = function () {
        updateSetting(maxDateInput, function () {
            datepicker.options.setMaxDate(maxDateInput.value !== '' ? maxDateInput.value : null);
        });
    };

    var yearDropdownItemsLimitInput = document.getElementById('yearDropdownItemsLimit');
    yearDropdownItemsLimitInput.onchange = function () {
        updateSetting(yearDropdownItemsLimitInput, function () {
            datepicker.options.setYearDropdownItemsLimit(yearDropdownItemsLimitInput.value !== '' ? yearDropdownItemsLimitInput.value : null);
        });
    };

    var daysOutOfMonthVisibleInput = document.getElementById('daysOutOfMonthVisible');
    daysOutOfMonthVisibleInput.onchange = function () {
        updateSetting(daysOutOfMonthVisibleInput, function () {
            datepicker.options.setDaysOutOfMonthVisible(daysOutOfMonthVisibleInput.checked);
        });
    };

    var fixedRowsCountInput = document.getElementById('fixedRowsCount');
    fixedRowsCountInput.onchange = function () {
        updateSetting(fixedRowsCountInput, function () {
            datepicker.options.setFixedRowsCount(fixedRowsCountInput.checked);
        });
    };

    var toggleSelectionInput = document.getElementById('toggleSelection');
    toggleSelectionInput.onchange = function () {
        updateSetting(toggleSelectionInput, function () {
            datepicker.options.setToggleSelection(toggleSelectionInput.checked);
        });
    };

    var showDeselectButtonInput = document.getElementById('showDeselectButton');
    showDeselectButtonInput.onchange = function () {
        updateSetting(showDeselectButtonInput, function () {
            datepicker.options.setShowDeselectButton(showDeselectButtonInput.checked);
        });
    };

    var allowEmptyInput = document.getElementById('allowEmpty');
    allowEmptyInput.onchange = function () {
        updateSetting(allowEmptyInput, function () {
            datepicker.options.setAllowEmpty(allowEmptyInput.checked);
        });
    };

    var showCloseButtonInput = document.getElementById('showCloseButton');
    showCloseButtonInput.onchange = function () {
        updateSetting(showCloseButtonInput, function () {
            datepicker.options.setShowCloseButton(showCloseButtonInput.checked);
        });
    };

    var titleInput = document.getElementById('title');
    titleInput.onchange = function () {
        updateSetting(titleInput, function () {
            datepicker.options.setTitle(titleInput.value);
        });
    };

    var showResetButtonInput = document.getElementById('showResetButton');
    showResetButtonInput.onchange = function () {
        updateSetting(showResetButtonInput, function () {
            datepicker.options.setShowResetButton(showResetButtonInput.checked);
        });
    };

    var monthAsDropdownInput = document.getElementById('monthAsDropdown');
    monthAsDropdownInput.onchange = function () {
        updateSetting(monthAsDropdownInput, function () {
            datepicker.options.setMonthAsDropdown(monthAsDropdownInput.checked);
        });
    };

    var yearAsDropdownInput = document.getElementById('yearAsDropdown');
    yearAsDropdownInput.onchange = function () {
        updateSetting(yearAsDropdownInput, function () {
            datepicker.options.setYearAsDropdown(yearAsDropdownInput.checked);
        });
    };

    var positionFixingInput = document.getElementById('positionFixing');
    positionFixingInput.onchange = function () {
        updateSetting(positionFixingInput, function () {
            datepicker.options.setPositionFixing(positionFixingInput.checked);
        });
    };

    var dateAvailabilityResolverInput = document.getElementById('dateAvailabilityResolver');
    dateAvailabilityResolverInput.onchange = function () {
        if (dateAvailabilityResolverInput.value === '') {
            datepicker.options.setDateAvailabilityResolver(null);
        } else {
            datepicker.options.setDateAvailabilityResolver(createCallback('date', dateAvailabilityResolverInput.value));
        }
        datepicker.render();
    };

    var cellContentResolverInput = document.getElementById('cellContentResolver');
    cellContentResolverInput.onchange = function () {
        if (cellContentResolverInput.value === '') {
            datepicker.options.setCellContentResolver(null);
        } else {
            datepicker.options.setCellContentResolver(createCallback('day', cellContentResolverInput.value));
        }
        datepicker.render();
    };

    var cellClassesResolverInput = document.getElementById('cellClassesResolver');
    cellClassesResolverInput.onchange = function () {
        if (cellClassesResolverInput.value === '') {
            datepicker.options.setCellClassesResolver(null);
        } else {
            datepicker.options.setCellClassesResolver(createCallback('day', cellClassesResolverInput.value));
        }
        datepicker.render();
    };

    var onBeforeSelectInput = document.getElementById('onBeforeSelect');
    onBeforeSelectInput.onchange = function () {
        updateListener('beforeSelect', onBeforeSelectInput.value, 'event, day, previousDay');
    };

    var onSelectInput = document.getElementById('onSelect');
    onSelectInput.onchange = function () {
        updateListener('select', onSelectInput.value, 'event, day, previousDay');
    };

    var onBeforeOpenAndCloseInput = document.getElementById('onBeforeOpenAndClose');
    onBeforeOpenAndCloseInput.onchange = function () {
        updateListener('beforeOpenAndClose', onBeforeOpenAndCloseInput.value, 'event, isOpening');
    };

    var onOpenAndCloseInput = document.getElementById('onOpenAndClose');
    onOpenAndCloseInput.onchange = function () {
        updateListener('openAndClose', onOpenAndCloseInput.value, 'event, isOpening');
    };

    var onBeforeMonthChangeInput = document.getElementById('onBeforeMonthChange');
    onBeforeMonthChangeInput.onchange = function () {
        updateListener('beforeMonthChange', onBeforeMonthChangeInput.value, 'event, month, previousMonth');
    };

    var onMonthChangeInput = document.getElementById('onMonthChange');
    onMonthChangeInput.onchange = function () {
        updateListener('monthChange', onMonthChangeInput.value, 'event, month, previousMonth');
    };

    var classesPrefixInput = document.getElementById('classesPrefix');
    classesPrefixInput.onchange = function () {
        updateSetting(classesPrefixInput, function () {
            datepicker.options.setClassesPrefix(classesPrefixInput.value);
        });
    };

    var todayInput = document.getElementById('today');
    todayInput.onchange = function () {
        updateSetting(todayInput, function () {
            datepicker.options.setToday(todayInput.value);
        });
    };

    var goBackHtmlInput = document.getElementById('goBackHtml');
    goBackHtmlInput.onchange = function () {
        updateSetting(goBackHtmlInput, function () {
            datepicker.options.setGoBackHtml(goBackHtmlInput.value);
        });
    };

    var goForwardHtmlInput = document.getElementById('goForwardHtml');
    goForwardHtmlInput.onchange = function () {
        updateSetting(goForwardHtmlInput, function () {
            datepicker.options.setGoForwardHtml(goForwardHtmlInput.value);
        });
    };

    var closeHtmlInput = document.getElementById('closeHtml');
    closeHtmlInput.onchange = function () {
        updateSetting(closeHtmlInput, function () {
            datepicker.options.setCloseHtml(closeHtmlInput.value);
        });
    };

    var resetHtmlInput = document.getElementById('resetHtml');
    resetHtmlInput.onchange = function () {
        updateSetting(resetHtmlInput, function () {
            datepicker.options.setResetHtml(resetHtmlInput.value);
        });
    };

    var deselectHtmlInput = document.getElementById('deselectHtml');
    deselectHtmlInput.onchange = function () {
        updateSetting(deselectHtmlInput, function () {
            datepicker.options.setReselectHtml(deselectHtmlInput.value);
        });
    };

    for (var i = 0; i < 7; i++) {
        (function () {
            var dayOfWeek = i;
            var dayOfWeekTranslationInput = document.getElementById('dayOfWeekTranslation' + dayOfWeek);
            dayOfWeekTranslationInput.onchange = function () {
                updateSetting(dayOfWeekTranslationInput, function () {
                    datepicker.options.translator.setDayOfWeekTranslation(dayOfWeek, dayOfWeekTranslationInput.value);
                });
            };
        })();
    }

    for (var j = 0; j < 12; j++) {
        (function () {
            var month = j;
            var monthTranslationInput = document.getElementById('monthTranslation' + month);
            monthTranslationInput.onchange = function () {
                updateSetting(monthTranslationInput, function () {
                    datepicker.options.translator.setMonthTranslation(month, monthTranslationInput.value);
                });
            };
        })();
    }
})();

