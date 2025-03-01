/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/**
 *  @author: Angus Croll
 * @version: $Id$
 */
/* global confirm, serverIsNotResponding, alert, extraPostData, ajaxError, ajaxErrorHeader*/
/**
 *  Generic Ajax Utils
 */
/**
 * Global Ajax Object
 */
import jQuery from 'jquery';
import dialogs from '../components/components.dialogs';
import {copyTable, copyTableJquery, isIPad, popOverlayObject} from "../util/utils.common";
import {errorHandler, showMessageDialog} from "./core.ajax.utils";
import {JRS} from "../namespace/namespace";
import xssUtil from 'js-sdk/src/common/util/xssUtil';
import Builder from 'scriptaculous/src/builder';

var ajax = {};    //cancel all requests sent before this date (in ms)
//cancel all requests sent before this date (in ms)
ajax.cancelRequestsBefore;
ajax.LOADING_ID = 'loading';    /**
 *  @class Manages incoming Ajax requests and processes corresponding Ajax responses
 *  based on specified attributes.
 *  Responses are bound to to the instance of AjaxRequester created by the corresponing request
 *
 *  @constructor
 *  @param {String} url address for server request
 *  @param {Array} params [1]fillLocation [2]fromLocation [3]Array of callbacks
 *  @param {String} postData user data for posting - where applicable
 *  @return a new AjaxRequester instance
 *  @type AjaxRequester
 */
/**
 *  @class Manages incoming Ajax requests and processes corresponding Ajax responses
 *  based on specified attributes.
 *  Responses are bound to to the instance of AjaxRequester created by the corresponing request
 *
 *  @constructor
 *  @param {String} url address for server request
 *  @param {Array} params [1]fillLocation [2]fromLocation [3]Array of callbacks
 *  @param {String} postData user data for posting - where applicable
 *  @return a new AjaxRequester instance
 *  @type AjaxRequester
 */
function AjaxRequester(url, params, postData, synchronous) {
    this.url = url || document.location.toString();
    this.params = params;
    this.xmlhttp = getXMLHTTP();
    var rsChangeFunction = this.processResponse(this);
    this.xmlhttp.onreadystatechange = rsChangeFunction;
    this.postData = postData;
    this.async = !synchronous;
    this.requestTime = +new Date();    //(new Date).getTime()
}    /////////////////////////////////////////////////////////////////////////
// Prototype Augmentation
/////////////////////////////////////////////////////////////////////////
//(new Date).getTime()
/////////////////////////////////////////////////////////////////////////
// Prototype Augmentation
/////////////////////////////////////////////////////////////////////////
AjaxRequester    //constants for targetted update modes
    .addVar('CUMULATIVE_UPDATE', 'c').addVar('ROW_COPY_UPDATE', 'r').addVar('TARGETTED_REPLACE_UPDATE', 't').addVar('EVAL_JSON', 'j').addVar('DUMMY_POST_PARAM', 'dummyPostData').addVar('MAX_WAIT_TIME', 2000)    //default function assignment
    .addVar('errorHandler', function () {
        return false;
    })    //the function to validate and report errors
/**
     * Submit an ajax get request
     * @private
     * @return true if successful
     * @type boolean
     */.addMethod('doGet', function () {
        if (this.xmlhttp) {
            this.xmlhttp.open('GET', this.url, this.async);
            this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            this.xmlhttp.setRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
            this.xmlhttp.setRequestHeader('x-requested-with', 'AJAXRequest');
            this.xmlhttp.send(null);
            return true;
        }
        return false;
    })    /**
     * Submit an ajax post request
     * @private
     * @return true if successful
     * @type boolean
     */.addMethod('doPost', function () {
        if (this.xmlhttp) {
            if (this.postData === AjaxRequester.prototype.DUMMY_POST_PARAM) {
                this.postData = null;
            }
            this.xmlhttp.open('POST', this.url, this.async);
            this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            this.xmlhttp.setRequestHeader('x-requested-with', 'AJAXRequest');
            this.xmlhttp.send(this.postData);
            return true;
        }
        return false;
    })    /**
     * Function to process the detected Ajax response
     * @param {AjaxRequester} the instance who's request we are processing
     * @private
     * @return the handler function
     * @type function
     */.addMethod('processResponse', function (requester) {
        return function () {
            if (requester.xmlhttp.readyState == 4) {
                if (ajax.cancelRequestsBefore && ajax.cancelRequestsBefore > requester.requestTime) {
                //ignore this request
                    ajaxRequestEnded(requester);
                    return;
                }    //if (requester.verifyAjaxResponse()) {
                //if (requester.verifyAjaxResponse()) {
                handleResponse(requester);    //}
            }
        };
    })    /**
     * Set error handler for this requester
     * @param {function} the error handler function
     * @private
     */.addMethod('setErrorHandler', function (setErrorHandler) {
        this.errorHandler = errorHandler;
    }).addMethod('verifyAjaxResponse', function () {
    //prompt if no server
        return this.xmlhttp.getResponseHeader('Server') || this.confirmContinue();
    })    /**
     * Start countdown to "no response" message
     */.addMethod('startResponseTimer', function () {
        this.responseTimer = window.setTimeout(function () {
            dialogs.popup.show(jQuery('#' + ajax.LOADING_ID)[0], true);
        }, this.MAX_WAIT_TIME);
    })    /**
     * Cancel countdown to "no response" message
     */.addMethod('cancelResponseTimer', function () {
        window.clearTimeout(this.responseTimer);
    })    /**
     * Cancel countdown to "no response" message
     */.addMethod('confirmContinue', function () {
        return confirm(window.serverIsNotResponding);
    });    /////////////////////////////////////////////////////////////////////////
// Prototype Augmentation; End
/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// AjaxRequester: End
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// Global Space: Start
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// Response Handling
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Delegate to handler for ajax response
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
/////////////////////////////////////////////////////////////////////////
// Prototype Augmentation; End
/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// AjaxRequester: End
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// Global Space: Start
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// Response Handling
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Delegate to handler for ajax response
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
function handleResponse(requester) {
    checkForErrors(requester) || requester.responseHandler(requester);
    ajaxRequestEnded(requester);
    if (JRS && JRS.vars) {
        JRS.vars.ajax_in_progress = false;
    }
    if (document.getElementById('mainTableContainerOverlay'))
        document.getElementById('mainTableContainerOverlay').className = 'hidden';
}    ///////////////////////////////////////////////////////////////////////////////////////////////////
// Response Handlers
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Default handler for responses triggered by targeted ajax requests
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
///////////////////////////////////////////////////////////////////////////////////////////////////
// Response Handlers
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Default handler for responses triggered by targeted ajax requests
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
function targettedResponseHandler(requester) {
    var xmlhttp = requester.xmlhttp;
    var fillId = requester.params[0];
    var fromId = requester.params[1];
    var callback = requester.params[2];
    var toLocation = jQuery('#' + fillId)[0];
    if (fromId) {
        jQuery(toLocation).html('');
        updateUsingResponseSubset(xmlhttp, fromId, toLocation);
    } else {
        var res = xmlhttp.responseText.trim();    //dirty solution for old dashboards because we haven't common format pattern for ajax response
        //dirty solution for old dashboards because we haven't common format pattern for ajax response
        if (res.indexOf('<div') === 0) {
            var opentTag = res.substring(0, res.indexOf('>') + 1);
            var body = res.substring(res.indexOf('>') + 1, res.lastIndexOf('</'));
            var closeTag = res.substring(res.lastIndexOf('</'));    //we want all the retrieved content - throw it all in
            //we want all the retrieved content - throw it all in
            var ajaxBuffer = jQuery(opentTag + closeTag);

            // Escape extra level per JSON being inserted into & read from the page
            body = body.replace(/&quot;/g, "&amp;quot;");
            ajaxBuffer.text(xssUtil.hardEscape(body));
            jQuery(toLocation).html(ajaxBuffer);
        } else {
            jQuery(toLocation).html(res);
        }
    }
    invokeCallbacks(callback, toLocation);
}    /**
 * Handler adds new content to existing content in specified container
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
/**
 * Handler adds new content to existing content in specified container
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
function cumulativeResponseHandler(requester) {
    var xmlhttp = requester.xmlhttp;
    var fillId = requester.params[0];
    var fromId = requester.params[1];
    var callback = requester.params[2];
    var toLocation = jQuery('#' + fillId)[0];
    if (fromId) {
        updateUsingResponseSubset(xmlhttp, fromId, toLocation);
    } else {
        //we want all the retrieved content - throw it all in
        toLocation.insert(xmlhttp.responseText, { position: 'after' });    //note this will eval scripts too
    }
    invokeCallbacks(callback);
}    /**
 * Use this handler if the response text represents table rows to add to an existing rows in the specified container
 * (more efficient than appending innerHtml)
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
/**
 * Use this handler if the response text represents table rows to add to an existing rows in the specified container
 * (more efficient than appending innerHtml)
 * @private
 * @param {AjaxRequester} requester the active requester instance
 * @param {Array} params parameters bundled with the request
 */
function rowCopyResponseHandler(requester) {
    var xmlhttp = requester.xmlhttp;
    var tableId = requester.params[0];    //var newRowId = params[1]; //not used yet
    //var newRowId = params[1]; //not used yet
    var callback = requester.params[2];
    var theTable = jQuery('#' + tableId)[0];
    if (theTable.tagName !== 'TABLE') {
        alert('Ajax Exception: rowCopyResponseHandler will not work for container ' + theTable.tagName);
        return;
    }    //put response html into a temp div to form the table
    //var tempDiv = document.createElement('DIV');
    //put response html into a temp div to form the table
    //var tempDiv = document.createElement('DIV');
    var tempDiv = Builder.node('DIV');
    jQuery(tempDiv).html(xmlhttp.responseText);    //now copy to existing table body
    //now copy to existing table body
    copyTable(tempDiv.getElementsByTagName('table')[0], theTable, false, false);
    invokeCallbacks(callback);
}    /**
 * Special handler for when we want to overwrite entire page with response
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
// TODO Consider for removal
/**
 * Special handler for when we want to overwrite entire page with response
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
// TODO Consider for removal
var clobberingResponseHandler = function (requester) {
    var callback = requester.params[2];
    jQuery(document.body).html(requester.xmlhttp.responseText);
    document.fire('dom:loaded');
    invokeCallbacks(callback);
};    /**
 * Handler evals JSOn expression. Does not update markup in anyway
 * For any updates to occur, responseText expression must include an assignment
 * e.g. "var myProfile = {city: London, age: 39, hobbies: ['waterskiing','chess']}"
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
/**
 * Handler evals JSOn expression. Does not update markup in anyway
 * For any updates to occur, responseText expression must include an assignment
 * e.g. "var myProfile = {city: London, age: 39, hobbies: ['waterskiing','chess']}"
 * @param {AjaxRequester} the active requester instance
 * @param {Array} parameters bundled with the request
 * @private
 */
var evalJSONResponseHandler = function (requester) {
    var jSONResponse = null;
    try {
        jSONResponse = requester.xmlhttp.responseText.evalJSON();
    } catch (e) {
        /*eslint-disable-next-line no-console*/
        window.console && console.log(e);
    }
    var callback = requester.params[2];
    invokeCallbacks(callback, jSONResponse);
};
function updateUsingResponseSubset(xmlhttp, fromLocation, toLoc) {
    /**
	 * This prevents the script tags inside responseText to be executed;
	 * If we wanted them to be executed, we would have wrapped the responseText with a div like this:
	 * 		var response = jQuery('<div/>').html(xmlhttp.responseText);
	 */
    var response = jQuery(xmlhttp.responseText);
    var whatWeWant = response.filter('#' + fromLocation);
    if (toLoc.tagName == 'TABLE' && jQuery('#' + fromLocation)[0].tagName == 'TABLE') {
        copyTableJquery(whatWeWant, toLoc, true);
    } else {
        jQuery(toLoc).append(whatWeWant.html());
    }
    function iterate() {
        if (idx >= sz) {
            return;
        }
        var scriptObj = jQuery(scriptTags.get(idx));
        if (scriptObj.attr('src')) {
            idx++;
            loadScript(scriptObj.attr('data-custname'), scriptObj.attr('src'), iterate);
        } else {
            idx++;
            executeScript(scriptObj.html(), iterate);
        }
    }
    function loadScript(scriptName, scriptUrl, callbackFn) {
        var gotCallback = callbackFn || false, scriptElement = document.createElement('script');    // prevent the script tag from being created more than once
        // prevent the script tag from being created more than once
        if (!window.jr_scripts) {
            window.jr_scripts = {};
        }
        if (!window.jr_scripts[scriptName] && scriptName !== 'jr_jq_min') {
            // skips jQuery core script
            scriptElement.setAttribute('type', 'text/javascript');
            if (scriptElement.readyState) {
                // for IE
                scriptElement.onreadystatechange = function () {
                    if (scriptElement.readyState === 'loaded' || scriptElement.readyState === 'complete') {
                        scriptElement.onreadystatechange = null;
                        if (gotCallback) {
                            callbackFn();
                        }
                    }
                };
            } else {
                // for Others - this is not supposed to work on Safari 2
                scriptElement.onload = function () {
                    if (gotCallback) {
                        callbackFn();
                    }
                };
            }
            scriptElement.src = scriptUrl;
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
            window.jr_scripts[scriptName] = scriptUrl;
        } else if (gotCallback) {
            callbackFn();
        }
    }
    function executeScript(scriptString, callbackFn) {
        var gotCallback = callbackFn || false;
        if (scriptString) {
            var lines = scriptString.match(/^.*((\r\n|\n|\r)|$)/gm);
            /*eslint-disable-next-line no-eval*/
            window.eval(lines.join('\n'));
            if (gotCallback) {
                callbackFn();
            }
        }
    }    /*
     * fusioncharts & jasperreports interactive: load JavaScript scripts synchronously
     */
    /*
     * fusioncharts & jasperreports interactive: load JavaScript scripts synchronously
     */
    if (typeof jQuery !== 'undefined' && true) {
        var scriptTags = response.filter('script.jasperreports'), sz = scriptTags.size(), idx = 0;
        iterate();
    }
}
function invokeCallbacks(callback, customArg) {
    if (callback) {
        /*eslint-disable-next-line no-eval*/
        typeof callback === 'string' ? eval(callback) : callback(customArg);
    }
}    /////////////////////////////////////////////////////////////////////////////////////////
// Public API starts Here....
// Please do not amend exisiting signatures but feel free to extend the API as required
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * Send an ajax request with this URL and update the entire page with the response
 * @param {String} url of the request
 */
// TODO Consider for removal
/////////////////////////////////////////////////////////////////////////////////////////
// Public API starts Here....
// Please do not amend exisiting signatures but feel free to extend the API as required
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * Send an ajax request with this URL and update the entire page with the response
 * @param {String} url of the request
 */
// TODO Consider for removal
function ajaxClobberredUpdate(url, options) {
    options.responseHandler = clobberingResponseHandler;
    ajaxUpdate(url, options);
}    /**
 * Send an ajax request with this URL and update the targetContainer  with the sourceContainer container of the response DOM
 * Optionally execute the post fill action as a callback following response processing
 * @param {String} url the url of the request
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 * @param {String} postData user data for posting - where applicable
 * @param {String} update mode (default is targetted replace)
 */
/**
 * Send an ajax request with this URL and update the targetContainer  with the sourceContainer container of the response DOM
 * Optionally execute the post fill action as a callback following response processing
 * @param {String} url the url of the request
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 * @param {String} postData user data for posting - where applicable
 * @param {String} update mode (default is targetted replace)
 */
function ajaxTargettedUpdate(url, options) {
    var responseHandler;
    if (options.mode == AjaxRequester.prototype.CUMULATIVE_UPDATE) {
        responseHandler = cumulativeResponseHandler;
    } else if (options.mode == AjaxRequester.prototype.ROW_COPY_UPDATE) {
        responseHandler = rowCopyResponseHandler;
    } else if (options.mode == AjaxRequester.prototype.EVAL_JSON) {
        responseHandler = evalJSONResponseHandler;
    } else {
        responseHandler = targettedResponseHandler;
    }
    options.responseHandler = function (requester, params) {
        if (options.preFillAction) {
            if (typeof options.preFillAction == 'string') {
                /*eslint-disable-next-line no-eval*/
                eval(options.preFillAction);
            } else {
                options.preFillAction(responseHandler(requester, params));
            }
        } else {
            responseHandler(requester, options.params);
        }
    };
    ajaxUpdate(url, options);
}    /**
 * Send an ajax request with this URL but don't return any content to the sender
 * Optionally execute the post fill action as a callback following response processing
 * @param {String} url the url of the request
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 * @param {String} postData user data for posting - where applicable
 */
/**
 * Send an ajax request with this URL but don't return any content to the sender
 * Optionally execute the post fill action as a callback following response processing
 * @param {String} url the url of the request
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 * @param {String} postData user data for posting - where applicable
 */
function ajaxNonReturningUpdate(url, options) {
    options.responseHandler = null;
    ajaxUpdate(url, options);
}    /**
 * Submit the form and replace entire page
 * @param {String} form name of the form
 * @param {String} url the url of the request
 * @param {String} extraPostData form data for posting
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 */
/**
 * Submit the form and replace entire page
 * @param {String} form name of the form
 * @param {String} url the url of the request
 * @param {String} extraPostData form data for posting
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 */
function ajaxClobberedFormSubmit(form, url, options) {
    var postData = getPostData(form, window.extraPostData);
    options.postData = appendPostData(postData, window.extraPostData);
    options.responseHandler = clobberingResponseHandler;
    ajaxUpdate(url, options);
}    /**
 * Submit the form and update the targetContainer  with the sourceContainer container of the response DOM
 * @param {String} form name of the form
 * @param {String} url the url of the request
 * @param {String} extraPostData form data for posting
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 */
/**
 * Submit the form and update the targetContainer  with the sourceContainer container of the response DOM
 * @param {String} form name of the form
 * @param {String} url the url of the request
 * @param {String} extraPostData form data for posting
 * @param {String} targetContainer id indicating where to dump html response
 * @param {String} sourceContainer id indicating which part of the html response to use
 * @param {Array} callback JS functions to evaluate after ajax update
 * @param {function} errorHandler a function to evaluate to trap errors
 */
function ajaxTargettedFormSubmit(form, url, options) {
    var postData = getPostData(form, options.extraPostData);
    options.postData = appendPostData(postData, options.extraPostData);
    options.responseHandler = targettedResponseHandler;
    ajaxUpdate(url, options);
}
function ajaxErrorHandler() {
    showMessageDialog(window.ajaxError, window.ajaxErrorHeader);
}    ////////////////////////////////////////////////////////////////////////////////
// ...Public API ends Here....
////////////////////////////////////////////////////////////////////////////////
/**
 * @private
 */
//dummy response handler for non returning case
////////////////////////////////////////////////////////////////////////////////
// ...Public API ends Here....
////////////////////////////////////////////////////////////////////////////////
/**
 * @private
 */
//dummy response handler for non returning case
function doNothing() {
}    /**
 * Wrapper for AjaxRequester
 * @private
 * @param {String} url - the url of the request
 * @param {Object} options - an object literal optioanlly defining:
 * @option {function} responseHandler - the designated response handler
 * @option {String} fillLocation - id indicating where in the DOM to dump ajax response
 * @option {String} fromLocation - id indicating which part of the ajax response to use
 * @option {Array} callback - JS functions to evaluate after ajax update
 * @option {function} errorHandler - the designated error handler
 * @option {String} postData - user data for posting - where applicable
 */
/**
 * Wrapper for AjaxRequester
 * @private
 * @param {String} url - the url of the request
 * @param {Object} options - an object literal optioanlly defining:
 * @option {function} responseHandler - the designated response handler
 * @option {String} fillLocation - id indicating where in the DOM to dump ajax response
 * @option {String} fromLocation - id indicating which part of the ajax response to use
 * @option {Array} callback - JS functions to evaluate after ajax update
 * @option {function} errorHandler - the designated error handler
 * @option {String} postData - user data for posting - where applicable
 */
function ajaxUpdate(url, options) {
    var ok = true;
    var requester = new AjaxRequester(url, [
        options.fillLocation,
        options.fromLocation,
        options.callback,
        options.isAutomaticRefresh
    ], options.postData, options.synchronous);
    if (isIPad() && JRS.vars.current_flow == 'adhoc') {
        if (!JRS.vars.ajax_in_progress) {
            JRS.vars.ajax_in_progress = true;
        }
    }
    if (ok) {
        requester.busyCursor = !options.silent;
        requester.showLoading = !options.silent && !options.hideLoader;
        requester.responseHandler = options.responseHandler || doNothing;
        if (requester.responseHandler != doNothing) {
            ajaxRequestStarted(requester);
        }
        if (options.errorHandler) {
            requester.errorHandler = options.errorHandler;
        }
        if (requester.xmlhttp) {
            if (options.postData) {
                requester.doPost();
            } else {
                requester.doGet();
            }
        }
    }
}    /**
 * @private
 */
/**
 * @private
 */
function checkForErrors(requester) {
    var requesterErrorHandler = requester.errorHandler;
    return requesterErrorHandler(requester.xmlhttp);
}    /**
 * @private
 */
/**
 * @private
 */
function getPostData(form, extraPostData) {
    if (typeof form == 'string') {
        form = document.forms[form];
    }
    var data = '';
    for (var i = 0; i < form.elements.length; ++i) {
        var element = form.elements[i];
        if (element.name && !(extraPostData && extraPostData[element.name])) {
            data = appendFormInput(data, element);
        }
    }
    return data;
}    /**
 * @private
 */
/**
 * @private
 */
function appendPostData(postData, extraPostData) {
    for (var name in extraPostData) {
        postData = appendFormValue(postData, name, extraPostData[name]);
    }
    return postData;
}    /**
 * @private
 */
/**
 * @private
 */
function appendFormInput(data, element) {
    if (element.name) {
        var value;
        var append = false;
        switch (element.type) {
        case 'checkbox':
        case 'radio':
            append = element.checked;
            value = element.value;
            break;
        case 'hidden':
        case 'password':
        case 'text':
        case 'Textarea':
            append = true;
            value = element.value;
            break;
        case 'select-one':
        case 'select-multiple':
            value = [];
            for (var i = 0; i < element.options.length; ++i) {
                var option = element.options[i];
                if (option.selected) {
                    append = true;
                    value.push(option.value);
                }
            }
            break;
        }
        if (append) {
            if (value.shift) {
                while (value.length > 0) {
                    data = appendFormValue(data, element.name, value.shift());
                }
            } else {
                data = appendFormValue(data, element.name, value);
            }
        }
    }
    return data;
}    /**
 * @private
 */
/**
 * @private
 */
function appendFormValue(data, name, value) {
    if (data.length > 0) {
        data += '&';
    }
    data += name + '=' + encodeURIComponent(value);
    return data;
}    /**
 * @private
 */
/**
 * @private
 */
var ERROR_POPUP_DIV = 'jsErrorPopup';
var ERROR_POPUP_CONTENTS = 'errorPopupContents';
var ERROR_POPUP_BACK_BUTTON = 'errorBack';
var ERROR_POPUP_CLOSE_BUTTON = 'errorPopupCloseButton';    /**
 * @private
 */
/**
 * @private
 */ /**
 * @private
 */
/**
 * @private
 */
function hideErrorPopup() {
    popOverlayObject();
    var errorPopup = document.getElementById(ERROR_POPUP_DIV);
    errorPopup.style.display = 'none';
}    ////////////////////////////////////////////////////////////////////////////////
// Request counter
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Request counter
////////////////////////////////////////////////////////////////////////////////
ajax.ajaxRequestCount = 0;    /**
 * @private
 */
/**
 * @private
 */
function ajaxRequestStarted(requester) {
    ++ajax.ajaxRequestCount;
    requester.busyCursor && (document.body.style.cursor = 'wait');
    !isIPad() && requester.showLoading && requester.startResponseTimer();
}    /**
 * @private
 */
/**
 * @private
 */
function ajaxRequestEnded(requester) {
    requester.cancelResponseTimer();
    if (ajax.ajaxRequestCount <= 1) {
        document.body.style.cursor = 'auto';
        ajax.ajaxRequestCount = 0;
        dialogs.popup.hide(jQuery('#' + ajax.LOADING_ID)[0]);
    } else {
        ajax.ajaxRequestCount--;
    }
}
function isValidJsonResponse(ajaxAgent) {
    var responseType = ajaxAgent.getResponseHeader('Content-Type');
    return ajaxAgent.status == 200 && responseType != null && responseType.indexOf('application/json') >= 0;
}    ////////////////////////////////////////////////////////////////////////////////
// XMLHTTP
////////////////////////////////////////////////////////////////////////////////
//
// standard function to obtain an xmlhttp instance regardless of platform
//
////////////////////////////////////////////////////////////////////////////////
// XMLHTTP
////////////////////////////////////////////////////////////////////////////////
//
// standard function to obtain an xmlhttp instance regardless of platform
//
function getXMLHTTP() {
    var alerted;
    var xmlhttp;    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
     // JScript gives us Conditional compilation, we can cope with old IE versions.
     try {
     xmlhttp=new ActiveXObject("Msxml2.XMLHTTP")
     } catch (e) {
     try {
     xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
     } catch (E) {
     alert("You must have Microsofts XML parsers available")
     }
     }
     @else
     alert("You must have JScript version 5 or above.")
     xmlhttp=false
     alerted=true
     @end @*/
    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
     // JScript gives us Conditional compilation, we can cope with old IE versions.
     try {
     xmlhttp=new ActiveXObject("Msxml2.XMLHTTP")
     } catch (e) {
     try {
     xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
     } catch (E) {
     alert("You must have Microsofts XML parsers available")
     }
     }
     @else
     alert("You must have JScript version 5 or above.")
     xmlhttp=false
     alerted=true
     @end @*/
    if (!xmlhttp && !alerted) {
        // Non ECMAScript Ed. 3 will error here (IE<5 ok), nothing I can
        // realistically do about it, blame the w3c or ECMA for not
        // having a working versioning capability in  <SCRIPT> or
        // ECMAScript.
        try {
            xmlhttp = new XMLHttpRequest();
        } catch (e) {
            alert('You need a browser which supports an XMLHttpRequest Object.\nMozilla build 0.9.5 has this Object and IE5 and above, others may do, I don\'t know, any info jim@jibbering.com');
        }
    }
    return xmlhttp;
}

//expose to global scope
window.ajaxNonReturningUpdate = ajaxNonReturningUpdate;

export {
    ajaxErrorHandler,
    ajaxClobberredUpdate,
    isValidJsonResponse,
    getPostData,
    checkForErrors,
    ajaxRequestStarted,
    ajaxTargettedFormSubmit,
    ajaxUpdate,
    evalJSONResponseHandler,
    rowCopyResponseHandler,
    cumulativeResponseHandler,
    updateUsingResponseSubset,
    targettedResponseHandler,
    ajaxRequestEnded,
    handleResponse,
    invokeCallbacks,
    getXMLHTTP,
    ajax,
    ajaxTargettedUpdate,
    ajaxNonReturningUpdate,
    appendPostData,
    AjaxRequester
};