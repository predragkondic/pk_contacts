/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/dt-1.11.3/e-2.0.5/b-2.0.1/sp-1.4.0/sl-1.3.3
 *
 * Included libraries:
 *   DataTables 1.11.3, Editor 2.0.5, Buttons 2.0.1, SearchPanes 1.4.0, Select 1.3.3
 */

/*! DataTables 1.11.3
 * ©2008-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.11.3
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		window.DataTable = factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( selector, options )
	{
		// When creating with `new`, create a new DataTable, returning the API instance
		if (this instanceof DataTable) {
			return $(selector).DataTable(options);
		}
		else {
			// Argument switching
			options = selector;
		}

		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnCamelToHungarian( defaults.oLanguage, json );
						_fnLanguageCompat( json );
						$.extend( true, oLanguage, json );
			
						_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			else {
				_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').insertAfter(thead);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	var _includes = function (search, start) {
		if (start === undefined) {
			start = 0;
		}
	
		return this.indexOf(search, start) !== -1;	
	};
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	if (! Array.prototype.includes) {
		Array.prototype.includes = _includes;
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	if (! String.prototype.includes) {
		String.prototype.includes = _includes;
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},
	
		/**
		 * Create a function that will write to a nested object or array
		 * @param {*} source JSON notation string
		 * @returns Write function
		 */
		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				/* Unlike get, only the underscore (global) option is used for for
				 * setting data since we don't know the type here. This is why an object
				 * option is not documented for `mData` (which is read/write), but it is
				 * for `mRender` which is read only.
				 */
				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {
				// Nothing to do when the data source is null
				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				// Like the get, we need to get data from a nested object
				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;
		
					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
						// Protect against prototype pollution
						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}
		
						// Check if we are dealing with an array notation request
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
		
						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];
		
							// Get the remainder of the nested object to set so we can recurse
							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');
		
							// Traverse each entry in the array setting the properties requested
							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {
								// We've been asked to save data to an array, but it
								// isn't array data to be saved. Best that can be done
								// is to just save the value.
								data[ a[i] ] = val;
							}
		
							// The inner call to setData has already traversed through the remainder
							// of the source and has set the data, thus we can exit here
							return;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}
		
						// If the nested object doesn't currently exist - since we are
						// trying to set the value - create it
						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}
		
					// Last item in the input - i.e, the actual set
					if ( aLast.match(__reFn ) ) {
						// Function call
						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {
						// If array notation is used, we just want to strip it and use the property name
						// and assign the value. If it isn't used, then we get the result we want anyway
						data[ aLast.replace(__reArray, '') ] = val;
					}
				};
		
				return function (data, val) { // meta is also passed in, but not used
					return setData( data, val, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, val) { // meta is also passed in, but not used
					data[source] = val;
				};
			}
		},
	
		/**
		 * Create a function that will read nested objects from arrays, based on JSON notation
		 * @param {*} source JSON notation string
		 * @returns Value read
		 */
		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				// Build an object of get functions, and wrap them in a single call
				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );
		
				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {
				// Give an empty string for rendering / sorting etc
				return function (data) { // type, row and meta also passed, but not used
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				/* If there is a . in the source string then the data source is in a
				 * nested object so we loop over the data for each level to get the next
				 * level down. On each loop we test for undefined, and if found immediately
				 * return. This allows entire objects to be missing and sDefaultContent to
				 * be used if defined, rather than throwing an error
				 */
				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;
		
					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );
		
						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
							// Check if we are dealing with special notation
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);
		
							if ( arrayNotation ) {
								// Array notation
								a[i] = a[i].replace(__reArray, '');
		
								// Condition allows simply [] to be passed in
								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];
		
								// Get the remainder of the nested object to get
								a.splice( 0, i+1 );
								innerSrc = a.join('.');
		
								// Traverse each entry in the array getting the properties requested
								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}
		
								// If a string is given in between the array notation indicators, that
								// is used to join the strings together, otherwise an array is returned
								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);
		
								// The inner call to fetchData has already traversed through the remainder
								// of the source requested, so we exit from the loop
								break;
							}
							else if ( funcNotation ) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}
		
							if ( data === null || data[ a[i] ] === undefined ) {
								return undefined;
							}
	
							data = data[ a[i] ];
						}
					}
		
					return data;
				};
		
				return function (data, type) { // row and meta also passed, but not used
					return fetchData( data, type, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, type) { // row and meta also passed, but not used
					return data[source];
				};
			}
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Convert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Convert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string - but it
						// must not be empty
						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		if (type === 'search') {
			type = 'filter';
		}
		else if (type === 'order') {
			type = 'sort';
		}
	
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type === 'display' ) {
			return '';
		}
	
		if ( type === 'filter' ) {
			var fomatters = DataTable.ext.type.search;
	
			if ( fomatters[ col.sType ] ) {
				cellData = fomatters[ col.sType ]( cellData );
			}
		}
	
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	var _fnGetObjectDataFn = DataTable.util.get;
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	var _fnSetObjectDataFn = DataTable.util.set;
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @param ajaxComplete true after ajax call to complete rendering
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings, ajaxComplete )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !ajaxComplete)
		{
			_fnAjaxUpdate( oSettings );
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXhr
				? oSettings.jqXhr.status
				: null;
	
			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}
	
			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}
	
			oSettings.json = json;
	
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );
	
		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		// No data in returned object, so rather than an array, we show an empty table
		if ( ! data ) {
			data = [];
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		_fnDraw( settings, true );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	 function _fnAjaxDataSrc ( oSettings, json, write )
	 {
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		if ( ! write ) {
			if ( dataSrc === 'data' ) {
				// If the default, then we still want to support the old style, and safely ignore
				// it if possible
				return json.aaData || json[dataSrc];
			}
	
			return dataSrc !== "" ?
				_fnGetObjectDataFn( dataSrc )( json ) :
				json;
		}
	
		// set
		_fnSetObjectDataFn( dataSrc )( json, write );
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function(event) {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
			if(previousSearch.return && event.key !== "Enter") {
				return;
			}
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive,
					"return": previousSearch.return
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
			oPrevSearch.return = oFilter.return;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive, oInput.return );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			var style = window.getComputedStyle ?
				window.getComputedStyle(nSizer).width :
				_fnStringToCss( $(nSizer).width() );
	
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( style );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = headerWidths[i];
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.ariaTitle || col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
		
		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}
		// otherwise, wait for the loaded callback to be executed
	
		return true;
	}
	
	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;
	
		// When StateRestore was introduced the state could now be implemented at any time
		// Not just initialisation. To do this an api instance is required in some places
		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;
	
		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			settings._iDisplayStart    = s.start;
			if(api === null) {
				settings.iInitDisplayStart = s.start;
			}
		}
		if ( s.length !== undefined ) {
			settings._iDisplayLength   = s.length;
		}
	
		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
		}
	
		// Columns
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];
	
				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}
	
				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
				}
			}
			
			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	
		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	};
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and filter=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
		api.on( 'stateSaveParams', function ( e, settings, data ) {
			var indexes = api.rows().iterator( 'row', function ( settings, idx ) {
				return settings.aoData[idx]._detailsShow ? idx : undefined;
			});
	
			data.childRows = api.rows( indexes ).ids( true ).toArray();
		})
	
		var loaded = api.state.loaded();
	
		if ( loaded && loaded.childRows ) {
			api.rows( loaded.childRows ).every( function () {
				_fnCallbackFire( context, null, 'requestChild', [ this ] )
			})
		}
	})
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.11.3";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true,
	
		/**
		 * Flag to indicate if DataTables should only trigger a search when
		 * the return key is pressed.
		 *  @type boolean
		 *  @default false
		 */
		"return": false
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed display and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all for DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs4/dt-1.11.3/e-2.0.5/b-2.0.1/sp-1.4.0/sl-1.3.3",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatibility only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_desc_disabled",
		"sSortableDesc": "sorting_asc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		if (Array.isArray(d)) {
			d = d.join(',');
		}
	
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					// If zero, then can't have a negative prefix
					if (intPart === 0 && parseFloat(floatPart) === 0) {
						negative = '';
					}
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnImplementState: _fnImplementState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );

	return DataTable;
}));


/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     2.0.5
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2021 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

w3ii[541378]=(function(){var S=2;for(;S !== 9;){switch(S){case 1:return globalThis;break;case 2:S=typeof globalThis === '\u006f\x62\u006a\x65\x63\u0074'?1:5;break;case 5:var w;try{var t=2;for(;t !== 6;){switch(t){case 3:throw "";t=9;break;case 2:Object['\u0064\x65\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\u0074\x79'](Object['\x70\x72\u006f\u0074\x6f\u0074\x79\u0070\x65'],'\u0044\x6b\x6e\u0063\x30',{'\x67\x65\x74':function(){var q=2;for(;q !== 1;){switch(q){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});w=Dknc0;w['\x4c\x53\x50\u0067\x32']=w;t=4;break;case 9:delete w['\x4c\x53\x50\u0067\x32'];var h=Object['\u0070\u0072\x6f\u0074\x6f\u0074\u0079\u0070\u0065'];delete h['\u0044\x6b\x6e\u0063\x30'];t=6;break;case 4:t=typeof LSPg2 === '\x75\u006e\x64\u0065\x66\u0069\x6e\x65\x64'?3:9;break;}}}catch(N){w=window;}return w;break;}}})();Q7q(w3ii[541378]);w3ii[626273]="1";w3ii[541378].s3EE=w3ii;w3ii.l13='object';w3ii[174097]=(function(g){function T(U2){var n2=2;for(;n2 !== 15;){switch(n2){case 2:var W2,Z,j2,L2,e2,k2,M2;n2=1;break;case 7:n2=! Q--?6:14;break;case 11:k2=(e2 || e2 === 0) && M2(e2,Z);n2=10;break;case 5:M2=H[g[4]];n2=4;break;case 9:n2=! Q--?8:7;break;case 19:return W2;break;case 12:n2=! Q--?11:10;break;case 16:W2=L2 - U2 > Z;n2=19;break;case 14:n2=! Q--?13:12;break;case 10:n2=k2 >= 0 && L2 >= 0?20:18;break;case 1:n2=! Q--?5:4;break;case 6:L2=j2 && M2(j2,Z);n2=14;break;case 17:W2=U2 - k2 > Z;n2=19;break;case 3:Z=29;n2=9;break;case 4:n2=! Q--?3:9;break;case 8:j2=g[6];n2=7;break;case 18:n2=k2 >= 0?17:16;break;case 13:e2=g[7];n2=12;break;case 20:W2=U2 - k2 > Z && L2 - U2 > Z;n2=19;break;}}}var N2=2;for(;N2 !== 10;){switch(N2){case 6:N2=! Q--?14:13;break;case 12:var u,X=0;N2=11;break;case 5:H=w3ii[541378];N2=4;break;case 9:l=typeof f;N2=8;break;case 11:return {E:function(G2){var b2=2;for(;b2 !== 13;){switch(b2){case 14:return J2?u:!u;break;case 5:b2=! Q--?4:3;break;case 9:X=p2 + 60000;b2=8;break;case 2:var p2=new H[g[0]]()[g[1]]();b2=1;break;case 3:b2=! Q--?9:8;break;case 6:(function(){var l2=2;for(;l2 !== 53;){switch(l2){case 38:l2=s2[w2]?37:36;break;case 23:Y2+=V2;Y2+=u2;Y2+=K2;var w2=z2;l2=34;break;case 31:w2+=g2;w2+=a2;w2+=C2;w2+=H2;w2+=Q2;l2=43;break;case 16:Y2+=g2;Y2+=a2;Y2+=C2;Y2+=H2;l2=25;break;case 43:w2+=q2;w2+=V2;w2+=u2;l2=40;break;case 34:w2+=A2;w2+=D2;w2+=E2;l2=31;break;case 2:var K2="s";var A2="q";var f2=541378;var q2="N";var E2="r";l2=9;break;case 12:var V2="X";var H2="P";l2=10;break;case 37:return;break;case 40:w2+=K2;var s2=w3ii[f2];l2=38;break;case 9:var Q2="7";var C2="z";var g2="R";l2=6;break;case 36:try{var O2=2;for(;O2 !== 1;){switch(O2){case 2:expiredWarning();O2=1;break;}}}catch(d2){}s2[Y2]=function(){};l2=53;break;case 10:var u2="L";var Y2=z2;Y2+=A2;Y2+=D2;Y2+=E2;l2=16;break;case 25:Y2+=Q2;Y2+=q2;l2=23;break;case 6:var z2="_";var D2="l";var a2="h";l2=12;break;}}})();b2=14;break;case 1:b2=p2 > X?5:8;break;case 8:var J2=(function(t2,m2){var X2=2;for(;X2 !== 10;){switch(X2){case 2:X2=typeof t2 === 'undefined' && typeof G2 !== 'undefined'?1:5;break;case 4:m2=g;X2=3;break;case 1:t2=G2;X2=5;break;case 6:X2=R2 === 0?14:12;break;case 11:return x2;break;case 12:x2=x2 ^ B2;X2=13;break;case 14:x2=B2;X2=13;break;case 3:var x2,R2=0;X2=9;break;case 5:X2=typeof m2 === 'undefined' && typeof g !== 'undefined'?4:3;break;case 9:X2=R2 < t2[m2[5]]?8:11;break;case 8:var h2=H[m2[4]](t2[m2[2]](R2),16)[m2[3]](2);var B2=h2[m2[2]](h2[m2[5]] - 1);X2=6;break;case 13:R2++;X2=9;break;}}})(undefined,undefined);b2=7;break;case 4:u=T(p2);b2=3;break;case 7:b2=!u?6:14;break;}}}};break;case 3:N2=! Q--?9:8;break;case 14:g=g.W2MM(function(y2){var S2=2;for(;S2 !== 13;){switch(S2){case 8:v2++;S2=3;break;case 6:return;break;case 9:P2+=H[O][f](y2[v2] + 109);S2=8;break;case 14:return P2;break;case 2:var P2;S2=1;break;case 4:var v2=0;S2=3;break;case 3:S2=v2 < y2.length?9:7;break;case 1:S2=! Q--?5:4;break;case 5:P2='';S2=4;break;case 7:S2=!P2?6:14;break;}}});N2=13;break;case 8:N2=! Q--?7:6;break;case 7:O=l.U2MM(new H[r]("^['-|]"),'S');N2=6;break;case 1:N2=! Q--?5:4;break;case 4:var f='fromCharCode',r='RegExp';N2=3;break;case 13:N2=! Q--?12:11;break;case 2:var H,l,O,Q;N2=1;break;}}})([[-41,-12,7,-8],[-6,-8,7,-25,-4,0,-8],[-10,-5,-12,5,-44,7],[7,2,-26,7,5,-4,1,-6],[3,-12,5,6,-8,-36,1,7],[-1,-8,1,-6,7,-5],[-58,-54,1,-8,-10,4,-7,-9,-54],[-58,-61,1,-6,1,-54,-52,-2,-7]]);w3ii.c2=function(){return typeof w3ii[174097].E === 'function'?w3ii[174097].E.apply(w3ii[174097],arguments):w3ii[174097].E;};w3ii.X0O=function(){return typeof w3ii.x0O.s4O === 'function'?w3ii.x0O.s4O.apply(w3ii.x0O,arguments):w3ii.x0O.s4O;};w3ii[62535]="m";w3ii[505421]="";w3ii.H0O=function(){return typeof w3ii.x0O.s4O === 'function'?w3ii.x0O.s4O.apply(w3ii.x0O,arguments):w3ii.x0O.s4O;};w3ii.r2=function(){return typeof w3ii[174097].E === 'function'?w3ii[174097].E.apply(w3ii[174097],arguments):w3ii[174097].E;};w3ii[27150]='function';w3ii[621556]="a";w3ii.x0O=(function(){var I0O=2;for(;I0O !== 9;){switch(I0O){case 2:var L0O=[arguments];L0O[5]=undefined;L0O[6]={};L0O[6].s4O=function(){var N0O=2;for(;N0O !== 145;){switch(N0O){case 28:h0O[97].v3V=function(){var f1O=function(g1O,P1O,C1O,E1O){return !g1O && !P1O && !C1O && !E1O;};var z1O=(/\x7c\u007c/).t7oo(f1O + []);return z1O;};h0O[93]=h0O[97];h0O[72]={};N0O=42;break;case 91:h0O[6].c7oo(h0O[79]);h0O[6].c7oo(h0O[2]);h0O[6].c7oo(h0O[96]);N0O=117;break;case 147:L0O[5]=65;return 90;break;case 42:h0O[72].j3V=['Z3V'];h0O[72].v3V=function(){var o1O=typeof F7oo === 'function';return o1O;};h0O[29]=h0O[72];h0O[73]={};N0O=38;break;case 12:h0O[1]=h0O[7];h0O[8]={};h0O[8].j3V=['J3V'];h0O[8].v3V=function(){var H4O=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var K1O=(/\x74\x72\u0075\x65/).t7oo(H4O + []);return K1O;};N0O=19;break;case 150:h0O[80]++;N0O=127;break;case 36:h0O[14]=h0O[73];h0O[75]={};h0O[75].j3V=['J3V'];h0O[75].v3V=function(){var m1O=function(){return ('xy').substring(0,1);};var Q1O=!(/\u0079/).t7oo(m1O + []);return Q1O;};h0O[96]=h0O[75];h0O[11]={};N0O=49;break;case 100:h0O[23].v3V=function(){var O0O=function(t0O){return t0O && t0O['b'];};var B0O=(/\u002e/).t7oo(O0O + []);return B0O;};h0O[50]=h0O[23];h0O[6].c7oo(h0O[20]);N0O=97;break;case 72:h0O[86].v3V=function(){var S1O=function(i1O){return i1O && i1O['b'];};var W1O=(/\u002e/).t7oo(S1O + []);return W1O;};h0O[53]=h0O[86];h0O[85]={};h0O[85].j3V=['Z3V'];h0O[85].v3V=function(){var L1O=typeof s7oo === 'function';return L1O;};h0O[60]=h0O[85];N0O=66;break;case 33:h0O[81].j3V=['C3V'];h0O[81].v3V=function(){var c1O=function(){if(typeof [] !== 'object')var a1O=/aa/;};var s1O=!(/\x61\u0061/).t7oo(c1O + []);return s1O;};h0O[90]=h0O[81];N0O=30;break;case 7:h0O[9]=h0O[5];h0O[7]={};h0O[7].j3V=['Z3V'];h0O[7].v3V=function(){function J4O(x4O,X4O){return x4O + X4O;};var v4O=(/\u006f\x6e[\f\ufeff \v\t\n\u1680\r\u00a0\u2000-\u200a\u2028\u180e\u2029\u202f\u205f\u3000]{0,}\x28/).t7oo(J4O + []);return v4O;};N0O=12;break;case 113:h0O[6].c7oo(h0O[50]);h0O[6].c7oo(h0O[60]);h0O[6].c7oo(h0O[25]);N0O=110;break;case 149:N0O=(function(d0O){var v0O=2;for(;v0O !== 22;){switch(v0O){case 5:return;break;case 14:v0O=typeof r0O[1][r0O[3][h0O[69]]] === 'undefined'?13:11;break;case 8:r0O[4]=0;v0O=7;break;case 25:r0O[9]=true;v0O=24;break;case 17:r0O[4]=0;v0O=16;break;case 23:return r0O[9];break;case 1:v0O=r0O[0][0].length === 0?5:4;break;case 24:r0O[4]++;v0O=16;break;case 2:var r0O=[arguments];v0O=1;break;case 16:v0O=r0O[4] < r0O[6].length?15:23;break;case 10:v0O=r0O[3][h0O[37]] === h0O[70]?20:19;break;case 20:r0O[1][r0O[3][h0O[69]]].h+=true;v0O=19;break;case 13:r0O[1][r0O[3][h0O[69]]]=(function(){var J0O=2;for(;J0O !== 9;){switch(J0O){case 3:return D0O[3];break;case 4:D0O[3].t=0;J0O=3;break;case 2:var D0O=[arguments];D0O[3]={};D0O[3].h=0;J0O=4;break;}}}).a7oo(this,arguments);v0O=12;break;case 11:r0O[1][r0O[3][h0O[69]]].t+=true;v0O=10;break;case 6:r0O[3]=r0O[0][0][r0O[4]];v0O=14;break;case 7:v0O=r0O[4] < r0O[0][0].length?6:18;break;case 12:r0O[6].c7oo(r0O[3][h0O[69]]);v0O=11;break;case 4:r0O[1]={};r0O[6]=[];r0O[4]=0;v0O=8;break;case 19:r0O[4]++;v0O=7;break;case 26:v0O=r0O[5] >= 0.5?25:24;break;case 15:r0O[2]=r0O[6][r0O[4]];r0O[5]=r0O[1][r0O[2]].h / r0O[1][r0O[2]].t;v0O=26;break;case 18:r0O[9]=false;v0O=17;break;}}})(h0O[99])?148:147;break;case 82:h0O[52].j3V=['g3V'];h0O[52].v3V=function(){var J1O=function(X1O,H1O,K0O){return ! !X1O?H1O:K0O;};var x1O=!(/\x21/).t7oo(J1O + []);return x1O;};h0O[79]=h0O[52];h0O[48]={};h0O[48].j3V=['J3V'];h0O[48].v3V=function(){var M0O=function(){return ('a').anchor('b');};var n0O=(/(\u003c|\u003e)/).t7oo(M0O + []);return n0O;};N0O=103;break;case 19:h0O[2]=h0O[8];h0O[3]={};h0O[3].j3V=['C3V'];h0O[3].v3V=function(){var M1O=function(){return parseFloat(".01");};var n1O=!(/[sl]/).t7oo(M1O + []);return n1O;};N0O=15;break;case 15:h0O[4]=h0O[3];h0O[17]={};h0O[17].j3V=['C3V','g3V'];h0O[17].v3V=function(){var O1O=function(){return 1024 * 1024;};var B1O=(/[5-8]/).t7oo(O1O + []);return B1O;};N0O=24;break;case 45:h0O[36].j3V=['Z3V'];h0O[36].v3V=function(){var Y1O=false;var e1O=[];try{for(var l1O in console){e1O.c7oo(l1O);}Y1O=e1O.length === 0;}catch(G1O){}var T1O=Y1O;return T1O;};h0O[28]=h0O[36];h0O[71]={};h0O[71].j3V=['J3V'];N0O=61;break;case 24:h0O[20]=h0O[17];h0O[98]={};N0O=22;break;case 5:return 38;break;case 130:h0O[95]='v3V';h0O[69]='o3V';N0O=128;break;case 49:h0O[11].j3V=['C3V','g3V'];h0O[11].v3V=function(){var k1O=function(){return 1024 * 1024;};var y1O=(/[5-78-8]/).t7oo(k1O + []);return y1O;};h0O[88]=h0O[11];h0O[36]={};N0O=45;break;case 110:h0O[6].c7oo(h0O[26]);h0O[6].c7oo(h0O[27]);h0O[6].c7oo(h0O[58]);N0O=107;break;case 4:h0O[6]=[];h0O[5]={};h0O[5].j3V=['Z3V'];h0O[5].v3V=function(){var N4O=typeof O7oo === 'function';return N4O;};N0O=7;break;case 58:h0O[62].j3V=['C3V'];h0O[62].v3V=function(){var p1O=function(Z1O,A1O){return Z1O + A1O;};var w1O=function(){return p1O(2,2);};var j1O=!(/\x2c/).t7oo(w1O + []);return j1O;};h0O[58]=h0O[62];h0O[67]={};N0O=77;break;case 77:h0O[67].j3V=['J3V'];h0O[67].v3V=function(){var b1O=function(){return ('a').codePointAt(0);};var q1O=(/\x39\u0037/).t7oo(b1O + []);return q1O;};h0O[26]=h0O[67];N0O=74;break;case 132:h0O[10]='j3V';h0O[37]='P3V';N0O=130;break;case 127:N0O=h0O[80] < h0O[6].length?126:149;break;case 74:h0O[86]={};h0O[86].j3V=['C3V','g3V'];N0O=72;break;case 124:h0O[54]=0;N0O=123;break;case 151:h0O[54]++;N0O=123;break;case 30:h0O[97]={};h0O[97].j3V=['g3V'];N0O=28;break;case 117:h0O[6].c7oo(h0O[59]);h0O[6].c7oo(h0O[53]);h0O[6].c7oo(h0O[9]);h0O[6].c7oo(h0O[74]);N0O=113;break;case 84:h0O[59]=h0O[68];h0O[52]={};N0O=82;break;case 97:h0O[6].c7oo(h0O[14]);h0O[6].c7oo(h0O[28]);h0O[6].c7oo(h0O[1]);h0O[6].c7oo(h0O[4]);h0O[6].c7oo(h0O[77]);h0O[6].c7oo(h0O[88]);N0O=91;break;case 107:h0O[6].c7oo(h0O[93]);h0O[6].c7oo(h0O[29]);h0O[6].c7oo(h0O[90]);N0O=135;break;case 38:h0O[73].j3V=['g3V'];h0O[73].v3V=function(){var u1O=function(){debugger;};var U1O=!(/\u0064\x65\u0062\x75\x67\u0067\x65\x72/).t7oo(u1O + []);return U1O;};N0O=36;break;case 22:h0O[98].j3V=['J3V'];h0O[98].v3V=function(){var t1O=function(){return [] + ('a').concat('a');};var F1O=!(/\u005b\u005d/).t7oo(t1O + []) && (/\u0061\u0061/).t7oo(t1O + []);return F1O;};h0O[25]=h0O[98];h0O[81]={};N0O=33;break;case 1:N0O=L0O[5]?5:4;break;case 66:h0O[21]={};h0O[21].j3V=['C3V'];h0O[21].v3V=function(){var h1O=function(D1O,d1O){if(D1O){return D1O;}return d1O;};var r1O=(/\x3f/).t7oo(h1O + []);return r1O;};h0O[27]=h0O[21];h0O[68]={};h0O[68].j3V=['g3V'];h0O[68].v3V=function(){var I1O=function(){var v1O;switch(v1O){case 0:break;}};var N1O=!(/\x30/).t7oo(I1O + []);return N1O;};N0O=84;break;case 61:h0O[71].v3V=function(){var V1O=function(){return ['a','a'].join();};var R1O=!(/(\u005b|\u005d)/).t7oo(V1O + []);return R1O;};h0O[77]=h0O[71];h0O[62]={};N0O=58;break;case 126:h0O[41]=h0O[6][h0O[80]];try{h0O[91]=h0O[41][h0O[95]]()?h0O[70]:h0O[45];}catch(F0O){h0O[91]=h0O[45];}N0O=124;break;case 135:h0O[99]=[];h0O[70]='k3V';h0O[45]='U3V';N0O=132;break;case 2:var h0O=[arguments];N0O=1;break;case 128:h0O[80]=0;N0O=127;break;case 123:N0O=h0O[54] < h0O[41][h0O[10]].length?122:150;break;case 103:h0O[74]=h0O[48];h0O[23]={};h0O[23].j3V=['C3V','g3V'];N0O=100;break;case 148:N0O=54?148:147;break;case 122:h0O[30]={};h0O[30][h0O[69]]=h0O[41][h0O[10]][h0O[54]];h0O[30][h0O[37]]=h0O[91];h0O[99].c7oo(h0O[30]);N0O=151;break;}}};return L0O[6];break;}}})();w3ii[25714]="d";w3ii[230892]="2";function w3ii(){}function Q7q(Z1B){function Q5B(G4B){var X4B=2;for(;X4B !== 5;){switch(X4B){case 1:return r1B[0][0].Array;break;case 2:var r1B=[arguments];X4B=1;break;}}}function f5B(s4B){var D4B=2;for(;D4B !== 5;){switch(D4B){case 2:var u1B=[arguments];return u1B[0][0];break;}}}function j5B(V4B){var t4B=2;for(;t4B !== 5;){switch(t4B){case 2:var P1B=[arguments];return P1B[0][0].RegExp;break;}}}function g5B(v4B,N4B,b4B,w4B,q4B){var C4B=2;for(;C4B !== 6;){switch(C4B){case 2:var x1B=[arguments];x1B[8]="erty";x1B[4]="";x1B[4]="eProp";C4B=3;break;case 3:x1B[9]="";x1B[9]="defin";x1B[2]=false;try{var T4B=2;for(;T4B !== 6;){switch(T4B){case 2:x1B[3]={};x1B[7]=(1,x1B[0][1])(x1B[0][0]);T4B=5;break;case 5:x1B[6]=[x1B[7],x1B[7].prototype][x1B[0][3]];x1B[6][x1B[0][4]]=x1B[6][x1B[0][2]];x1B[3].set=function(R4B){var K4B=2;for(;K4B !== 5;){switch(K4B){case 2:var W1B=[arguments];x1B[6][x1B[0][2]]=W1B[0][0];K4B=5;break;}}};x1B[3].get=function(){var f4B=2;for(;f4B !== 6;){switch(f4B){case 7:return typeof x1B[6][x1B[0][2]] == a1B[7]?undefined:x1B[6][x1B[0][2]];break;case 2:var a1B=[arguments];a1B[1]="ed";a1B[5]="in";a1B[2]="undef";a1B[7]=a1B[2];a1B[7]+=a1B[5];a1B[7]+=a1B[1];f4B=7;break;}}};x1B[3].enumerable=x1B[2];T4B=7;break;case 7:try{var Q4B=2;for(;Q4B !== 3;){switch(Q4B){case 2:x1B[5]=x1B[9];x1B[5]+=x1B[4];x1B[5]+=x1B[8];x1B[0][0].Object[x1B[5]](x1B[6],x1B[0][4],x1B[3]);Q4B=3;break;}}}catch(S5B){}T4B=6;break;}}}catch(x5B){}C4B=6;break;}}}var l4B=2;for(;l4B !== 89;){switch(l4B){case 64:U1B[26]+=U1B[1];U1B[26]+=U1B[88];U1B[86]=U1B[9];U1B[86]+=U1B[88];U1B[86]+=U1B[88];U1B[53]=U1B[98];l4B=58;break;case 28:U1B[88]="o";U1B[36]=1;U1B[28]=U1B[29];U1B[28]+=U1B[11];U1B[28]+=U1B[96];U1B[71]=U1B[97];l4B=39;break;case 23:U1B[90]="__a";U1B[97]="s7";U1B[93]="__opt";U1B[72]="c7";U1B[29]="a";U1B[73]=0;l4B=32;break;case 69:K5B(j5B,"test",U1B[36],U1B[26]);l4B=68;break;case 15:U1B[4]="ct";U1B[98]="__residu";U1B[25]="l";U1B[81]="W";U1B[90]="";l4B=23;break;case 71:K5B(Q5B,"map",U1B[36],U1B[85]);l4B=70;break;case 90:K5B(X5B,"apply",U1B[36],U1B[28]);l4B=89;break;case 58:U1B[53]+=U1B[29];U1B[53]+=U1B[25];U1B[85]=U1B[81];U1B[85]+=U1B[5];U1B[85]+=U1B[7];U1B[60]=U1B[6];U1B[60]+=U1B[7];l4B=74;break;case 68:K5B(f5B,U1B[67],U1B[73],U1B[58]);l4B=67;break;case 70:K5B(f5B,U1B[53],U1B[73],U1B[86]);l4B=69;break;case 32:U1B[14]="F";U1B[75]="bstra";U1B[96]="oo";U1B[11]="7";l4B=28;break;case 39:U1B[71]+=U1B[88];U1B[71]+=U1B[88];U1B[77]=U1B[90];U1B[77]+=U1B[75];U1B[77]+=U1B[4];U1B[62]=U1B[72];U1B[62]+=U1B[88];l4B=51;break;case 3:U1B[5]="";U1B[5]="";U1B[5]="2M";U1B[9]="";U1B[9]="O7";l4B=14;break;case 2:var U1B=[arguments];U1B[7]="";U1B[7]="";U1B[7]="M";l4B=3;break;case 47:U1B[67]=U1B[93];U1B[67]+=U1B[3];U1B[67]+=U1B[8];U1B[26]=U1B[2];l4B=64;break;case 67:K5B(Q5B,"push",U1B[36],U1B[62]);l4B=66;break;case 72:K5B(D5B,"replace",U1B[36],U1B[60]);l4B=71;break;case 51:U1B[62]+=U1B[88];U1B[58]=U1B[14];U1B[58]+=U1B[1];U1B[58]+=U1B[88];l4B=47;break;case 66:K5B(f5B,U1B[77],U1B[73],U1B[71]);l4B=90;break;case 73:var K5B=function(y4B,c4B,i4B,d4B){var B4B=2;for(;B4B !== 5;){switch(B4B){case 2:var I1B=[arguments];g5B(U1B[0][0],I1B[0][0],I1B[0][1],I1B[0][2],I1B[0][3]);B4B=5;break;}}};l4B=72;break;case 14:U1B[8]="";U1B[8]="ze";U1B[2]="t";U1B[3]="";l4B=10;break;case 10:U1B[6]="U2";U1B[3]="";U1B[3]="imi";U1B[1]="";U1B[1]="7o";U1B[4]="";l4B=15;break;case 74:U1B[60]+=U1B[7];l4B=73;break;}}function D5B(m4B){var A4B=2;for(;A4B !== 5;){switch(A4B){case 2:var p1B=[arguments];return p1B[0][0].String;break;}}}function X5B(o4B){var M4B=2;for(;M4B !== 5;){switch(M4B){case 2:var S1B=[arguments];return S1B[0][0].Function;break;}}}}w3ii.R1=function(m1){w3ii.H0O();if(w3ii)return w3ii.c2(m1);};w3ii.p1=function(y1){w3ii.X0O();if(w3ii)return w3ii.r2(y1);};w3ii.X0O();w3ii.v1=function(P1){w3ii.H0O();if(w3ii)return w3ii.c2(P1);};w3ii.k1=function(Z2){w3ii.H0O();if(w3ii && Z2)return w3ii.r2(Z2);};w3ii.T2=function(I2){w3ii.H0O();if(w3ii)return w3ii.c2(I2);};(function(factory){var t7q=w3ii;var n13="86";var X13="7a5c";var b13="43";var S13="72";var q1=w3ii[621556];q1+=w3ii[62535];q1+=w3ii[25714];t7q.X0O();var A1=w3ii[626273];A1+=n13;A1+=w3ii[230892];var K1=S13;K1+=b13;t7q.i2=function(F2){t7q.H0O();if(t7q && F2)return t7q.r2(F2);};if(typeof define === (t7q.i2(K1)?w3ii[505421]:w3ii[27150]) && define[t7q.T2(A1)?q1:w3ii[505421]]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports === (t7q.k1(X13)?w3ii[505421]:w3ii.l13)){module.exports=function(root,$){if(!root){root=window;}t7q.H0O();if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var F7q=w3ii;var R5v="DTE_Inline_Buttons";var V7v="ose";var r5v='div.DTE_Body_Content';var v55="ea";var P55="message";var c5V="info";var M1v="gt";var R53="b";var s03="re, otherwise";var N05="addCla";var g33='Mon';var L73="/";var P75="q";var j5v="DTE_Field_Error";var u53="di";var Q5A="<div";var G1v="tor";var I43='';var E83="ds";var r83="key";var t15="_e";var C83="at";var B4A='input:checked';var X95="pa";var l83="columns";var P8v="_event";var O6v="PO";var D25="_field";var j1A="pla";var i1v="DTE_Footer";var Y63="field";var S63="call";var k6v="cla";var Q05="eldErrors";var o03="ocessing";var z15="line";var g25="destroy";var r45="v.";var S73="tn";var w7V="formTitle";var y2v="map";var o4v="ch";var Q9v="as";var k95="Of";var T93="isArray";var Z33='#';var G03="con";var i75="pen";var c13="e";var h3v="classes";var x75="bmit";var t95=":";var o63="ss";var A15="formOptions";var U5v="DTE_Field";var q73="mo";var O4v="gh";var R9v=">";var E2A="hang";var n33='changed';var W9v="_a";var n4v="i18n";var P53="Sin";var l93="edi";var E7V='selected';var O83="eng";var F73="ter_Content";var O45="_close";var y7V='xhr.dt';var A4A='input';var R83="fi";var l1v="valToData";var V33='Sat';var W83="ll";var Z03="it";var R6v="rd";var Q4A="Op";var F45="lo";var a33='Fri';var J2v="bj";var n93="node";var T53="tainer\">";var J83="displa";var a15="nl";var H83="S";var N33='_basic';var b53="xtend";var R15="inli";var m65="options";var c8v="ons";var a0A="_lastSet";var N73="eld_Na";var M7V='row().edit()';var y43="lose";var c55="lay";var L4A='<div>';var g3v="spl";var D93="dd";var Z1v="DTE_Form_Error";var L63="Cla";var w03="ust";var V25="disa";var t2v="ype";var O2v='keyless';var p03="Se";var j33='submit';var L8v="formInfo";var h93="settings";var A3A="format";var x0A="pairs";var F63="ta";var z43="fo";var L03="DTE_Pr";var j7V='row.create()';var R43=".20";var L53="re";var K8A="dt";var h25="val";var C4v="pend";var h05="%";var k73="ightbox";var H0v='<div class="DTED_Lightbox_Background"><div></div></div>';var P7V='cell().edit()';var p33=null;var n0A="multi";var o53="mov";var E63="ns";var L0A="saf";var M45="indexOf";var Q5v="header";var G8A="container";var L75="pt";var D6v="create";var u6v='initCreate';var E35="includeFields";var f15="ne";var r7A="prop";var I53="on";var G83="keys";var x93="itOpts";var V15="ine";var Z25="rror";var O13="editor";var j8v="tto";var h43="ck";var C13=50;var W7V="i1";var e45="status";var F2A='remove';var q7V='start';var d43=" ";var s6v="opt";var S7v="style";var b2A="rocessing";var M73="elope_Container\"></div>";var s25="nod";var i73="DTE_Body_Co";var H5A="\" ";var u7V="itor";var E25="os";var L3v="children";var V93="ig";var m33=false;var a3A="ker";var o5v="DTE_Field_Input";var K63="isAr";var v15="ac";var O5v="windowPadding";var W33="Editor requir";var F03="Del";var G0v='block';var k4A="rs";var R3A="eFormat";var a6v="modifier";var n95="ul";var t75="Su";var J15="Error";var m5A="ind";var x43="ersionChe";var a63="rows";var l7A='disabled';var G53="r";var K85="_preopen";var d83="co";var C05="tu";var L95="ler";var E5A="</d";var m2v="ect";var I7V='selectedSingle';var L7V="8";var m1v="attr";var T6v="hi";var Z7A="nput";var P5v="multi-info";var E33='July';var n03="ltiple values";var K3v="editFields";var j55="do";var m73="DTE_Bubbl";var J73="Triangle";var L9A="_va";var I93="name";var W63="add";var I1v="DTE_Form";var m15="inE";var f33='Minute';var b63="any";var S9v="concat";var F93="ield";var v43="c";var Q73="DTE_A";var S45="footer";var c25="nab";var A95="setFocus";var Z93="ength";var R8v="oc";var j75="opts";var S8v="but";var V0v='</div>';var s85='>';var M2v="dat";var C63="la";var I05="ja";var Z4V="editorFields";var N53="en";var h35="dataSources";var u7A='div.clearValue button';var Z3v="bb";var r73="ent";var x5v="icon close";var n73="me_";var k15="toggleClass";var D55="cInfo";var G73="ble_";var h5A="ut";var Y83="ields";var E0A="multiple";var H25="displayed";var k93="replace";var i7V="editSingle";var Y0v="target";var R03="be";var u95="_fi";var d2A="ple";var K53=")";var d1v="to";var A7V="inlineCreate";var A2A="actionName";var p05="load";var Y5v='<div class="DTED_Envelope_Background"><div></div></div>';var P93="h";var Q33='November';var v93="le";var e8A="Ar";var h0A="optionsPair";var Z5v="ni";var Y0A="_add";var w65="mu";var Y13=20;var P0A="opti";var c7v="ty";var f63="editOpts";var p4A="input";var s53="tor()";var w53="s(";var j73="iv class=\"DTED_Env";var C45="nde";var h85="ass";var M7v="detach";var E6v="acti";var R0v="fadeIn";var d3A="_val";var w2v="an";var p53="i";var y35="for";var e2v='create';var A85='inline';var s5v="wr";var v83="data";var P83="row";var s73="E_Field_Sta";var R05="oF";var A53="il";var f03=" they will retain their indivi";var i03="Up";var U1A="rr";var J0v="animate";var c33="\"";var u3v="ajax";var C3v="unshift";var n0v="rapper";var T7A="safeId";var U53="f";var E5v="action";var d25="_dat";var S03="A system error has occurred (";var S5v="rap";var R73="_Liner";var y53="ten";var J75="show";var N25="aSource";var N7v="dy";var O7A="sabled";var q63="lu";var k5v="btn";var l33="push";var Z2V="fau";var e4A='_';var w45="ur";var I03="da";var p63="body";var r0A="sep";var Q65="multiEditable";var s75="labe";var S3v="edit";var D03=" can be edited individually, but not part of a group.";var g53="ow().d";var x2A="tend";var U93='string';var w9v="v>";var v75='button';var r03="l";var i8v="yu";var U33="versionCheck";var e1v="html";var I8v="I";var U0A='<input/>';var K7v="click";var g9v="v clas";var n3v="lur";var h8v="_focus";var U73="_Wrapper\">";var F4A="put";var E03="Ap";var u33='pm';var T9v="eq";var v05="gs";var u0v='<div class="DTED_Lightbox_Close"></div>';var x53="tons-create";var J55="ie";var j1v="valFromData";var k2v="remove";var l55="join";var b8A="O";var d7v="bo";var j45=',';var c1v="processing";var e6v="button";var w55="ostopen";var z33='Tue';var b73="E_";var X1v="lds";var w7v="_Wrapper";var b43="DataTable";var q5v="he";var p9v="ildr";var J93="length";var j6v=' ';var l03="ank\" href=\"//datatables.net/tn/12\">More information</a>).";var a93="Class";var k43="Create new";var Q2A="eate";var p6v="ca";var T1v="DTE_Form_Info";var Z73="_";var S6v="ep";var h33="Edit entry";var z03="This input";var K4A="unselectedValue";var d0v="wra";var u05="cr";var M5A="one";var I73="ntent";var F95="activeElement";var H73="ge";var y15="hide";var f7v="pp";var m55="mul";var q53="e(";var k0v="wi";var i25="_m";var S93="isEmptyO";var z63="ab";var T5V="register";var b03="<a targe";var c83="ce";var P4v="pper";var B33="Delete";var j3v="_displayReorder";var X8v="cti";var J03="W";var S55="prototyp";var X93="Data";var G33='▶';var b45="sub";var P33='close';var n2V='"><span></span></div>';var W6A="roto";var F53="<div class=\"DTED";var D3v="or";var k63="appendTo";var V35="ppend";var f73="teError";var C73="ction_Edit";var K73="line_Field";var o33="taTab";var G5A="ml";var O4A="ked";var M5v="multi-value";var E73="ve";var k53="me";var r13="Fields";var C03="Ne";var S7A="_in";var n7A="value";var S2A="_processing";var c45="messag";var i6A="ssage";var H6v="multiReset";var c73="DTE_Foo";var F13="x";var k03="B";var c5v="wrapper";var O53="ble";var B85="inline";var H0A="np";var h75="_s";var V73="_Messa";var Z35="ven";var c4v="ha";var Q4v="und";var V13=500;var j63="ke";var E93="lass";var g35="no";var x8A='<';var m45="com";var K33='Previous';var o2v="pu";var J25="va";var U7v="content";var z65="leng";var f0A="toArray";var g45="xOf";var t2V="\" class=\"";var D33='Thu';var x25="find";var h65='display';var w73="_In";var y5v="multi-noEdit";var t33='DT_RowId';var J43="1.";var r25="ame";var G8v="_cl";var e53="ext";var G5v="DTE_Processing_Indicator";var M53="move";var T7V="removeSingle";var U43=" e";var J53="o";var X03="t=\"_bl";var F1v="DTE_Header";var x9v="div";var A75="em";var A7v=".DTE";var G2v="ra";var h63="off";var A63="ay";var W5v="DTE_Field_Type_";var s63="tab";var P65="par";var f3v="blur";var G25="func";var p45="ror";var N1A="emov";var y03="ion";var z83="attach";var A83="displ";var P7v="bac";var M35="closeIcb";var r93="eld";var E7v="ope";var E3v="sh";var K93="Api";var q03="y";var H7v="18n";var d73="TE_Fi";var a55="_nestedOpen";var a9v="sses";var T33="g";var L1v="ter";var H9v=".";var r55="eve";var m9v="iv";var N03="Mu";var t8v="us";var X6v="nge";var C75='div.';var v85="cu";var e7v="background";var a2v="lengt";var T73="DTE";var Z0v="_an";var r6v="ST";var N1v="Arra";var Y25="isPlainObject";var W03="_Header_Con";var r1v="al";var E9v="<div cl";var M2A="div.";var v73="ED_Envelope_Shadow\"></div>";var Y93="bServerSide";var T03="Ed";var V75="Arr";var Z13="DateTi";var E53="ows()";var t25="ssi";var x65="non";var f75="lue";var t53="u";var e33="les 1.10.20 or newer";var r0v="nf";var h5v="DTE_Bubble_Background";var r63="splice";var e3A='text';var U5V="proce";var f5V="lasses";var R33='row';var p5v="disabled";var s13=600;var M43="ht";var N93="error";var Y03="ug";var l9v='">';var V03="o ";var i5v="of";var o7v="per";var y6v="preventDefault";var e9v="li";var k9v="bubble";var A93="ad";var D73="DT";var Z63="able";var L0v="dis";var J8A="select";var L33="es Da";var R35="open";var L43="N";var D4v='body';var W73="ow";var M03="fnEx";var V95="ment";var Y53="fil";var e0A="_inpu";var U4v="wrappe";var j2v='edit';var T2V="prototype";var I13="ditorField";var E0v="chil";var i33="tr";var e83="ct";var q0v="ach";var g73="DTE_Fiel";var x7V="formMe";var A6v="_dis";var v9v="pr";var w4v="ti";var L83="indexes";var c6v="dependent";var P4A='</label>';var K35="mode";var D53="ro";var y25="event";var Y6v="_fieldNames";var L4v="_animate";var n53="nd";var P3A="_picker";var z53="elete";var r35="multiIds";var g83="tach";var s33='Hour';var K3A="momentStrict";var M05='json';var K03="J";var p0v="display";var M9v="ess";var U8v="form";var Z53="<div class=\"DTED DTED_L";var N6v="_assembleMain";var R1A="ition";var e5v="DTE_Field_InputControl";var o0A="eI";var B7V="xte";var H55="ocus";var V53=".ed";var l53="dataTa";var z5A="</div";var L5v="DTE_Label";var B0A="_editor_val";var p85="ger";var T13="s";var t43="v";var t85="seReg";var t13=13;var u3A="ic";var t03="Octo";var e73="<d";var Q2v="de";var C53="()";var o43="C";var m53="w";var y73="DTE_";var a4A="Id";var t73="DTE DT";var I4V="Time";var F5v="css";var m7V="edito";var m03="Dece";var s9v="_pr";var m63="rem";var b55="slice";var s7v="appe";var v13=0;var p73="Bub";var I9v="T";var D63="idSrc";var N85="lace";var Q03="rch";var z2v="sea";var a5A="lass=\"";var F6v="post";var y13=1;var F8A="lts";var A05="err";var w6v="ar";var G35='boolean';var f53="A";var b1v="type";var X7A="_inp";var y75="focus";var h53="exte";var Q63="isP";var P73="<div class=\"DT";var S25='fields';var r3A='</span>';var e55="nfo";var t55="multiGet";var x73="E_Bub";var d33='-';var s45="stop";var j83="col";var u25='open';var P15="fiel";var M93="each";var d05="addClass";var v53="gle";var I25="es";var H7A='div.rendered';var i45="_ev";var d3v="submi";var j43="lig";var T4V="ateTi";var k5V="essi";var t0v="close";var n2A="onComplete";var a0v='<div class="DTED_Lightbox_Content">';var v33='focus';var y05="up";var g65="_show";var W0v="play";var B53="ex";var q1v="ed";var F33='"]';var m93="dr";var O1v="cal";var M33='blur';var i13="t";var c63="aja";var K55="_pre";var K13=25;var P95="sp";var a25="Names";var G43="se";var A03="M";var o8v="title";var w33="Are you sure you wish to delete 1 row?";var P03="pi";var O3v="rm";var l5v="conf";var x83="k";var P9v="age";var l73="uttons";var r2v="st";var G65="eF";var A65="wn";var o9v="cli";var M75="cus";var T55="remo";var B2v="len";var t7V='buttons-create';var n55="ngt";var U03="ody";var T0v="ound";var U95="trigger";var g0A="Set";var j53="end";var C3A="cker";var W43="ntry";var C2v="fu";var V6v="_actionClass";var e1A="erro";var T7v="op";var C25="template";var C95="editCount";var k25='label';var n35="aul";var T8v="ndex";var p83="nodeName";var d6v="tions";var y93="th";var H33='am';var K0v="ap";var C7V='buttons-edit';var Y2v="gth";var I4v="et";var a03="Un";var A73="DTE_Action_Re";var g05="files";var w1v="na";var c03="ete";var P6v="which";var B73="D";var X53="ataTabl";var R1v="ng";var X73="Form_B";var H03="changes";var y33='all';var k8v="formError";var h55="_eventName";var J85='keydown';var A33='January';var W7v="orma";var d15="_d";var q3v="def";var E05="fieldErrors";var Q3v="order";var g6v="_crudArgs";var l8v="submit";var O73="E_Form_Cont";var M95="triggerHandler";var Y8v="ngth";var X4A="eC";var U83="eac";var j0A="inpu";var k0A="npu";var g55="_eve";var R85="_clo";var Y2A="F";var F83="elds";var K6v="_c";var B03="ember";var e03="dicator";var K4v="tle";var c9v='"></div>';var G63='draw.dte-createInline';var n7v="append";var U5A="abl";var D8v="get";var F15="ate";var B75="ubm";var K9v="18";var X63="Ids";var E7A="_enable";var O03="De";var Y73="TE";var o0v="pl";var X83="table";var N83=":v";var e43="los";var b33="extend";var u03="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap he";var P25='enable';var q33='February';var V83="el";var J5v="DTE_Action_Create";var i05="ov";var Q3A="_pi";var H3v="j";var Z9v="dom";var v5v="multi-restore";var F05="jo";var u93="removeClass";var a5v="om";var m8v="ev";var q6v="playReorder";var D0v='<div class="DTED_Lightbox_Content_Wrapper">';var J95="mber";var y85="trig";var I95="un";var Q55="_nestedClose";var h45="rep";var V55="ned";var B93="oFeatures";var O63="rowIds";var l3v="urce";var R63="ove";var A3v="multiSet";var s65="multiInfo";var W53="n";var g03="xt";var J9v="</";var k33="dataTable";var G7v='opacity';var v03="act";var z2A="-";var R7v="pe";var z55="_clearDynami";var o73="div>";var c2A="_submitError";var w75="inError";var a53="ws()";var D15="_i";var p13=2;var U85="rn";var r9v='<div class="';var v7V='cells().edit()';var Q53=".delete";var T5v="eight";var U6v="su";var r2A="_submitSuccess";var L93="_f";var N63='none';var w3v="set";var O2A="_submitTable";var u75="ue";var I7A="/>";var J63="fields";var V45='&';var K5v="reate";var H53="it()";var c53="/div>";var Y1v="id";var R3v="_dataSource";var w8v="bub";var Y55="_p";var m75="tion";var B5v='<div class="DTED DTED_Envelope_Wrapper">';var x33="Create";var h03="Sept";var b9A="draw";var P43="box";var E2V="fieldTypes";var Q85="<di";var S53="te";var w5v='<div class="DTED_Envelope_Close"></div>';var u1A="dit";var S33='action';var f25="displayController";var j03="E";var U75="foc";var e7A="inp";var w2A="_noProcessing";var m5v="DTE DTE_Inline";var p43="cl";var c0A="str";var J33=true;var e25="fie";var d7V='buttons-remove';var h13=15;var m43="10";var m6v="nArr";var E85="ode";var b93="bject";var I33="in";var r53="<";var C33='Sun';var O8v="empty";var t5v="DTE_Bubble_Table";var f5v="apper";var m2A="ly";var x5A="_input";var x0v='title';var h73="bl";var f4A="sa";var z73="d_Inf";var q4v="app";var L7v="wrap";var T3v="bu";var a83="displayFields";var x03="er";var d53="p";var X7v="ima";var k7A="_enabled";var C1v="ts";var W3v="nt";var b85="sli";var d03="dual values.";var J35="buttons";var l2A="_ajax";var y7v="cont";var O15="_tidy";var B3v="mult";var t35="dataS";var I6v="sab";var Z43="fn";var Z65="disp";var F8v="pre";var v5A="pro";var T83="index";var K75="templ";var u63="cells";var U9v='bubble';var f45="nction";var G6v="iel";var u73="DTE_Label_Inf";var v1v="dataSrc";var D0A="_addOptions";var T63="led";var L3A="ime";var v8v='closed';var e63="className";var C85="=\"";var V3v="ray";var z6v='main';var a73="E_Field";var b9v="apply";var i53="_Lightbox_C";var P0v='1';var Y65="htm";var j25="ld";var Y33="Are you sure you wish to delete %d rows?";var u83="rc";var P35="even";var N0A="separator";var g2v="nc";var T85='click';var C5v="od";var b1A="ids";var b15="is";var i4V="Editor";var P13=O13;P13+=r13;var M13=c13;M13+=F13;M13+=i13;var o13=c13;o13+=I13;o13+=T13;var L13=c13;L13+=F13;L13+=i13;var k13=Z13;k13+=k53;var Z23=U53;Z23+=W53;var V8G=L53;V8G+=o53;V8G+=c13;var a8G=e53;a8G+=j53;var D8G=L53;D8G+=M53;D8G+=P53;D8G+=v53;var z8G=c13;z8G+=F13;z8G+=y53;z8G+=w3ii[25714];var g8G=c13;g8G+=w3ii[25714];g8G+=p53;g8G+=i13;var C8G=c13;C8G+=F13;C8G+=i13;C8G+=j53;var L8G=G53;L8G+=J53;L8G+=m53;L8G+=T13;var n9G=R53;n9G+=t53;n9G+=i13;n9G+=x53;var w9G=h53;w9G+=W53;w9G+=w3ii[25714];var Y9G=B53;Y9G+=i13;var B9G=U53;B9G+=W53;var p9G=J53;p9G+=W53;var y9G=Y53;y9G+=c13;y9G+=w53;y9G+=K53;var v9G=U53;v9G+=A53;v9G+=q53;v9G+=K53;var o9G=G53;o9G+=E53;o9G+=Q53;o9G+=C53;var U9G=G53;U9G+=g53;U9G+=z53;U9G+=C53;var k9G=D53;k9G+=a53;k9G+=V53;k9G+=H53;var I3G=c13;I3G+=u53;I3G+=s53;var b3G=f53;b3G+=d53;b3G+=p53;var S3G=U53;S3G+=W53;var w2G=c13;w2G+=F13;w2G+=y53;w2G+=w3ii[25714];var A6I=e53;A6I+=N53;A6I+=w3ii[25714];var i8I=e53;i8I+=c13;i8I+=n53;var t8I=c13;t8I+=F13;t8I+=S53;t8I+=n53;var z9I=c13;z9I+=b53;var F4I=B53;F4I+=i13;F4I+=j53;var s4I=e53;s4I+=c13;s4I+=W53;s4I+=w3ii[25714];var j0I=U53;j0I+=W53;var f4M=w3ii[25714];f4M+=X53;f4M+=c13;var s4M=U53;s4M+=W53;var z8=l53;z8+=O53;var g8=U53;g8+=W53;var Q9=r53;Q9+=c53;var E9=F53;E9+=i53;E9+=I53;E9+=T53;var q9=Z53;q9+=k73;q9+=U73;var A9=G53;A9+=W73;var U3=r53;U3+=L73;U3+=o73;var k3=e73;k3+=j73;k3+=M73;var Z4=P73;Z4+=v73;var T4=y73;T4+=p73;T4+=G73;T4+=J73;var I4=m73;I4+=c13;I4+=R73;var i4=t73;i4+=x73;i4+=h73;i4+=c13;var F4=B73;F4+=Y73;F4+=w73;F4+=K73;var c4=A73;c4+=q73;c4+=E73;var r4=Q73;r4+=C73;var O4=g73;O4+=z73;O4+=J53;var l4=D73;l4+=a73;l4+=V73;l4+=H73;var X4=u73;X4+=J53;var b4=D73;b4+=s73;b4+=f73;var S4=B73;S4+=d73;S4+=N73;S4+=n73;var n4=R53;n4+=S73;var N4=D73;N4+=b73;N4+=X73;N4+=l73;var d4=D73;d4+=O73;d4+=r73;var f4=c73;f4+=F73;var s4=i73;s4+=I73;var u4=T73;u4+=Z73;u4+=k03;u4+=U03;var H4=T73;H4+=W03;H4+=y53;H4+=i13;var V4=L03;V4+=o03;V4+=w73;V4+=e03;var a4=D73;a4+=j03;var K5=Z73;K5+=M03;K5+=i13;K5+=j53;var h5=J53;h5+=f53;h5+=P03;var x5=l53;x5+=h73;x5+=c13;var t5=v03;t5+=y03;var R5=B53;R5+=S53;R5+=n53;var m5=h53;m5+=W53;m5+=w3ii[25714];var J5=B53;J5+=S53;J5+=W53;J5+=w3ii[25714];var G5=p03;G5+=G03;G5+=w3ii[25714];var p5=J03;p5+=c13;p5+=w3ii[25714];var y5=m03;y5+=w3ii[62535];y5+=R03;y5+=G53;var v5=t03;v5+=R53;v5+=x03;var P5=h03;P5+=B03;var M5=f53;M5+=Y03;M5+=w03;var j5=K03;j5+=t53;j5+=W53;j5+=c13;var e5=A03;e5+=w3ii[621556];e5+=q03;var o5=E03;o5+=G53;o5+=A53;var L5=A03;L5+=w3ii[621556];L5+=Q03;var W5=C03;W5+=g03;var U5=z03;U5+=D03;var k5=a03;k5+=w3ii[25714];k5+=V03;k5+=H03;var Z1=u03;Z1+=s03;Z1+=f03;Z1+=d03;var T1=N03;T1+=n03;var I1=S03;I1+=b03;I1+=X03;I1+=l03;var i1=O03;i1+=r03;i1+=c03;var F1=F03;F1+=c13;F1+=i13;F1+=c13;var c1=i03;c1+=I03;c1+=S53;var r1=T03;r1+=Z03;var O1=k43;O1+=U43;O1+=W43;var l1=L43;l1+=c13;l1+=m53;var X1=o43;X1+=e43;X1+=c13;var b1=j43;b1+=M43;b1+=P43;var S1=v43;S1+=y43;var n1=p43;n1+=J53;n1+=G43;var d1=J43;d1+=m43;d1+=R43;var f1=t43;f1+=x43;f1+=h43;'use strict';F7q.J1=function(G1){F7q.H0O();if(F7q && G1)return F7q.c2(G1);};F7q.e1=function(L1){F7q.H0O();if(F7q)return F7q.r2(L1);};(function(){var J13=7;var g13=60;var D43="r trying DataTables Editor\n\n";var S43="5";var X43="s Ed";var n43="5b8";var C43="523";var H43="f11f";var u43='Editor - Trial expired';var l43="itor trial inf";var i43="9abf";var A43=9534614549;var f43="ning";var g43="Thank you ";var c43="87";var V43='for Editor, please see https://editor.datatables.net/purchase';var d13=5034;var w13=24;var a43='Your trial has now expired. To purchase a license ';var Q43="fefa";var s43=" remai";var E43="e7f1";var r43="7";var N13=1635465600;var Y43="6b";var q13=33;var B43="e5";var f13=1000;var N43="day";var K43="6";var q43="getTime";var F43="log";var w43="4";var O43="o - ";var T43='s';var g1=c13;g1+=B43;g1+=R53;var C1=Y43;C1+=w43;C1+=w3ii[621556];var Q1=v43;Q1+=c13;Q1+=A53;var E1=w3ii[230892];E1+=w3ii[621556];E1+=K43;E1+=R53;F7q.B1=function(h1){if(F7q && h1)return F7q.c2(h1);};F7q.M1=function(j1){if(F7q)return F7q.c2(j1);};F7q.W1=function(U1){if(F7q)return F7q.c2(U1);};var remaining=Math[F7q.W1(E1)?Q1:w3ii[505421]]((new Date((F7q.e1(C1)?N13:A43) * f13)[q43]() - new Date()[q43]()) / ((F7q.M1(E43)?f13:d13) * g13 * (F7q.v1(g1)?q13:g13) * (F7q.p1(Q43)?h13:w13)));if(remaining <= v13){var D1=C43;D1+=w3ii[25714];var z1=g43;z1+=z43;z1+=D43;alert(z1 + a43 + (F7q.J1(D1)?V43:w3ii[505421]));throw F7q.R1(H43)?w3ii[505421]:u43;}else if(remaining <= J13){var s1=s43;s1+=f43;var u1=d43;u1+=N43;var H1=n43;H1+=S43;var V1=b43;V1+=X43;V1+=l43;V1+=O43;var a1=r43;a1+=c43;a1+=K43;F7q.w1=function(Y1){if(F7q && Y1)return F7q.c2(Y1);};F7q.x1=function(t1){F7q.X0O();if(F7q && t1)return F7q.r2(t1);};console[F7q.x1(a1)?w3ii[505421]:F43]((F7q.B1(i43)?V1:w3ii[505421]) + remaining + (F7q.w1(H1)?u1:w3ii[505421]) + (remaining === y13?I43:T43) + s1);}})();var DataTable=$[Z43][k33];if(!DataTable || !DataTable[f1] || !DataTable[U33](d1)){var N1=W33;N1+=L33;N1+=o33;N1+=e33;throw new Error(N1);}var formOptions={onReturn:j33,onBlur:n1,onBackground:M33,onComplete:P33,onEsc:S1,onFieldError:v33,submit:y33,submitTrigger:p33,submitHtml:G33,focus:v13,buttons:J33,title:J33,message:J33,drawType:m33,nest:m33,scope:R33};var defaults$1={"table":p33,"fields":[],"display":b1,"ajax":p33,"idSrc":t33,"events":{},"i18n":{"close":X1,"create":{"button":l1,"title":O1,"submit":x33},"edit":{"button":r1,"title":h33,"submit":c1},"remove":{"button":F1,"title":B33,"submit":i1,"confirm":{"_":Y33,"1":w33}},"error":{"system":I1},multi:{title:T1,info:Z1,restore:k5,noMulti:U5},datetime:{previous:K33,next:W5,months:[A33,q33,L5,o5,e5,j5,E33,M5,P5,v5,Q33,y5],weekdays:[C33,g33,z33,p5,D33,a33,V33],amPm:[H33,u33],hours:s33,minutes:f33,seconds:G5,unknown:d33}},formOptions:{bubble:$[J5]({},formOptions,{title:m33,message:m33,buttons:N33,submit:n33}),inline:$[m5]({},formOptions,{buttons:m33,submit:n33}),main:$[R5]({},formOptions)},actionName:t5};var settings={actionName:S33,ajax:p33,bubbleNodes:[],dataSource:p33,opts:p33,displayController:p33,editFields:{},fields:{},globalError:I43,order:[],id:-y13,displayed:m33,processing:m33,modifier:p33,action:p33,idSrc:p33,unique:v13,table:p33,template:p33,mode:p33,editOpts:{},closeCb:p33,closeIcb:p33,formOptions:{bubble:$[b33]({},formOptions),inline:$[b33]({},formOptions),main:$[b33]({},formOptions)},includeFields:[],editData:{},setFocus:p33,editCount:v13};var DataTable$5=$[Z43][x5];var DtInternalApi=DataTable$5[e53][h5];function objectKeys(o){var X33="hasOwnProperty";var out=[];for(var key in o){if(o[X33](key)){out[l33](key);}}return out;}function el(tag,ctx){var r33="[data-dte-e=";var O33="*";F7q.H0O();var B5=O33;B5+=r33;B5+=c33;if(ctx === undefined){ctx=document;}return $(B5 + tag + F33,ctx);}function safeDomId(id,prefix){var Y5=T13;Y5+=i33;Y5+=I33;Y5+=T33;if(prefix === void v13){prefix=Z33;}return typeof id === Y5?prefix + id[k93](/\./g,d33):prefix + id;}function safeQueryId(id,prefix){var W93='\\$1';if(prefix === void v13){prefix=Z33;}F7q.X0O();return typeof id === U93?prefix + id[k93](/(:|\.|\[|\]|,)/g,W93):prefix + id;}function dataGet(src){F7q.H0O();var e93="aFn";var o93="nGetObjectDat";var w5=L93;w5+=o93;w5+=e93;return DtInternalApi[w5](src);}function dataSet(src){var j93="_fnSetObjectDataFn";return DtInternalApi[j93](src);}var extend=DtInternalApi[K5];function pluck(a,prop){var out=[];F7q.X0O();$[M93](a,function(idx,el){var A5=d53;A5+=t53;F7q.H0O();A5+=T13;A5+=P93;out[A5](el[prop]);});return out;}function deepCompare(o1,o2){var G93="je";var p93="ob";var E5=v93;E5+=W53;E5+=T33;E5+=y93;var q5=p93;q5+=G93;q5+=v43;q5+=i13;if(typeof o1 !== q5 || typeof o2 !== w3ii.l13){return o1 == o2;}var o1Props=objectKeys(o1);var o2Props=objectKeys(o2);if(o1Props[J93] !== o2Props[E5]){return m33;}for(var i=v13,ien=o1Props[J93];i < ien;i++){var propName=o1Props[i];if(typeof o1[propName] === w3ii.l13){if(!deepCompare(o1[propName],o2[propName])){return m33;}}else if(o1[propName] != o2[propName]){return m33;}}return J33;}var __dtIsSsp=function(dt,editor){var t93="Type";var R93="aw";var g5=W53;g5+=J53;g5+=W53;g5+=c13;var C5=m93;C5+=R93;C5+=t93;var Q5=c13;Q5+=w3ii[25714];Q5+=x93;return dt[h93]()[v13][B93][Y93] && editor[T13][Q5][C5] !== g5;};var __dtApi=function(table){var w93="taTable";var D5=I03;D5+=w93;var z5=U53;F7q.H0O();z5+=W53;return table instanceof $[z5][D5][K93]?table:$(table)[b43]();};var __dtHighlight=function(node){F7q.H0O();node=$(node);setTimeout(function(){var Q93='highlight';var q93="dC";var a5=A93;a5+=q93;a5+=E93;node[a5](Q93);setTimeout(function(){var g93="oH";var H13=550;var z93="ighlight";var C93="removeClas";var u5=C93;u5+=T13;var H5=W53;H5+=g93;H5+=z93;var V5=w3ii[621556];V5+=D93;V5+=a93;F7q.X0O();node[V5](H5)[u5](Q93);setTimeout(function(){var H93="hlight";var s5=W53;s5+=g93;s5+=V93;s5+=H93;node[u93](s5);},H13);},V13);},Y13);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var s93="ndexes";var d5=p53;d5+=s93;var f5=G53;f5+=W73;F7q.H0O();f5+=T13;dt[f5](identifier)[d5]()[M93](function(idx){var d93="ow identifier";var x13=14;var f93="Unable to find r";var n5=w3ii[25714];n5+=w3ii[621556];F7q.X0O();n5+=i13;n5+=w3ii[621556];var N5=G53;N5+=J53;N5+=m53;var row=dt[N5](idx);var data=row[n5]();var idSrc=idFn(data);if(idSrc === undefined){var S5=f93;S5+=d93;Editor[N93](S5,x13);}out[idSrc]={idSrc:idSrc,data:data,node:row[n93](),fields:fields,type:R33};});};var __dtFieldsFromIdx=function(dt,fields,idx,ignoreUnknown){var R13=11;var O93="tFi";var i93="aoColumns";var c93="itF";var k83='Unable to automatically determine field from source. Please specify the field name.';var r5=S93;r5+=b93;var l5=w3ii[62535];l5+=X93;var X5=l93;X5+=O93;X5+=r93;var b5=c13;b5+=w3ii[25714];F7q.H0O();b5+=c93;b5+=F93;var col=dt[h93]()[v13][i93][idx];var dataSrc=col[b5] !== undefined?col[X5]:col[l5];var resolvedFields={};var run=function(field,dataSrc){if(field[I93]() === dataSrc){resolvedFields[field[I93]()]=field;}};$[M93](fields,function(name,fieldInst){F7q.X0O();if(Array[T93](dataSrc)){var O5=r03;O5+=Z93;for(var i=v13;i < dataSrc[O5];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[r5](resolvedFields) && !ignoreUnknown){var c5=x03;c5+=G53;c5+=J53;c5+=G53;Editor[c5](k83,R13);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var i5=U83;i5+=P93;var F5=v43;F5+=c13;F5+=W83;F5+=T13;if(forceFields === void v13){forceFields=p33;}var cells=dt[F5](identifier);cells[L83]()[i5](function(idx){var w83="ttac";var M83="umn";var o83="obj";var Q83="attachField";var q83="ayFiel";var t83="edNode";var m83="yFi";var D83="fixedNode";var K83="hField";var y83="count";var B83="attachF";var h83="eys";var k7=o83;k7+=c13;k7+=e83;var Z5=j83;Z5+=M83;var T5=G53;T5+=J53;T5+=m53;var I5=v43;I5+=c13;I5+=r03;I5+=r03;var cell=dt[I5](idx);var row=dt[T5](idx[P83]);var data=row[v83]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[Z5],cells[y83]() > y13);var isNode=typeof identifier === k7 && identifier[p83] || identifier instanceof $;var prevDisplayFields,prevAttach,prevAttachFields;if(Object[G83](fields)[J93]){var p7=J83;p7+=m83;p7+=r93;p7+=T13;var y7=h53;y7+=n53;var v7=R83;v7+=F13;v7+=t83;var P7=T33;P7+=c13;P7+=i13;var M7=x83;M7+=h83;var j7=d53;j7+=t53;j7+=T13;j7+=P93;var e7=B83;e7+=Y83;var o7=w3ii[621556];o7+=w83;o7+=K83;o7+=T13;if(out[idSrc]){var L7=A83;L7+=q83;L7+=E83;var W7=Q83;W7+=T13;var U7=C83;U7+=g83;prevAttach=out[idSrc][U7];prevAttachFields=out[idSrc][W7];prevDisplayFields=out[idSrc][L7];}__dtRowSelector(out,dt,idx[P83],allFields,idFn);out[idSrc][o7]=prevAttachFields || [];out[idSrc][e7][j7](Object[M7](fields));out[idSrc][z83]=prevAttach || [];out[idSrc][z83][l33](isNode?$(identifier)[P7](v13):cell[v7]?cell[D83]():cell[n93]());out[idSrc][a83]=prevDisplayFields || ({});$[y7](out[idSrc][p7],fields);}});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var G7=v43;G7+=V83;G7+=r03;F7q.H0O();G7+=T13;dt[G7](p33,identifier)[L83]()[M93](function(idx){F7q.X0O();__dtCellSelector(out,dt,idx,fields,idFn);});};var dataSource$1={id:function(data){var J7=p53;F7q.H0O();J7+=w3ii[25714];J7+=H83;J7+=u83;var idFn=dataGet(this[T13][J7]);return idFn(data);},fakeRow:function(insertPoint){var U63=':eq(0)';var n83="isible";var I83=':visible';var i83="olum";var b83="e-inlineAdd\">";var M63="ys";var s83="__dtF";var f83="akeRow";var S83="tr class=\"d";var Z83='<td>';var a7=G53;a7+=J53;a7+=m53;var D7=J53;D7+=W53;var z7=s83;z7+=f83;var t7=d83;t7+=t53;t7+=W53;t7+=i13;var R7=N83;R7+=n83;var m7=r53;m7+=S83;m7+=i13;m7+=b83;var dt=__dtApi(this[T13][X83]);var tr=$(m7);var attachFields=[];var attach=[];var displayFields={};for(var i=v13,ien=dt[l83](R7)[t7]();i < ien;i++){var A7=r03;A7+=O83;A7+=i13;A7+=P93;var K7=r83;K7+=T13;var Y7=W53;Y7+=J53;Y7+=w3ii[25714];Y7+=c13;var B7=c83;B7+=r03;B7+=r03;var h7=U53;h7+=p53;h7+=F83;var x7=v43;x7+=i83;x7+=W53;var visIdx=dt[x7](i + I83)[T83]();var td=$(Z83)[k63](tr);var fields=__dtFieldsFromIdx(dt,this[T13][h7],visIdx,J33);var cell=dt[B7](U63,visIdx)[Y7]();if(cell){var w7=W63;w7+=L63;w7+=o63;td[w7](cell[e63]);}if(Object[K7](fields)[A7]){var Q7=B53;Q7+=i13;Q7+=j53;var E7=d53;E7+=t53;E7+=T13;E7+=P93;var q7=j63;q7+=M63;attachFields[l33](Object[q7](fields));attach[E7](td[v13]);$[Q7](displayFields,fields);}}var append=function(){var y63='prependTo';var v63='end';var P63="ppendTo";var g7=i13;g7+=w3ii[621556];g7+=O53;var C7=w3ii[621556];C7+=P63;var action=insertPoint === v63?C7:y63;tr[action](dt[g7](undefined)[p63]());};this[z7]=tr;append();dt[D7](G63,function(){append();});return {0:{attachFields:attachFields,attach:attach,displayFields:displayFields,fields:this[T13][J63],type:a7}};},fakeRowEnd:function(){var B63="__dtFakeRow";var x63="FakeR";var t63="__dt";var u7=m63;u7+=R63;var H7=t63;H7+=x63;H7+=W73;var V7=i13;V7+=w3ii[621556];V7+=h73;V7+=c13;var dt=__dtApi(this[T13][V7]);dt[h63](G63);this[H7][u7]();this[B63]=p33;},individual:function(identifier,fieldNames){var w63="idS";var f7=Y63;f7+=T13;F7q.H0O();var s7=w63;s7+=u83;var idFn=dataGet(this[T13][s7]);var dt=__dtApi(this[T13][X83]);var fields=this[T13][f7];var out={};var forceFields;if(fieldNames){var N7=c13;N7+=w3ii[621556];N7+=v43;N7+=P93;var d7=K63;d7+=G53;d7+=A63;if(!Array[d7](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[N7](fieldNames,function(i,name){F7q.X0O();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var g63="inObject";var H63="colum";var V63="mns";var X7=v43;X7+=c13;X7+=W83;X7+=T13;var b7=d83;b7+=q63;b7+=w3ii[62535];b7+=E63;var S7=Q63;S7+=C63;S7+=g63;var n7=i13;n7+=z63;n7+=r03;n7+=c13;var idFn=dataGet(this[T13][D63]);var dt=__dtApi(this[T13][n7]);var fields=this[T13][J63];var out={};if($[S7](identifier) && (identifier[a63] !== undefined || identifier[b7] !== undefined || identifier[X7] !== undefined)){var F7=c83;F7+=W83;F7+=T13;var r7=j83;r7+=t53;r7+=V63;var l7=G53;l7+=J53;l7+=m53;l7+=T13;if(identifier[l7] !== undefined){var O7=D53;O7+=m53;O7+=T13;__dtRowSelector(out,dt,identifier[O7],fields,idFn);}if(identifier[r7] !== undefined){var c7=H63;c7+=E63;__dtColumnSelector(out,dt,identifier[c7],fields,idFn);}if(identifier[F7] !== undefined){__dtCellSelector(out,dt,identifier[u63],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var i7=s63;i7+=v93;var dt=__dtApi(this[T13][i7]);if(!__dtIsSsp(dt,this)){var T7=W53;T7+=J53;T7+=w3ii[25714];T7+=c13;var I7=A93;I7+=w3ii[25714];var row=dt[P83][I7](data);__dtHighlight(row[T7]());}},edit:function(identifier,fields,data,store){var d63="drawType";var n63="ny";var l63="inArray";var that=this;var dt=__dtApi(this[T13][X83]);if(!__dtIsSsp(dt,this) || this[T13][f63][d63] === N63){var W0=w3ii[621556];W0+=n63;var Z7=p53;Z7+=w3ii[25714];var rowId=dataSource$1[Z7][S63](this,data);var row;try{row=dt[P83](safeQueryId(rowId));}catch(e){row=dt;}if(!row[b63]()){var k0=G53;k0+=J53;k0+=m53;row=dt[k0](function(rowIdx,rowData,rowNode){var U0=p53;U0+=w3ii[25714];return rowId == dataSource$1[U0][S63](that,rowData);});}if(row[W0]()){var o0=G53;o0+=J53;o0+=m53;o0+=X63;var L0=w3ii[25714];L0+=C83;L0+=w3ii[621556];var toSave=extend({},row[v83](),J33);toSave=extend(toSave,data,J33);row[L0](toSave);var idx=$[l63](rowId,store[o0]);store[O63][r63](idx,y13);}else {var e0=G53;e0+=J53;e0+=m53;row=dt[e0][W63](data);}__dtHighlight(row[n93]());}},refresh:function(){F7q.X0O();var i63="reload";var M0=c63;M0+=F13;var j0=F63;j0+=h73;j0+=c13;var dt=__dtApi(this[T13][j0]);dt[M0][i63](p33,m33);},remove:function(identifier,fields,store){var W2v="every";var I63="cancel";var U2v="ws";var v0=I63;v0+=T63;var P0=i13;P0+=Z63;var that=this;F7q.H0O();var dt=__dtApi(this[T13][P0]);var cancelled=store[v0];if(cancelled[J93] === v13){var y0=P83;y0+=T13;dt[y0](identifier)[k2v]();}else {var R0=D53;R0+=U2v;var p0=G53;p0+=J53;p0+=U2v;var indexes=[];dt[p0](identifier)[W2v](function(){var L2v="inArra";var J0=L2v;J0+=q03;var G0=p53;G0+=w3ii[25714];var id=dataSource$1[G0][S63](that,this[v83]());if($[J0](id,cancelled) === -y13){var m0=o2v;m0+=T13;m0+=P93;indexes[m0](this[T83]());}});dt[R0](indexes)[k2v]();}},prep:function(action,identifier,submit,json,store){var v2v="cancelled";var P2v="owIds";var A0=G53;A0+=c13;A0+=q73;A0+=E73;var _this=this;if(action === e2v){var x0=w3ii[25714];x0+=C83;x0+=w3ii[621556];var t0=w3ii[62535];t0+=w3ii[621556];t0+=d53;store[O63]=$[t0](json[x0],function(row){F7q.X0O();var h0=p53;h0+=w3ii[25714];return dataSource$1[h0][S63](_this,row);});}if(action === j2v){var Y0=M2v;Y0+=w3ii[621556];var B0=G53;B0+=P2v;var cancelled=json[v2v] || [];store[B0]=$[y2v](submit[Y0],function(val,key){var p2v="inAr";var K0=p2v;K0+=G2v;K0+=q03;F7q.X0O();var w0=S93;w0+=J2v;w0+=m2v;return !$[w0](submit[v83][key]) && $[K0](key,cancelled) === -y13?key:undefined;});}else if(action === A0){store[v2v]=json[v2v] || [];}},commit:function(action,identifier,data,store){var d2v="searchBuilder";var u2v="sear";var E2v="Buil";var f2v="rebuildPane";var N2v="earchBu";var s2v="chPanes";var S2v="rebuild";var n2v="ilder";var A2v="uild";var R2v="drawT";var x2v="bServ";var D2v="Panes";var q2v="search";var b2v="getDetails";var h2v="erSi";var K2v="reb";var V2v="responsive";var H2v="recalc";var V0=R2v;V0+=t2v;F7q.X0O();var E0=x2v;E0+=h2v;E0+=w3ii[25714];E0+=c13;var q0=F63;q0+=O53;var that=this;var dt=__dtApi(this[T13][q0]);var ssp=dt[h93]()[v13][B93][E0];var ids=store[O63];if(!__dtIsSsp(dt,this) && action === j2v && store[O63][J93]){var g0=B2v;g0+=Y2v;var row=void v13;var compare=function(id){return function(rowIdx,rowData,rowNode){var C0=v43;C0+=w3ii[621556];C0+=W83;var Q0=p53;F7q.H0O();Q0+=w3ii[25714];return id == dataSource$1[Q0][C0](that,rowData);};};for(var i=v13,ien=ids[g0];i < ien;i++){var a0=w2v;a0+=q03;var D0=w2v;D0+=q03;try{var z0=G53;z0+=J53;z0+=m53;row=dt[z0](safeQueryId(ids[i]));}catch(e){row=dt;}if(!row[D0]()){row=dt[P83](compare(ids[i]));}if(row[a0]() && !ssp){row[k2v]();}}}var drawType=this[T13][f63][V0];if(drawType !== N63){var l0=K2v;l0+=A2v;var X0=q2v;X0+=E2v;X0+=Q2v;X0+=G53;var S0=C2v;S0+=g2v;S0+=i13;S0+=y03;var n0=z2v;n0+=u83;n0+=P93;n0+=D2v;var N0=m93;N0+=w3ii[621556];N0+=m53;var H0=a2v;H0+=P93;var dtAny=dt;if(ssp && ids && ids[H0]){var s0=m93;s0+=w3ii[621556];s0+=m53;var u0=J53;u0+=W53;u0+=c13;dt[u0](s0,function(){var f0=v93;f0+=W53;f0+=Y2v;F7q.H0O();for(var i=v13,ien=ids[f0];i < ien;i++){var d0=G53;d0+=J53;d0+=m53;var row=dt[d0](safeQueryId(ids[i]));if(row[b63]()){__dtHighlight(row[n93]());}}});}dt[N0](drawType);if(dtAny[V2v]){dtAny[V2v][H2v]();}if(typeof dtAny[n0] === S0 && !ssp){var b0=u2v;b0+=s2v;dtAny[b0][f2v](undefined,J33);}if(dtAny[X0] !== undefined && typeof dtAny[d2v][l0] === w3ii[27150] && !ssp){var O0=T13;O0+=N2v;O0+=n2v;dtAny[O0][S2v](dtAny[d2v][b2v]());}}}};function __html_id(identifier){var i2v="n element with `data-editor-i";var F2v="Could not find a";var c2v="ring";var l2v="ata-editor-id=\"";F7q.X0O();var I2v="d` or `id` of: ";var X2v="[d";var F0=B2v;F0+=Y2v;var r0=X2v;r0+=l2v;if(identifier === O2v){return $(document);}var specific=$(r0 + identifier + F33);if(specific[J93] === v13){var c0=r2v;c0+=c2v;specific=typeof identifier === c0?$(safeQueryId(identifier)):$(identifier);}if(specific[F0] === v13){var i0=F2v;i0+=i2v;i0+=I2v;throw new Error(i0 + identifier);}return specific;}function __html_el(identifier,name){var Z2v="d=\"";var T2v="[data-editor-fiel";var I0=T2v;I0+=Z2v;var context=__html_id(identifier);return $(I0 + name + F33,context);}function __html_els(identifier,names){var out=$();for(var i=v13,ien=names[J93];i < ien;i++){var T0=w3ii[621556];T0+=w3ii[25714];T0+=w3ii[25714];out=out[T0](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var W1v="alue]";var k1v="[data-edi";var o1v='data-editor-value';var U1v="tor-v";var U4=C83;U4+=i33;var k4=k1v;F7q.X0O();k4+=U1v;k4+=W1v;var Z0=R83;Z0+=r03;Z0+=L1v;var el=__html_el(identifier,dataSrc);return el[Z0](k4)[J93]?el[U4](o1v):el[e1v]();}function __html_set(identifier,fields,data){F7q.H0O();$[M93](fields,function(name,field){var P1v="ilter";var J1v="-value";var p1v="ata-edi";F7q.X0O();var y1v='[data-editor-value]';var val=field[j1v](data);if(val !== undefined){var L4=B2v;L4+=M1v;L4+=P93;var W4=U53;W4+=P1v;var el=__html_el(identifier,field[v1v]());if(el[W4](y1v)[L4]){var o4=w3ii[25714];o4+=p1v;o4+=G1v;o4+=J1v;el[m1v](o4,val);}else {var P4=P93;P4+=i13;P4+=w3ii[62535];P4+=r03;el[M93](function(){var t1v="child";var B1v="removeChild";var x1v="Nodes";var h1v="irstChild";var j4=v93;F7q.H0O();j4+=R1v;j4+=i13;j4+=P93;var e4=t1v;e4+=x1v;while(this[e4][j4]){var M4=U53;M4+=h1v;this[B1v](this[M4]);}})[P4](val);}}});}var dataSource={id:function(data){var v4=Y1v;v4+=H83;v4+=u83;var idFn=dataGet(this[T13][v4]);return idFn(data);},initField:function(cfg){var K1v='[data-editor-label="';var A1v="lab";var p4=r03;p4+=w3ii[621556];p4+=R53;p4+=V83;var y4=w1v;y4+=k53;var label=$(K1v + (cfg[v83] || cfg[y4]) + F33);if(!cfg[p4] && label[J93]){var G4=A1v;G4+=c13;G4+=r03;cfg[G4]=label[e1v]();}},individual:function(identifier,fieldNames){var u1v='[data-editor-id]';var V1v="or-fi";var a1v="data-edit";var s1v='Cannot automatically determine field name from data source';var H1v='andSelf';var z1v="ack";var g1v="dB";var E1v="r-id";var D1v="ddB";var Q1v="ren";var Y4=B2v;Y4+=Y2v;var attachEl;if(identifier instanceof $ || identifier[p83]){var B4=q1v;B4+=Z03;B4+=J53;B4+=E1v;var h4=d53;h4+=w3ii[621556];h4+=Q1v;h4+=C1v;var x4=A93;x4+=g1v;x4+=z1v;var t4=w3ii[621556];t4+=D1v;t4+=w3ii[621556];t4+=h43;var R4=U53;R4+=W53;attachEl=identifier;if(!fieldNames){var m4=a1v;m4+=V1v;m4+=V83;m4+=w3ii[25714];var J4=w3ii[621556];J4+=i13;J4+=i13;J4+=G53;fieldNames=[$(identifier)[J4](m4)];}var back=$[R4][t4]?x4:H1v;identifier=$(identifier)[h4](u1v)[back]()[v83](B4);}if(!identifier){identifier=O2v;}if(fieldNames && !Array[T93](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[Y4] === v13){throw new Error(s1v);}var out=dataSource[J63][S63](this,identifier);var fields=this[T13][J63];var forceFields={};$[M93](fieldNames,function(i,name){forceFields[name]=fields[name];});$[M93](out,function(id,set){var n1v="tachFie";var f1v="yField";var S1v="cel";var q4=J83;q4+=f1v;q4+=T13;var A4=d1v;A4+=N1v;A4+=q03;var K4=C83;K4+=n1v;K4+=r03;K4+=E83;var w4=S1v;w4+=r03;set[b1v]=w4;set[K4]=[fieldNames];set[z83]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[A4]();set[J63]=fields;set[q4]=forceFields;});return out;},fields:function(identifier){var E4=R83;E4+=c13;E4+=X1v;var out={};if(Array[T93](identifier)){for(var i=v13,ien=identifier[J93];i < ien;i++){var res=dataSource[J63][S63](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};F7q.X0O();var fields=this[T13][E4];if(!identifier){identifier=O2v;}$[M93](fields,function(name,field){F7q.X0O();var val=__html_get(identifier,field[v1v]());field[l1v](data,val === p33?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:R33};return out;},create:function(fields,data){if(data){var C4=O1v;C4+=r03;var Q4=p53;Q4+=w3ii[25714];var id=dataSource[Q4][C4](this,data);try{var g4=B2v;g4+=Y2v;if(__html_id(id)[g4]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var z4=v43;z4+=r1v;z4+=r03;var id=dataSource[Y1v][z4](this,data) || O2v;__html_set(id,fields,data);},remove:function(identifier,fields){var D4=m63;D4+=J53;D4+=t43;F7q.X0O();D4+=c13;__html_id(identifier)[D4]();}};var classNames={"wrapper":a4,"processing":{"indicator":V4,"active":c1v},"header":{"wrapper":F1v,"content":H4},"body":{"wrapper":u4,"content":s4},"footer":{"wrapper":i1v,"content":f4},"form":{"wrapper":I1v,"content":d4,"tag":w3ii[505421],"info":T1v,"error":Z1v,"buttons":N4,"button":n4,"buttonInternal":k5v},"field":{"wrapper":U5v,"typePrefix":W5v,"namePrefix":S4,"label":L5v,"input":o5v,"inputControl":e5v,"error":b4,"msg-label":X4,"msg-error":j5v,"msg-message":l4,"msg-info":O4,"multiValue":M5v,"multiInfo":P5v,"multiRestore":v5v,"multiNoEdit":y5v,"disabled":p5v,"processing":G5v},"actions":{"create":J5v,"edit":r4,"remove":c4},"inline":{"wrapper":m5v,"liner":F4,"buttons":R5v},"bubble":{"wrapper":i4,"liner":I4,"table":t5v,"close":x5v,"pointer":T4,"bg":h5v}};var displayed$2=m33;var cssBackgroundOpacity=y13;var dom$1={wrapper:$(B5v + Z4 + k3 + U3)[v13],background:$(Y5v)[v13],close:$(w5v)[v13],content:p33};function findAttachRow(editor,attach){var A5v='head';var g5v="fier";var e3=v43;e3+=K5v;var W3=U53;W3+=W53;F7q.X0O();var dt=new $[W3][k33][K93](editor[T13][X83]);if(attach === A5v){var o3=q5v;o3+=A93;o3+=c13;o3+=G53;var L3=i13;L3+=w3ii[621556];L3+=h73;L3+=c13;return dt[L3](undefined)[o3]();;}else if(editor[T13][E5v] === e3){var j3=i13;j3+=z63;j3+=r03;j3+=c13;return dt[j3](undefined)[Q5v]();}else {var v3=W53;v3+=J53;v3+=Q2v;var P3=w3ii[62535];P3+=C5v;P3+=p53;P3+=g5v;var M3=G53;M3+=J53;M3+=m53;return dt[M3](editor[T13][P3])[v3]();}}function heightCalc$1(dte){var X5v="outerHeight";var V5v="maxHe";var u5v="outerHeig";var n5v="ooter";var b5v="div.DTE_Head";var d5v="div.DTE";var N5v="_F";var D5v="eigh";var H5v="ght";var z5v="outerH";var h3=z5v;h3+=D5v;h3+=i13;var x3=w3ii[25714];x3+=a5v;var t3=V5v;t3+=V93;t3+=M43;var R3=P93;R3+=c13;R3+=p53;R3+=H5v;var m3=u5v;m3+=M43;var J3=s5v;J3+=f5v;var G3=d5v;G3+=N5v;G3+=n5v;var p3=m53;p3+=S5v;p3+=d53;p3+=x03;var y3=b5v;y3+=x03;var header=$(y3,dom$1[p3])[X5v]();var footer=$(G3,dom$1[J3])[m3]();var maxHeight=$(window)[R3]() - envelope[l5v][O5v] * p13 - header - footer;$(r5v,dom$1[c5v])[F5v](t3,maxHeight);return $(dte[x3][c5v])[h3]();}function hide$2(dte,callback){var I5v="setH";var k7v="mate";F7q.X0O();if(!callback){callback=function(){};}if(displayed$2){var Y3=i5v;Y3+=U53;Y3+=I5v;Y3+=T5v;var B3=w3ii[621556];B3+=Z5v;B3+=k7v;$(dom$1[U7v])[B3]({top:-(dom$1[U7v][Y3] + C13)},s13,function(){var j7v="fadeOut";var K3=W53;K3+=W7v;K3+=r03;var w3=L7v;w3+=o7v;$([dom$1[w3],dom$1[e7v]])[j7v](K3,function(){$(this)[M7v]();callback();});});displayed$2=m33;}}function init$1(){var v7v="kground";var p7v='div.DTED_Envelope_Container';var Q3=v43;Q3+=o63;var E3=P7v;E3+=v7v;F7q.X0O();var q3=L7v;q3+=o7v;var A3=y7v;A3+=N53;A3+=i13;dom$1[A3]=$(p7v,dom$1[q3])[v13];cssBackgroundOpacity=$(dom$1[E3])[Q3](G7v);}function show$2(dte,callback){var m0v='normal';var h7v="ff";var J7v="resize.D";var z7v="click.D";var Z7v="ffset";var t7v="click.DTED_Env";var u7v="heig";var Q7v="ground";var v0v="px";var q7v="D_Envel";var C7v="click.DTED_Enve";var U0v="dth";var F7v="groun";var B7v="iv.DTED_";var b7v='auto';var x7v="elope";var Y7v="Lightbox_Content";var r7v="ci";var I7v="etHeight";var D7v="TED_En";var i7v="offs";var O7v="opa";var h0v='click.DTED_Envelope';var a7v="velo";var g7v="lop";var j0v='0';var M0v="offsetWidth";var y0v="marginLeft";var m7v="TED_Envelo";var l7v="ackgrou";var e0v="opacity";var t9=J7v;t9+=m7v;t9+=R7v;var R9=J53;R9+=W53;var m9=J7v;m9+=m7v;m9+=R7v;var J9=i5v;J9+=U53;var p9=J53;p9+=W53;var y9=t7v;y9+=x7v;var v9=J53;v9+=h7v;var P9=s5v;P9+=f5v;var M9=w3ii[25714];M9+=B7v;M9+=Y7v;M9+=w7v;var j9=K7v;j9+=A7v;j9+=q7v;j9+=E7v;var e9=J53;e9+=W53;var o9=i5v;o9+=U53;var L9=P7v;L9+=x83;L9+=Q7v;var W9=C7v;W9+=g7v;W9+=c13;var U9=J53;U9+=W53;var k9=z7v;k9+=D7v;k9+=a7v;k9+=R7v;var Z3=J53;Z3+=h7v;var T3=p43;T3+=V7v;var I3=p53;I3+=H7v;var D3=u7v;D3+=M43;var z3=m53;z3+=G53;z3+=s7v;z3+=G53;var g3=w3ii[621556];g3+=f7v;g3+=N53;g3+=w3ii[25714];var C3=d7v;C3+=N7v;if(!callback){callback=function(){};}$(C3)[g3](dom$1[e7v])[n7v](dom$1[z3]);dom$1[U7v][S7v][D3]=b7v;if(!displayed$2){var i3=w2v;i3+=X7v;i3+=S53;var F3=R53;F3+=l7v;F3+=n53;var c3=O7v;c3+=r7v;c3+=c7v;var r3=P7v;r3+=x83;r3+=F7v;r3+=w3ii[25714];var O3=i13;O3+=J53;O3+=d53;var l3=d53;l3+=F13;var X3=i7v;X3+=I7v;var b3=i13;b3+=T7v;var S3=J53;S3+=Z7v;var n3=i13;n3+=J53;n3+=d53;var N3=s5v;N3+=f5v;var d3=d53;d3+=F13;var f3=k0v;f3+=U0v;var s3=W53;s3+=I53;s3+=c13;var u3=u53;u3+=T13;u3+=W0v;var H3=C83;H3+=g83;var V3=h73;V3+=J53;V3+=v43;V3+=x83;var a3=L0v;a3+=o0v;a3+=A63;var style=dom$1[c5v][S7v];style[e0v]=j0v;style[a3]=V3;var height=heightCalc$1(dte);var targetRow=findAttachRow(dte,envelope[l5v][H3]);var width=targetRow[M0v];style[u3]=s3;style[e0v]=P0v;dom$1[c5v][S7v][f3]=width + v0v;dom$1[c5v][S7v][y0v]=-(width / p13) + d3;dom$1[N3][S7v][n3]=$(targetRow)[S3]()[b3] + targetRow[X3] + l3;dom$1[U7v][S7v][O3]=-y13 * height - Y13 + v0v;dom$1[r3][S7v][c3]=j0v;dom$1[e7v][S7v][p0v]=G0v;$(dom$1[F3])[J0v]({opacity:cssBackgroundOpacity},m0v);$(dom$1[c5v])[R0v]();$(dom$1[U7v])[i3]({top:v13},s13,callback);}$(dom$1[t0v])[m1v](x0v,dte[I3][T3])[Z3](k9)[U9](W9,function(e){F7q.H0O();dte[t0v]();});$(dom$1[L9])[o9](h0v)[e9](j9,function(e){dte[e7v]();});$(M9,dom$1[P9])[v9](y9)[p9](h0v,function(e){var B0v="hasClas";var w0v='DTED_Envelope_Content_Wrapper';F7q.H0O();var G9=B0v;G9+=T13;if($(e[Y0v])[G9](w0v)){dte[e7v]();}});$(window)[J9](m9)[R9](t9,function(){heightCalc$1(dte);});displayed$2=J33;}var envelope={close:function(dte,callback){F7q.X0O();hide$2(dte,callback);},destroy:function(dte){F7q.X0O();hide$2();},init:function(dte){F7q.H0O();init$1();return envelope;},node:function(dte){var x9=m53;x9+=S5v;x9+=o7v;return dom$1[x9][v13];},open:function(dte,append,callback){var Q0v="appendChild";var A0v="ndChil";var K9=K0v;K9+=R7v;K9+=A0v;K9+=w3ii[25714];var w9=G03;w9+=i13;w9+=r73;var Y9=w3ii[25714];Y9+=c13;Y9+=i13;Y9+=q0v;var B9=E0v;B9+=m93;B9+=N53;var h9=d83;h9+=I73;$(dom$1[h9])[B9]()[Y9]();dom$1[w9][K9](append);dom$1[U7v][Q0v](dom$1[t0v]);show$2(dte,callback);},conf:{windowPadding:C13,attach:A9}};function isMobile(){var g0v='undefined';var C0v="orientation";F7q.X0O();var u13=576;var z0v="outerWidth";return typeof window[C0v] !== g0v && window[z0v] <= u13?J33:m33;}var displayed$1=m33;var ready=m33;var scrollTop=v13;var dom={wrapper:$(q9 + E9 + D0v + a0v + Q9 + V0v + V0v + V0v),background:$(H0v),close:$(u0v),content:p33};function heightCalc(){F7q.H0O();var b0v='div.DTE_Footer';var X0v='maxHeight';var f0v="rHeigh";var s0v="oute";var N0v="rH";var l0v='calc(100vh - ';var O0v='px)';var S0v="div.DTE_Heade";var a9=s0v;a9+=f0v;a9+=i13;var D9=d0v;D9+=f7v;D9+=x03;var z9=s0v;z9+=N0v;z9+=T5v;var g9=m53;g9+=n0v;var C9=S0v;C9+=G53;var headerFooter=$(C9,dom[g9])[z9]() + $(b0v,dom[D9])[a9]();if(isMobile()){var V9=d0v;V9+=d53;V9+=R7v;V9+=G53;$(r5v,dom[V9])[F5v](X0v,l0v + headerFooter + O0v);}else {var u9=v43;u9+=J53;u9+=r0v;var H9=P93;H9+=T5v;var maxHeight=$(window)[H9]() - self[u9][O5v] * p13 - headerFooter;$(r5v,dom[c5v])[F5v](X0v,maxHeight);}}function hide$1(dte,callback){var k4v="setAn";var i0v="back";F7q.H0O();var W4v="crollTo";var c0v="resize.DTED_L";var I0v="gr";var F0v="ightbo";var l9=c0v;l9+=F0v;l9+=F13;var X9=J53;X9+=U53;X9+=U53;var b9=i0v;b9+=I0v;b9+=T0v;var S9=Z0v;S9+=X7v;S9+=S53;var N9=i5v;N9+=U53;N9+=k4v;N9+=p53;var d9=U4v;d9+=G53;var f9=T13;f9+=W4v;f9+=d53;var s9=R53;s9+=U03;if(!callback){callback=function(){};}$(s9)[f9](scrollTop);dte[L4v](dom[d9],{opacity:v13,top:self[l5v][N9]},function(){var n9=Q2v;n9+=F63;n9+=o4v;$(this)[n9]();callback();});dte[S9](dom[b9],{opacity:v13},function(){$(this)[M7v]();});displayed$1=m33;$(window)[X9](l9);}function init(){var y4v="Content";var M4v="ckgr";var e4v="city";var v4v="div.DTED_Lightbox_";var j4v="ba";var i9=T7v;i9+=w3ii[621556];i9+=e4v;var F9=v43;F9+=T13;F9+=T13;var c9=j4v;c9+=M4v;c9+=T0v;var r9=m53;r9+=G53;r9+=w3ii[621556];r9+=P4v;var O9=v4v;O9+=y4v;if(ready){return;}dom[U7v]=$(O9,dom[c5v]);dom[r9][F5v](G7v,v13);dom[c9][F9](i9,v13);ready=J33;}function show$1(dte,callback){var H4v="D_Li";var a4v="resiz";var E4v="backgr";var S4v='click.DTED_Lightbox';var p4v="lick.D";var m4v="div.DTED_L";var R4v="ightbox_Content";var Y4v=".DTED_Lightb";var u4v="ghtbox";var t4v="lick";var h4v="clic";var z4v='DTED_Lightbox_Mobile';var f4v="onf";var g4v="addC";var J4v="ox";var A4v="clo";var d4v="uto";var s4v="offsetA";var G4v="TED_Lightb";var x4v=".DTED_Lightbox";var B4v="k.DTED_Lightbox";var N4v="scrollTop";var V4v="e.DTE";var B8=v43;B8+=p4v;B8+=G4v;B8+=J4v;var h8=m4v;h8+=R4v;h8+=w7v;var t8=v43;t8+=t4v;t8+=x4v;var R8=J53;R8+=W53;var m8=h4v;m8+=B4v;var J8=K7v;J8+=Y4v;J8+=J4v;var G8=J53;G8+=W53;var p8=p43;p8+=V7v;var y8=w4v;y8+=K4v;var v8=A4v;v8+=T13;v8+=c13;var U8=q4v;U8+=c13;U8+=W53;U8+=w3ii[25714];var k8=E4v;k8+=J53;k8+=Q4v;var Z9=w3ii[621556];Z9+=d53;Z9+=C4v;if(isMobile()){var T9=g4v;T9+=E93;var I9=d7v;I9+=w3ii[25714];I9+=q03;$(I9)[T9](z4v);}$(D4v)[Z9](dom[k8])[U8](dom[c5v]);heightCalc();if(!displayed$1){var P8=a4v;P8+=V4v;P8+=H4v;P8+=u4v;var M8=U4v;M8+=G53;var j8=s4v;j8+=Z5v;var e8=v43;e8+=f4v;var o8=v43;o8+=o63;var L8=w3ii[621556];L8+=d4v;var W8=q5v;W8+=V93;W8+=P93;W8+=i13;displayed$1=J33;dom[U7v][F5v](W8,L8);dom[c5v][o8]({top:-self[e8][j8]});dte[L4v](dom[M8],{opacity:y13,top:v13},callback);dte[L4v](dom[e7v],{opacity:y13});$(window)[I53](P8,function(){heightCalc();});scrollTop=$(D4v)[N4v]();}dom[v8][m1v](y8,dte[n4v][p8])[h63](S4v)[G8](J8,function(e){dte[t0v]();});dom[e7v][h63](m8)[R8](t8,function(e){var b4v="stopImmediateP";var X4v="pagation";var x8=b4v;x8+=D53;x8+=X4v;F7q.X0O();e[x8]();dte[e7v]();});$(h8,dom[c5v])[h63](B8)[I53](S4v,function(e){var T4v="stopImmediate";var l4v="DTED_Li";var k3v="opagation";var i4v="rg";var F4v="sClass";var r4v="tbox_Content_Wrapper";var Z4v="Pr";var K8=l4v;K8+=O4v;K8+=r4v;var w8=c4v;w8+=F4v;var Y8=i13;Y8+=w3ii[621556];Y8+=i4v;Y8+=I4v;if($(e[Y8])[w8](K8)){var A8=T4v;A8+=Z4v;A8+=k3v;e[A8]();dte[e7v]();}});}var self={close:function(dte,callback){F7q.H0O();hide$1(dte,callback);},conf:{offsetAni:K13,windowPadding:K13},destroy:function(dte){F7q.X0O();if(displayed$1){hide$1(dte);}},init:function(dte){F7q.X0O();init();return self;},node:function(dte){var q8=m53;q8+=G2v;q8+=f7v;q8+=x03;return dom[q8][v13];},open:function(dte,append,callback){var U3v="onte";var C8=w3ii[621556];C8+=d53;C8+=R7v;C8+=n53;var Q8=w3ii[621556];Q8+=f7v;Q8+=j53;var E8=v43;E8+=U3v;E8+=W3v;var content=dom[E8];content[L3v]()[M7v]();content[Q8](append)[C8](dom[t0v]);show$1(dte,callback);}};var DataTable$4=$[g8][z8];function add(cfg,after,reorder){var P3v="'. ";var G3v="or ";var a3v="nA";var z3v="ice";var J3v="addi";var Y3v="Re";var t3v='initField';var y3v=" exists with this name";var v3v="A field already";var x3v="Field";var m3v="ng field '";var e3v="reverse";var M3v="Error adding field. The field requires a `name` option";var p3v="Err";var o3v="orde";var n8=R83;n8+=c13;n8+=X1v;var s8=q73;s8+=w3ii[25714];s8+=c13;var V8=U53;F7q.H0O();V8+=p53;V8+=F83;var a8=W53;a8+=w3ii[621556];a8+=w3ii[62535];a8+=c13;if(reorder === void v13){reorder=J33;}if(Array[T93](cfg)){var D8=o3v;D8+=G53;if(after !== undefined){cfg[e3v]();}for(var i=v13;i < cfg[J93];i++){this[W63](cfg[i],after,m33);}this[j3v](this[D8]());return this;}var name=cfg[a8];if(name === undefined){throw M3v;}if(this[T13][V8][name]){var u8=P3v;u8+=v3v;u8+=y3v;var H8=p3v;H8+=G3v;H8+=J3v;H8+=m3v;throw H8 + name + u8;}this[R3v](t3v,cfg);var field=new Editor[x3v](cfg,this[h3v][Y63],this);if(this[T13][s8]){var f8=B3v;f8+=p53;f8+=Y3v;f8+=w3v;var editFields=this[T13][K3v];field[f8]();$[M93](editFields,function(idSrc,edit){var d8=w3ii[25714];d8+=w3ii[621556];d8+=i13;d8+=w3ii[621556];var val;if(edit[d8]){var N8=I03;N8+=F63;val=field[j1v](edit[N8]);}field[A3v](idSrc,val !== undefined?val:field[q3v]());});}this[T13][n8][name]=field;if(after === undefined){var S8=d53;S8+=t53;S8+=E3v;this[T13][Q3v][S8](name);}else if(after === p33){this[T13][Q3v][C3v](name);}else {var l8=g3v;l8+=z3v;var X8=D3v;X8+=Q2v;X8+=G53;var b8=p53;b8+=a3v;b8+=G53;b8+=V3v;var idx=$[b8](after,this[T13][Q3v]);this[T13][X8][l8](idx + y13,v13,name);}if(reorder !== m33){this[j3v](this[Q3v]());}return this;}function ajax(newAjax){var O8=w3ii[621556];O8+=H3v;O8+=w3ii[621556];O8+=F13;if(newAjax){this[T13][u3v]=newAjax;return this;}return this[T13][O8];}function background(){var s3v="onBackground";var c8=v43;c8+=r03;c8+=J53;c8+=G43;var r8=R53;r8+=r03;r8+=t53;r8+=G53;var onBackground=this[T13][f63][s3v];if(typeof onBackground === w3ii[27150]){onBackground(this);}else if(onBackground === r8){this[f3v]();}else if(onBackground === c8){var F8=p43;F8+=J53;F8+=T13;F8+=c13;this[F8]();}else if(onBackground === j33){var i8=d3v;i8+=i13;this[i8]();}return this;}function blur(){F7q.X0O();var N3v="_b";var I8=N3v;I8+=n3v;this[I8]();return this;}function bubble(cells,fieldNames,show,opts){var F3v="olean";var r3v="Options";var X3v="dataSo";var i3v="isPlainOb";var c3v="sPlainObj";var I3v="ject";var b3v="ividual";var j6=Z73;j6+=S3v;var e6=I33;e6+=w3ii[25714];e6+=b3v;var o6=Z73;o6+=X3v;o6+=l3v;var L6=U53;L6+=J53;L6+=O3v;L6+=r3v;var W6=p53;W6+=c3v;W6+=m2v;var U6=d7v;U6+=F3v;var k6=i3v;k6+=I3v;var T8=Z73;T8+=i13;T8+=p53;T8+=N7v;var _this=this;var that=this;if(this[T8](function(){F7q.X0O();var Z8=T3v;Z8+=Z3v;Z8+=v93;that[Z8](cells,fieldNames,opts);})){return this;}F7q.X0O();if($[k6](fieldNames)){opts=fieldNames;fieldNames=undefined;show=J33;}else if(typeof fieldNames === U6){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[W6](show)){opts=show;show=J33;}if(show === undefined){show=J33;}opts=$[b33]({},this[T13][L6][k9v],opts);var editFields=this[o6](e6,cells,fieldNames);this[j6](cells,editFields,U9v,opts,function(){var W8v="prepend";var B9v="s=\"";var u9v="ubbl";var D9v="class=\"";var C9v="s=";var z9v="iv ";var G9v="dren";var J8v="_postopen";var L9v="imate";var Y9v="</di";var d9v="_formOptions";var h9v=" clas";var O9v="liner";var t9v="poin";var e8v="repen";var j9v="closeReg";var i9v="appendT";var V9v="esize";var f9v="eopen";var y9v="epend";var n9v="bubbleNodes";var A9v="\" tit";var F9v='<div class="DTE_Processing_Indicator"><span></div>';var X9v='"><div></div></div>';var q9v="le=\"";var N9v="bubblePosition";var i6=W9v;i6+=W53;i6+=L9v;var l6=o9v;l6+=h43;var X6=J53;X6+=W53;var S6=v43;S6+=e9v;S6+=h43;var N6=Z73;N6+=j9v;var d6=A93;d6+=w3ii[25714];var u6=R53;u6+=l73;var a6=w3ii[62535];a6+=M9v;a6+=P9v;var D6=v9v;D6+=y9v;var z6=o4v;z6+=p9v;z6+=N53;F7q.X0O();var g6=E0v;g6+=G9v;var q6=J9v;q6+=w3ii[25714];q6+=m9v;q6+=R9v;var A6=t9v;A6+=L1v;var K6=r53;K6+=x9v;K6+=h9v;K6+=B9v;var w6=Y9v;w6+=w9v;var Y6=p53;Y6+=K9v;Y6+=W53;var B6=A9v;B6+=q9v;var h6=c33;h6+=R9v;var x6=E9v;x6+=Q9v;x6+=C9v;x6+=c33;var t6=m53;t6+=n0v;var R6=e73;R6+=p53;R6+=g9v;R6+=B9v;var m6=R53;m6+=T33;var J6=e73;J6+=z9v;J6+=D9v;var G6=v43;G6+=r03;G6+=w3ii[621556];G6+=a9v;var p6=w3ii[621556];p6+=i13;p6+=i13;p6+=q0v;var y6=G53;y6+=V9v;y6+=H9v;var v6=J53;v6+=W53;var P6=R53;P6+=u9v;P6+=c13;var M6=s9v;M6+=f9v;var namespace=_this[d9v](opts);var ret=_this[M6](P6);if(!ret){return _this;}$(window)[v6](y6 + namespace,function(){_this[N9v]();});var nodes=[];_this[T13][n9v]=nodes[S9v][b9v](nodes,pluck(editFields,p6));var classes=_this[G6][k9v];var background=$(J6 + classes[m6] + X9v);var container=$(R6 + classes[t6] + l9v + x6 + classes[O9v] + h6 + r9v + classes[X83] + l9v + r9v + classes[t0v] + B6 + _this[Y6][t0v] + c9v + F9v + V0v + w6 + K6 + classes[A6] + c9v + q6);if(show){var C6=R53;C6+=J53;C6+=w3ii[25714];C6+=q03;var Q6=i9v;Q6+=J53;var E6=n7v;E6+=I9v;E6+=J53;container[E6](D4v);background[Q6](C6);}var liner=container[g6]()[T9v](v13);var table=liner[z6]();var close=table[L3v]();liner[n7v](_this[Z9v][k8v]);table[D6](_this[Z9v][U8v]);if(opts[a6]){liner[W8v](_this[Z9v][L8v]);}if(opts[o8v]){var H6=w3ii[25714];H6+=J53;H6+=w3ii[62535];var V6=d53;V6+=e8v;V6+=w3ii[25714];liner[V6](_this[H6][Q5v]);}if(opts[u6]){var f6=T3v;f6+=j8v;f6+=W53;f6+=T13;var s6=w3ii[25714];s6+=J53;s6+=w3ii[62535];table[n7v](_this[s6][f6]);}var finish=function(){var M8v="_clearDynamicInfo";_this[M8v]();_this[P8v](v8v,[U9v]);};var pair=$()[W63](container)[d6](background);_this[N6](function(submitComplete){var y8v="anima";var n6=Z73;n6+=y8v;n6+=S53;F7q.X0O();_this[n6](pair,{opacity:v13},function(){var p8v='resize.';F7q.X0O();if(this === container[v13]){pair[M7v]();$(window)[h63](p8v + namespace);finish();}});});background[I53](S6,function(){var b6=R53;b6+=r03;b6+=t53;b6+=G53;_this[b6]();});close[X6](l6,function(){var O6=G8v;O6+=J53;O6+=T13;O6+=c13;_this[O6]();});_this[N9v]();_this[J8v](U9v,m33);var opened=function(){var B8v='opened';var x8v="cludeF";var F6=Z73;F6+=m8v;F6+=N53;F6+=i13;var c6=U53;c6+=R8v;c6+=t8v;var r6=I33;r6+=x8v;r6+=p53;r6+=F83;_this[h8v](_this[T13][r6],opts[c6]);_this[F6](B8v,[U9v,_this[T13][E5v]]);};_this[i6](pair,{opacity:y13},function(){F7q.H0O();if(this === container[v13]){opened();}});});return this;}function bubblePosition(){var d8v="addClas";var N8v="elow";var s8v="bottom";var A8v="ou";var n8v='left';var q8v="terWid";var H8v="right";var f8v="belo";var K8v="clas";var E8v="bbleNodes";var Q8v='div.DTE_Bubble';var a8v="top";var C8v='div.DTE_Bubble_Liner';var V8v="left";var y2M=i13;y2M+=J53;y2M+=d53;var v2M=i5v;v2M+=U53;v2M+=G43;v2M+=i13;var P2M=v93;P2M+=Y8v;var M2M=v43;M2M+=o63;var j2M=w8v;j2M+=R53;j2M+=v93;var e2M=K8v;e2M+=T13;e2M+=c13;e2M+=T13;var o2M=k0v;o2M+=w3ii[25714];o2M+=i13;o2M+=P93;var L2M=A8v;L2M+=q8v;L2M+=y93;var W2M=G53;W2M+=p53;W2M+=O4v;W2M+=i13;var U2M=B2v;U2M+=Y2v;var I6=T3v;I6+=E8v;var wrapper=$(Q8v),liner=$(C8v),nodes=this[T13][I6];var position={top:v13,left:v13,right:v13,bottom:v13};$[M93](nodes,function(i,node){var z8v="offset";var g8v="offsetWi";var u8v="offsetHeight";var k2M=d7v;k2M+=j8v;k2M+=w3ii[62535];var Z6=g8v;Z6+=w3ii[25714];Z6+=y93;var T6=v93;T6+=U53;T6+=i13;var pos=$(node)[z8v]();node=$(node)[D8v](v13);position[a8v]+=pos[a8v];position[V8v]+=pos[V8v];position[H8v]+=pos[T6] + node[Z6];position[k2M]+=pos[a8v] + node[u8v];});position[a8v]/=nodes[J93];position[V8v]/=nodes[U2M];position[W2M]/=nodes[J93];position[s8v]/=nodes[J93];var top=position[a8v],left=(position[V8v] + position[H8v]) / p13,width=liner[L2M](),visLeft=left - width / p13,visRight=visLeft + width,docWidth=$(window)[o2M](),padding=h13;this[e2M][j2M];wrapper[M2M]({top:top,left:left});if(liner[P2M] && liner[v2M]()[y2M] < v13){var m2M=f8v;m2M+=m53;var J2M=d8v;J2M+=T13;var G2M=i13;G2M+=T7v;var p2M=v43;p2M+=o63;wrapper[p2M](G2M,position[s8v])[J2M](m2M);}else {var R2M=R53;R2M+=N8v;wrapper[u93](R2M);}if(visRight + padding > docWidth){var diff=visRight - docWidth;liner[F5v](n8v,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var t2M=v93;t2M+=U53;t2M+=i13;liner[F5v](t2M,visLeft < padding?-(visLeft - padding):v13);}return this;}function buttons(buttons){var b8v="tons";var h2M=S8v;h2M+=b8v;var _this=this;if(buttons === N33){var x2M=w3ii[621556];x2M+=X8v;x2M+=I53;buttons=[{text:this[n4v][this[T13][x2M]][l8v],action:function(){this[l8v]();}}];}else if(!Array[T93](buttons)){buttons=[buttons];}$(this[Z9v][h2M])[O8v]();$[M93](buttons,function(i,btn){var L6v="label";var r8v="butt";var M6v='tabindex';var Z8v="bIndex";var o6v='<button></button>';var H2M=r8v;H2M+=c8v;var V2M=w3ii[25714];V2M+=a5v;var D2M=o9v;D2M+=v43;D2M+=x83;var g2M=j63;g2M+=q03;F7q.X0O();g2M+=F8v;g2M+=o63;var C2M=J53;C2M+=W53;var E2M=x83;E2M+=c13;E2M+=i8v;E2M+=d53;var q2M=J53;q2M+=W53;var A2M=i13;A2M+=z63;A2M+=I8v;A2M+=T8v;var K2M=F63;K2M+=Z8v;var w2M=k6v;w2M+=a9v;var Y2M=S53;Y2M+=g03;if(typeof btn === U93){btn={text:btn,action:function(){var W6v="mi";F7q.X0O();var B2M=U6v;B2M+=R53;B2M+=W6v;B2M+=i13;this[B2M]();}};}var text=btn[Y2M] || btn[L6v];var action=btn[E5v] || btn[Z43];$(o6v,{'class':_this[w2M][U8v][e6v] + (btn[e63]?j6v + btn[e63]:I43)})[e1v](typeof text === w3ii[27150]?text(_this):text || I43)[m1v](M6v,btn[K2M] !== undefined?btn[A2M]:v13)[q2M](E2M,function(e){F7q.X0O();if(e[P6v] === t13 && action){var Q2M=v43;Q2M+=w3ii[621556];Q2M+=W83;action[Q2M](_this);}})[C2M](g2M,function(e){var v6v="hich";F7q.X0O();var z2M=m53;z2M+=v6v;if(e[z2M] === t13){e[y6v]();}})[I53](D2M,function(e){e[y6v]();F7q.H0O();if(action){var a2M=p6v;a2M+=W83;action[a2M](_this,e);}})[k63](_this[V2M][H2M]);});return this;}function clear(fieldName){var J6v="includeField";var h6v="clud";var x6v="plic";var B6v="eFie";var t6v="des";var u2M=U53;u2M+=G6v;u2M+=w3ii[25714];u2M+=T13;var that=this;var fields=this[T13][u2M];if(typeof fieldName === U93){var n2M=J6v;n2M+=T13;var N2M=p53;N2M+=m6v;N2M+=A63;var d2M=J53;d2M+=R6v;d2M+=c13;d2M+=G53;var f2M=I33;f2M+=N1v;f2M+=q03;var s2M=t6v;s2M+=i13;s2M+=D53;s2M+=q03;that[Y63](fieldName)[s2M]();delete fields[fieldName];var orderIdx=$[f2M](fieldName,this[T13][d2M]);this[T13][Q3v][r63](orderIdx,y13);var includeIdx=$[N2M](fieldName,this[T13][n2M]);if(includeIdx !== -y13){var b2M=T13;b2M+=x6v;b2M+=c13;var S2M=I33;S2M+=h6v;S2M+=B6v;S2M+=X1v;this[T13][S2M][b2M](includeIdx,y13);}}else {var X2M=c13;X2M+=w3ii[621556];X2M+=v43;X2M+=P93;$[X2M](this[Y6v](fieldName),function(i,name){var l2M=v43;l2M+=r03;l2M+=c13;F7q.H0O();l2M+=w6v;that[l2M](name);});}return this;}function close(){var O2M=K6v;F7q.H0O();O2M+=e43;O2M+=c13;this[O2M](m33);return this;}function create(arg1,arg2,arg3,arg4){var Q6v="um";var U1M=c13;U1M+=w3ii[621556];U1M+=o4v;var k1M=A6v;k1M+=q6v;var Z2M=z43;Z2M+=O3v;var T2M=w3ii[25714];T2M+=J53;T2M+=w3ii[62535];var I2M=E6v;I2M+=I53;var i2M=w3ii[62535];i2M+=J53;i2M+=w3ii[25714];i2M+=c13;var F2M=W53;F2M+=Q6v;F2M+=R03;F2M+=G53;var r2M=Z73;r2M+=i13;r2M+=Y1v;r2M+=q03;var _this=this;var that=this;var fields=this[T13][J63];var count=y13;if(this[r2M](function(){var C6v="rea";var c2M=v43;c2M+=C6v;F7q.X0O();c2M+=i13;c2M+=c13;that[c2M](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === F2M){count=arg1;arg1=arg2;arg2=arg3;}this[T13][K3v]={};for(var i=v13;i < count;i++){this[T13][K3v][i]={fields:this[T13][J63]};}var argOpts=this[g6v](arg1,arg2,arg3,arg4);this[T13][i2M]=z6v;this[T13][I2M]=D6v;this[T13][a6v]=p33;this[T2M][Z2M][S7v][p0v]=G0v;this[V6v]();this[k1M](this[J63]());$[U1M](fields,function(name,field){F7q.H0O();field[H6v]();for(var i=v13;i < count;i++){field[A3v](i,field[q3v]());}field[w3v](field[q3v]());});this[P8v](u6v,p33,function(){var f6v="ormOp";var n6v="maybeOpen";var L1M=s6v;L1M+=T13;F7q.H0O();var W1M=L93;W1M+=f6v;W1M+=d6v;_this[N6v]();_this[W1M](argOpts[L1M]);argOpts[n6v]();});return this;}function undependent(parent){var b6v="undependent";var e1M=H9v;e1M+=c13;e1M+=w3ii[25714];e1M+=S6v;var o1M=K63;o1M+=G53;o1M+=A63;if(Array[o1M](parent)){for(var i=v13,ien=parent[J93];i < ien;i++){this[b6v](parent[i]);}return this;}var field=this[Y63](parent);$(field[n93]())[h63](e1M);return this;}function dependent(parent,url,opts){var p25='.edep';var l6v="js";var m1M=W53;m1M+=J53;m1M+=w3ii[25714];m1M+=c13;var v1M=v43;v1M+=c4v;v1M+=X6v;var P1M=l6v;P1M+=I53;var M1M=O6v;M1M+=r6v;var j1M=K63;j1M+=V3v;var _this=this;if(Array[j1M](parent)){for(var i=v13,ien=parent[J93];i < ien;i++){this[c6v](parent[i],url,opts);}return this;}var that=this;var field=this[Y63](parent);var ajaxOpts={type:M1M,dataType:P1M};opts=$[b33]({event:v1M,data:p33,preUpdate:p33,postUpdate:p33},opts);var update=function(json){var i6v="Update";var L25='message';var Z6v="preUpdate";var o25='error';var v25="postUpdate";var W25='val';var U25='update';var M25='show';var J1M=F6v;J1M+=i6v;var G1M=u53;G1M+=I6v;G1M+=v93;var p1M=T6v;p1M+=Q2v;if(opts[Z6v]){opts[Z6v](json);}$[M93]({labels:k25,options:U25,values:W25,messages:L25,errors:o25},function(jsonProp,fieldFn){if(json[jsonProp]){$[M93](json[jsonProp],function(field,val){var y1M=e25;y1M+=j25;that[y1M](field)[fieldFn](val);});}});$[M93]([p1M,M25,P25,G1M],function(i,key){if(json[key]){that[key](json[key],json[J0v]);}});F7q.H0O();if(opts[J1M]){opts[v25](json);}field[c1v](m33);};$(field[m1M]())[I53](opts[y25] + p25,function(e){var m25="editFi";var R25="oce";var B25="bje";var E1M=G25;E1M+=w4v;E1M+=J53;E1M+=W53;var A1M=w3ii[25714];A1M+=w3ii[621556];A1M+=i13;A1M+=w3ii[621556];var K1M=J25;K1M+=q63;K1M+=c13;K1M+=T13;var w1M=D53;w1M+=m53;w1M+=T13;F7q.H0O();var Y1M=D53;Y1M+=m53;Y1M+=T13;var B1M=G53;B1M+=W73;var h1M=w3ii[25714];h1M+=C83;h1M+=w3ii[621556];var x1M=m25;x1M+=F83;var t1M=v9v;t1M+=R25;t1M+=t25;t1M+=R1v;var R1M=r03;R1M+=c13;R1M+=R1v;R1M+=y93;if($(field[n93]())[x25](e[Y0v])[R1M] === v13){return;}field[t1M](J33);var data={};data[a63]=_this[T13][x1M]?pluck(_this[T13][K3v],h1M):p33;data[B1M]=data[Y1M]?data[w1M][v13]:p33;data[K1M]=_this[h25]();if(opts[A1M]){var q1M=w3ii[25714];q1M+=w3ii[621556];q1M+=i13;q1M+=w3ii[621556];var ret=opts[q1M](data);if(ret){opts[v83]=ret;}}if(typeof url === E1M){var Q1M=v43;Q1M+=w3ii[621556];Q1M+=r03;Q1M+=r03;var o=url[Q1M](_this,field[h25](),data,update,e);if(o){var g1M=i13;g1M+=P93;g1M+=N53;var C1M=J53;C1M+=B25;C1M+=e83;if(typeof o === C1M && typeof o[g1M] === w3ii[27150]){var z1M=y93;z1M+=c13;z1M+=W53;o[z1M](function(resolved){if(resolved){update(resolved);}});}else {update(o);}}}else {if($[Y25](url)){$[b33](ajaxOpts,url);}else {var D1M=t53;D1M+=G53;D1M+=r03;ajaxOpts[D1M]=url;}$[u3v]($[b33](ajaxOpts,{data:data,success:update}));}});F7q.X0O();return this;}function destroy(){var K25="displayCon";var Q25="clear";var w25="que";var z25='.dte';var A25="troller";var q25="isplayed";var d1M=w3ii[25714];d1M+=J53;d1M+=w3ii[62535];var f1M=t53;f1M+=W53;f1M+=p53;f1M+=w25;var s1M=J53;s1M+=U53;s1M+=U53;var u1M=K25;u1M+=A25;F7q.H0O();var a1M=w3ii[25714];a1M+=q25;if(this[T13][a1M]){var V1M=v43;V1M+=r03;V1M+=E25;V1M+=c13;this[V1M]();}this[Q25]();if(this[T13][C25]){var H1M=w3ii[621556];H1M+=f7v;H1M+=c13;H1M+=n53;$(D4v)[H1M](this[T13][C25]);}var controller=this[T13][u1M];if(controller[g25]){controller[g25](this);}$(document)[s1M](z25 + this[T13][f1M]);this[d1M]=p33;this[T13]=p33;}function disable(name){var n1M=D25;n1M+=a25;var N1M=c13;N1M+=w3ii[621556];N1M+=v43;N1M+=P93;var that=this;$[N1M](this[n1M](name),function(i,n){var b1M=V25;F7q.H0O();b1M+=O53;var S1M=R83;S1M+=c13;S1M+=r03;S1M+=w3ii[25714];that[S1M](n)[b1M]();});return this;}function display(show){if(show === undefined){return this[T13][H25];}return this[show?u25:P33]();}function displayed(){var X1M=R83;X1M+=c13;X1M+=j25;X1M+=T13;return $[y2v](this[T13][X1M],function(field,name){F7q.H0O();return field[H25]()?name:p33;});}function displayNode(){var l1M=s25;l1M+=c13;F7q.X0O();return this[T13][f25][l1M](this);}function edit(items,arg1,arg2,arg3,arg4){F7q.H0O();var n25="_edit";var c1M=T7v;c1M+=C1v;var r1M=d25;r1M+=N25;var O1M=Z73;O1M+=i13;O1M+=p53;O1M+=N7v;var _this=this;var that=this;if(this[O1M](function(){F7q.X0O();that[S3v](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[g6v](arg1,arg2,arg3,arg4);this[n25](items,this[r1M](S25,items),z6v,argOpts[c1M],function(){var X25="_formOptio";var l25="_assemb";var b25="aybeOpe";var O25="leMain";var T1M=w3ii[62535];T1M+=b25;T1M+=W53;var I1M=T7v;I1M+=i13;I1M+=T13;var i1M=X25;i1M+=E63;var F1M=l25;F1M+=O25;F7q.X0O();_this[F1M]();_this[i1M](argOpts[I1M]);argOpts[T1M]();});return this;}function enable(name){var Z1M=D25;Z1M+=L43;Z1M+=r25;Z1M+=T13;var that=this;$[M93](this[Z1M](name),function(i,n){var U5M=c13;U5M+=c25;U5M+=r03;U5M+=c13;F7q.H0O();var k5M=U53;k5M+=F93;that[k5M](n)[U5M]();});return this;}function error$1(name,msg){var F25="globalErro";var L5M=m53;L5M+=S5v;L5M+=d53;L5M+=x03;var W5M=w3ii[25714];W5M+=J53;W5M+=w3ii[62535];var wrapper=$(this[W5M][L5M]);if(msg === undefined){var j5M=F25;j5M+=G53;var o5M=i25;o5M+=I25;o5M+=T13;o5M+=P9v;this[o5M](this[Z9v][k8v],name,J33,function(){var T25="FormE";var e5M=I33;e5M+=T25;e5M+=Z25;wrapper[k15](e5M,name !== undefined && name !== I43);});this[T13][j5M]=name;}else {this[Y63](name)[N93](msg);}return this;}function field(name){var W15="name ";var L15="- ";var U15="Unknown field ";var M5M=U53;M5M+=p53;M5M+=r93;M5M+=T13;var fields=this[T13][M5M];if(!fields[name]){var P5M=U15;P5M+=W15;P5M+=L15;throw P5M + name;}return fields[name];}function fields(){F7q.H0O();return $[y2v](this[T13][J63],function(field,name){return name;});}function file(name,id){var j15=' in table ';var e15='Unknown file id ';var o15="les";var v5M=R83;v5M+=o15;var table=this[v5M](name);var file=table[id];if(!file){throw e15 + id + j15 + name;}return table[id];}function files(name){var M15='Unknown file table name: ';var p5M=U53;p5M+=p53;p5M+=r03;p5M+=I25;if(!name){var y5M=U53;y5M+=p53;y5M+=v93;y5M+=T13;return Editor[y5M];}F7q.H0O();var table=Editor[p5M][name];if(!table){throw M15 + name;}return table;}function get(name){var R5M=T33;R5M+=I4v;var m5M=R83;m5M+=c13;m5M+=r03;m5M+=w3ii[25714];var that=this;if(!name){var G5M=R83;G5M+=r93;G5M+=T13;name=this[G5M]();}F7q.X0O();if(Array[T93](name)){var out={};$[M93](name,function(i,n){var J5M=T33;J5M+=I4v;out[n]=that[Y63](n)[J5M]();});return out;}return this[m5M](name)[R5M]();}function hide(names,animate){var x5M=Z73;x5M+=P15;x5M+=w3ii[25714];x5M+=a25;var t5M=c13;t5M+=v15;t5M+=P93;var that=this;$[t5M](this[x5M](names),function(i,n){that[Y63](n)[y15](animate);});F7q.H0O();return this;}function ids(includeHash){var p15="ditFiel";var h5M=c13;h5M+=p15;F7q.X0O();h5M+=E83;if(includeHash === void v13){includeHash=m33;}return $[y2v](this[T13][h5M],function(edit,idSrc){return includeHash === J33?Z33 + idSrc:idSrc;});}function inError(inNames){var G15="lobal";var Y5M=v93;Y5M+=W53;Y5M+=T33;Y5M+=y93;var B5M=T33;B5M+=G15;B5M+=J15;$(this[Z9v][k8v]);if(this[T13][B5M]){return J33;}var names=this[Y6v](inNames);for(var i=v13,ien=names[Y5M];i < ien;i++){var K5M=m15;K5M+=G53;K5M+=D53;K5M+=G53;var w5M=U53;w5M+=p53;w5M+=r93;if(this[w5M](names[i])[K5M]()){return J33;}}return m33;}function inline(cell,fieldName,opts){var w15="sP";var Y15="nline";var Q15=" row inli";var E15="nnot edit more than one";var x15="_tid";var h15="ndi";var g15='div.DTE_Field';var K15="lainObject";var C15="ne at a time";var q15="Ca";var B15="vidual";var H5M=R15;H5M+=W53;F7q.X0O();H5M+=c13;var V5M=t15;V5M+=w3ii[25714];V5M+=Z03;var D5M=x15;D5M+=q03;var g5M=v93;g5M+=Y8v;var Q5M=p53;Q5M+=h15;Q5M+=B15;var E5M=p53;E5M+=Y15;var q5M=c13;q5M+=F13;q5M+=S53;q5M+=n53;var A5M=p53;A5M+=w15;A5M+=K15;var _this=this;var that=this;if($[A5M](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[q5M]({},this[T13][A15][E5M],opts);var editFields=this[R3v](Q5M,cell,fieldName);var keys=Object[G83](editFields);if(keys[J93] > y13){var C5M=q15;C5M+=E15;C5M+=Q15;C5M+=C15;throw new Error(C5M);}var editRow=editFields[keys[v13]];var hosts=[];for(var i=v13;i < editRow[z83][g5M];i++){var z5M=o2v;z5M+=T13;z5M+=P93;hosts[z5M](editRow[z83][i]);}if($(g15,hosts)[J93]){return this;}if(this[D5M](function(){var a5M=I33;a5M+=z15;F7q.H0O();that[a5M](cell,fieldName,opts);})){return this;}this[V5M](cell,editFields,H5M,opts,function(){var u5M=D15;u5M+=a15;u5M+=V15;_this[u5M](editFields,opts);});return this;}function inlineCreate(insertPoint,opts){var S15="cre";var H15="editFiel";var X15="Pl";var u15="ctionClass";var T15='fakeRow';var N15="aSourc";var s15="nli";var n15="modifi";var Z15="_inline";var l15="ainObject";var F5M=H15;F5M+=E83;var c5M=W9v;F7q.X0O();c5M+=u15;var r5M=p53;r5M+=s15;r5M+=f15;var O5M=d15;O5M+=C83;O5M+=N15;O5M+=c13;var l5M=n15;l5M+=x03;var X5M=S15;X5M+=w3ii[621556];X5M+=i13;X5M+=c13;var b5M=w3ii[62535];b5M+=C5v;b5M+=c13;var s5M=b15;s5M+=X15;s5M+=l15;var _this=this;if($[s5M](insertPoint)){opts=insertPoint;insertPoint=p33;}if(this[O15](function(){var c15="eCre";var r15="inl";var f5M=r15;F7q.H0O();f5M+=I33;f5M+=c15;f5M+=F15;_this[f5M](insertPoint,opts);})){return this;}$[M93](this[T13][J63],function(name,field){var i15="ef";var I15="multiR";var S5M=w3ii[25714];F7q.H0O();S5M+=i15;var n5M=G43;n5M+=i13;var N5M=Q2v;N5M+=U53;var d5M=I15;d5M+=I25;d5M+=I4v;field[d5M]();field[A3v](v13,field[N5M]());field[n5M](field[S5M]());});this[T13][b5M]=z6v;this[T13][E5v]=X5M;this[T13][l5M]=p33;this[T13][K3v]=this[O5M](T15,insertPoint);opts=$[b33]({},this[T13][A15][r5M],opts);this[c5M]();this[Z15](this[T13][F5M],opts,function(){var L55="_dataSou";var k55="fak";var o55="rce";var W55="wE";var U55="eRo";var I5M=k55;I5M+=U55;I5M+=W55;I5M+=n53;var i5M=L55;i5M+=o55;_this[i5M](I5M);});this[P8v](u6v,p33);return this;}function message(name,msg){var M55="_message";F7q.X0O();if(msg === undefined){var Z5M=U8v;Z5M+=I8v;Z5M+=e55;var T5M=j55;T5M+=w3ii[62535];this[M55](this[T5M][Z5M],name);}else {this[Y63](name)[P55](msg);}return this;}function mode(mode){var p55='Changing from create mode is not supported';var y55='Not currently in an editing mode';var U7M=v43;F7q.H0O();U7M+=G53;U7M+=v55;U7M+=S53;var k7M=E6v;k7M+=I53;if(!mode){return this[T13][E5v];}if(!this[T13][k7M]){throw new Error(y55);}else if(this[T13][E5v] === e2v && mode !== U7M){throw new Error(p55);}this[T13][E5v]=mode;return this;}function modifier(){F7q.H0O();return this[T13][a6v];}function multiGet(fieldNames){var G55="sAr";var e7M=R83;e7M+=V83;e7M+=w3ii[25714];var L7M=p53;L7M+=G55;L7M+=G53;L7M+=A63;var that=this;if(fieldNames === undefined){var W7M=U53;W7M+=J55;W7M+=X1v;fieldNames=this[W7M]();}F7q.X0O();if(Array[L7M](fieldNames)){var out={};$[M93](fieldNames,function(i,name){var R55="Get";var o7M=m55;o7M+=w4v;o7M+=R55;out[name]=that[Y63](name)[o7M]();});return out;}return this[e7M](fieldNames)[t55]();}function multiSet(fieldNames,val){var that=this;if($[Y25](fieldNames) && val === undefined){var j7M=v55;j7M+=v43;j7M+=P93;$[j7M](fieldNames,function(name,value){F7q.H0O();var x55="multiS";var M7M=x55;M7M+=I4v;that[Y63](name)[M7M](value);});}else {var P7M=R83;P7M+=c13;P7M+=j25;this[P7M](fieldNames)[A3v](val);}return this;}function node(name){var J7M=W53;J7M+=C5v;F7q.X0O();J7M+=c13;var y7M=w3ii[62535];y7M+=w3ii[621556];y7M+=d53;var that=this;if(!name){var v7M=D3v;v7M+=w3ii[25714];v7M+=x03;name=this[v7M]();}return Array[T93](name)?$[y7M](name,function(n){var G7M=W53;G7M+=J53;G7M+=w3ii[25714];F7q.X0O();G7M+=c13;var p7M=P15;p7M+=w3ii[25714];return that[p7M](n)[G7M]();}):this[Y63](name)[J7M]();}function off(name,fn){$(this)[h63](this[h55](name),fn);return this;}function on(name,fn){var B55="ventName";var m7M=t15;m7M+=B55;$(this)[I53](this[m7M](name),fn);F7q.H0O();return this;}function one(name,fn){var R7M=J53;R7M+=W53;R7M+=c13;$(this)[R7M](this[h55](name),fn);return this;}function open(){var A55="_di";var s55="nest";var E55="_closeReg";var q55="splayReorde";var g7M=Y55;F7q.H0O();g7M+=w55;var w7M=K55;w7M+=E7v;w7M+=W53;var t7M=A55;t7M+=q55;t7M+=G53;var _this=this;this[t7M]();this[E55](function(){F7q.H0O();_this[Q55](function(){var C55="ai";var Y7M=w3ii[62535];Y7M+=C55;Y7M+=W53;var B7M=v43;B7M+=r03;B7M+=V7v;B7M+=w3ii[25714];var h7M=g55;h7M+=W3v;var x7M=z55;x7M+=D55;_this[x7M]();_this[h7M](B7M,[Y7M]);});});var ret=this[w7M](z6v);if(!ret){return this;}this[a55](function(){var u55="tOpt";var C7M=v15;C7M+=w4v;C7M+=I53;var Q7M=w3ii[62535];Q7M+=w3ii[621556];Q7M+=p53;Q7M+=W53;var E7M=E7v;E7M+=V55;var q7M=U53;q7M+=H55;var A7M=l93;A7M+=u55;A7M+=T13;_this[h8v]($[y2v](_this[T13][Q3v],function(name){F7q.H0O();var K7M=U53;K7M+=Y83;return _this[T13][K7M][name];}),_this[T13][A7M][q7M]);_this[P8v](E7M,[Q7M,_this[T13][C7M]]);},this[T13][f63][s55]);this[g7M](z6v,m33);return this;}function order(set){var X55="sort";var N55="sl";var d55="ord";var O55="All fields, and no additional fields, must be provided for ordering.";var f55="yReorder";var f7M=Z73;f7M+=A83;F7q.X0O();f7M+=w3ii[621556];f7M+=f55;var s7M=d55;s7M+=x03;var u7M=H3v;u7M+=J53;u7M+=I33;var H7M=N55;H7M+=p53;H7M+=v43;H7M+=c13;var D7M=v93;D7M+=n55;D7M+=P93;if(!set){var z7M=J53;z7M+=R6v;z7M+=c13;z7M+=G53;return this[T13][z7M];}if(arguments[D7M] && !Array[T93](set)){var V7M=N55;V7M+=p53;V7M+=v43;V7M+=c13;var a7M=S55;a7M+=c13;set=Array[a7M][V7M][S63](arguments);}if(this[T13][Q3v][b55]()[X55]()[l55](d33) !== set[H7M]()[X55]()[u7M](d33)){throw O55;}$[b33](this[T13][s7M],set);this[f7M]();return this;}function remove(items,arg1,arg2,arg3,arg4){var F55="yle";var i55="crudArg";var I55="idy";var Z55='initRemove';var F7M=I03;F7M+=i13;F7M+=w3ii[621556];var c7M=W53;c7M+=J53;c7M+=Q2v;var r7M=Z73;r7M+=r55;r7M+=W3v;var O7M=u53;O7M+=T13;O7M+=d53;O7M+=c55;var l7M=r2v;l7M+=F55;var X7M=U53;X7M+=J53;X7M+=G53;X7M+=w3ii[62535];var b7M=d25;b7M+=N25;var S7M=Z73;S7M+=i55;S7M+=T13;var n7M=r03;n7M+=Z93;var d7M=Z73;d7M+=i13;d7M+=I55;var _this=this;var that=this;if(this[d7M](function(){var N7M=T55;N7M+=t43;F7q.X0O();N7M+=c13;that[N7M](items,arg1,arg2,arg3,arg4);})){return this;}if(items[n7M] === undefined){items=[items];}var argOpts=this[S7M](arg1,arg2,arg3,arg4);var editFields=this[b7M](S25,items);this[T13][E5v]=k2v;this[T13][a6v]=items;this[T13][K3v]=editFields;this[Z9v][X7M][l7M][O7M]=N63;this[V6v]();this[r7M](Z55,[pluck(editFields,c7M),pluck(editFields,F7M),items],function(){var k75='initMultiRemove';_this[P8v](k75,[editFields,items],function(){var o75="aybeO";var W75="tO";var e75="mOpti";var Z7M=U75;Z7M+=t8v;var T7M=l93;T7M+=W75;F7q.H0O();T7M+=L75;T7M+=T13;var I7M=w3ii[62535];I7M+=o75;I7M+=d53;I7M+=N53;var i7M=L93;i7M+=D3v;i7M+=e75;i7M+=c8v;_this[N6v]();_this[i7M](argOpts[j75]);argOpts[I7M]();var opts=_this[T13][T7M];if(opts[Z7M] !== p33){var L0M=z43;L0M+=M75;var W0M=c13;W0M+=P75;var U0M=e6v;U0M+=T13;var k0M=w3ii[25714];k0M+=J53;k0M+=w3ii[62535];$(v75,_this[k0M][U0M])[W0M](opts[y75])[L0M]();}});});return this;}function set(set,val){var p75="isPlain";var G75="Ob";var e0M=c13;e0M+=w3ii[621556];e0M+=v43;e0M+=P93;var o0M=p75;o0M+=G75;o0M+=H3v;o0M+=m2v;var that=this;if(!$[o0M](set)){var o={};o[set]=val;set=o;}$[e0M](set,function(n,v){var j0M=G43;F7q.X0O();j0M+=i13;that[Y63](n)[j0M](v);});return this;}function show(names,animate){var that=this;F7q.X0O();$[M93](this[Y6v](names),function(i,n){that[Y63](n)[J75](animate);});return this;}function submit(successCallback,errorCallback,formatdata,hide){var h0M=c13;h0M+=w3ii[621556];h0M+=v43;h0M+=P93;var t0M=c13;t0M+=v15;t0M+=P93;var R0M=c13;R0M+=G53;R0M+=D53;R0M+=G53;var y0M=Z73;y0M+=c1v;var v0M=v15;v0M+=m75;var P0M=v9v;P0M+=o03;var M0M=U53;M0M+=p53;M0M+=F83;var _this=this;var fields=this[T13][M0M],errorFields=[],errorReady=v13,sent=m33;if(this[T13][P0M] || !this[T13][v0M]){return this;}this[y0M](J33);var send=function(){var R75="init";var G0M=v03;G0M+=p53;G0M+=J53;G0M+=W53;var p0M=R75;p0M+=t75;p0M+=x75;if(errorFields[J93] !== errorReady || sent){return;}_this[P8v](p0M,[_this[T13][G0M]],function(result){var Y75="_processi";var m0M=h75;m0M+=B75;m0M+=Z03;if(result === m33){var J0M=Y75;J0M+=R1v;_this[J0M](m33);return;}sent=J33;_this[m0M](successCallback,errorCallback,formatdata,hide);});};this[R0M]();$[t0M](fields,function(name,field){if(field[w75]()){var x0M=d53;x0M+=t53;x0M+=T13;x0M+=P93;errorFields[x0M](name);}});$[h0M](errorFields,function(i,name){var B0M=c13;B0M+=Z25;fields[name][B0M](I43,function(){errorReady++;send();});});send();return this;}function table(set){if(set === undefined){return this[T13][X83];}this[T13][X83]=set;F7q.H0O();return this;}F7q.X0O();function template(set){var q75="late";var w0M=K75;w0M+=C83;F7q.X0O();w0M+=c13;if(set === undefined){var Y0M=i13;Y0M+=A75;Y0M+=d53;Y0M+=q75;return this[T13][Y0M];}this[T13][w0M]=set === p33?p33:$(set);return this;}function title(title){var E75="chi";var Q75="ader";var E0M=G25;E0M+=m75;var q0M=v43;q0M+=E93;q0M+=I25;var A0M=E75;A0M+=r03;A0M+=m93;A0M+=N53;var K0M=q5v;K0M+=Q75;var header=$(this[Z9v][K0M])[A0M](C75 + this[q0M][Q5v][U7v]);if(title === undefined){return header[e1v]();}if(typeof title === E0M){var Q0M=s63;Q0M+=v93;title=title(this,new DataTable$4[K93](this[T13][Q0M]));}header[e1v](title);return this;}function val(field,value){if(value !== undefined || $[Y25](field)){var C0M=T13;C0M+=I4v;return this[C0M](field,value);}return this[D8v](field);;}function error(msg,tn,thro){var a75="tables.net/tn/";var g75=" For more informa";var D75="ase refer to https://data";var z75="tion, ple";var g0M=g75;g0M+=z75;g0M+=D75;g0M+=a75;if(thro === void v13){thro=J33;}var display=tn?msg + g0M + tn:msg;if(thro){throw display;}else {var z0M=m53;z0M+=w3ii[621556];z0M+=G53;z0M+=W53;console[z0M](display);}}function pairs(data,props,fn){var H75='value';var V0M=p53;V0M+=T13;V0M+=V75;V0M+=A63;var a0M=C63;a0M+=R03;a0M+=r03;var D0M=B53;D0M+=i13;D0M+=j53;var i,ien,dataPoint;props=$[D0M]({label:a0M,value:H75},props);if(Array[V0M](data)){for((i=v13,ien=data[J93]);i < ien;i++){dataPoint=data[i];if($[Y25](dataPoint)){var d0M=w3ii[621556];d0M+=i13;d0M+=i13;d0M+=G53;var f0M=C63;f0M+=R53;f0M+=c13;f0M+=r03;var s0M=t43;s0M+=w3ii[621556];s0M+=r03;s0M+=u75;var u0M=s75;u0M+=r03;var H0M=J25;H0M+=f75;fn(dataPoint[props[H0M]] === undefined?dataPoint[props[u0M]]:dataPoint[props[s0M]],dataPoint[props[f0M]],i,dataPoint[d0M]);}else {fn(dataPoint,dataPoint,i);}}}else {var N0M=c13;N0M+=q0v;i=v13;$[N0M](data,function(key,val){fn(val,key,i);F7q.H0O();i++;});}}function upload$1(editor,conf,files,progressCallback,completeCallback){var N75="leReadText";var e05="readAsDataURL";var d75="mitLef";var b75="onload";var n75='A server error occurred while uploading the file';var S75="<i>Uploading file</i>";var H05="_limitLeft";var u4M=Z73;u4M+=e9v;u4M+=d75;u4M+=i13;var l0M=R83;l0M+=N75;var b0M=G25;b0M+=m75;var S0M=W53;S0M+=w3ii[621556];S0M+=w3ii[62535];S0M+=c13;var n0M=c13;F7q.X0O();n0M+=Z25;var reader=new FileReader();var counter=v13;var ids=[];var generalError=n75;editor[n0M](conf[S0M],I43);if(typeof conf[u3v] === b0M){var X0M=w3ii[621556];X0M+=H3v;X0M+=w3ii[621556];X0M+=F13;conf[X0M](files,function(ids){completeCallback[S63](editor,ids);});return;}progressCallback(conf,conf[l0M] || S75);reader[b75]=function(e){var L05="Upload feature canno";var F75="ploadFie";var T75="ajaxData";var Z75="upload";var r75="lainO";var l75="oa";var O75="ction";var k05="No Ajax ";var c75="pload";var X75="Upl";var W05="ecified for upload plug-in";var U05="option sp";var I75='upload';var o05="t use `ajax.data` with an object. Please use it as a function instead.";var j4M=F8v;j4M+=X75;j4M+=l75;j4M+=w3ii[25714];var o4M=M2v;o4M+=w3ii[621556];F7q.H0O();var k4M=U53;k4M+=t53;k4M+=W53;k4M+=O75;var Z0M=I03;Z0M+=i13;Z0M+=w3ii[621556];var F0M=Q63;F0M+=r75;F0M+=J2v;F0M+=m2v;var c0M=t53;c0M+=c75;var r0M=t53;r0M+=F75;r0M+=j25;var O0M=K0v;O0M+=i75;O0M+=w3ii[25714];var data=new FormData();var ajax;data[O0M](S33,I75);data[n7v](r0M,conf[I93]);data[n7v](c0M,files[counter]);if(conf[T75]){conf[T75](data,files[counter],counter);}if(conf[u3v]){ajax=conf[u3v];}else if($[F0M](editor[T13][u3v])){var I0M=c63;I0M+=F13;var i0M=w3ii[621556];i0M+=H3v;i0M+=w3ii[621556];i0M+=F13;ajax=editor[T13][i0M][Z75]?editor[T13][I0M][Z75]:editor[T13][u3v];}else if(typeof editor[T13][u3v] === U93){ajax=editor[T13][u3v];}if(!ajax){var T0M=k05;T0M+=U05;T0M+=W05;throw new Error(T0M);}if(typeof ajax === U93){ajax={url:ajax};}if(typeof ajax[Z0M] === k4M){var L4M=c13;L4M+=w3ii[621556];L4M+=v43;L4M+=P93;var W4M=r2v;W4M+=G53;W4M+=p53;W4M+=R1v;var U4M=I03;U4M+=i13;U4M+=w3ii[621556];var d={};var ret=ajax[U4M](d);if(ret !== undefined && typeof ret !== W4M){d=ret;}$[L4M](d,function(key,value){F7q.H0O();data[n7v](key,value);});}else if($[Y25](ajax[o4M])){var e4M=L05;e4M+=o05;throw new Error(e4M);}editor[P8v](j4M,[conf[I93],files[counter],data],function(preRet){F7q.H0O();var G05="upl";var j05='preSubmit.DTE_Upload';var y4M=d53;y4M+=J53;y4M+=r2v;var v4M=c13;v4M+=b53;var P4M=J53;P4M+=W53;if(preRet === m33){if(counter < files[J93] - y13){counter++;reader[e05](files[counter]);}else {var M4M=v43;M4M+=w3ii[621556];M4M+=r03;M4M+=r03;completeCallback[M4M](editor,ids);}return;}var submit=m33;editor[P4M](j05,function(){submit=J33;return m33;});$[u3v]($[v4M]({},ajax,{type:y4M,data:data,dataType:M05,contentType:m33,processData:m33,xhr:function(){var P05="jaxSettin";var Y05="onloadend";var J05="onprogress";var G4M=F13;G4M+=P93;G4M+=G53;var p4M=w3ii[621556];p4M+=P05;p4M+=v05;var xhr=$[p4M][G4M]();if(xhr[Z75]){var B4M=y05;B4M+=p05;var J4M=G05;J4M+=l75;J4M+=w3ii[25714];xhr[J4M][J05]=function(e){var B05=':';var x05="total";var t05="xed";var z13=100;var m05="lengthComput";var m4M=m05;F7q.X0O();m4M+=Z63;if(e[m4M]){var h4M=r03;h4M+=Z93;var x4M=v93;x4M+=Y8v;var t4M=i13;t4M+=R05;t4M+=p53;t4M+=t05;var R4M=r03;R4M+=l75;R4M+=Q2v;R4M+=w3ii[25714];var percent=(e[R4M] / e[x05] * z13)[t4M](v13) + h05;progressCallback(conf,files[x4M] === y13?percent:counter + B05 + files[h4M] + j6v + percent);}};xhr[B4M][Y05]=function(e){var w05="essingTe";var K05='Processing';var Y4M=v9v;F7q.H0O();Y4M+=R8v;Y4M+=w05;Y4M+=g03;progressCallback(conf,conf[Y4M] || K05);};}return xhr;},success:function(json){var a05="RL";var z05="readAsD";var D05="ataU";var q05='uploadXhrSuccess';var C4M=A05;C4M+=D3v;var K4M=W53;K4M+=r25;var w4M=J53;w4M+=U53;w4M+=U53;editor[w4M](j05);editor[P8v](q05,[conf[K4M],json]);if(json[E05] && json[E05][J93]){var q4M=r03;q4M+=O83;q4M+=i13;q4M+=P93;var A4M=R83;A4M+=Q05;var errors=json[A4M];for(var i=v13,ien=errors[q4M];i < ien;i++){var Q4M=r2v;Q4M+=w3ii[621556];Q4M+=C05;Q4M+=T13;var E4M=W53;E4M+=w3ii[621556];E4M+=w3ii[62535];E4M+=c13;editor[N93](errors[i][E4M],errors[i][Q4M]);}}else if(json[C4M]){var g4M=A05;g4M+=D3v;editor[N93](json[g4M]);}else if(!json[Z75] || !json[Z75][Y1v]){var z4M=x03;z4M+=G53;z4M+=J53;z4M+=G53;editor[z4M](conf[I93],generalError);}else {if(json[g05]){$[M93](json[g05],function(table,files){if(!Editor[g05][table]){var D4M=U53;D4M+=A53;D4M+=I25;Editor[D4M][table]={};}$[b33](Editor[g05][table],files);});}ids[l33](json[Z75][Y1v]);if(counter < files[J93] - y13){var a4M=z05;a4M+=D05;a4M+=a05;counter++;reader[a4M](files[counter]);}else {completeCallback[S63](editor,ids);if(submit){editor[l8v]();}}}progressCallback(conf);},error:function(xhr){var V05="oadXhrErro";var H4M=G05;H4M+=V05;H4M+=G53;var V4M=t15;V4M+=t43;V4M+=N53;V4M+=i13;editor[N93](conf[I93],generalError);editor[V4M](H4M,[conf[I93],xhr]);progressCallback(conf);}}));});};files=$[y2v](files,function(val){return val;});if(conf[u4M] !== undefined){files[r63](conf[H05],files[J93]);}reader[e05](files[v13]);}var DataTable$3=$[s4M][f4M];var __inlineCounter=v13;function _actionClass(){var s05="remov";var f05="ctions";var b4M=u05;b4M+=v55;F7q.H0O();b4M+=S53;var S4M=s05;S4M+=c13;var n4M=c13;n4M+=u53;n4M+=i13;var N4M=v15;N4M+=i13;N4M+=p53;N4M+=I53;var d4M=w3ii[621556];d4M+=f05;var classesActions=this[h3v][d4M];var action=this[T13][N4M];var wrapper=$(this[Z9v][c5v]);wrapper[u93]([classesActions[D6v],classesActions[n4M],classesActions[S4M]][l55](j6v));if(action === b4M){var X4M=W63;X4M+=L63;X4M+=o63;wrapper[X4M](classesActions[D6v]);}else if(action === S3v){var l4M=c13;l4M+=w3ii[25714];l4M+=p53;l4M+=i13;wrapper[d05](classesActions[l4M]);}else if(action === k2v){var r4M=G53;r4M+=c13;r4M+=q73;r4M+=E73;var O4M=N05;O4M+=o63;wrapper[O4M](classesActions[r4M]);}}function _ajax(data,success,error,submitParams){var q45=/_id_/;var v45="url";var x45="unshi";var b05="leteB";var D45="param";var O05="cements";var P45="spli";var G45="xten";var z45="ata";var a45='?';var X05="ace";var J45="complete";var y45="exten";var Q45='DELETE';var t45="comp";var n05="del";var l05="epl";var S05="eBody";var B45="lacement";var c05="ctio";var E45=/{id}/;var r05="fun";var R45="lete";var H3M=w3ii[621556];H3M+=H3v;H3M+=w3ii[621556];H3M+=F13;var z3M=n05;z3M+=c13;z3M+=i13;z3M+=S05;var g3M=Q2v;g3M+=b05;g3M+=C5v;g3M+=q03;var C3M=I03;C3M+=F63;var q3M=I03;q3M+=i13;q3M+=w3ii[621556];var A3M=G53;A3M+=S6v;A3M+=r03;A3M+=X05;var x3M=G53;x3M+=l05;x3M+=w3ii[621556];x3M+=O05;var j3M=r05;j3M+=c05;j3M+=W53;var e3M=F05;e3M+=I33;F7q.X0O();var o3M=Y1v;o3M+=H83;o3M+=u83;var L3M=S3v;L3M+=r13;var W3M=G53;W3M+=A75;W3M+=i05;W3M+=c13;var U3M=c13;U3M+=w3ii[25714];U3M+=p53;U3M+=i13;var k3M=w3ii[621556];k3M+=I05;k3M+=F13;var c4M=O6v;c4M+=r6v;var action=this[T13][E5v];var thrown;var opts={type:c4M,dataType:M05,data:p33,error:[function(xhr,text,err){F7q.X0O();thrown=err;}],success:[],complete:[function(xhr,text){var k45="tus";var Z05="ull";var o45="parse";var U45="responseText";var D13=204;var W45="sponseJSON";var T05="isPlainO";var a13=400;var L45="responseJSON";var Z4M=K63;Z4M+=V3v;var T4M=T05;T4M+=J2v;T4M+=m2v;var i4M=W53;i4M+=Z05;var F4M=T13;F4M+=F63;F4M+=k45;var json=p33;if(xhr[F4M] === D13 || xhr[U45] === i4M){json={};}else {try{var I4M=L53;I4M+=W45;json=xhr[L45]?xhr[I4M]:JSON[o45](xhr[U45]);}catch(e){}}if($[T4M](json) || Array[Z4M](json)){success(json,xhr[e45] >= a13,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[T13][k3M];var id=action === U3M || action === W3M?pluck(this[T13][L3M],o3M)[e3M](j45):p33;if($[Y25](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === j3M){ajaxSrc(p33,p33,data,success,error);return;}else if(typeof ajaxSrc === U93){if(ajaxSrc[M45](j6v) !== -y13){var M3M=P45;M3M+=i13;a=ajaxSrc[M3M](j6v);opts[b1v]=a[v13];opts[v45]=a[y13];}else {opts[v45]=ajaxSrc;}}else {var t3M=y45;t3M+=w3ii[25714];var p3M=x03;p3M+=p45;var P3M=c13;P3M+=G45;P3M+=w3ii[25714];var optsCopy=$[P3M]({},ajaxSrc || ({}));if(optsCopy[J45]){var y3M=m45;y3M+=d53;y3M+=R45;var v3M=t45;v3M+=R45;opts[v3M][C3v](optsCopy[y3M]);delete optsCopy[J45];}if(optsCopy[p3M]){var R3M=x03;R3M+=p45;var m3M=x03;m3M+=p45;var J3M=x45;J3M+=U53;J3M+=i13;var G3M=A05;G3M+=D3v;opts[G3M][J3M](optsCopy[m3M]);delete optsCopy[R3M];}opts=$[t3M]({},opts,optsCopy);}if(opts[x3M]){var B3M=h45;B3M+=B45;B3M+=T13;var h3M=c13;h3M+=q0v;$[h3M](opts[B3M],function(key,repl){var Y45="all";var K45='{';var A45='}';var K3M=v43;K3M+=Y45;var w3M=w45;w3M+=r03;var Y3M=t53;Y3M+=G53;F7q.H0O();Y3M+=r03;opts[Y3M]=opts[w3M][k93](K45 + key + A45,repl[K3M](this,key,id,action,data));});}opts[v45]=opts[v45][k93](q45,id)[A3M](E45,id);if(opts[q3M]){var Q3M=B53;Q3M+=S53;Q3M+=W53;Q3M+=w3ii[25714];var E3M=w3ii[25714];E3M+=w3ii[621556];E3M+=F63;var isFn=typeof opts[E3M] === w3ii[27150];var newData=isFn?opts[v83](data):opts[v83];data=isFn && newData?newData:$[Q3M](J33,data,newData);}opts[C3M]=data;if(opts[b1v] === Q45 && (opts[g3M] === undefined || opts[z3M] === J33)){var V3M=p53;V3M+=C45;V3M+=g45;var a3M=t53;a3M+=G53;a3M+=r03;var D3M=w3ii[25714];D3M+=z45;var params=$[D45](opts[D3M]);opts[a3M]+=opts[v45][V3M](a45) === -y13?a45 + params:V45 + params;delete opts[v83];}$[H3M](opts);}function _animate(target,style,time,callback){var H45="ani";var u45="mat";var u3M=U53;u3M+=W53;if($[u3M][J0v]){var s3M=H45;s3M+=u45;s3M+=c13;target[s45]()[s3M](style,time,callback);}else {var f3M=C2v;f3M+=f45;target[F5v](style);if(typeof time === f3M){var d3M=v43;d3M+=w3ii[621556];d3M+=r03;d3M+=r03;time[d3M](target);}else if(callback){callback[S63](target);}}}function _assembleMain(){var d45="bodyCo";var n45="wrapp";var N45="ormEr";var c3M=U53;c3M+=J53;c3M+=G53;c3M+=w3ii[62535];var r3M=w3ii[621556];r3M+=d53;r3M+=R7v;r3M+=n53;var O3M=K0v;O3M+=i75;O3M+=w3ii[25714];var l3M=d45;l3M+=I73;var X3M=S8v;X3M+=d1v;X3M+=W53;X3M+=T13;var b3M=U53;b3M+=N45;b3M+=p45;var S3M=s7v;S3M+=W53;S3M+=w3ii[25714];var n3M=d53;n3M+=L53;n3M+=C4v;F7q.X0O();var N3M=n45;N3M+=x03;var dom=this[Z9v];$(dom[N3M])[n3M](dom[Q5v]);$(dom[S45])[S3M](dom[b3M])[n7v](dom[X3M]);$(dom[l3M])[O3M](dom[L8v])[r3M](dom[c3M]);}function _blur(){var X45="onBlur";var l45='preBlur';F7q.H0O();var T3M=v43;T3M+=y43;var i3M=b45;i3M+=w3ii[62535];i3M+=Z03;var F3M=C2v;F3M+=f45;var opts=this[T13][f63];var onBlur=opts[X45];if(this[P8v](l45) === m33){return;}if(typeof onBlur === F3M){onBlur(this);}else if(onBlur === i3M){var I3M=T13;I3M+=t53;I3M+=x75;this[I3M]();}else if(onBlur === T3M){this[O45]();}}function _clearDynamicInfo(errorsOnly){var L9M=w3ii[25714];L9M+=p53;L9M+=r45;var W9M=R83;W9M+=F83;var U9M=A05;U9M+=D3v;var k9M=R83;k9M+=r93;var Z3M=v43;Z3M+=r03;Z3M+=w3ii[621556];Z3M+=a9v;if(errorsOnly === void v13){errorsOnly=m33;}if(!this[T13]){return;}var errorClass=this[Z3M][k9M][U9M];var fields=this[T13][W9M];$(L9M + errorClass,this[Z9v][c5v])[u93](errorClass);$[M93](fields,function(name,field){var o9M=x03;o9M+=p45;field[o9M](I43);F7q.X0O();if(!errorsOnly){var e9M=c45;e9M+=c13;field[e9M](I43);}});this[N93](I43);if(!errorsOnly){this[P55](I43);}}function _close(submitComplete,mode){var e35="seC";var W35="closeCb";var Z45="bod";var U35="Close";var o35="Cb";var T45="or-focus";var L35="clos";var I45="focus.edit";var k35="seIc";var j35="closeIc";var R9M=v43;R9M+=F45;R9M+=G43;var m9M=i45;m9M+=N53;m9M+=i13;var J9M=I45;J9M+=T45;var G9M=i5v;G9M+=U53;var p9M=Z45;p9M+=q03;var v9M=p43;F7q.X0O();v9M+=J53;v9M+=k35;v9M+=R53;var j9M=F8v;j9M+=U35;var closed;if(this[P8v](j9M) === m33){return;}if(this[T13][W35]){var P9M=L35;P9M+=c13;P9M+=o35;var M9M=p43;M9M+=J53;M9M+=e35;M9M+=R53;closed=this[T13][M9M](submitComplete,mode);this[T13][P9M]=p33;}if(this[T13][v9M]){var y9M=j35;y9M+=R53;this[T13][M35]();this[T13][y9M]=p33;}$(p9M)[G9M](J9M);this[T13][H25]=m33;this[m9M](R9M);if(closed){var t9M=Z73;t9M+=P35;t9M+=i13;this[t9M](v8v,[closed]);}}function _closeReg(fn){F7q.H0O();var v35="loseCb";var x9M=v43;x9M+=v35;this[T13][x9M]=fn;}function _crudArgs(arg1,arg2,arg3,arg4){var m35="main";var p35="mOp";var h9M=y35;h9M+=p35;h9M+=w4v;h9M+=c8v;var that=this;var title;var buttons;var show;var opts;if($[Y25](arg1)){opts=arg1;}else if(typeof arg1 === G35){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=J33;}if(title){that[o8v](title);}if(buttons){that[J35](buttons);}return {opts:$[b33]({},this[T13][h9M][m35],opts),maybeOpen:function(){F7q.H0O();if(show){that[R35]();}}};}function _dataSource(name){var x35="rces";var Y9M=t35;Y9M+=J53;Y9M+=t53;Y9M+=x35;var B9M=F63;B9M+=O53;var args=[];for(var _i=y13;_i < arguments[J93];_i++){args[_i - y13]=arguments[_i];}var dataSource=this[T13][B9M]?Editor[h35][k33]:Editor[Y9M][e1v];var fn=dataSource[name];if(fn){return fn[b9v](this,args);}}function _displayReorder(includeFields){var H35="ppendT";var u35='displayOrder';var Y35="dre";var B35="played";var q35="ludeFields";var w35="formContent";var A35="inc";var V9M=v03;V9M+=y03;var a9M=L0v;a9M+=B35;var D9M=Z73;D9M+=m8v;D9M+=N53;D9M+=i13;F7q.X0O();var q9M=E0v;q9M+=Y35;q9M+=W53;var K9M=J53;K9M+=G53;K9M+=Q2v;K9M+=G53;var w9M=R83;w9M+=c13;w9M+=X1v;var _this=this;var formContent=$(this[Z9v][w35]);var fields=this[T13][w9M];var order=this[T13][K9M];var template=this[T13][C25];var mode=this[T13][K35] || z6v;if(includeFields){var A9M=A35;A9M+=q35;this[T13][A9M]=includeFields;}else {includeFields=this[T13][E35];}formContent[q9M]()[M7v]();$[M93](order,function(i,name){var D35="after";var C35="kInArray";var z35='editor-field[name="';var Q35="_wea";F7q.H0O();var a35='[data-editor-template="';var E9M=Q35;E9M+=C35;if(_this[E9M](name,includeFields) !== -y13){if(template && mode === z6v){var C9M=W53;C9M+=J53;C9M+=w3ii[25714];C9M+=c13;var Q9M=g35;Q9M+=w3ii[25714];Q9M+=c13;template[x25](z35 + name + F33)[D35](fields[name][Q9M]());template[x25](a35 + name + F33)[n7v](fields[name][C9M]());}else {var g9M=w3ii[621556];g9M+=V35;formContent[g9M](fields[name][n93]());}}});if(template && mode === z6v){var z9M=w3ii[621556];z9M+=H35;z9M+=J53;template[z9M](formContent);}this[D9M](u35,[this[T13][a9M],this[T13][V9M],formContent]);}function _edit(items,editFields,type,formOptions,setupDone){var d35="editData";var s35="itEdi";var c35="toStrin";var i35='data';var F35="Array";var f35="der";var U8M=W53;U8M+=J53;U8M+=w3ii[25714];U8M+=c13;var k8M=I33;k8M+=s35;k8M+=i13;var i9M=r03;i9M+=O83;i9M+=y93;var F9M=J53;F9M+=G53;F9M+=f35;F7q.H0O();var N9M=R53;N9M+=r03;N9M+=J53;N9M+=h43;var d9M=w3ii[25714];d9M+=b15;d9M+=d53;d9M+=c55;var f9M=r2v;f9M+=q03;f9M+=v93;var s9M=w3ii[25714];s9M+=J53;s9M+=w3ii[62535];var u9M=E6v;u9M+=J53;u9M+=W53;var H9M=U53;H9M+=p53;H9M+=V83;H9M+=E83;var _this=this;var fields=this[T13][H9M];var usedFields=[];var includeInOrder;var editData={};this[T13][K3v]=editFields;this[T13][d35]=editData;this[T13][a6v]=items;this[T13][u9M]=S3v;this[s9M][U8v][f9M][d9M]=N9M;this[T13][K35]=type;this[V6v]();$[M93](fields,function(name,field){var c9M=v93;c9M+=W53;c9M+=Y2v;field[H6v]();includeInOrder=m33;editData[name]={};$[M93](editFields,function(idSrc,edit){var b35="scope";var X35="splayFields";var O35="displayFi";var l35="playFie";var S35="lFromData";var N35="nullDef";if(edit[J63][name]){var S9M=N35;S9M+=n35;S9M+=i13;var n9M=J25;n9M+=S35;var val=field[n9M](edit[v83]);var nullDefault=field[S9M]();editData[name][idSrc]=val === p33?I43:Array[T93](val)?val[b55]():val;if(!formOptions || formOptions[b35] === R33){var X9M=u53;X9M+=X35;var b9M=w3ii[25714];b9M+=c13;b9M+=U53;field[A3v](idSrc,val === undefined || nullDefault && val === p33?field[b9M]():val);if(!edit[X9M] || edit[a83][name]){includeInOrder=J33;}}else {var O9M=u53;O9M+=T13;O9M+=l35;O9M+=X1v;var l9M=O35;l9M+=r93;l9M+=T13;if(!edit[l9M] || edit[O9M][name]){var r9M=w3ii[25714];r9M+=c13;r9M+=U53;field[A3v](idSrc,val === undefined || nullDefault && val === p33?field[r9M]():val);includeInOrder=J33;}}}});if(field[r35]()[c9M] !== v13 && includeInOrder){usedFields[l33](name);}});var currOrder=this[F9M]()[b55]();for(var i=currOrder[i9M] - y13;i >= v13;i--){var T9M=c35;T9M+=T33;var I9M=I33;I9M+=F35;if($[I9M](currOrder[i][T9M](),usedFields) === -y13){var Z9M=g3v;Z9M+=p53;Z9M+=v43;Z9M+=c13;currOrder[Z9M](i,y13);}}this[j3v](currOrder);this[P8v](k8M,[pluck(editFields,U8M)[v13],pluck(editFields,i35)[v13],items,type],function(){var T35="tMultiEdi";var I35="ini";var L8M=I35;F7q.H0O();L8M+=T35;L8M+=i13;var W8M=i45;W8M+=c13;W8M+=W3v;_this[W8M](L8M,[editFields,items,type],function(){setupDone();});});}function _event(trigger,args,promiseComplete){var W95="Hand";var o95="result";var j95="celled";F7q.X0O();var e95="Can";if(args === void v13){args=[];}if(promiseComplete === void v13){promiseComplete=undefined;}if(Array[T93](trigger)){var o8M=v93;o8M+=W53;o8M+=M1v;o8M+=P93;for(var i=v13,ien=trigger[o8M];i < ien;i++){var e8M=t15;e8M+=Z35;e8M+=i13;this[e8M](trigger[i],args);}}else {var v8M=v9v;v8M+=c13;var P8M=T83;P8M+=k95;var M8M=U95;M8M+=W95;M8M+=L95;var j8M=j03;j8M+=t43;j8M+=r73;var e=$[j8M](trigger);$(this)[M8M](e,args);var result=e[o95];if(trigger[P8M](v8M) === v13 && result === m33){var p8M=e95;p8M+=j95;var y8M=j03;y8M+=Z35;y8M+=i13;$(this)[M95]($[y8M](trigger + p8M),args);}if(promiseComplete){var G8M=y93;G8M+=c13;G8M+=W53;if(result && typeof result === w3ii.l13 && result[G8M]){var J8M=i13;J8M+=q5v;J8M+=W53;result[J8M](promiseComplete);}else {promiseComplete(result);}}return result;}}function _eventName(input){var v95="tc";var y95=/^on([A-Z])/;var p95="toLowerCas";var G13=3;var G95="substring";var R8M=B2v;R8M+=T33;R8M+=y93;var m8M=P95;m8M+=e9v;F7q.X0O();m8M+=i13;var name;var names=input[m8M](j6v);for(var i=v13,ien=names[R8M];i < ien;i++){var t8M=w3ii[62535];t8M+=w3ii[621556];t8M+=v95;t8M+=P93;name=names[i];var onStyle=name[t8M](y95);if(onStyle){var x8M=p95;x8M+=c13;name=onStyle[y13][x8M]() + name[G95](G13);}names[i]=name;}return names[l55](j6v);}function _fieldFromNode(node){var foundField=p33;F7q.H0O();$[M93](this[T13][J63],function(name,field){var h8M=g35;h8M+=w3ii[25714];h8M+=c13;if($(field[h8M]())[x25](node)[J93]){foundField=field;}});return foundField;}function _fieldNames(fieldNames){if(fieldNames === undefined){var B8M=Y63;B8M+=T13;return this[B8M]();}else if(!Array[T93](fieldNames)){return [fieldNames];}return fieldNames;}function _focus(fieldsIn,focus){var x95="div.D";var B95=/^jq:/;var K95="ement";var w95="iveEl";var m95="emove";var Y95="blu";var h95="TE ";var E8M=W53;E8M+=t53;E8M+=J95;var K8M=w3ii[62535];K8M+=w3ii[621556];K8M+=d53;var w8M=G53;w8M+=m95;var Y8M=v03;Y8M+=p53;Y8M+=I53;var _this=this;if(this[T13][Y8M] === w8M){return;}var field;var fields=$[K8M](fieldsIn,function(fieldOrName){var R95="ing";var q8M=Y63;q8M+=T13;var A8M=T13;A8M+=i33;A8M+=R95;return typeof fieldOrName === A8M?_this[T13][q8M][fieldOrName]:fieldOrName;});if(typeof focus === E8M){field=fields[focus];}else if(focus){var C8M=H3v;C8M+=P75;C8M+=t95;var Q8M=I33;Q8M+=Q2v;Q8M+=g45;if(focus[Q8M](C8M) === v13){var g8M=x95;g8M+=h95;field=$(g8M + focus[k93](B95,I43));}else {var z8M=R83;z8M+=c13;z8M+=j25;z8M+=T13;field=this[T13][z8M][focus];}}else {var a8M=Y95;a8M+=G53;var D8M=v03;D8M+=w95;D8M+=K95;document[D8M][a8M]();}this[T13][A95]=field;if(field){var V8M=U53;V8M+=J53;V8M+=v43;V8M+=t8v;field[V8M]();}}function _formOptions(opts){var g95="sage";var D95="utt";var Q95=".dteInlin";F7q.H0O();var z95="ag";var d95="canReturnSubmit";var q95="keydow";var E95="unc";var Z8M=r83;Z8M+=y05;var c8M=q95;c8M+=W53;var r8M=J53;r8M+=W53;var S8M=U53;S8M+=E95;S8M+=w4v;S8M+=I53;var f8M=r2v;f8M+=G53;f8M+=I33;f8M+=T33;var s8M=i13;s8M+=p53;s8M+=i13;s8M+=v93;var u8M=q1v;u8M+=x93;var H8M=Q95;H8M+=c13;var _this=this;var that=this;var inlineCount=__inlineCounter++;var namespace=H8M + inlineCount;this[T13][u8M]=opts;this[T13][C95]=inlineCount;if(typeof opts[s8M] === f8M || typeof opts[o8v] === w3ii[27150]){var n8M=i13;n8M+=p53;n8M+=K4v;var N8M=i13;N8M+=Z03;N8M+=v93;var d8M=w4v;d8M+=K4v;this[d8M](opts[N8M]);opts[n8M]=J33;}if(typeof opts[P55] === U93 || typeof opts[P55] === S8M){var l8M=k53;l8M+=T13;l8M+=g95;var X8M=c45;X8M+=c13;var b8M=w3ii[62535];b8M+=M9v;b8M+=z95;b8M+=c13;this[b8M](opts[X8M]);opts[l8M]=J33;}if(typeof opts[J35] !== G35){var O8M=R53;O8M+=D95;O8M+=J53;O8M+=E63;this[J35](opts[O8M]);opts[J35]=J33;}$(document)[r8M](c8M + namespace,function(e){var s95="dF";var N95="preventDefa";var a95="activeEl";var f95="romNode";var H95="ReturnSubmit";if(e[P6v] === t13 && _this[T13][H25]){var F8M=a95;F8M+=c13;F8M+=V95;var el=$(document[F8M]);if(el){var I8M=p6v;I8M+=W53;I8M+=H95;var i8M=u95;i8M+=V83;i8M+=s95;i8M+=f95;var field=_this[i8M](el);if(field && typeof field[I8M] === w3ii[27150] && field[d95](el)){var T8M=N95;T8M+=n95;T8M+=i13;e[T8M]();}}}});$(document)[I53](Z8M + namespace,function(e){var j85="sc";var M85="reventDefault";var r95="splayed";var c95="whi";var A13=27;var P85="onEsc";var T95="onRe";var Z95="turn";var i95="_fieldFromNode";var W85="revent";var e85="Esc";var l95="wh";var E13=37;var Q13=39;var G85="tton";var S95="_Form";var b95="_B";var L85="Default";var o85="onReturn";var O95="ich";var k85="nRe";var R6M=A7v;R6M+=S95;R6M+=b95;R6M+=l73;var m6M=X95;m6M+=L53;m6M+=W3v;m6M+=T13;var M6M=l95;M6M+=O95;var U6M=u53;U6M+=r95;var k6M=c95;k6M+=o4v;var el=$(document[F95]);if(e[k6M] === t13 && _this[T13][U6M]){var field=_this[i95](el);if(field && typeof field[d95] === w3ii[27150] && field[d95](el)){var j6M=U53;j6M+=I95;j6M+=e83;j6M+=y03;var e6M=T95;e6M+=Z95;var L6M=d3v;L6M+=i13;var W6M=J53;W6M+=k85;W6M+=C05;W6M+=U85;if(opts[W6M] === L6M){var o6M=d53;o6M+=W85;o6M+=L85;e[o6M]();_this[l8v]();}else if(typeof opts[e6M] === j6M){e[y6v]();opts[o85](_this,e);}}}else if(e[M6M] === A13){var G6M=p43;G6M+=E25;G6M+=c13;var p6M=I53;p6M+=e85;var y6M=R53;y6M+=r03;y6M+=w45;var v6M=J53;v6M+=W53;v6M+=j03;v6M+=j85;var P6M=d53;P6M+=M85;e[P6M]();if(typeof opts[P85] === w3ii[27150]){opts[P85](that,e);}else if(opts[v6M] === y6M){that[f3v]();}else if(opts[p6M] === G6M){var J6M=p43;J6M+=E25;J6M+=c13;that[J6M]();}else if(opts[P85] === j33){that[l8v]();}}else if(el[m6M](R6M)[J93]){if(e[P6v] === E13){var x6M=U53;x6M+=J53;x6M+=v43;x6M+=t8v;var t6M=d53;t6M+=G53;t6M+=c13;t6M+=t43;el[t6M](v75)[U95](x6M);}else if(e[P6v] === Q13){var w6M=U53;w6M+=J53;w6M+=v85;w6M+=T13;var Y6M=y85;Y6M+=p85;var B6M=R53;B6M+=t53;B6M+=G85;var h6M=W53;h6M+=B53;h6M+=i13;el[h6M](B6M)[Y6M](w6M);}}});this[T13][M35]=function(){var q6M=x83;q6M+=c13;q6M+=i8v;q6M+=d53;var A6M=i5v;A6M+=U53;F7q.X0O();var K6M=J53;K6M+=U53;K6M+=U53;$(document)[K6M](J85 + namespace);$(document)[A6M](q6M + namespace);};return namespace;}function _inline(editFields,opts,closeCb){var Y85="atta";var r85="childNodes";var m85="_post";var u85='" ';var V85="ntents";var I85="submitHtml";var S85="click.dte-";var l85='tr';var d85='.';var z85="e=\"wid";var q85="rmErro";var g85="styl";var X85="closest";var x85="ormOptio";var O85="from";var f85='<div class="DTE_Processing_Indicator"><span></span></div>';var w85="chFi";var n85="submitTrigger";var D85="th:";var H85="userAgent";var a85="dge";var V2I=m85;V2I+=R35;var a2I=w3ii[62535];a2I+=w3ii[621556];a2I+=d53;var D2I=Z73;D2I+=U53;D2I+=J53;D2I+=M75;var p2I=R85;p2I+=t85;var H6M=r03;H6M+=N53;H6M+=M1v;H6M+=P93;var V6M=L93;V6M+=x85;V6M+=W53;V6M+=T13;var g6M=r03;g6M+=O83;g6M+=y93;var C6M=C83;C6M+=i13;C6M+=w3ii[621556];C6M+=o4v;var Q6M=x83;Q6M+=c13;Q6M+=q03;Q6M+=T13;var E6M=v43;E6M+=r03;E6M+=h85;E6M+=I25;var _this=this;if(closeCb === void v13){closeCb=p33;}var closed=m33;var classes=this[E6M][B85];var keys=Object[Q6M](editFields);var editRow=editFields[keys[v13]];var children=p33;var lastAttachPoint;var elements=[];for(var i=v13;i < editRow[C6M][g6M];i++){var a6M=U53;a6M+=p53;a6M+=c13;a6M+=X1v;var D6M=d53;D6M+=t8v;D6M+=P93;var z6M=Y85;z6M+=w85;z6M+=V83;z6M+=E83;var name_1=editRow[z6M][i][v13];elements[D6M]({field:this[T13][a6M][name_1],name:name_1,node:$(editRow[z83][i])});}var namespace=this[V6M](opts);var ret=this[K85](A85);if(!ret){return this;}for(var i=v13;i < elements[H6M];i++){var k2I=e6v;k2I+=T13;var Z6M=s25;Z6M+=c13;var T6M=e25;T6M+=r03;T6M+=w3ii[25714];var I6M=z43;I6M+=q85;I6M+=G53;var i6M=w3ii[25714];i6M+=J53;i6M+=w3ii[62535];var F6M=W53;F6M+=E85;var c6M=U53;c6M+=p53;c6M+=r93;var r6M=z15;r6M+=G53;var O6M=S8v;O6M+=d1v;O6M+=W53;O6M+=T13;var l6M=e9v;l6M+=f15;l6M+=G53;var X6M=Q85;X6M+=g9v;X6M+=T13;X6M+=C85;var b6M=K0v;b6M+=C4v;var S6M=d53;S6M+=F13;S6M+=c33;var n6M=m53;n6M+=p53;n6M+=w3ii[25714];n6M+=y93;var N6M=g85;N6M+=z85;N6M+=D85;var d6M=j03;d6M+=a85;d6M+=L73;var f6M=d83;f6M+=V85;var s6M=o4v;s6M+=p9v;s6M+=N53;var u6M=g35;u6M+=Q2v;var el=elements[i];var node=el[u6M];elements[i][s6M]=node[f6M]()[M7v]();var style=navigator[H85][M45](d6M) !== -y13?N6M + node[n6M]() + S6M:I43;node[b6M]($(X6M + classes[c5v] + l9v + r9v + classes[l6M] + u85 + style + s85 + f85 + V0v + r9v + classes[O6M] + c9v + V0v));node[x25](C75 + classes[r6M][k93](/ /g,d85))[n7v](el[c6M][F6M]())[n7v](this[i6M][I6M]);lastAttachPoint=el[T6M][Z6M]();if(opts[k2I]){var o2I=w3ii[25714];o2I+=J53;o2I+=w3ii[62535];var L2I=K0v;L2I+=R7v;L2I+=W53;L2I+=w3ii[25714];var W2I=L53;W2I+=d53;W2I+=N85;var U2I=u53;U2I+=r45;node[x25](U2I + classes[J35][W2I](/ /g,d85))[L2I](this[o2I][J35]);}}var submitTrigger=opts[n85];if(submitTrigger !== p33){var y2I=w3ii[621556];y2I+=V35;var P2I=S85;P2I+=d3v;P2I+=i13;var M2I=b85;M2I+=c83;var e2I=W53;e2I+=t53;e2I+=J95;if(typeof submitTrigger === e2I){var j2I=v93;j2I+=W53;j2I+=T33;j2I+=y93;var kids=$(lastAttachPoint)[X85](l85)[L3v]();submitTrigger=submitTrigger < v13?kids[kids[j2I] + submitTrigger]:kids[submitTrigger];}children=Array[O85]($(submitTrigger)[v13][r85])[M2I]();$(children)[M7v]();$(submitTrigger)[I53](P2I,function(e){var F85="med";var i85="iatePropagation";var c85="stopI";var v2I=c85;v2I+=w3ii[62535];v2I+=F85;v2I+=i85;e[v2I]();_this[l8v]();})[y2I](opts[I85]);}this[p2I](function(submitComplete,action){var Z85="forEach";var W65='click.dte-submit';var U65="empt";var h2I=I33;h2I+=e9v;h2I+=W53;h2I+=c13;var x2I=z55;x2I+=D55;var G2I=i5v;G2I+=U53;closed=J33;$(document)[G2I](T85 + namespace);if(!submitComplete || action !== j2v){elements[Z85](function(el){var k65="contents";var m2I=W53;m2I+=E85;var J2I=Q2v;J2I+=i13;J2I+=w3ii[621556];J2I+=o4v;el[n93][k65]()[J2I]();el[m2I][n7v](el[L3v]);});}if(submitTrigger){var t2I=U65;t2I+=q03;var R2I=J53;R2I+=U53;R2I+=U53;$(submitTrigger)[R2I](W65)[t2I]()[n7v](children);}_this[x2I]();if(closeCb){closeCb();}return h2I;;});setTimeout(function(){var o65="dBack";var e65='addBack';var j65='mousedown';var L65="Sel";var K2I=J53;K2I+=W53;var w2I=w2v;w2I+=w3ii[25714];w2I+=L65;w2I+=U53;var Y2I=A93;Y2I+=o65;var B2I=U53;B2I+=W53;if(closed){return;}var back=$[B2I][Y2I]?e65:w2I;var target;$(document)[K2I](j65 + namespace,function(e){var M65="arget";var A2I=i13;A2I+=M65;target=e[A2I];})[I53](T85 + namespace,function(e){var y65="inA";var v65="nts";var p65="_typ";var J65='owns';var q2I=r03;q2I+=N53;F7q.X0O();q2I+=Y2v;var isIn=m33;for(var i=v13;i < elements[q2I];i++){var g2I=P65;g2I+=c13;g2I+=v65;var C2I=y65;C2I+=G53;C2I+=G53;C2I+=A63;var Q2I=p65;Q2I+=G65;Q2I+=W53;var E2I=U53;E2I+=G6v;E2I+=w3ii[25714];if(elements[i][E2I][Q2I](J65,target) || $[C2I](elements[i][n93][v13],$(target)[g2I]()[back]()) !== -y13){isIn=J33;}}if(!isIn){var z2I=R53;z2I+=n3v;_this[z2I]();}});},v13);this[D2I]($[a2I](elements,function(el){return el[Y63];}),opts[y75]);this[V2I](A85,J33);}function _optionsUpdate(json){var H2I=s6v;H2I+=p53;H2I+=I53;H2I+=T13;var that=this;if(json[H2I]){var s2I=R83;s2I+=V83;s2I+=w3ii[25714];s2I+=T13;var u2I=c13;u2I+=w3ii[621556];u2I+=o4v;$[u2I](this[T13][s2I],function(name,field){F7q.X0O();var R65="update";if(json[m65][name] !== undefined){var f2I=U53;f2I+=J55;f2I+=r03;f2I+=w3ii[25714];var fieldInst=that[f2I](name);if(fieldInst && fieldInst[R65]){fieldInst[R65](json[m65][name]);}}});}}function _message(el,msg,title,fn){var t65="eOut";var B65="removeAttr";var N2I=U53;N2I+=I95;N2I+=e83;N2I+=y03;var d2I=U53;d2I+=W53;var canAnimate=$[d2I][J0v]?J33:m33;if(title === undefined){title=m33;}if(!fn){fn=function(){};}if(typeof msg === N2I){msg=msg(this,new DataTable$3[K93](this[T13][X83]));}el=$(el);if(canAnimate){el[s45]();}if(!msg){if(this[T13][H25] && canAnimate){var n2I=U53;n2I+=A93;n2I+=t65;el[n2I](function(){el[e1v](I43);fn();});}else {var b2I=x65;b2I+=c13;var S2I=v43;S2I+=T13;S2I+=T13;el[e1v](I43)[S2I](h65,b2I);fn();}if(title){el[B65](x0v);}}else {fn();if(this[T13][H25] && canAnimate){var X2I=Y65;X2I+=r03;el[X2I](msg)[R0v]();}else {var r2I=J83;r2I+=q03;var O2I=v43;O2I+=T13;O2I+=T13;var l2I=P93;l2I+=i13;l2I+=w3ii[62535];l2I+=r03;el[l2I](msg)[O2I](r2I,G0v);}if(title){var c2I=w3ii[621556];c2I+=i13;c2I+=i13;c2I+=G53;el[c2I](x0v,msg);}}}function _multiInfo(){var q65="MultiVa";var E65="ultiValue";var K65="ltiInfoSho";var F2I=R83;F2I+=V83;F2I+=w3ii[25714];F2I+=T13;var fields=this[T13][F2I];F7q.H0O();var include=this[T13][E35];var show=J33;var state;if(!include){return;}for(var i=v13,ien=include[J93];i < ien;i++){var T2I=w65;T2I+=K65;T2I+=A65;var I2I=b15;I2I+=q65;I2I+=f75;var i2I=b15;i2I+=A03;i2I+=E65;var field=fields[include[i]];var multiEditable=field[Q65]();if(field[i2I]() && multiEditable && show){state=J33;show=m33;}else if(field[I2I]() && !multiEditable){state=J33;}else {state=m33;}fields[include[i]][T2I](state);}}function _nestedClose(cb){var C65="playControl";var a65="dte";F7q.X0O();var D65="pop";var V65="callback";var k1I=v93;k1I+=R1v;k1I+=y93;var Z2I=L0v;Z2I+=C65;Z2I+=L95;var disCtrl=this[T13][Z2I];var show=disCtrl[g65];if(!show || !show[J93]){if(cb){cb();}}else if(show[k1I] > y13){var W1I=w3ii[621556];W1I+=f7v;W1I+=c13;W1I+=n53;var U1I=z65;U1I+=i13;U1I+=P93;show[D65]();var last=show[show[U1I] - y13];if(cb){cb();}this[T13][f25][R35](last[a65],last[W1I],last[V65]);}else {var L1I=z65;L1I+=y93;this[T13][f25][t0v](this,cb);show[L1I]=v13;}}function _nestedOpen(cb,nest){var u65="how";var H65="_sh";var v1I=L7v;v1I+=R7v;v1I+=G53;var P1I=d0v;P1I+=d53;P1I+=R7v;P1I+=G53;var M1I=j55;M1I+=w3ii[62535];var j1I=H65;j1I+=J53;j1I+=m53;var o1I=H65;o1I+=W73;var disCtrl=this[T13][f25];if(!disCtrl[o1I]){disCtrl[g65]=[];}if(!nest){var e1I=h75;e1I+=u65;disCtrl[e1I][J93]=v13;}disCtrl[j1I][l33]({dte:this,append:this[M1I][P1I],callback:cb});this[T13][f25][R35](this,this[Z9v][v1I],cb);}function _postopen(type,immediate){var X65="captureFocus";var b65="ntroller";var O65="-f";var d65="-in";var f65="submit.editor";var S65="displayCo";var l65="focus.editor";var N65="ternal";var n65=".editor-internal";var z1I=Z73;z1I+=m8v;z1I+=N53;z1I+=i13;var g1I=Z73;g1I+=s65;var x1I=R53;x1I+=t53;x1I+=Z3v;x1I+=v93;var t1I=f65;t1I+=d65;t1I+=N65;var R1I=J53;R1I+=W53;var m1I=d3v;m1I+=i13;m1I+=n65;var J1I=i5v;J1I+=U53;var G1I=U53;G1I+=D3v;G1I+=w3ii[62535];var p1I=w3ii[25714];p1I+=J53;p1I+=w3ii[62535];var y1I=S65;y1I+=b65;var _this=this;var focusCapture=this[T13][y1I][X65];if(focusCapture === undefined){focusCapture=J33;}$(this[p1I][G1I])[J1I](m1I)[R1I](t1I,function(e){F7q.H0O();e[y6v]();});if(focusCapture && (type === z6v || type === x1I)){var B1I=l65;B1I+=O65;B1I+=H55;var h1I=d7v;h1I+=w3ii[25714];h1I+=q03;$(h1I)[I53](B1I,function(){var I65="men";var r65=".D";var c65="ents";var i65="eEle";var T65="Focus";var F65="activ";var E1I=v93;E1I+=Y8v;var q1I=r65;q1I+=Y73;q1I+=B73;var A1I=X95;A1I+=G53;A1I+=c65;var K1I=F65;K1I+=i65;K1I+=I65;K1I+=i13;var w1I=H9v;w1I+=B73;w1I+=I9v;w1I+=j03;var Y1I=P65;Y1I+=N53;Y1I+=i13;Y1I+=T13;if($(document[F95])[Y1I](w1I)[J93] === v13 && $(document[K1I])[A1I](q1I)[E1I] === v13){if(_this[T13][A95]){var C1I=z43;C1I+=v85;C1I+=T13;var Q1I=w3v;Q1I+=T65;_this[T13][Q1I][C1I]();}}});}this[g1I]();this[z1I](u25,[type,this[T13][E5v]]);if(immediate){var D1I=E7v;D1I+=V55;this[P8v](D1I,[type,this[T13][E5v]]);}return J33;}function _preopen(type){var o2A="_clearDynamicI";var W2A="eIcb";var U2A="eOpen";var k2A="earDynamicIn";var L2A="lOpen";var e2A="loseI";var X1I=Z65;X1I+=C63;X1I+=q03;X1I+=q1v;var b1I=G8v;b1I+=k2A;b1I+=z43;var V1I=w3ii[621556];V1I+=X8v;V1I+=J53;V1I+=W53;var a1I=v9v;a1I+=U2A;if(this[P8v](a1I,[type,this[T13][V1I]]) === m33){var n1I=p43;n1I+=E25;n1I+=W2A;var N1I=R53;N1I+=t53;N1I+=R53;N1I+=O53;var d1I=w3ii[62535];d1I+=E85;var f1I=p53;f1I+=a15;f1I+=p53;f1I+=f15;var s1I=q73;s1I+=w3ii[25714];s1I+=c13;var u1I=p6v;u1I+=g2v;u1I+=c13;u1I+=L2A;var H1I=o2A;H1I+=e55;this[H1I]();this[P8v](u1I,[type,this[T13][E5v]]);if((this[T13][s1I] === f1I || this[T13][d1I] === N1I) && this[T13][n1I]){var S1I=v43;S1I+=e2A;S1I+=v43;S1I+=R53;this[T13][S1I]();}this[T13][M35]=p33;return m33;}this[b1I](J33);this[T13][X1I]=type;return J33;}function _processing(processing){var P2A="active";var j2A="ppe";F7q.H0O();var v2A='processing';var r1I=Z73;r1I+=y25;var O1I=d0v;O1I+=j2A;O1I+=G53;var l1I=M2A;l1I+=B73;l1I+=Y73;var procClass=this[h3v][c1v][P2A];$([l1I,this[Z9v][O1I]])[k15](procClass,processing);this[T13][c1v]=processing;this[r1I](v2A,[processing]);}function _noProcessing(args){var y2A='processing-field';var F1I=e25;F1I+=j25;F1I+=T13;var c1I=c13;c1I+=q0v;var processing=m33;$[c1I](this[T13][F1I],function(name,field){if(field[c1v]()){processing=J33;}});if(processing){var i1I=J53;i1I+=W53;i1I+=c13;this[i1I](y2A,function(){var G2A="roces";var R2A="ubmit";var p2A="_noP";F7q.H0O();var J2A="sin";var I1I=p2A;I1I+=G2A;I1I+=J2A;I1I+=T33;if(this[I1I](args) === J33){var Z1I=K0v;Z1I+=d53;Z1I+=m2A;var T1I=Z73;T1I+=T13;T1I+=R2A;this[T1I][Z1I](this,args);}});}F7q.H0O();return !processing;}function _submit(successCallback,errorCallback,formatdata,hide){var N2A="vent";var K2A='Field is still processing';var h2A="Opt";var q2A="llIfC";var B13=16;var t2A="preSubmi";var B2A="itDa";var f2A="bmitCom";var Q5I=t2A;Q5I+=i13;var E5I=g55;E5I+=W3v;var q5I=B53;q5I+=x2A;var K5I=m63;K5I+=R63;var o5I=q1v;o5I+=Z03;var L5I=v03;L5I+=p53;L5I+=J53;L5I+=W53;var W5I=S3v;W5I+=h2A;W5I+=T13;var U5I=q1v;U5I+=B2A;U5I+=F63;var k5I=S3v;k5I+=Y2A;k5I+=G6v;k5I+=E83;var _this=this;var changed=m33,allData={},changedData={};var setBuilder=dataSet;var fields=this[T13][J63];var editCount=this[T13][C95];var editFields=this[T13][k5I];var editData=this[T13][U5I];var opts=this[T13][W5I];var changedSubmit=opts[l8v];var submitParamsLocal;if(this[w2A](arguments) === m33){Editor[N93](K2A,B13,m33);return;}var action=this[T13][L5I];var submitParams={"data":{}};submitParams[this[T13][A2A]]=action;if(action === D6v || action === o5I){var t5I=w3ii[621556];t5I+=q2A;t5I+=E2A;t5I+=q1v;var R5I=u05;R5I+=Q2A;var e5I=c13;e5I+=w3ii[621556];e5I+=o4v;$[e5I](editFields,function(idSrc,edit){var s2A="isEmptyObject";var j5I=c13;j5I+=q0v;var allRowData={};var changedRowData={};$[j5I](fields,function(name,field){var D2A="many-count";var g2A="compa";var H2A="]";var C2A="bmitt";var a2A="place";F7q.X0O();var V2A="[";var u2A=/\[.*$/;var M5I=U6v;M5I+=C2A;M5I+=w3ii[621556];M5I+=O53;if(edit[J63][name] && field[M5I]()){var J5I=g2A;J5I+=L53;var G5I=q1v;G5I+=Z03;var p5I=z2A;p5I+=D2A;var y5I=L53;y5I+=a2A;var v5I=V2A;v5I+=H2A;var P5I=K63;P5I+=V3v;var multiGet=field[t55]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var originalVal=field[j1v](edit[v83]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[P5I](value) && typeof name === U93 && name[M45](v5I) !== -y13?setBuilder(name[y5I](u2A,I43) + p5I):p33;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[J93]);}if(action === G5I && (!editData[name] || !field[J5I](value,editData[name][idSrc]))){builder(changedRowData,value);changed=J33;if(manyBuilder){var m5I=v93;m5I+=W53;m5I+=M1v;m5I+=P93;manyBuilder(changedRowData,value[m5I]);}}}});if(!$[s2A](allRowData)){allData[idSrc]=allRowData;}F7q.H0O();if(!$[s2A](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === R5I || changedSubmit === y33 || changedSubmit === t5I && changed){submitParams[v83]=allData;}else if(changedSubmit === n33 && changed){var x5I=w3ii[25714];x5I+=w3ii[621556];x5I+=i13;x5I+=w3ii[621556];submitParams[x5I]=changedData;}else {var w5I=U6v;w5I+=f2A;w5I+=d2A;w5I+=S53;var Y5I=Z73;Y5I+=c13;Y5I+=N2A;var h5I=E6v;h5I+=I53;this[T13][h5I]=p33;if(opts[n2A] === P33 && (hide === undefined || hide)){var B5I=G8v;B5I+=V7v;this[B5I](m33);}else if(typeof opts[n2A] === w3ii[27150]){opts[n2A](this);}if(successCallback){successCallback[S63](this);}this[S2A](m33);this[Y5I](w5I);return;}}else if(action === K5I){$[M93](editFields,function(idSrc,edit){var A5I=I03;A5I+=F63;F7q.X0O();submitParams[v83][idSrc]=edit[A5I];});}F7q.H0O();submitParamsLocal=$[q5I](J33,{},submitParams);if(formatdata){formatdata(submitParams);}this[E5I](Q5I,[submitParams,action],function(result){var X2A="ax";F7q.H0O();if(result === m33){var C5I=Y55;C5I+=b2A;_this[C5I](m33);}else {var g5I=w3ii[621556];g5I+=H3v;g5I+=X2A;var submitWire=_this[T13][g5I]?_this[l2A]:_this[O2A];submitWire[S63](_this,submitParams,function(json,notGood,xhr){F7q.X0O();_this[r2A](json,notGood,submitParams,submitParamsLocal,_this[T13][E5v],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){F7q.X0O();_this[c2A](xhr,err,thrown,errorCallback,submitParams,_this[T13][E5v]);},submitParams);}});}function _submitTable(data,success,error,submitParams){var I2A='individual';var i2A="_dataS";var D5I=p53;D5I+=w3ii[25714];D5I+=H83;D5I+=u83;var z5I=Y1v;z5I+=H83;z5I+=u83;var action=data[E5v];var out={data:[]};var idGet=dataGet(this[T13][z5I]);var idSet=dataSet(this[T13][D5I]);if(action !== F2A){var a5I=i2A;a5I+=J53;a5I+=l3v;var originalData=this[T13][K35] === z6v?this[R3v](S25,this[a6v]()):this[a5I](I2A,this[a6v]());$[M93](data[v83],function(key,vals){var T2A="toString";var toSave;var extender=extend;if(action === j2v){var V5I=w3ii[25714];V5I+=w3ii[621556];V5I+=i13;V5I+=w3ii[621556];var rowData=originalData[key][V5I];toSave=extender({},rowData,J33);toSave=extender(toSave,vals,J33);}else {toSave=extender({},vals,J33);}var overrideId=idGet(toSave);if(action === e2v && overrideId === undefined){idSet(toSave,+new Date() + key[T2A]());}else {idSet(toSave,overrideId);}out[v83][l33](toSave);});}success(out);}function _submitSuccess(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var Z2A="mitComplete";var z1A="preCre";var C1A="eat";var k1A="fieldE";var A1A="_da";var K1A="editCoun";var Y1A='<br>';var n1A="Source";var o1A="dErrors";var s1A='postEdit';var W1A="ors";var H1A="eE";var a1A="ataS";var Q1A='setData';var L1A='postSubmit';var D1A='postCreate';var g1A="_dataSour";var E1A='prep';var f1A='commit';var X1A="onCompl";var d1A="R";var V1A="ourc";var l1A="onCom";var w1A='submitUnsuccessful';var r1A='submitSuccess';var S1A='preRemove';var q1A="taSource";var O1A="let";var u7I=b45;u7I+=Z2A;var H7I=Z73;H7I+=c13;H7I+=Z35;H7I+=i13;var N5I=R83;N5I+=Q05;var d5I=x03;d5I+=G53;d5I+=J53;d5I+=G53;var s5I=k1A;s5I+=U1A;s5I+=W1A;var H5I=A05;H5I+=J53;H5I+=G53;var _this=this;var that=this;var setData;var fields=this[T13][J63];var opts=this[T13][f63];var modifier=this[T13][a6v];this[P8v](L1A,[json,submitParams,action,xhr]);if(!json[H5I]){var u5I=x03;u5I+=G53;u5I+=D3v;json[u5I]=w3ii[505421];}if(!json[s5I]){var f5I=R83;f5I+=V83;f5I+=o1A;json[f5I]=[];}if(notGood || json[d5I] || json[N5I][J93]){var L7I=e1A;L7I+=G53;var globalError=[];if(json[N93]){var S5I=c13;S5I+=G53;S5I+=p45;var n5I=d53;n5I+=t53;n5I+=E3v;globalError[n5I](json[S5I]);}$[M93](json[E05],function(i,err){var M1A="yed";var B1A="atus";var y1A=" f";var P1A="Unk";var m1A="Fiel";var J1A="unction";var x1A="bodyContent";var p1A="ield: ";var v1A="nown";F7q.H0O();var h1A="onFieldError";var G1A="Erro";var t1A="_ani";var l5I=u53;l5I+=T13;l5I+=j1A;l5I+=M1A;var field=fields[err[I93]];if(!field){var X5I=W53;X5I+=r25;var b5I=P1A;b5I+=v1A;b5I+=y1A;b5I+=p1A;throw new Error(b5I + err[X5I]);}else if(field[l5I]()){var r5I=G1A;r5I+=G53;var O5I=c13;O5I+=U1A;O5I+=J53;O5I+=G53;field[O5I](err[e45] || r5I);if(i === v13){var k7I=U53;k7I+=J1A;var F5I=U53;F5I+=R8v;F5I+=t8v;var c5I=I53;c5I+=m1A;c5I+=w3ii[25714];c5I+=J15;if(opts[c5I] === F5I){var Z5I=i13;Z5I+=T7v;var T5I=d53;T5I+=J53;T5I+=T13;T5I+=R1A;var I5I=W53;I5I+=J53;I5I+=Q2v;var i5I=t1A;i5I+=w3ii[62535];i5I+=F15;_this[i5I]($(_this[Z9v][x1A]),{scrollTop:$(field[I5I]())[T5I]()[Z5I]},V13);field[y75]();}else if(typeof opts[h1A] === k7I){opts[h1A](_this,err);}}}else {var W7I=r2v;W7I+=B1A;var U7I=t95;U7I+=d43;globalError[l33](field[I93]() + U7I + (err[W7I] || J15));}});this[L7I](globalError[l55](Y1A));this[P8v](w1A,[json]);if(errorCallback){errorCallback[S63](that,json);}}else {var V7I=Z73;V7I+=c13;V7I+=E73;V7I+=W3v;var Q7I=K1A;Q7I+=i13;var Y7I=G53;Y7I+=c13;Y7I+=o53;Y7I+=c13;var j7I=c13;j7I+=w3ii[25714];j7I+=p53;j7I+=i13;var e7I=v43;e7I+=G53;e7I+=Q2A;var o7I=w3ii[25714];o7I+=w3ii[621556];o7I+=i13;o7I+=w3ii[621556];var store={};if(json[o7I] && (action === e7I || action === j7I)){var B7I=A1A;B7I+=q1A;var P7I=I03;P7I+=F63;var M7I=d15;M7I+=w3ii[621556];M7I+=q1A;this[M7I](E1A,action,modifier,submitParamsLocal,json,store);for(var i=v13;i < json[P7I][J93];i++){var m7I=c13;m7I+=w3ii[25714];m7I+=p53;m7I+=i13;var y7I=i45;y7I+=c13;y7I+=W53;y7I+=i13;var v7I=p53;v7I+=w3ii[25714];setData=json[v83][i];var id=this[R3v](v7I,setData);this[y7I](Q1A,[json,setData,action]);if(action === D6v){var J7I=v43;J7I+=G53;J7I+=C1A;J7I+=c13;var G7I=g1A;G7I+=c83;var p7I=z1A;p7I+=F15;this[P8v](p7I,[json,setData,id]);this[G7I](e2v,fields,setData,store);this[P8v]([J7I,D1A],[json,setData,id]);}else if(action === m7I){var h7I=Z73;h7I+=m8v;h7I+=r73;var x7I=q1v;x7I+=Z03;var t7I=d15;t7I+=a1A;t7I+=V1A;t7I+=c13;var R7I=v9v;R7I+=H1A;R7I+=u1A;this[P8v](R7I,[json,setData,id]);this[t7I](x7I,modifier,fields,setData,store);this[h7I]([j2v,s1A],[json,setData,id]);}}this[B7I](f1A,action,modifier,json[v83],store);}else if(action === Y7I){var E7I=p53;E7I+=w3ii[25714];E7I+=T13;var q7I=F6v;q7I+=d1A;q7I+=N1A;q7I+=c13;var A7I=T55;A7I+=t43;A7I+=c13;var K7I=v9v;K7I+=c13;K7I+=d53;var w7I=d25;w7I+=w3ii[621556];w7I+=n1A;this[w7I](K7I,action,modifier,submitParamsLocal,json,store);this[P8v](S1A,[json,this[b1A]()]);this[R3v](A7I,modifier,fields,store);this[P8v]([F2A,q7I],[json,this[E7I]()]);this[R3v](f1A,action,modifier,json[v83],store);}if(editCount === this[T13][Q7I]){var g7I=X1A;g7I+=c03;var C7I=w3ii[621556];C7I+=e83;C7I+=y03;var action_1=this[T13][C7I];this[T13][E5v]=p33;if(opts[g7I] === P33 && (hide === undefined || hide)){var z7I=w3ii[25714];z7I+=w3ii[621556];z7I+=i13;z7I+=w3ii[621556];this[O45](json[z7I]?J33:m33,action_1);}else if(typeof opts[n2A] === w3ii[27150]){var D7I=l1A;D7I+=d53;D7I+=O1A;D7I+=c13;opts[D7I](this);}}if(successCallback){var a7I=p6v;a7I+=W83;successCallback[a7I](that,json);}this[V7I](r1A,[json,setData,action]);}this[S2A](m33);F7q.H0O();this[H7I](u7I,[json,setData,action]);}function _submitError(xhr,err,thrown,errorCallback,submitParams,action){var F1A="subm";var I1A="ost";var c1A="submitCompl";var T1A="system";var i1A="itError";var b7I=c1A;b7I+=c03;var S7I=F1A;S7I+=i1A;var n7I=Z73;n7I+=P35;n7I+=i13;var N7I=Z73;N7I+=c1v;var d7I=c13;d7I+=U1A;d7I+=D3v;var f7I=d53;f7I+=I1A;f7I+=t75;f7I+=x75;var s7I=Z73;s7I+=m8v;s7I+=c13;s7I+=W3v;this[s7I](f7I,[p33,submitParams,action,xhr]);this[d7I](this[n4v][N93][T1A]);this[N7I](m33);if(errorCallback){errorCallback[S63](this,xhr,err,thrown);}this[n7I]([S7I,b7I],[xhr,err,thrown,submitParams]);}function _tidy(fn){var L5A="res";var k5A="aT";var o5A="settin";var m13=10;var e5A="mitCo";var W5A="eatu";var j5A="mplete";var Z1A="spla";var Z7I=u53;Z7I+=Z1A;Z7I+=q03;var T7I=R15;T7I+=W53;T7I+=c13;var I7I=L0v;I7I+=o0v;I7I+=A63;var O7I=M2v;O7I+=k5A;O7I+=U5A;O7I+=c13;var l7I=U53;l7I+=W53;var X7I=i13;X7I+=U5A;X7I+=c13;var _this=this;var dt=this[T13][X7I]?new $[l7I][O7I][K93](this[T13][X83]):p33;var ssp=m33;if(dt){var c7I=J53;c7I+=Y2A;c7I+=W5A;c7I+=L5A;var r7I=o5A;r7I+=T33;r7I+=T13;ssp=dt[r7I]()[v13][c7I][Y93];}if(this[T13][c1v]){var i7I=b45;i7I+=e5A;i7I+=j5A;var F7I=J53;F7I+=W53;F7I+=c13;this[F7I](i7I,function(){var P5A='draw';F7q.H0O();if(ssp){dt[M5A](P5A,fn);}else {setTimeout(function(){fn();},m13);}});return J33;}else if(this[I7I]() === T7I || this[Z7I]() === U9v){var o0I=R53;o0I+=q63;o0I+=G53;var U0I=v43;U0I+=e43;U0I+=c13;var k0I=J53;k0I+=W53;k0I+=c13;this[k0I](U0I,function(){var y5A="cessing";var p5A='submitComplete';var W0I=v5A;W0I+=y5A;if(!_this[T13][W0I]){setTimeout(function(){F7q.X0O();if(_this[T13]){fn();}},m13);}else {_this[M5A](p5A,function(e,json){if(ssp && json){var L0I=w3ii[25714];L0I+=G53;L0I+=w3ii[621556];L0I+=m53;dt[M5A](L0I,fn);}else {setTimeout(function(){if(_this[T13]){fn();}},m13);}});}})[o0I]();return J33;}return m33;}function _weakInArray(name,arr){F7q.H0O();var e0I=r03;e0I+=Z93;for(var i=v13,ien=arr[e0I];i < ien;i++){if(name == arr[i]){return i;}}return -y13;}var fieldType={create:function(){},get:function(){},set:function(){},enable:function(){},disable:function(){}};var DataTable$2=$[j0I][k33];function _buttonText(conf,text){var J5A="upload button";var t5A="Choose file...";var R5A="loadT";var y0I=M43;y0I+=G5A;var v0I=M2A;v0I+=J5A;var P0I=U53;P0I+=m5A;if(text === p33 || text === undefined){var M0I=y05;M0I+=R5A;M0I+=e53;text=conf[M0I] || t5A;}conf[x5A][P0I](v0I)[y0I](text);}function _commonUpload(editor,conf,dropCallback,multiple){var o7A='id';var L7A='input[type=file]';var g5A="row second\">";var F5A='<div class="cell clearValue">';var y7A="Drag and drop a ";var t7A="dragDropText";var m7A="iv.drop";var O5A='<div class="eu_table">';var B5A="input[";var i5A='"></button>';var q7A='dragover';var r5A='multiple';var v7A="v.dr";var d5A="=\"cell upload l";var S5A="lass=\"row";var T5A='<div class="drop"><span></span></div>';var J7A="tex";var W7A="att";var V5A="input type=\"file";var C5A=" class=\"";var V7A="oDrop";var w5A="/d";var Y5A="pe=file]";var D5A="<button c";var R7A=" span";var N5A="mitHide\">";var K5A="iv>";var c5A='></input>';var Z5A='<div class="cell">';var p7A="file here ";var l5A='<div class="editor_upload">';var b5A="buttonIn";var M7A="FileReader";var A7A='over';var A5A="/div";var j7A="t[type=file]";var w7A='dragleave dragexit';var G7A="to upload";var f5A="<div class";var u5A="\">";var n5A="<div c";var s5A="ton>";var I5A='<div class="cell limitHide">';var X5A="rnal";var q5A="<div class=\"rendered\"><";var U7A="safeI";var P7A="dragDrop";var x4I=p53;x4I+=W53;x4I+=d53;x4I+=h5A;var t4I=J53;t4I+=W53;var R4I=B5A;R4I+=i13;R4I+=q03;R4I+=Y5A;var m4I=U53;m4I+=p53;m4I+=W53;m4I+=w3ii[25714];var v4I=J53;v4I+=W53;var P4I=U53;P4I+=p53;P4I+=n53;var E0I=p53;E0I+=w3ii[25714];var q0I=r53;q0I+=w5A;q0I+=K5A;var A0I=r53;A0I+=A5A;A0I+=R9v;var K0I=q5A;K0I+=c53;var w0I=E5A;w0I+=K5A;var Y0I=Q5A;Y0I+=C5A;Y0I+=g5A;var B0I=z5A;B0I+=R9v;var h0I=D5A;h0I+=a5A;var x0I=r53;x0I+=w5A;x0I+=m9v;x0I+=R9v;var t0I=r53;t0I+=V5A;t0I+=H5A;var R0I=u5A;R0I+=J9v;R0I+=S8v;R0I+=s5A;var m0I=r53;m0I+=e6v;m0I+=C5A;var J0I=f5A;J0I+=d5A;J0I+=p53;J0I+=N5A;var G0I=n5A;G0I+=S5A;G0I+=u5A;var p0I=b5A;p0I+=S53;p0I+=X5A;if(multiple === void v13){multiple=m33;}var btnClass=editor[h3v][U8v][p0I];var container=$(l5A + O5A + G0I + J0I + m0I + btnClass + R0I + t0I + (multiple?r5A:I43) + c5A + x0I + F5A + h0I + btnClass + i5A + V0v + B0I + Y0I + I5A + T5A + w0I + Z5A + K0I + V0v + V0v + A0I + q0I);conf[x5A]=container;conf[k7A]=J33;if(conf[E0I]){var z0I=p53;z0I+=w3ii[25714];var g0I=U7A;g0I+=w3ii[25714];var C0I=W7A;C0I+=G53;var Q0I=U53;Q0I+=p53;Q0I+=W53;Q0I+=w3ii[25714];container[Q0I](L7A)[C0I](o7A,Editor[g0I](conf[z0I]));}if(conf[m1v]){var H0I=C83;H0I+=i13;H0I+=G53;var V0I=w3ii[621556];V0I+=i13;V0I+=i13;V0I+=G53;var a0I=e7A;a0I+=t53;a0I+=j7A;var D0I=U53;D0I+=p53;D0I+=W53;D0I+=w3ii[25714];container[D0I](a0I)[V0I](conf[H0I]);}_buttonText(conf);if(window[M7A] && conf[P7A] !== m33){var W4I=v43;W4I+=y43;var Z0I=E7v;Z0I+=W53;var F0I=J53;F0I+=W53;var S0I=w3ii[25714];S0I+=G53;S0I+=J53;S0I+=d53;var n0I=J53;n0I+=W53;var N0I=u53;N0I+=v7A;N0I+=J53;N0I+=d53;var d0I=y7A;d0I+=p7A;d0I+=G7A;var f0I=J7A;f0I+=i13;var s0I=w3ii[25714];s0I+=m7A;s0I+=R7A;var u0I=U53;u0I+=m5A;container[u0I](s0I)[f0I](conf[t7A] || d0I);var dragDrop=container[x25](N0I);dragDrop[n0I](S0I,function(e){var x7A="enabl";var Y7A="lEv";var B7A="igina";var h7A="taTransfer";var b0I=Z73;b0I+=x7A;b0I+=c13;b0I+=w3ii[25714];if(conf[b0I]){var c0I=J53;c0I+=t43;c0I+=c13;c0I+=G53;var r0I=U53;r0I+=p53;r0I+=v93;r0I+=T13;var O0I=I03;O0I+=h7A;var l0I=D3v;l0I+=B7A;l0I+=Y7A;l0I+=r73;var X0I=y05;X0I+=F45;X0I+=w3ii[621556];X0I+=w3ii[25714];Editor[X0I](editor,conf,e[l0I][O0I][r0I],_buttonText,dropCallback);dragDrop[u93](c0I);}return m33;})[F0I](w7A,function(e){var K7A="eClass";F7q.H0O();if(conf[k7A]){var i0I=G53;i0I+=N1A;i0I+=K7A;dragDrop[i0I](A7A);}return m33;})[I53](q7A,function(e){var I0I=E7A;I0I+=w3ii[25714];F7q.X0O();if(conf[I0I]){var T0I=N05;T0I+=T13;T0I+=T13;dragDrop[T0I](A7A);}return m33;});editor[I53](Z0I,function(){var Q7A="dragover.DTE_Upl";var C7A="oad drop.DTE_Upload";var U4I=Q7A;U4I+=C7A;var k4I=J53;k4I+=W53;$(D4v)[k4I](U4I,function(e){F7q.X0O();return m33;});})[I53](W4I,function(){var D7A="ver.";var g7A="dra";var z7A="go";F7q.X0O();var a7A="DTE_Upload drop.DTE_Upload";var o4I=g7A;o4I+=z7A;o4I+=D7A;o4I+=a7A;var L4I=J53;L4I+=U53;L4I+=U53;$(D4v)[L4I](o4I);});}else {var M4I=K0v;M4I+=R7v;M4I+=n53;var j4I=W53;j4I+=V7A;var e4I=W63;e4I+=a93;container[e4I](j4I);container[M4I](container[x25](H7A));}container[P4I](u7A)[v4I](T85,function(e){var f7A="eventDef";var s7A="nabl";var p4I=t15;p4I+=s7A;p4I+=q1v;var y4I=v9v;F7q.X0O();y4I+=f7A;y4I+=n35;y4I+=i13;e[y4I]();if(conf[p4I]){var J4I=O1v;J4I+=r03;var G4I=G43;G4I+=i13;upload[G4I][J4I](editor,conf,I43);}});container[m4I](R4I)[t4I](x4I,function(){var B4I=Y53;B4I+=I25;var h4I=y05;h4I+=p05;Editor[h4I](editor,conf,this[B4I],_buttonText,function(ids){var N7A="ype=file]";var d7A="ut[t";var K4I=e7A;K4I+=d7A;K4I+=N7A;var w4I=U53;w4I+=p53;w4I+=W53;w4I+=w3ii[25714];var Y4I=v43;Y4I+=r1v;Y4I+=r03;dropCallback[Y4I](editor,ids);container[w4I](K4I)[v13][n7A]=I43;});});return container;}function _triggerChange(input){F7q.X0O();setTimeout(function(){var q4I=v43;q4I+=c4v;q4I+=X6v;var A4I=y85;A4I+=T33;A4I+=x03;input[A4I](q4I,{editor:J33,editorSet:J33});;},v13);}var baseFieldType=$[b33](J33,{},fieldType,{get:function(conf){var E4I=t43;E4I+=r1v;return conf[x5A][E4I]();},set:function(conf,val){var Q4I=S7A;Q4I+=o2v;Q4I+=i13;conf[x5A][h25](val);F7q.H0O();_triggerChange(conf[Q4I]);},enable:function(conf){var b7A="rop";var g4I=d53;g4I+=b7A;var C4I=X7A;C4I+=t53;C4I+=i13;conf[C4I][g4I](l7A,m33);},disable:function(conf){var D4I=u53;D4I+=O7A;var z4I=D15;z4I+=W53;z4I+=o2v;F7q.X0O();z4I+=i13;conf[z4I][r7A](D4I,J33);},canReturnSubmit:function(conf,node){return J33;}});var hidden={create:function(conf){var V4I=J25;V4I+=r03;V4I+=t53;V4I+=c13;var a4I=Z73;a4I+=t43;a4I+=w3ii[621556];a4I+=r03;conf[a4I]=conf[V4I];return p33;},get:function(conf){var H4I=Z73;F7q.H0O();H4I+=t43;H4I+=w3ii[621556];H4I+=r03;return conf[H4I];},set:function(conf,val){var u4I=Z73;u4I+=t43;u4I+=r1v;F7q.H0O();conf[u4I]=val;}};var readonly=$[s4I](J33,{},baseFieldType,{create:function(conf){var c7A="read";var i7A="<input";var F7A="only";var b4I=C83;b4I+=i33;var S4I=c7A;S4I+=F7A;var n4I=i13;n4I+=c13;n4I+=g03;F7q.X0O();var N4I=w3ii[621556];N4I+=i13;N4I+=i13;N4I+=G53;var d4I=i7A;d4I+=I7A;var f4I=S7A;f4I+=d53;f4I+=t53;f4I+=i13;conf[f4I]=$(d4I)[N4I]($[b33]({id:Editor[T7A](conf[Y1v]),type:n4I,readonly:S4I},conf[b4I] || ({})));return conf[x5A][v13];}});var text=$[b33](J33,{},baseFieldType,{create:function(conf){var c4I=Z73;c4I+=p53;c4I+=Z7A;var r4I=w3ii[621556];r4I+=i13;r4I+=i13;r4I+=G53;var O4I=i13;O4I+=c13;O4I+=g03;var l4I=p53;l4I+=w3ii[25714];var X4I=Z73;X4I+=p53;X4I+=k0A;X4I+=i13;conf[X4I]=$(U0A)[m1v]($[b33]({id:Editor[T7A](conf[l4I]),type:O4I},conf[r4I] || ({})));return conf[c4I][v13];}});var password=$[F4I](J33,{},baseFieldType,{create:function(conf){var W0A="asswor";var T4I=d53;T4I+=W0A;T4I+=w3ii[25714];var I4I=L0A;I4I+=o0A;I4I+=w3ii[25714];var i4I=e0A;i4I+=i13;conf[i4I]=$(U0A)[m1v]($[b33]({id:Editor[I4I](conf[Y1v]),type:T4I},conf[m1v] || ({})));return conf[x5A][v13];}});var textarea=$[b33](J33,{},baseFieldType,{create:function(conf){var M0A='<textarea></textarea>';var Z4I=Z73;Z4I+=j0A;Z4I+=i13;conf[x5A]=$(M0A)[m1v]($[b33]({id:Editor[T7A](conf[Y1v])},conf[m1v] || ({})));return conf[Z4I][v13];},canReturnSubmit:function(conf,node){return m33;}});var select=$[b33](J33,{},baseFieldType,{_addOptions:function(conf,opts,append){var G0A="idd";var m0A="lderDi";var J0A="placeho";var R0A="placeholderValue";var p0A="itor_val";var t0A="placeholderDisabled";var y0A="_ed";var v0A="placeholder";var U3I=P0A;U3I+=J53;U3I+=W53;U3I+=T13;var k3I=Z73;k3I+=j0A;k3I+=i13;if(append === void v13){append=m33;}var elOpts=conf[k3I][v13][U3I];var countOffset=v13;if(!append){elOpts[J93]=v13;if(conf[v0A] !== undefined){var o3I=y0A;o3I+=p0A;var L3I=P93;L3I+=G0A;L3I+=c13;L3I+=W53;var W3I=J0A;W3I+=m0A;W3I+=O7A;var placeholderValue=conf[R0A] !== undefined?conf[R0A]:I43;countOffset+=y13;elOpts[v13]=new Option(conf[v0A],placeholderValue);var disabled=conf[t0A] !== undefined?conf[W3I]:J33;elOpts[v13][L3I]=disabled;elOpts[v13][p5v]=disabled;elOpts[v13][o3I]=placeholderValue;}}else {countOffset=elOpts[J93];}if(opts){Editor[x0A](opts,conf[h0A],function(val,label,i,attr){var option=new Option(label,val);option[B0A]=val;if(attr){var e3I=w3ii[621556];e3I+=i13;e3I+=i13;e3I+=G53;$(option)[e3I](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var z0A="ipOpts";var Q0A='change.dte';var A0A="></sele";var K0A="<sel";var w0A="Opti";var q0A="ct>";var m3I=P0A;m3I+=J53;m3I+=E63;var J3I=Y0A;J3I+=w0A;J3I+=c8v;var v3I=J53;v3I+=W53;var P3I=w3ii[621556];P3I+=i13;P3I+=i13;P3I+=G53;var M3I=p53;M3I+=w3ii[25714];var j3I=K0A;j3I+=m2v;j3I+=A0A;F7q.X0O();j3I+=q0A;conf[x5A]=$(j3I)[m1v]($[b33]({id:Editor[T7A](conf[M3I]),multiple:conf[E0A] === J33},conf[P3I] || ({})))[v3I](Q0A,function(e,d){F7q.X0O();var C0A="_las";var y3I=q1v;y3I+=p53;y3I+=G1v;if(!d || !d[y3I]){var G3I=H73;G3I+=i13;var p3I=C0A;p3I+=i13;p3I+=g0A;conf[p3I]=select[G3I](conf);}});select[J3I](conf,conf[m3I] || conf[z0A]);return conf[x5A][v13];},update:function(conf,options,append){var t3I=Z73;t3I+=j0A;t3I+=i13;select[D0A](conf,options,append);var lastSet=conf[a0A];if(lastSet !== undefined){var R3I=T13;R3I+=c13;R3I+=i13;select[R3I](conf,lastSet,J33);}_triggerChange(conf[t3I]);},get:function(conf){var u0A='option:selected';var V0A="iple";var d0A="ato";var A3I=r03;A3I+=c13;A3I+=W53;A3I+=Y2v;var w3I=m55;w3I+=i13;w3I+=V0A;var B3I=w3ii[62535];B3I+=w3ii[621556];B3I+=d53;var h3I=U53;h3I+=p53;h3I+=W53;h3I+=w3ii[25714];var x3I=D15;x3I+=H0A;x3I+=t53;x3I+=i13;var val=conf[x3I][h3I](u0A)[B3I](function(){var s0A="tor_va";F7q.X0O();var Y3I=Z73;Y3I+=l93;Y3I+=s0A;Y3I+=r03;return this[Y3I];})[f0A]();if(conf[w3I]){var K3I=G43;K3I+=P65;K3I+=d0A;K3I+=G53;return conf[N0A]?val[l55](conf[K3I]):val;}return val[A3I]?val[v13]:p33;},set:function(conf,val,localUpdate){var l0A="arator";var O0A="ltiple";var X0A="sArray";var F0A="split";var S0A="ceholder";var i0A="selected";var b0A="pti";var n3I=z65;n3I+=i13;n3I+=P93;var N3I=n0A;N3I+=d2A;var d3I=j1A;d3I+=S0A;var f3I=U83;f3I+=P93;var s3I=T7v;s3I+=i13;s3I+=p53;s3I+=I53;var u3I=R83;u3I+=n53;var H3I=Z73;H3I+=I33;H3I+=o2v;H3I+=i13;var V3I=J53;V3I+=b0A;V3I+=J53;V3I+=W53;var a3I=R83;a3I+=n53;var D3I=Z73;D3I+=e7A;D3I+=t53;D3I+=i13;var z3I=a2v;z3I+=P93;var Q3I=p53;Q3I+=X0A;var E3I=T13;E3I+=c13;E3I+=d53;E3I+=l0A;var q3I=w65;q3I+=O0A;if(!localUpdate){conf[a0A]=val;}if(conf[q3I] && conf[E3I] && !Array[Q3I](val)){var g3I=r0A;g3I+=l0A;var C3I=c0A;C3I+=p53;C3I+=R1v;val=typeof val === C3I?val[F0A](conf[g3I]):[];}else if(!Array[T93](val)){val=[val];}var i,len=val[z3I],found,allFound=m33;var options=conf[D3I][a3I](V3I);conf[H3I][u3I](s3I)[f3I](function(){found=m33;for(i=v13;i < len;i++){if(this[B0A] == val[i]){found=J33;allFound=J33;break;}}this[i0A]=found;});if(conf[d3I] && !allFound && !conf[N3I] && options[n3I]){options[v13][i0A]=J33;}if(!localUpdate){var S3I=S7A;S3I+=o2v;S3I+=i13;_triggerChange(conf[S3I]);}return allFound;},destroy:function(conf){var I0A="e.dte";var X3I=v43;X3I+=E2A;X3I+=I0A;var b3I=J53;b3I+=U53;b3I+=U53;conf[x5A][b3I](X3I);}});var checkbox=$[b33](J33,{},baseFieldType,{_addOptions:function(conf,opts,append){var T0A="pty";var Z0A="pai";var l3I=e0A;l3I+=i13;if(append === void v13){append=m33;}var jqInput=conf[l3I];var offset=v13;if(!append){var O3I=A75;O3I+=T0A;jqInput[O3I]();}else {var c3I=r03;c3I+=N53;c3I+=T33;c3I+=y93;var r3I=p53;r3I+=H0A;r3I+=t53;r3I+=i13;offset=$(r3I,jqInput)[c3I];}if(opts){var F3I=Z0A;F3I+=k4A;Editor[F3I](opts,conf[h0A],function(val,label,i,attr){var v4A='input:last';var U4A="ditor_val";var M4A='<label for="';var j4A='" type="checkbox" />';var o4A='<input id="';var W4A="feI";var y4A="t:last";var W9I=t15;W9I+=U4A;var U9I=J25;U9I+=q63;U9I+=c13;var k9I=J9v;F7q.H0O();k9I+=w3ii[25714];k9I+=p53;k9I+=w9v;var Z3I=c33;Z3I+=R9v;var T3I=p53;T3I+=w3ii[25714];var I3I=L0A;I3I+=o0A;I3I+=w3ii[25714];var i3I=T13;i3I+=w3ii[621556];i3I+=W4A;i3I+=w3ii[25714];jqInput[n7v](L4A + o4A + Editor[i3I](conf[Y1v]) + e4A + (i + offset) + j4A + M4A + Editor[I3I](conf[T3I]) + e4A + (i + offset) + Z3I + label + P4A + k9I);$(v4A,jqInput)[m1v](U9I,val)[v13][W9I]=val;if(attr){var o9I=w3ii[621556];o9I+=i13;o9I+=i13;o9I+=G53;var L9I=j0A;L9I+=y4A;$(L9I,jqInput)[o9I](attr);}});}},create:function(conf){var G4A="ipO";var J4A='<div></div>';var M9I=Z73;M9I+=p4A;var j9I=G4A;j9I+=d53;j9I+=C1v;var e9I=Z73;e9I+=p4A;conf[e9I]=$(J4A);checkbox[D0A](conf,conf[m65] || conf[j9I]);return conf[M9I][v13];},get:function(conf){F7q.X0O();var w4A="ush";var x4A="nse";var t4A="arat";var h4A="lectedValue";var R4A="rator";var m4A="sepa";var x9I=m4A;x9I+=R4A;var t9I=F05;t9I+=I33;var R9I=T13;R9I+=S6v;R9I+=t4A;R9I+=D3v;var J9I=t53;J9I+=x4A;J9I+=h4A;var v9I=r03;v9I+=Z93;var P9I=Z73;P9I+=e7A;P9I+=t53;P9I+=i13;var out=[];var selected=conf[P9I][x25](B4A);if(selected[v9I]){var y9I=c13;y9I+=w3ii[621556];y9I+=v43;y9I+=P93;selected[y9I](function(){var Y4A="_editor_va";var G9I=Y4A;G9I+=r03;var p9I=d53;p9I+=t8v;p9I+=P93;out[p9I](this[G9I]);});}else if(conf[J9I] !== undefined){var m9I=d53;m9I+=w4A;out[m9I](conf[K4A]);}return conf[N0A] === undefined || conf[R9I] === p33?out:out[t9I](conf[x9I]);},set:function(conf,val){var q4A='|';var B9I=r03;B9I+=Z93;var jqInputs=conf[x5A][x25](A4A);if(!Array[T93](val) && typeof val === U93){var h9I=T13;h9I+=d53;h9I+=r03;h9I+=Z03;val=val[h9I](conf[N0A] || q4A);}else if(!Array[T93](val)){val=[val];}var i,len=val[B9I],found;F7q.X0O();jqInputs[M93](function(){var E4A="chec";var Y9I=E4A;Y9I+=x83;Y9I+=c13;Y9I+=w3ii[25714];found=m33;F7q.X0O();for(i=v13;i < len;i++){if(this[B0A] == val[i]){found=J33;break;}}this[Y9I]=found;});_triggerChange(jqInputs);},enable:function(conf){var w9I=U53;F7q.H0O();w9I+=p53;w9I+=n53;conf[x5A][w9I](A4A)[r7A](l7A,m33);},disable:function(conf){var E9I=w3ii[25714];E9I+=b15;E9I+=z63;E9I+=T63;var q9I=v9v;q9I+=J53;q9I+=d53;var A9I=p53;A9I+=Z7A;var K9I=D15;K9I+=H0A;K9I+=h5A;conf[K9I][x25](A9I)[q9I](E9I,J33);},update:function(conf,options,append){var g9I=T13;g9I+=c13;g9I+=i13;var C9I=Y0A;F7q.H0O();C9I+=Q4A;C9I+=d6v;var Q9I=T33;Q9I+=c13;Q9I+=i13;var currVal=checkbox[Q9I](conf);checkbox[C9I](conf,options,append);checkbox[g9I](conf,currVal);}});var radio=$[z9I](J33,{},baseFieldType,{_addOptions:function(conf,opts,append){F7q.H0O();var C4A="mp";if(append === void v13){append=m33;}var jqInput=conf[x5A];var offset=v13;if(!append){var D9I=c13;D9I+=C4A;D9I+=i13;D9I+=q03;jqInput[D9I]();}else {var a9I=B2v;a9I+=Y2v;offset=$(A4A,jqInput)[a9I];}if(opts){Editor[x0A](opts,conf[h0A],function(val,label,i,attr){var n4A="ut id";var N4A="<in";var u4A=" na";var s4A="me=\"";var g4A="put:";var H4A="\" type=\"radio\"";var V4A="label for=";var d4A="fe";var z4A="last";var D4A="safe";var S4A=":last";var X9I=J25;X9I+=f75;var b9I=I33;b9I+=g4A;b9I+=z4A;var S9I=z5A;S9I+=R9v;var n9I=D4A;n9I+=a4A;var N9I=r53;N9I+=V4A;N9I+=c33;var d9I=H5A;d9I+=I7A;F7q.H0O();var f9I=H4A;f9I+=u4A;f9I+=s4A;var s9I=p53;s9I+=w3ii[25714];var u9I=f4A;u9I+=d4A;u9I+=I8v;u9I+=w3ii[25714];var H9I=N4A;H9I+=d53;H9I+=n4A;H9I+=C85;var V9I=q4v;V9I+=N53;V9I+=w3ii[25714];jqInput[V9I](L4A + H9I + Editor[u9I](conf[s9I]) + e4A + (i + offset) + f9I + conf[I93] + d9I + N9I + Editor[n9I](conf[Y1v]) + e4A + (i + offset) + l9v + label + P4A + S9I);$(b9I,jqInput)[m1v](X9I,val)[v13][B0A]=val;if(attr){var l9I=p4A;l9I+=S4A;$(l9I,jqInput)[m1v](attr);}});}},create:function(conf){F7q.H0O();var b4A='<div />';var c9I=J53;c9I+=R7v;c9I+=W53;var r9I=p53;r9I+=d53;r9I+=Q4A;r9I+=C1v;var O9I=Z73;O9I+=p53;O9I+=k0A;O9I+=i13;conf[O9I]=$(b4A);radio[D0A](conf,conf[m65] || conf[r9I]);this[I53](c9I,function(){var F9I=I33;F9I+=d53;F9I+=h5A;conf[x5A][x25](F9I)[M93](function(){var r4A="hecked";F7q.X0O();var l4A="hec";var i9I=s9v;i9I+=X4A;i9I+=l4A;i9I+=O4A;if(this[i9I]){var I9I=v43;I9I+=r4A;this[I9I]=J33;}});});return conf[x5A][v13];},get:function(conf){var c4A="put:checked";var k8I=v93;k8I+=R1v;k8I+=i13;k8I+=P93;var Z9I=I33;Z9I+=c4A;var T9I=X7A;T9I+=h5A;var el=conf[T9I][x25](Z9I);if(el[k8I]){return el[v13][B0A];}return conf[K4A] !== undefined?conf[K4A]:undefined;},set:function(conf,val){var M8I=Z73;M8I+=I33;M8I+=F4A;var L8I=c13;L8I+=w3ii[621556];L8I+=v43;L8I+=P93;var W8I=I33;W8I+=F4A;var U8I=Z73;U8I+=p53;U8I+=H0A;U8I+=h5A;conf[U8I][x25](W8I)[L8I](function(){var T4A="_preChecked";F7q.X0O();var Z4A="checked";var I4A="ecked";var i4A="Chec";var o8I=s9v;o8I+=c13;o8I+=i4A;o8I+=O4A;this[o8I]=m33;if(this[B0A] == val){var e8I=o4v;e8I+=I4A;this[e8I]=J33;this[T4A]=J33;}else {var j8I=K55;j8I+=i4A;j8I+=x83;j8I+=q1v;this[Z4A]=m33;this[j8I]=m33;}});_triggerChange(conf[M8I][x25](B4A));},enable:function(conf){var y8I=u53;y8I+=I6v;y8I+=T63;var v8I=v5A;v8I+=d53;var P8I=D15;P8I+=W53;P8I+=F4A;conf[P8I][x25](A4A)[v8I](y8I,m33);},disable:function(conf){var p8I=p53;F7q.X0O();p8I+=k0A;p8I+=i13;conf[x5A][x25](p8I)[r7A](l7A,J33);},update:function(conf,options,append){var k3A="filter";F7q.X0O();var U3A='[value="';var R8I=t43;R8I+=r1v;R8I+=t53;R8I+=c13;var m8I=z65;m8I+=i13;m8I+=P93;var J8I=T13;J8I+=c13;J8I+=i13;var G8I=p53;G8I+=W53;G8I+=o2v;G8I+=i13;var currVal=radio[D8v](conf);radio[D0A](conf,options,append);var inputs=conf[x5A][x25](G8I);radio[J8I](conf,inputs[k3A](U3A + currVal + F33)[m8I]?currVal:inputs[T9v](v13)[m1v](R8I));}});var datetime=$[t8I](J33,{},baseFieldType,{create:function(conf){var W3A="Dat";var v3A="displayFormat";var G3A="keyInput";var j3A="DateTime";var p3A="_closeFn";var M3A="eTime library is required";var J3A="down";var o3A='<input />';var y3A="datetime";var g8I=p43;g8I+=E25;g8I+=c13;var C8I=J53;C8I+=W53;var A8I=T7v;A8I+=i13;A8I+=T13;F7q.H0O();var K8I=U8v;K8I+=C83;var w8I=Z73;w8I+=I33;w8I+=d53;w8I+=h5A;var Y8I=W3A;Y8I+=c13;Y8I+=I9v;Y8I+=L3A;var h8I=B53;h8I+=S53;h8I+=W53;h8I+=w3ii[25714];var x8I=D15;x8I+=W53;x8I+=F4A;conf[x8I]=$(o3A)[m1v]($[h8I](J33,{id:Editor[T7A](conf[Y1v]),type:e3A},conf[m1v]));if(!DataTable$2[j3A]){var B8I=B73;B8I+=C83;B8I+=M3A;Editor[N93](B8I,h13);}conf[P3A]=new DataTable$2[Y8I](conf[w8I],$[b33]({format:conf[v3A] || conf[K8I],i18n:this[n4v][y3A]},conf[A8I]));conf[p3A]=function(){conf[P3A][y15]();};if(conf[G3A] === m33){var Q8I=r83;Q8I+=J3A;var E8I=J53;E8I+=W53;var q8I=Z73;q8I+=p4A;conf[q8I][E8I](Q8I,function(e){F7q.H0O();e[y6v]();});}this[C8I](g8I,conf[p3A]);return conf[x5A][v13];},get:function(conf){var B3A="rma";var t3A="momen";var Y3A="ormat";var h3A="ocale";var w3A="mome";var m3A="wir";var x3A="L";var u8I=m3A;u8I+=R3A;var H8I=t3A;H8I+=i13;H8I+=x3A;H8I+=h3A;var V8I=z43;V8I+=B3A;V8I+=i13;var a8I=m3A;a8I+=G65;a8I+=Y3A;var D8I=w3A;D8I+=W53;D8I+=i13;var z8I=S7A;F7q.H0O();z8I+=d53;z8I+=t53;z8I+=i13;var val=conf[z8I][h25]();var inst=conf[P3A][v43];var moment=window[D8I];return val && conf[a8I] && moment?moment(val,inst[V8I],inst[H8I],inst[K3A])[A3A](conf[u8I]):val;},set:function(conf,val){var g3A='--';var E3A="ir";var z3A="wireFormat";var q3A="omentLocal";var N8I=w3ii[62535];N8I+=q3A;N8I+=c13;var d8I=m53;d8I+=E3A;d8I+=R3A;var f8I=Q3A;f8I+=C3A;var s8I=q73;s8I+=V95;var inst=conf[P3A][v43];var moment=window[s8I];conf[f8I][h25](typeof val === U93 && val && val[M45](g3A) !== v13 && conf[d8I] && moment?moment(val,conf[z3A],inst[N8I],inst[K3A])[A3A](inst[A3A]):val);_triggerChange(conf[x5A]);},owns:function(conf,node){var D3A="picker";var S8I=J53;S8I+=A65;S8I+=T13;var n8I=Z73;n8I+=D3A;return conf[n8I][S8I](node);},errorMessage:function(conf,msg){var V3A="errorMsg";F7q.X0O();var b8I=Q3A;b8I+=v43;b8I+=a3A;conf[b8I][V3A](msg);},destroy:function(conf){var H3A="seFn";var r8I=Z73;r8I+=d53;r8I+=p53;r8I+=C3A;var O8I=J53;O8I+=U53;O8I+=U53;var l8I=R85;l8I+=H3A;var X8I=J53;X8I+=U53;X8I+=U53;F7q.H0O();this[X8I](P33,conf[l8I]);conf[x5A][O8I](J85);conf[r8I][g25]();},minDate:function(conf,min){var c8I=w3ii[62535];c8I+=p53;F7q.H0O();c8I+=W53;conf[P3A][c8I](min);},maxDate:function(conf,max){var s3A="max";var F8I=Y55;F8I+=u3A;F8I+=a3A;F7q.H0O();conf[F8I][s3A](max);}});var upload=$[i8I](J33,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var f3A="ostUpload";var Z8I=W53;Z8I+=w3ii[621556];F7q.X0O();Z8I+=w3ii[62535];Z8I+=c13;var T8I=d53;T8I+=f3A;var I8I=i45;I8I+=c13;I8I+=W3v;upload[w3v][S63](editor,conf,val[v13]);editor[I8I](T8I,[conf[Z8I],val[v13]]);});return container;},get:function(conf){F7q.H0O();return conf[d3A];},set:function(conf,val){var X3A="span>";var I3A='noClear';var O3A='No file';var b3A="leText";var n3A="gerHandler";var S3A="tml";var i3A="arTex";var l3A="ppen";var F3A="removeCla";var c3A="clearText";var N3A="load.edito";var h6I=t53;h6I+=d53;h6I+=N3A;h6I+=G53;var x6I=y85;x6I+=n3A;var t6I=R83;t6I+=W53;t6I+=w3ii[25714];var R6I=Z73;R6I+=I33;R6I+=o2v;R6I+=i13;var o6I=L0v;o6I+=W0v;var L6I=S7A;L6I+=F4A;var W6I=t43;W6I+=w3ii[621556];W6I+=r03;var U6I=Z73;U6I+=p53;U6I+=Z7A;var k6I=Z73;k6I+=t43;k6I+=w3ii[621556];k6I+=r03;conf[k6I]=val;conf[U6I][W6I](I43);var container=conf[L6I];if(conf[o6I]){var e6I=Z73;e6I+=t43;e6I+=w3ii[621556];e6I+=r03;var rendered=container[x25](H7A);if(conf[e6I]){var M6I=Z73;M6I+=h25;var j6I=P93;j6I+=S3A;rendered[j6I](conf[p0v](conf[M6I]));}else {var y6I=W53;y6I+=R05;y6I+=p53;y6I+=b3A;var v6I=r53;v6I+=X3A;var P6I=w3ii[621556];P6I+=l3A;P6I+=w3ii[25714];rendered[O8v]()[P6I](v6I + (conf[y6I] || O3A) + r3A);}}var button=container[x25](u7A);if(val && conf[c3A]){var J6I=g35;J6I+=o43;J6I+=v93;J6I+=w6v;var G6I=F3A;G6I+=o63;var p6I=p43;p6I+=c13;p6I+=i3A;p6I+=i13;button[e1v](conf[p6I]);container[G6I](J6I);}else {var m6I=N05;m6I+=T13;m6I+=T13;container[m6I](I3A);}conf[R6I][t6I](A4A)[x6I](h6I,[conf[d3A]]);},enable:function(conf){var T3A="_enab";var Y6I=T3A;Y6I+=T63;var B6I=D15;B6I+=k0A;B6I+=i13;conf[B6I][x25](A4A)[r7A](l7A,m33);conf[Y6I]=J33;},disable:function(conf){var Z3A="disable";var K6I=Z3A;K6I+=w3ii[25714];var w6I=Z73;w6I+=e7A;w6I+=h5A;conf[w6I][x25](A4A)[r7A](K6I,J33);conf[k7A]=m33;},canReturnSubmit:function(conf,node){return m33;}});var uploadMany=$[A6I](J33,{},baseFieldType,{_showHide:function(conf){var j9A="ntainer";var W9A="eft";var e9A="_co";var o9A=".limitHide";var k9A="_l";var U9A="imitL";var M9A="limit";var s6I=B2v;s6I+=Y2v;var u6I=Z73;u6I+=J25;u6I+=r03;var H6I=r03;H6I+=p53;H6I+=w3ii[62535];H6I+=Z03;var V6I=k9A;V6I+=U9A;F7q.X0O();V6I+=W9A;var a6I=h73;a6I+=J53;a6I+=h43;var D6I=W53;D6I+=J53;D6I+=f15;var z6I=r03;z6I+=c13;z6I+=n55;z6I+=P93;var g6I=L9A;g6I+=r03;var C6I=Z65;C6I+=C63;C6I+=q03;var Q6I=x9v;Q6I+=o9A;var E6I=U53;E6I+=p53;E6I+=W53;E6I+=w3ii[25714];var q6I=e9A;q6I+=j9A;if(!conf[M9A]){return;}conf[q6I][E6I](Q6I)[F5v](C6I,conf[g6I][z6I] >= conf[M9A]?D6I:a6I);conf[V6I]=conf[H6I] - conf[u6I][s6I];},create:function(conf){var G9A='multi';var P9A="taine";var v9A="button.";var F6I=K6v;F6I+=I53;F6I+=P9A;F6I+=G53;var l6I=v9A;l6I+=G53;l6I+=A75;l6I+=R63;var X6I=J53;X6I+=W53;var b6I=w3ii[621556];b6I+=D93;b6I+=o43;b6I+=E93;var editor=this;var container=_commonUpload(editor,conf,function(val){var p9A="_v";var y9A="Upload";var S6I=F6v;S6I+=y9A;var n6I=p9A;n6I+=w3ii[621556];n6I+=r03;F7q.X0O();var N6I=T13;N6I+=c13;N6I+=i13;var d6I=p9A;d6I+=w3ii[621556];d6I+=r03;var f6I=Z73;f6I+=t43;f6I+=r1v;conf[f6I]=conf[d6I][S9v](val);uploadMany[N6I][S63](editor,conf,conf[n6I]);editor[P8v](S6I,[conf[I93],conf[d3A]]);},J33);container[b6I](G9A)[X6I](T85,l6I,function(e){var J9A="sto";var m9A="pPropag";var t9A='idx';var R9A="ati";var r6I=E7A;r6I+=w3ii[25714];var O6I=J9A;O6I+=m9A;O6I+=R9A;O6I+=I53;e[O6I]();if(conf[r6I]){var c6I=T13;c6I+=c13;c6I+=i13;var idx=$(this)[v83](t9A);conf[d3A][r63](idx,y13);uploadMany[c6I][S63](editor,conf,conf[d3A]);}});conf[F6I]=container;return container;},get:function(conf){return conf[d3A];},set:function(conf,val){var f9A="<s";var A9A="v.rendered";var q9A="To";var d9A="noFileText";var K9A="as a val";var B9A="isplay";var h9A="d.editor";var Q9A="ul>";var Y9A="Upload collections must ha";var N9A='No files';var w9A="ve an array ";var n9A="_showHide";var x9A="uploa";var E9A="<ul></";var m2G=L9A;m2G+=r03;var J2G=x9A;J2G+=h9A;var G2G=p53;G2G+=H0A;G2G+=h5A;var p2G=Z73;p2G+=p53;p2G+=k0A;p2G+=i13;var T6I=w3ii[25714];T6I+=B9A;var I6I=t43;I6I+=w3ii[621556];I6I+=r03;if(!val){val=[];}if(!Array[T93](val)){var i6I=Y9A;i6I+=w9A;i6I+=K9A;i6I+=u75;throw i6I;}conf[d3A]=val;conf[x5A][I6I](I43);var that=this;var container=conf[x5A];if(conf[T6I]){var Z6I=u53;Z6I+=A9A;var rendered=container[x25](Z6I)[O8v]();if(val[J93]){var W2G=c13;W2G+=w3ii[621556];W2G+=v43;W2G+=P93;var U2G=K0v;U2G+=C4v;U2G+=q9A;var k2G=E9A;k2G+=Q9A;var list=$(k2G)[U2G](rendered);$[W2G](val,function(i,file){var H9A="ton";var z9A=";</bu";var u9A="<li";var V9A="x=\"";var s9A=' <button class="';var D9A="n>";var C9A="li>";var a9A=" remove\" data-i";var g9A="\">&times";var v2G=r53;v2G+=L73;v2G+=C9A;var P2G=g9A;P2G+=z9A;P2G+=j8v;P2G+=D9A;var M2G=a9A;M2G+=w3ii[25714];M2G+=V9A;var j2G=R53;j2G+=h5A;j2G+=H9A;var e2G=u53;e2G+=g3v;e2G+=w3ii[621556];e2G+=q03;var o2G=u9A;o2G+=R9v;var L2G=w3ii[621556];L2G+=V35;list[L2G](o2G + conf[e2G](file,i) + s9A + that[h3v][U8v][j2G] + M2G + i + P2G + v2G);});}else {var y2G=f9A;y2G+=d53;y2G+=w2v;y2G+=R9v;rendered[n7v](y2G + (conf[d9A] || N9A) + r3A);}}F7q.X0O();uploadMany[n9A](conf);conf[p2G][x25](G2G)[M95](J2G,[conf[m2G]]);},enable:function(conf){var x2G=d53;x2G+=G53;x2G+=J53;x2G+=d53;var t2G=p53;t2G+=Z7A;var R2G=Z73;R2G+=p4A;conf[R2G][x25](t2G)[x2G](l7A,m33);conf[k7A]=J33;},disable:function(conf){var S9A="enab";var Y2G=Z73;Y2G+=S9A;Y2G+=v93;Y2G+=w3ii[25714];var B2G=U53;B2G+=p53;B2G+=W53;B2G+=w3ii[25714];var h2G=Z73;h2G+=I33;h2G+=F4A;conf[h2G][B2G](A4A)[r7A](l7A,J33);conf[Y2G]=m33;},canReturnSubmit:function(conf,node){F7q.X0O();return m33;}});var datatable=$[w2G](J33,{},baseFieldType,{_addOptions:function(conf,options,append){var q2G=G53;q2G+=J53;q2G+=m53;q2G+=T13;F7q.H0O();var K2G=w3ii[25714];K2G+=i13;if(append === void v13){append=m33;}var dt=conf[K2G];if(!append){var A2G=p43;A2G+=v55;A2G+=G53;dt[A2G]();}dt[q2G][W63](options)[b9A]();},create:function(conf){var c9A="bel";var Z9A="ld_Type_datatabl";var U8A="<tab";var l9A="nfig";var L8A="foot";var j8A="<tfo";var M8A="ot>";var X9A="addOptions";var F9A="it.";var Y8A='user-select';var W8A="le>";var O9A="Sea";var r9A="tp";var i9A="00";var T9A=" class=\"DTE_Fie";var A8A="bmitComplete";var v8A="tableClass";var t8A='Label';var h8A='single';var o8A="tr>";var I9A="ote";var k8A="e_info\">";var R1G=Z73;R1G+=X9A;var W1G=J53;W1G+=d53;W1G+=N53;var U1G=d83;U1G+=l9A;var k1G=J53;k1G+=T13;var Z2G=O9A;Z2G+=G53;Z2G+=o4v;var T2G=U53;T2G+=p53;T2G+=k03;T2G+=r9A;var I2G=C63;I2G+=c9A;var b2G=I33;b2G+=F9A;b2G+=w3ii[25714];b2G+=i13;F7q.X0O();var S2G=J53;S2G+=W53;var n2G=w3ii[626273];n2G+=i9A;n2G+=h05;var N2G=m53;N2G+=Y1v;N2G+=i13;N2G+=P93;var a2G=z43;a2G+=I9A;a2G+=G53;var D2G=Q5A;D2G+=T9A;D2G+=Z9A;D2G+=k8A;var z2G=w3ii[621556];z2G+=d53;z2G+=C4v;var g2G=Q5A;g2G+=R9v;var C2G=U8A;C2G+=W8A;var Q2G=t43;Q2G+=w3ii[621556];Q2G+=f75;var E2G=C63;E2G+=R03;E2G+=r03;var _this=this;conf[h0A]=$[b33]({label:E2G,value:Q2G},conf[h0A]);var table=$(C2G);var container=$(g2G)[z2G](table);var side=$(D2G);if(conf[a2G]){var d2G=L8A;d2G+=x03;var f2G=w3ii[62535];f2G+=w3ii[621556];f2G+=d53;var s2G=r53;s2G+=o8A;var u2G=U53;u2G+=J53;u2G+=I9A;u2G+=G53;var H2G=b15;H2G+=e8A;H2G+=V3v;var V2G=j8A;V2G+=M8A;$(V2G)[n7v](Array[H2G](conf[u2G])?$(s2G)[n7v]($[f2G](conf[d2G],function(str){var P8A='<th>';return $(P8A)[e1v](str);})):conf[S45])[k63](table);}var dt=table[d05](datatable[v8A])[N2G](n2G)[S2G](b2G,function(e,settings){var R8A='div.dt-buttons';var p8A="ataTables_info";var y8A="div.d";var m8A='div.dataTables_filter';var i2G=y8A;i2G+=p8A;var F2G=w3ii[621556];F2G+=d53;F2G+=d53;F2G+=j53;var c2G=U53;c2G+=p53;c2G+=W53;c2G+=w3ii[25714];var r2G=R83;r2G+=n53;var O2G=K0v;O2G+=d53;O2G+=c13;O2G+=n53;var l2G=I33;l2G+=p53;l2G+=i13;var X2G=i13;X2G+=U5A;X2G+=c13;var api=new DataTable$2[K93](settings);var container=$(api[X2G](undefined)[G8A]());F7q.X0O();DataTable$2[J8A][l2G](api);side[O2G](container[r2G](m8A))[n7v](container[c2G](R8A))[F2G](container[x25](i2G));})[b43]($[b33]({buttons:[],columns:[{title:t8A,data:conf[h0A][I2G]}],deferRender:J33,dom:T2G,language:{search:I43,searchPlaceholder:Z2G,paginate:{next:s85,previous:x8A}},lengthChange:m33,select:{style:conf[E0A]?k1G:h8A}},conf[U1G]));this[I53](W1G,function(){var B8A="ju";F7q.H0O();var e1G=w3ii[621556];e1G+=w3ii[25714];e1G+=B8A;e1G+=r2v;var L1G=z2v;L1G+=G53;L1G+=v43;L1G+=P93;if(dt[L1G]()){var o1G=T13;o1G+=v55;o1G+=u83;o1G+=P93;dt[o1G](I43)[b9A]();}dt[l83][e1G]();});dt[I53](Y8A,function(){var w8A="iner";F7q.X0O();var j1G=y7v;j1G+=w3ii[621556];j1G+=w8A;_triggerChange($(conf[K8A][X83]()[j1G]()));});if(conf[O13]){var P1G=U6v;P1G+=A8A;var M1G=q1v;M1G+=p53;M1G+=i13;M1G+=D3v;conf[M1G][X83](dt);conf[O13][I53](P1G,function(e,json,data,action){var q8A="mpToFirst";var E8A='refresh';var m1G=Z73;m1G+=H3v;m1G+=t53;m1G+=q8A;var J1G=L53;J1G+=q73;J1G+=E73;var G1G=l93;G1G+=i13;if(action === e2v){var p1G=r03;p1G+=N53;p1G+=T33;p1G+=y93;var y1G=w3ii[25714];y1G+=C83;y1G+=w3ii[621556];var _loop_1=function(i){var v1G=G43;v1G+=v93;v1G+=v43;v1G+=i13;dt[a63](function(idx,d){return d === json[v83][i];})[v1G]();};for(var i=v13;i < json[y1G][p1G];i++){_loop_1(i);}}else if(action === G1G || action === J1G){_this[R3v](E8A);}datatable[m1G](conf);});}conf[K8A]=dt;datatable[R1G](conf,conf[m65] || []);return {input:container,side:side};},get:function(conf){var Q8A="arato";var C8A="option";var g8A="sPair";var z8A="pluck";var h1G=r0A;h1G+=Q8A;h1G+=G53;var x1G=C8A;x1G+=g8A;var t1G=G53;t1G+=J53;F7q.H0O();t1G+=m53;t1G+=T13;var rows=conf[K8A][t1G]({selected:J33})[v83]()[z8A](conf[x1G][n7A])[f0A]();return conf[h1G] || !conf[E0A]?rows[l55](conf[N0A] || j45):rows;},set:function(conf,val,localUpdate){var H8A="_jumpToFirst";var D8A="eselect";var a8A="epar";var V8A="ultipl";var E1G=D53;E1G+=m53;E1G+=T13;var q1G=w3ii[25714];q1G+=D8A;var A1G=P83;A1G+=T13;var K1G=p53;K1G+=T13;K1G+=e8A;K1G+=V3v;var Y1G=T13;Y1G+=a8A;Y1G+=C83;Y1G+=D3v;var B1G=w3ii[62535];B1G+=V8A;B1G+=c13;if(conf[B1G] && conf[Y1G] && !Array[T93](val)){var w1G=P95;w1G+=e9v;w1G+=i13;val=typeof val === U93?val[w1G](conf[N0A]):[];}else if(!Array[K1G](val)){val=[val];}var valueFn=dataGet(conf[h0A][n7A]);conf[K8A][A1G]({selected:J33})[q1G]();conf[K8A][E1G](function(idx,data,node){F7q.H0O();var Q1G=p53;Q1G+=C45;Q1G+=F13;Q1G+=k95;return val[Q1G](valueFn(data)) !== -y13;})[J8A]();datatable[H8A](conf);if(!localUpdate){_triggerChange($(conf[K8A][X83]()[G8A]()));}},update:function(conf,options,append){var d8A="stSet";var f8A="_la";var u8A="ont";var N8A="_addOption";var s8A="aine";var D1G=v43;D1G+=u8A;D1G+=s8A;D1G+=G53;var g1G=f8A;g1G+=d8A;F7q.X0O();var C1G=N8A;C1G+=T13;datatable[C1G](conf,options,append);var lastSet=conf[g1G];if(lastSet !== undefined){var z1G=T13;z1G+=I4v;datatable[z1G](conf,lastSet,J33);}_triggerChange($(conf[K8A][X83]()[D1G]()));},dt:function(conf){F7q.H0O();return conf[K8A];},tableClass:I43,_jumpToFirst:function(conf){var X8A="xes";var r8A="floor";var O8A='applied';var S8A='number';var l8A="page";var n8A="pplied";var S1G=d53;S1G+=P9v;var n1G=w3ii[25714];n1G+=i13;var H1G=p53;H1G+=C45;H1G+=F13;var V1G=w3ii[621556];V1G+=n8A;var a1G=G53;a1G+=J53;a1G+=m53;var idx=conf[K8A][a1G]({selected:J33,order:V1G})[H1G]();var page=v13;if(typeof idx === S8A){var N1G=T83;N1G+=b8A;N1G+=U53;var d1G=I33;d1G+=Q2v;d1G+=X8A;var f1G=w3ii[25714];f1G+=i13;var s1G=p53;s1G+=W53;s1G+=z43;var u1G=w3ii[25714];u1G+=i13;var pageLen=conf[u1G][l8A][s1G]()[J93];var pos=conf[f1G][a63]({order:O8A})[d1G]()[N1G](idx);page=pageLen > v13?Math[r8A](pos / pageLen):v13;}conf[n1G][S1G](page)[b9A](m33);}});var defaults={className:I43,compare:p33,data:I43,def:I43,entityDecode:J33,fieldInfo:I43,id:I43,label:I43,labelInfo:I43,name:p33,nullDefault:m33,type:e3A,message:I43,multiEditable:J33,submit:J33,getFormatter:p33,setFormatter:p33};var DataTable$1=$[Z43][k33];var Field=(function(){var q6A="abe";var B6A="ototyp";var J1V="enabled";var A6A="lInfo";var E6A="hid";var W1V="_type";F7q.H0O();var C6A="prototy";var U6A="oto";var j1V="ner";var h1V="_msg";var a6A="ieldI";var w6A="yp";var R6A="null";var G1V="sable";var z6A="isMul";var o6A="_err";var D6A="tiVa";var Y6A="rotot";var w1V="multiValue";var t5V="orm";var d1V="multiRestore";var z1V="isMultiValue";var v6A="dest";var E1V='input, select, textarea';var B1V="fieldError";var I5V="formatters";var v1V="enable";var I8A="Fn";var m6A="ototype";var c8A="defau";var r2V="hasClass";var k6A="heck";var K6A="messa";var T8A="proto";var P6A="totype";var e6A="orNode";var G6A="oty";var H6A="displaye";var V6A="otyp";var p6A="rototy";var L6A="typ";var y6A="oy";var h5V="host";var J6A="date";var Z8A="_multiVal";var A2V="int";var q1V="conta";var j6A="Reset";var I2V="_typeFn";var g5V="submittable";var h6A="otype";var g6A="totyp";var u1V="labelInfo";var t6A="efaul";var Q6A="ototy";var k1V="lt";var M6A="protot";var i8A="_t";var B5V="slideDown";var x6A="prot";var E5V="multiInfoShown";var n3G=c8A;n3G+=F8A;var s3G=i8A;s3G+=q03;s3G+=R7v;s3G+=I8A;var u3G=T8A;u3G+=c7v;u3G+=R7v;var J3G=Z8A;J3G+=t53;J3G+=X4A;J3G+=k6A;var U3G=Z73;U3G+=w3ii[62535];U3G+=T13;U3G+=T33;var k3G=v9v;k3G+=U6A;k3G+=i13;k3G+=t2v;var F4G=Z73;F4G+=U8v;F4G+=C83;var c4G=d53;c4G+=W6A;c4G+=L6A;c4G+=c13;var r4G=o6A;r4G+=e6A;var O4G=S55;O4G+=c13;var b4G=n0A;b4G+=j6A;var N4G=M6A;N4G+=t2v;var s4G=v5A;s4G+=P6A;var D4G=v6A;D4G+=G53;D4G+=y6A;var z4G=M6A;z4G+=t2v;var C4G=t35;C4G+=u83;var Q4G=d53;Q4G+=p6A;Q4G+=R7v;var q4G=m45;q4G+=P65;q4G+=c13;var K4G=t43;K4G+=w3ii[621556];K4G+=r03;var w4G=v5A;w4G+=i13;w4G+=G6A;w4G+=R7v;var h4G=y05;h4G+=J6A;var x4G=d53;x4G+=G53;x4G+=m6A;var p4G=v5A;p4G+=P6A;var d0G=R6A;d0G+=B73;d0G+=t6A;d0G+=i13;var s0G=W53;s0G+=C5v;s0G+=c13;var u0G=x6A;u0G+=h6A;var V0G=w1v;V0G+=w3ii[62535];V0G+=c13;var a0G=v9v;a0G+=B6A;a0G+=c13;var q0G=w3ii[62535];q0G+=n95;q0G+=w4v;q0G+=g0A;var K0G=d53;K0G+=Y6A;K0G+=w6A;K0G+=c13;var R0G=K6A;R0G+=H73;var m0G=x6A;m0G+=h6A;var J0G=s75;J0G+=A6A;var M0G=r03;M0G+=q6A;M0G+=r03;var j0G=x6A;j0G+=h6A;var k0G=E6A;k0G+=c13;var i7G=T33;i7G+=c13;i7G+=i13;var F7G=d53;F7G+=p6A;F7G+=R7v;var O7G=U75;O7G+=t53;O7G+=T13;var l7G=v9v;l7G+=Q6A;l7G+=R7v;var d7G=C6A;d7G+=R7v;var H7G=d53;H7G+=D53;H7G+=g6A;H7G+=c13;var a7G=z6A;a7G+=D6A;a7G+=f75;var D7G=T8A;D7G+=i13;D7G+=t2v;var C7G=U53;C7G+=a6A;C7G+=e55;var Q7G=v5A;Q7G+=i13;Q7G+=V6A;Q7G+=c13;var Y7G=x03;Y7G+=G53;Y7G+=D3v;var B7G=v9v;B7G+=U6A;B7G+=c7v;B7G+=R7v;var P7G=H6A;P7G+=w3ii[25714];var U7G=V25;U7G+=O53;var I5G=w3ii[25714];I5G+=c13;I5G+=U53;function Field(options,classes,host){var C2V='DTE_Field_';var f6A="ulti-v";var q2V="ernalI18n";var c6A="o\" class=\"";var m2V="abelInfo";var L2V="Res";var v2V="inputContr";var X2V='input-control';var w2V="defa";var o2V="tore";var B2V="pePre";var M2V="tit";var l6A="ms";var R2V="<label data-dte-e=\"label";var k2V="ta-dte";var l2V='msg-multi';var O2V='field-processing';var G2V="/l";var Y2V="fix";var u6A="multiRetu";var p2V=" data-dte-e=\"input\" ";var H2V='<div data-dte-e="input-control" class="';var T6A="msg";var Z6A="<div da";var W2V="or\" class=\"";var b6A="_ty";var f2V="restore";var F6A="msg-";var n6A="-erro";var Q2V='Error adding field - unknown field type ';var K2V="ult";var s2V='<span data-dte-e="multi-info" class="';var d2V='<div data-dte-e="msg-message" class="';var N2V='<div data-dte-e="field-processing" class="';var h2V="am";var e2V="<div data-dte-e=\"msg-m";var j2V="ulti\" class=\"";var N6A="sg";var O6A="g-inf";var r6A="<div data-dte-e=\"msg-inf";var b2V="t-control";F7q.X0O();var D2V='" for="';var d6A="msg-messa";var u2V='<div data-dte-e="multi-value" class="';var S6A="g-info";var J2V="abel>";var x2V="Na";var X6A="ldInfo";var y2V="ol";var I6A="\"><";var U2V="-e=\"msg-err";var V2V='msg-label';var S2V="side";var a2V='<div data-dte-e="msg-label" class="';var P2V="tiValue";var z2V="namePrefix";var s6A="ti-i";var r5G=c7v;r5G+=R7v;var O5G=c13;O5G+=w3ii[621556];O5G+=o4v;var X5G=u6A;X5G+=U85;var b5G=v43;b5G+=r03;b5G+=u3A;b5G+=x83;var S5G=w3ii[25714];S5G+=a5v;var n5G=w65;n5G+=r03;n5G+=s6A;n5G+=e55;var N5G=w3ii[62535];N5G+=f6A;N5G+=w3ii[621556];N5G+=f75;var d5G=d6A;d5G+=H73;var f5G=w3ii[62535];f5G+=N6A;f5G+=n6A;f5G+=G53;var s5G=w3ii[62535];s5G+=T13;s5G+=S6A;var u5G=w3ii[621556];u5G+=d53;u5G+=R7v;u5G+=n53;var H5G=w3ii[25714];H5G+=J53;H5G+=w3ii[62535];var g5G=T13;g5G+=p53;g5G+=w3ii[25714];g5G+=c13;var C5G=b6A;C5G+=d53;C5G+=G65;C5G+=W53;var Q5G=E5A;Q5G+=p53;Q5G+=t43;Q5G+=R9v;var E5G=r53;E5G+=c53;var q5G=e25;q5G+=X6A;var A5G=l6A;A5G+=O6A;A5G+=J53;var K5G=r6A;K5G+=c6A;var w5G=z5A;w5G+=R9v;var Y5G=c45;Y5G+=c13;var B5G=F6A;B5G+=k53;B5G+=i6A;var h5G=I6A;h5G+=c53;var x5G=T6A;x5G+=z2A;x5G+=e1A;x5G+=G53;var t5G=Z6A;t5G+=k2V;t5G+=U2V;t5G+=W2V;var R5G=n0A;R5G+=L2V;R5G+=o2V;var m5G=e2V;m5G+=j2V;var J5G=I33;J5G+=z43;var G5G=M2V;G5G+=v93;var p5G=m55;p5G+=P2V;var y5G=v2V;y5G+=y2V;var v5G=c33;v5G+=R9v;var P5G=p53;P5G+=W53;P5G+=d53;P5G+=h5A;var M5G=Q5A;M5G+=p2V;M5G+=v43;M5G+=a5A;var j5G=r53;j5G+=G2V;j5G+=J2V;var e5G=r03;e5G+=m2V;var o5G=c33;o5G+=R9v;var L5G=C63;L5G+=R53;L5G+=c13;L5G+=r03;var W5G=r03;W5G+=q6A;W5G+=r03;var U5G=R2V;U5G+=t2V;var k5G=c33;k5G+=R9v;var Z1G=k6v;Z1G+=o63;Z1G+=x2V;Z1G+=k53;var T1G=W53;T1G+=h2V;T1G+=c13;var I1G=c7v;I1G+=B2V;I1G+=Y2V;var i1G=w3ii[25714];i1G+=w3ii[621556];i1G+=i13;i1G+=w3ii[621556];var F1G=w3ii[25714];F1G+=w3ii[621556];F1G+=i13;F1G+=w3ii[621556];var r1G=i13;r1G+=q03;r1G+=d53;r1G+=c13;var l1G=w2V;l1G+=K2V;l1G+=T13;var X1G=c13;X1G+=F13;X1G+=S53;X1G+=n53;var b1G=A2V;b1G+=q2V;var that=this;var multiI18n=host[b1G]()[n0A];var opts=$[X1G](J33,{},Field[l1G],options);if(!Editor[E2V][opts[b1v]]){var O1G=L6A;O1G+=c13;throw new Error(Q2V + opts[O1G]);}this[T13]={classes:classes,host:host,multiIds:[],multiValue:m33,multiValues:{},name:opts[I93],opts:opts,processing:m33,type:Editor[E2V][opts[r1G]]};if(!opts[Y1v]){var c1G=W53;c1G+=w3ii[621556];c1G+=k53;opts[Y1v]=C2V + opts[c1G];}if(opts[F1G] === I43){opts[v83]=opts[I93];}this[j1v]=function(d){F7q.X0O();var g2V='editor';return dataGet(opts[v83])(d,g2V);};this[l1v]=dataSet(opts[i1G]);var template=$(r9v + classes[c5v] + j6v + classes[I1G] + opts[b1v] + j6v + classes[z2V] + opts[T1G] + j6v + opts[Z1G] + k5G + U5G + classes[W5G] + D2V + Editor[T7A](opts[Y1v]) + l9v + opts[L5G] + a2V + classes[V2V] + o5G + opts[e5G] + V0v + j5G + M5G + classes[P5G] + v5G + H2V + classes[y5G] + c9v + u2V + classes[p5G] + l9v + multiI18n[G5G] + s2V + classes[s65] + l9v + multiI18n[J5G] + r3A + V0v + m5G + classes[R5G] + l9v + multiI18n[f2V] + V0v + t5G + classes[x5G] + h5G + d2V + classes[B5G] + l9v + opts[Y5G] + w5G + K5G + classes[A5G] + l9v + opts[q5G] + E5G + Q5G + N2V + classes[c1v] + n2V + V0v);var input=this[C5G](e2v,opts);var side=p33;if(input && input[g5G]){side=input[S2V];input=input[p4A];}if(input !== p33){var D5G=F8v;D5G+=d53;D5G+=c13;D5G+=n53;var z5G=j0A;z5G+=b2V;el(z5G,template)[D5G](input);}else {var V5G=x65;V5G+=c13;var a5G=L0v;a5G+=o0v;a5G+=w3ii[621556];a5G+=q03;template[F5v](a5G,V5G);}this[H5G]={container:template,inputControl:el(X2V,template),label:el(k25,template)[u5G](side),fieldInfo:el(s5G,template),labelInfo:el(V2V,template),fieldError:el(f5G,template),fieldMessage:el(d5G,template),multi:el(N5G,template),multiReturn:el(l2V,template),multiInfo:el(n5G,template),processing:el(O2V,template)};this[S5G][n0A][I53](b5G,function(){F7q.X0O();var c2V='readonly';if(that[T13][j75][Q65] && !template[r2V](classes[p5v]) && opts[b1v] !== c2V){that[h25](I43);that[y75]();}});this[Z9v][X5G][I53](T85,function(){var F2V="Restore";var l5G=n0A;F7q.X0O();l5G+=F2V;that[l5G]();});$[O5G](this[T13][r5G],function(name,fn){F7q.X0O();if(typeof fn === w3ii[27150] && that[name] === undefined){that[name]=function(){var i2V="ft";var i5G=I95;i5G+=T13;i5G+=T6v;i5G+=i2V;var F5G=v43;F5G+=w3ii[621556];F5G+=r03;F5G+=r03;var c5G=d53;F7q.H0O();c5G+=p6A;c5G+=R7v;var args=Array[c5G][b55][F5G](arguments);args[i5G](name);var ret=that[I2V][b9v](that,args);return ret === undefined?that:ret;};}});}Field[T2V][I5G]=function(set){var U1V='default';var k7G=w3ii[25714];k7G+=c13;k7G+=U53;var opts=this[T13][j75];if(set === undefined){var Z5G=U53;Z5G+=I95;Z5G+=e83;Z5G+=y03;var T5G=w3ii[25714];T5G+=c13;T5G+=Z2V;T5G+=k1V;var def=opts[T5G] !== undefined?opts[U1V]:opts[q3v];return typeof def === Z5G?def():def;}opts[k7G]=set;return this;};Field[T2V][U7G]=function(){var e1V="tai";var L1V="asses";var o1V="ddClas";var M7G=V25;M7G+=O53;var j7G=W1V;j7G+=I8A;var e7G=v43;e7G+=r03;e7G+=L1V;var o7G=w3ii[621556];o7G+=o1V;o7G+=T13;var L7G=G03;L7G+=e1V;L7G+=j1V;var W7G=w3ii[25714];W7G+=J53;W7G+=w3ii[62535];this[W7G][L7G][o7G](this[T13][e7G][p5v]);this[j7G](M7G);return this;};Field[T2V][P7G]=function(){var P1V="parents";var M1V="contain";var p7G=B2v;p7G+=M1v;p7G+=P93;var y7G=R53;y7G+=J53;y7G+=N7v;var v7G=M1V;v7G+=x03;var container=this[Z9v][v7G];return container[P1V](y7G)[p7G] && container[F5v](h65) != N63?J33:m33;};Field[T2V][v1V]=function(toggle){var p1V="moveClas";var y1V="disab";var t7G=W1V;t7G+=Y2A;t7G+=W53;var R7G=y1V;R7G+=T63;var m7G=L53;m7G+=p1V;m7G+=T13;var J7G=w3ii[25714];J7G+=J53;J7G+=w3ii[62535];if(toggle === void v13){toggle=J33;}if(toggle === m33){var G7G=u53;G7G+=G1V;return this[G7G]();}this[J7G][G8A][m7G](this[T13][h3v][R7G]);this[t7G](P25);return this;};Field[T2V][J1V]=function(){var h7G=w3ii[25714];h7G+=p53;h7G+=G1V;h7G+=w3ii[25714];F7q.X0O();var x7G=w3ii[25714];x7G+=J53;x7G+=w3ii[62535];return this[x7G][G8A][r2V](this[T13][h3v][h7G]) === m33;};Field[B7G][Y7G]=function(msg,fn){var t1V="contai";var x1V='errorMessage';var R1V="Clas";var m1V="rro";var E7G=Z73;E7G+=L6A;E7G+=G65;E7G+=W53;var classes=this[T13][h3v];if(msg){var K7G=c13;K7G+=m1V;K7G+=G53;var w7G=w3ii[621556];w7G+=D93;w7G+=R1V;w7G+=T13;this[Z9v][G8A][w7G](classes[K7G]);}else {var q7G=x03;q7G+=D53;q7G+=G53;var A7G=t1V;A7G+=j1V;this[Z9v][A7G][u93](classes[q7G]);}this[E7G](x1V,msg);return this[h1V](this[Z9v][B1V],msg,fn);};Field[Q7G][C7G]=function(msg){var Y1V="dInfo";var z7G=P15;F7q.X0O();z7G+=Y1V;var g7G=j55;g7G+=w3ii[62535];return this[h1V](this[g7G][z7G],msg);};Field[D7G][a7G]=function(){var V7G=B3v;V7G+=p53;F7q.H0O();V7G+=a4A;V7G+=T13;return this[T13][w1V] && this[T13][V7G][J93] !== y13;};Field[H7G][w75]=function(){F7q.H0O();var K1V="class";var A1V="Cl";var f7G=K1V;f7G+=c13;f7G+=T13;var s7G=P93;s7G+=Q9v;s7G+=A1V;s7G+=h85;var u7G=q1V;u7G+=p53;u7G+=W53;u7G+=x03;return this[Z9v][u7G][s7G](this[T13][f7G][N93]);};Field[d7G][p4A]=function(){var X7G=q1V;X7G+=V15;X7G+=G53;var b7G=w3ii[25714];b7G+=a5v;var S7G=e7A;S7G+=t53;S7G+=i13;var n7G=i8A;n7G+=w6A;n7G+=G65;n7G+=W53;var N7G=L6A;N7G+=c13;return this[T13][N7G][p4A]?this[n7G](S7G):$(E1V,this[b7G][X7G]);};Field[l7G][O7G]=function(){var Q1V="ainer";var r7G=U53;r7G+=J53;r7G+=v85;r7G+=T13;F7q.X0O();if(this[T13][b1v][r7G]){this[I2V](v33);}else {var c7G=y7v;c7G+=Q1V;$(E1V,this[Z9v][c7G])[y75]();}return this;};Field[F7G][i7G]=function(){var D1V='get';var g1V="rmatter";var C1V="tF";var Z7G=H73;Z7G+=C1V;Z7G+=J53;Z7G+=g1V;var T7G=J53;T7G+=d53;T7G+=C1v;F7q.X0O();var I7G=Z73;I7G+=U53;I7G+=W7v;I7G+=i13;if(this[z1V]()){return undefined;}return this[I7G](this[I2V](D1V),this[T13][T7G][Z7G]);};Field[T2V][k0G]=function(animate){var a1V="ideU";var V1V="ain";var H1V="slideUp";var L0G=T13;L0G+=r03;L0G+=a1V;L0G+=d53;var W0G=P93;W0G+=J53;W0G+=T13;W0G+=i13;var U0G=y7v;U0G+=V1V;U0G+=x03;var el=this[Z9v][U0G];if(animate === undefined){animate=J33;}if(this[T13][W0G][p0v]() && animate && $[Z43][L0G]){el[H1V]();}else {var e0G=u53;e0G+=g3v;e0G+=A63;var o0G=v43;o0G+=T13;o0G+=T13;el[o0G](e0G,N63);}return this;};Field[j0G][M0G]=function(str){var G0G=K0v;F7q.H0O();G0G+=C4v;var p0G=P93;p0G+=i13;p0G+=G5A;var v0G=r03;v0G+=z63;v0G+=c13;v0G+=r03;var P0G=j55;P0G+=w3ii[62535];var label=this[P0G][v0G];var labelInfo=this[Z9v][u1V][M7v]();if(str === undefined){var y0G=P93;y0G+=i13;y0G+=w3ii[62535];y0G+=r03;return label[y0G]();}label[p0G](str);label[G0G](labelInfo);return this;};Field[T2V][J0G]=function(msg){F7q.X0O();return this[h1V](this[Z9v][u1V],msg);};Field[m0G][R0G]=function(msg,fn){var s1V="dMessage";var x0G=P15;x0G+=s1V;var t0G=j55;t0G+=w3ii[62535];return this[h1V](this[t0G][x0G],msg,fn);};Field[T2V][t55]=function(id){var f1V="tiValues";F7q.X0O();var B0G=n0A;B0G+=X63;var h0G=m55;h0G+=f1V;var value;var multiValues=this[T13][h0G];var multiIds=this[T13][B0G];var isMultiValue=this[z1V]();if(id === undefined){var Y0G=t43;Y0G+=w3ii[621556];Y0G+=r03;var fieldVal=this[Y0G]();value={};for(var i=v13;i < multiIds[J93];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {var w0G=t43;w0G+=r1v;value=this[w0G]();}return value;};Field[K0G][d1V]=function(){var N1V="iVal";var n1V="_multiValueCheck";var A0G=w65;A0G+=k1V;A0G+=N1V;F7q.X0O();A0G+=u75;this[T13][A0G]=J33;this[n1V]();};Field[T2V][q0G]=function(id,val){var X1V="multiV";var b1V="sPlain";var S1V="ultiValueCheck";var l1V="alues";var D0G=i25;D0G+=S1V;var g0G=p53;g0G+=b1V;g0G+=b8A;g0G+=b93;var Q0G=n0A;Q0G+=a4A;Q0G+=T13;var E0G=X1V;E0G+=l1V;var that=this;var multiValues=this[T13][E0G];var multiIds=this[T13][Q0G];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){var r1V="setFormatter";var O1V="_format";var C0G=p53;C0G+=m6v;C0G+=A63;if($[C0G](idSrc,multiIds) === -y13){multiIds[l33](idSrc);}multiValues[idSrc]=that[O1V](val,that[T13][j75][r1V]);};if($[g0G](val) && id === undefined){$[M93](val,function(idSrc,innerVal){F7q.H0O();set(idSrc,innerVal);});}else if(id === undefined){var z0G=v55;z0G+=v43;z0G+=P93;$[z0G](multiIds,function(i,idSrc){F7q.X0O();set(idSrc,val);});}else {set(id,val);}this[T13][w1V]=J33;this[D0G]();return this;};Field[a0G][V0G]=function(){var H0G=s6v;H0G+=T13;F7q.X0O();return this[T13][H0G][I93];};Field[u0G][s0G]=function(){var f0G=q1V;f0G+=p53;f0G+=W53;f0G+=x03;return this[Z9v][f0G][v13];};Field[T2V][d0G]=function(){var c1V="ullDef";F7q.X0O();var F1V="au";var n0G=W53;n0G+=c1V;n0G+=F1V;n0G+=k1V;var N0G=J53;N0G+=d53;N0G+=i13;N0G+=T13;return this[T13][N0G][n0G];};Field[T2V][c1v]=function(set){var T1V="lEvent";var i1V="-field";var Z1V="hos";var I1V="nterna";var W5V="ssing";var F0G=c1v;F0G+=i1V;var c0G=p53;c0G+=I1V;c0G+=T1V;var r0G=Z1V;r0G+=i13;var O0G=v5A;O0G+=v43;F7q.H0O();O0G+=k5V;O0G+=R1v;var l0G=W53;l0G+=J53;l0G+=W53;l0G+=c13;var X0G=R53;X0G+=r03;X0G+=R8v;X0G+=x83;var b0G=j55;b0G+=w3ii[62535];if(set === undefined){var S0G=U5V;S0G+=W5V;return this[T13][S0G];}this[b0G][c1v][F5v](h65,set?X0G:l0G);this[T13][O0G]=set;this[T13][r0G][c0G](F0G,[set]);return this;};Field[T2V][w3v]=function(val,multiCheck){var R5V="atter";var e5V="ecode";var L5V="enti";var J5V="_multiValue";var x5V="_typeF";var o5V="tyD";var G5V="rray";var m5V="setFor";var U4G=L5V;U4G+=o5V;U4G+=e5V;if(multiCheck === void v13){multiCheck=J33;}var decodeFn=function(d){var P5V='"';var j5V="lac";var v5V='£';var p5V='\n';var M5V="repla";var y5V='\'';var k4G=h45;k4G+=j5V;k4G+=c13;var Z0G=L53;Z0G+=j1A;Z0G+=v43;Z0G+=c13;var T0G=M5V;T0G+=c83;var I0G=L53;I0G+=d53;I0G+=N85;var i0G=c0A;i0G+=p53;i0G+=W53;i0G+=T33;return typeof d !== i0G?d:d[I0G](/&gt;/g,s85)[T0G](/&lt;/g,x8A)[k93](/&amp;/g,V45)[k93](/&quot;/g,P5V)[Z0G](/&#163;/g,v5V)[k4G](/&#39;/g,y5V)[k93](/&#10;/g,p5V);};this[T13][w1V]=m33;var decode=this[T13][j75][U4G];if(decode === undefined || decode === J33){var W4G=p53;W4G+=T13;W4G+=f53;W4G+=G5V;if(Array[W4G](val)){var L4G=r03;L4G+=c13;L4G+=W53;L4G+=Y2v;for(var i=v13,ien=val[L4G];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}if(multiCheck === J33){var P4G=J5V;P4G+=o43;P4G+=k6A;var M4G=G43;M4G+=i13;var j4G=m5V;j4G+=w3ii[62535];j4G+=R5V;var e4G=J53;e4G+=d53;e4G+=i13;e4G+=T13;var o4G=L93;o4G+=t5V;o4G+=w3ii[621556];o4G+=i13;val=this[o4G](val,this[T13][e4G][j4G]);this[I2V](M4G,val);this[P4G]();}else {var y4G=G43;y4G+=i13;var v4G=x5V;v4G+=W53;this[v4G](y4G,val);}return this;};Field[p4G][J75]=function(animate,toggle){var m4G=U53;m4G+=W53;var J4G=u53;J4G+=P95;J4G+=C63;J4G+=q03;var G4G=w3ii[25714];G4G+=J53;G4G+=w3ii[62535];if(animate === void v13){animate=J33;}if(toggle === void v13){toggle=J33;}if(toggle === m33){return this[y15](animate);}var el=this[G4G][G8A];if(this[T13][h5V][J4G]() && animate && $[m4G][B5V]){el[B5V]();}else {var t4G=L0v;t4G+=W0v;var R4G=v43;R4G+=T13;R4G+=T13;el[R4G](t4G,I43);;}return this;};Field[x4G][h4G]=function(options,append){var Y5V="upda";var B4G=Y5V;B4G+=S53;if(append === void v13){append=m33;}F7q.X0O();if(this[T13][b1v][B4G]){var Y4G=t53;Y4G+=d53;Y4G+=M2v;Y4G+=c13;this[I2V](Y4G,options,append);}return this;};Field[w4G][K4G]=function(val){var A4G=T13;F7q.X0O();A4G+=c13;A4G+=i13;return val === undefined?this[D8v]():this[A4G](val);};Field[T2V][q4G]=function(value,original){var w5V="compare";var E4G=s6v;E4G+=T13;var compare=this[T13][E4G][w5V] || deepCompare;return compare(value,original);};Field[Q4G][C4G]=function(){F7q.X0O();var g4G=J53;g4G+=L75;g4G+=T13;return this[T13][g4G][v83];};Field[z4G][D4G]=function(){var K5V="estro";var A5V="containe";var u4G=w3ii[25714];u4G+=K5V;u4G+=q03;var H4G=i8A;H4G+=t2v;H4G+=I8A;var V4G=A5V;V4G+=G53;var a4G=w3ii[25714];a4G+=J53;a4G+=w3ii[62535];this[a4G][V4G][k2v]();this[H4G](u4G);return this;};Field[s4G][Q65]=function(){var q5V="multiEd";var d4G=q5V;d4G+=Z03;d4G+=Z63;var f4G=J53;f4G+=d53;f4G+=i13;f4G+=T13;return this[T13][f4G][d4G];};Field[N4G][r35]=function(){F7q.X0O();return this[T13][r35];};Field[T2V][E5V]=function(show){var Q5V="blo";var S4G=Q5V;S4G+=h43;var n4G=v43;n4G+=T13;n4G+=T13;this[Z9v][s65][n4G]({display:show?S4G:N63});};Field[T2V][b4G]=function(){var C5V="multiValues";this[T13][r35]=[];F7q.X0O();this[T13][C5V]={};};Field[T2V][g5V]=function(){var l4G=U6v;l4G+=x75;F7q.H0O();var X4G=J53;X4G+=d53;X4G+=i13;X4G+=T13;return this[T13][X4G][l4G];};Field[O4G][r4G]=function(){F7q.X0O();return this[Z9v][B1V];};Field[c4G][F4G]=function(val,formatter){var z5V="ters";if(formatter){if(Array[T93](formatter)){var Z4G=q4v;Z4G+=m2A;var T4G=U53;T4G+=t5V;T4G+=C83;T4G+=z5V;var I4G=E3v;I4G+=p53;I4G+=U53;I4G+=i13;var i4G=b85;i4G+=c83;var args=formatter[i4G]();var name=args[I4G]();formatter=Field[T4G][name][Z4G](this,args);}return formatter[S63](this[T13][h5V],val,this);}return val;};Field[k3G][U3G]=function(el,msg,fn){var V5V="internalSettings";var H5V="deU";var a5V="tm";var D5V="si";var M3G=U53;M3G+=W53;var j3G=N83;j3G+=p53;j3G+=D5V;F7q.X0O();j3G+=O53;var e3G=p53;e3G+=T13;var o3G=P65;o3G+=c13;o3G+=W53;o3G+=i13;if(msg === undefined){var W3G=P93;W3G+=a5V;W3G+=r03;return el[W3G]();}if(typeof msg === w3ii[27150]){var L3G=P93;L3G+=J53;L3G+=T13;L3G+=i13;var editor=this[T13][L3G];msg=msg(editor,new DataTable$1[K93](editor[V5V]()[X83]));}if(el[o3G]()[e3G](j3G) && $[M3G][J0v]){var P3G=P93;P3G+=i13;P3G+=G5A;el[P3G](msg);if(msg){el[B5V](fn);;}else {var v3G=T13;v3G+=e9v;v3G+=H5V;v3G+=d53;el[v3G](fn);}}else {var G3G=R53;G3G+=r03;G3G+=J53;G3G+=h43;var p3G=v43;p3G+=T13;p3G+=T13;var y3G=M43;y3G+=G5A;el[y3G](msg || I43)[p3G](h65,msg?G3G:N63);if(fn){fn();}}return this;};Field[T2V][J3G]=function(){var n5V="ernal";var u5V="inter";var N5V="iInfo";var X5V="ultiI";var r5V="multiReturn";var O5V="ulti";var F5V="multiNoEdit";var d5V="noMult";var l5V="inputControl";var b5V="ltiValu";var S5V="I18";var s5V="alMultiInfo";var H3G=u5V;H3G+=W53;H3G+=s5V;var V3G=v43;V3G+=f5V;var a3G=w65;a3G+=r03;a3G+=i13;a3G+=p53;var D3G=w3ii[25714];D3G+=a5v;var z3G=d5V;z3G+=p53;var g3G=Y65;g3G+=r03;var C3G=m55;C3G+=i13;C3G+=N5V;var Q3G=w3ii[25714];Q3G+=J53;Q3G+=w3ii[62535];var E3G=w65;E3G+=k1V;E3G+=p53;var q3G=A2V;q3G+=n5V;q3G+=S5V;q3G+=W53;var A3G=v93;A3G+=W53;A3G+=T33;A3G+=y93;var K3G=v43;K3G+=T13;K3G+=T13;var t3G=T7v;t3G+=C1v;var R3G=w65;R3G+=b5V;R3G+=c13;R3G+=T13;var m3G=w3ii[62535];m3G+=X5V;m3G+=E83;var last;var ids=this[T13][m3G];var values=this[T13][R3G];var isMultiValue=this[T13][w1V];var isMultiEditable=this[T13][t3G][Q65];var val;var different=m33;if(ids){for(var i=v13;i < ids[J93];i++){val=values[ids[i]];if(i > v13 && !deepCompare(val,last)){different=J33;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[z1V]()){var x3G=v43;x3G+=T13;x3G+=T13;this[Z9v][l5V][x3G]({display:N63});this[Z9v][n0A][F5v]({display:G0v});}else {var Y3G=g35;Y3G+=f15;var B3G=w3ii[62535];B3G+=O5V;var h3G=w3ii[25714];h3G+=J53;h3G+=w3ii[62535];this[Z9v][l5V][F5v]({display:G0v});this[h3G][B3G][F5v]({display:Y3G});if(isMultiValue && !different){var w3G=G43;w3G+=i13;this[w3G](last,m33);}}this[Z9v][r5V][K3G]({display:ids && ids[A3G] > y13 && different && !isMultiValue?G0v:N63});var i18n=this[T13][h5V][q3G]()[E3G];this[Q3G][C3G][g3G](isMultiEditable?i18n[c5V]:i18n[z3G]);this[D3G][a3G][k15](this[T13][V3G][F5V],!isMultiEditable);this[T13][h5V][H3G]();return J33;};Field[u3G][s3G]=function(name){var i5V="shift";var d3G=i13;d3G+=t2v;var f3G=I95;f3G+=i5V;F7q.H0O();var args=[];for(var _i=y13;_i < arguments[J93];_i++){args[_i - y13]=arguments[_i];}args[f3G](this[T13][j75]);var fn=this[T13][d3G][name];if(fn){var N3G=P93;N3G+=J53;N3G+=T13;N3G+=i13;return fn[b9v](this[T13][N3G],args);}};Field[n3G]=defaults;Field[I5V]={};return Field;})();var button={action:p33,className:p33,tabIndex:v13,text:p33};var displayController={close:function(){},init:function(){},open:function(){},node:function(){}};var DataTable=$[S3G][k33];var apiRegister=DataTable[b3G][T5V];function __getInst(api){var Z5V="context";var k7V="oInit";var X3G=t15;X3G+=u1A;X3G+=D3v;var ctx=api[Z5V][v13];return ctx[k7V][O13] || ctx[X3G];}function __setBasic(inst,opts,type,plural){var o7V="fir";var U7V="butto";var e7V=/%d/;var r3G=k53;r3G+=T13;r3G+=T13;r3G+=P9v;if(!opts){opts={};}if(opts[J35] === undefined){var l3G=U7V;l3G+=E63;opts[l3G]=N33;}if(opts[o8v] === undefined){var O3G=W7V;O3G+=L7V;O3G+=W53;opts[o8v]=inst[O3G][type][o8v];}if(opts[r3G] === undefined){var c3G=L53;c3G+=M53;if(type === c3G){var i3G=L53;i3G+=d53;i3G+=N85;var F3G=G03;F3G+=o7V;F3G+=w3ii[62535];var confirm=inst[n4v][type][F3G];opts[P55]=plural !== y13?confirm[Z73][i3G](e7V,plural):confirm[P0v];}else {opts[P55]=I43;}}return opts;}apiRegister(I3G,function(){F7q.X0O();return __getInst(this);});apiRegister(j7V,function(opts){var Z3G=v43;Z3G+=K5v;var T3G=u05;T3G+=Q2A;var inst=__getInst(this);inst[T3G](__setBasic(inst,opts,Z3G));F7q.X0O();return this;});apiRegister(M7V,function(opts){var inst=__getInst(this);inst[S3v](this[v13][v13],__setBasic(inst,opts,j2v));return this;});apiRegister(k9G,function(opts){var inst=__getInst(this);F7q.H0O();inst[S3v](this[v13],__setBasic(inst,opts,j2v));return this;});apiRegister(U9G,function(opts){var L9G=L53;F7q.X0O();L9G+=w3ii[62535];L9G+=J53;L9G+=E73;var W9G=L53;W9G+=w3ii[62535];W9G+=i05;W9G+=c13;var inst=__getInst(this);inst[W9G](this[v13][v13],__setBasic(inst,opts,L9G,y13));return this;});apiRegister(o9G,function(opts){var M9G=r03;M9G+=Z93;var j9G=m63;j9G+=R63;var e9G=L53;e9G+=M53;var inst=__getInst(this);inst[e9G](this[v13],__setBasic(inst,opts,j9G,this[v13][M9G]));F7q.X0O();return this;});apiRegister(P7V,function(type,opts){if(!type){type=A85;}else if($[Y25](type)){var P9G=R15;P9G+=f15;opts=type;type=P9G;}__getInst(this)[type](this[v13][v13],opts);return this;});apiRegister(v7V,function(opts){__getInst(this)[k9v](this[v13],opts);F7q.X0O();return this;});apiRegister(v9G,file);apiRegister(y9G,files);$(document)[p9G](y7V,function(e,ctx,json){var J7V="iles";var G7V="mespa";var p7V="ile";var m9G=U53;m9G+=p7V;m9G+=T13;var J9G=w3ii[25714];J9G+=i13;F7q.X0O();var G9G=W53;G9G+=w3ii[621556];G9G+=G7V;G9G+=c83;if(e[G9G] !== J9G){return;}if(json && json[m9G]){var R9G=U53;R9G+=J7V;$[M93](json[R9G],function(name,files){var h9G=U53;h9G+=p7V;h9G+=T13;var x9G=e53;x9G+=j53;F7q.X0O();var t9G=R83;t9G+=r03;t9G+=c13;t9G+=T13;if(!Editor[t9G][name]){Editor[g05][name]={};}$[x9G](Editor[h9G][name],files);});}});var _buttons=$[B9G][k33][Y9G][J35];$[w9G](_buttons,{create:{text:function(dt,node,config){var R7V=".create";var Q9G=T3v;Q9G+=i13;Q9G+=d1v;Q9G+=W53;var E9G=p53;F7q.H0O();E9G+=w3ii[626273];E9G+=L7V;E9G+=W53;var q9G=m7V;q9G+=G53;var A9G=J35;A9G+=R7V;var K9G=p53;K9G+=w3ii[626273];K9G+=L7V;K9G+=W53;return dt[K9G](A9G,config[q9G][E9G][D6v][Q9G]);},className:t7V,editor:p33,formButtons:{text:function(editor){var C9G=v43;F7q.H0O();C9G+=G53;C9G+=c13;C9G+=F15;return editor[n4v][C9G][l8v];},action:function(e){var g9G=U6v;g9G+=x75;this[g9G]();}},formMessage:p33,formOptions:{},formTitle:p33,action:function(e,dt,node,config){var Y7V="preOpe";var h7V="formButto";var f9G=u05;f9G+=v55;f9G+=S53;var s9G=p53;s9G+=K9v;s9G+=W53;var u9G=k53;u9G+=i6A;var H9G=x7V;H9G+=i6A;var V9G=h7V;V9G+=E63;var a9G=c13;a9G+=B7V;a9G+=n53;var D9G=v43;D9G+=L53;D9G+=C83;D9G+=c13;var z9G=Y7V;z9G+=W53;var that=this;var editor=config[O13];this[c1v](J33);F7q.X0O();editor[M5A](z9G,function(){F7q.X0O();that[c1v](m33);})[D9G]($[a9G]({buttons:config[V9G],message:config[H9G] || editor[n4v][D6v][u9G],title:config[w7V] || editor[s9G][f9G][o8v],nest:J33},config[A15]));}},createInline:{text:function(dt,node,config){var K7V='buttons.create';var N9G=p53;N9G+=w3ii[626273];N9G+=L7V;N9G+=W53;F7q.H0O();var d9G=m7V;d9G+=G53;return dt[n4v](K7V,config[d9G][N9G][D6v][e6v]);},className:n9G,editor:p33,formButtons:{text:function(editor){var S9G=p53;S9G+=K9v;S9G+=W53;return editor[S9G][D6v][l8v];},action:function(e){this[l8v]();}},formOptions:{},action:function(e,dt,node,config){var b9G=d53;b9G+=J53;b9G+=T13;b9G+=R1A;config[O13][A7V](config[b9G],config[A15]);},position:q7V},edit:{extend:E7V,text:function(dt,node,config){var Q7V='buttons.edit';var l9G=q1v;l9G+=p53;l9G+=G1v;var X9G=W7V;X9G+=L7V;X9G+=W53;return dt[X9G](Q7V,config[l9G][n4v][S3v][e6v]);},className:C7V,editor:p33,formButtons:{text:function(editor){var r9G=T13;r9G+=t53;r9G+=x75;var O9G=c13;O9G+=w3ii[25714];F7q.H0O();O9G+=p53;O9G+=i13;return editor[n4v][O9G][r9G];},action:function(e){var g7V="ub";var c9G=T13;c9G+=g7V;c9G+=w3ii[62535];c9G+=Z03;this[c9G]();}},formMessage:p33,formOptions:{},formTitle:p33,action:function(e,dt,node,config){var V7V='preOpen';var z7V="essag";var a7V="Butto";var D7V="ssag";var W8G=l93;W8G+=i13;var U8G=w3ii[62535];U8G+=z7V;U8G+=c13;var k8G=c13;k8G+=u1A;var Z9G=x7V;Z9G+=D7V;Z9G+=c13;var T9G=U8v;T9G+=a7V;T9G+=E63;var I9G=B53;I9G+=S53;I9G+=W53;I9G+=w3ii[25714];var F9G=p53;F7q.X0O();F9G+=T8v;F9G+=I25;var that=this;var editor=config[O13];var rows=dt[a63]({selected:J33})[F9G]();var columns=dt[l83]({selected:J33})[L83]();var cells=dt[u63]({selected:J33})[L83]();var items=columns[J93] || cells[J93]?{rows:rows,columns:columns,cells:cells}:rows;this[c1v](J33);editor[M5A](V7V,function(){var H7V="processin";var i9G=H7V;i9G+=T33;F7q.H0O();that[i9G](m33);})[S3v](items,$[I9G]({buttons:config[T9G],message:config[Z9G] || editor[n4v][k8G][U8G],title:config[w7V] || editor[n4v][W8G][o8v],nest:J33},config[A15]));}},remove:{extend:E7V,limitTo:[L8G],text:function(dt,node,config){F7q.X0O();var f7V='buttons.remove';var s7V="i18";var j8G=T3v;j8G+=j8v;j8G+=W53;var e8G=c13;e8G+=w3ii[25714];e8G+=u7V;var o8G=s7V;o8G+=W53;return dt[o8G](f7V,config[e8G][n4v][k2v][j8G]);},className:d7V,editor:p33,formButtons:{text:function(editor){var M8G=L53;M8G+=M53;return editor[n4v][M8G][l8v];},action:function(e){this[l8v]();}},formMessage:function(editor,dt){var X7V="confirm";var N7V="replac";var b7V="onfir";var S7V="irm";var n7V="nfi";var x8G=r03;x8G+=c13;x8G+=R1v;x8G+=y93;var t8G=N7V;t8G+=c13;var R8G=d83;R8G+=n7V;R8G+=O3v;var m8G=r03;m8G+=N53;m8G+=Y2v;var J8G=v43;J8G+=I53;J8G+=U53;J8G+=S7V;var G8G=v93;G8G+=Y8v;var p8G=v43;p8G+=b7V;p8G+=w3ii[62535];var y8G=d83;y8G+=r0v;y8G+=p53;y8G+=O3v;var v8G=L53;v8G+=w3ii[62535];v8G+=i05;v8G+=c13;var P8G=P83;P8G+=T13;var rows=dt[P8G]({selected:J33})[L83]();var i18n=editor[n4v][v8G];var question=typeof i18n[X7V] === U93?i18n[y8G]:i18n[p8G][rows[G8G]]?i18n[J8G][rows[m8G]]:i18n[R8G][Z73];return question[t8G](/%d/g,rows[x8G]);},formOptions:{},formTitle:p33,action:function(e,dt,node,config){var c7V="reOpen";var l7V="8n";var F7V="formButtons";var O7V="rmMess";var r7V="exes";var Q8G=w4v;Q8G+=K4v;var E8G=W7V;E8G+=l7V;var q8G=U53;q8G+=J53;q8G+=O7V;q8G+=P9v;var A8G=c13;A8G+=B7V;A8G+=n53;var K8G=p53;K8G+=n53;K8G+=r7V;var Y8G=d53;Y8G+=c7V;var B8G=J53;B8G+=W53;B8G+=c13;var h8G=v9v;h8G+=R8v;h8G+=k5V;h8G+=R1v;var that=this;var editor=config[O13];this[h8G](J33);editor[B8G](Y8G,function(){var w8G=U5V;w8G+=t25;w8G+=R1v;F7q.H0O();that[w8G](m33);})[k2v](dt[a63]({selected:J33})[K8G](),$[A8G]({buttons:config[F7V],message:config[q8G],title:config[w7V] || editor[E8G][k2v][Q8G],nest:J33},config[A15]));}}});_buttons[i7V]=$[C8G]({},_buttons[g8G]);_buttons[i7V][z8G]=I7V;_buttons[D8G]=$[a8G]({},_buttons[V8G]);_buttons[T7V][b33]=I7V;var Editor=(function(){var x4V="_multiInfo";var k0V="DateT";var c4V='2.0.5';var e0V="nalEvent";var L0V="Types";var A4V="models";var O4V="internalI18n";var r4V="internalMultiInfo";var o0V="ternalSettin";var F4V="defaults";var Z7V="plo";var U0V="Fi";var W0V="ers";var T23=t53;T23+=Z7V;T23+=A93;var I23=L0A;I23+=o0A;I23+=w3ii[25714];var i23=d53;i23+=w3ii[621556];i23+=p53;i23+=k4A;var F23=k0V;F23+=L3A;var c23=U0V;c23+=r93;var r23=v43;r23+=f5V;var O23=t43;O23+=W0V;O23+=p53;O23+=I53;var l23=U53;l23+=p53;l23+=r03;l23+=I25;var X23=P15;X23+=w3ii[25714];X23+=L0V;var b23=p53;b23+=W53;b23+=o0V;b23+=v05;var S23=d53;S23+=W6A;S23+=b1v;var d23=I33;d23+=i13;d23+=x03;d23+=e0V;function Editor(init){var Z0V="_cr";var R4V="file";var x0V="<div d";var D4V='body_content';var H0V="a-dte-e=\"body\" class=";var X0V="_opti";var E4V="indicator";var S0V="essing";var s0V="e=\"processing\" c";var C4V='<div data-dte-e="form_content" class="';var T0V="Name";var C0V="<form data-dte-e=\"f";var v0V="it.dt.dte";var W4V="ynami";var X4V="splay controll";var z4V='"></div></div>';var q4V="unique";var q0V="form_error\" class=\"";var p4V="blePosit";var N4V='xhr.dt.dte';var A0V="-dte-e=\"";var m0V="utton";var J4V="backg";var H4V='i18n.dt.dte';var l0V="onsU";var e4V="ayed";var d0V="ttings";var L4V="_act";var Q4V='<div data-dte-e="foot" class="';var i0V="ldName";var E0V="</form";var Y0V="data-dte-e=\"f";var y0V="process";var P0V="uniqu";var v4V="creat";var R0V="<div data-dt";var J0V="\"></d";var G4V="bubb";var N0V="_weakI";var D0V="iv d";var G0V="form_co";var K4V="domTable";var t4V="_blur";var w4V="new' instance";var I0V="fieldFromNode";var a0V="ata-dte-e=\"body_content";var u0V=" data-dte-";var h0V="ata-dte-e=\"head\" class=\"";var c0V="_fo";var o4V="ionCla";var V0V="<div dat";var O0V="pdate";var b4V="Cannot find di";var b0V="mes";var B4V="Tables Editor must ";var F0V="mOptions";var n0V="_proc";var j0V="initEd";var g4V='"><div class="';var m4V="displayNode";var U4V="_clearD";var M4V="undep";var y4V="clea";var h4V="_submit";var Q0V="></";var k4V="udArg";var M0V="nit";var p0V="foo";var j4V="estroy";var g0V="orm\" class=\"";var r0V="_inlin";var f0V="v class=";var Y4V="be initialised as a '";var B0V="<div ";var z0V="ss=";var P4V="ende";var V4V="nTable";var K0V="<div data";var l4V='initComplete';var w0V="orm_info\" class=\"";var t0V="e-e=\"form_buttons\" class=\"";var f23=j0V;f23+=p53;f23+=G1v;var s23=y85;s23+=p85;var u23=Z73;u23+=r55;u23+=W3v;var H23=p53;H23+=M0V;var V23=w3ii[25714];V23+=b15;V23+=W0v;var a23=A83;a23+=A63;var z23=w3ii[25714];z23+=b15;z23+=o0v;z23+=A63;var q23=J53;q23+=W53;var K23=P0V;K23+=c13;var w23=p53;w23+=W53;w23+=v0V;var Y23=J53;Y23+=W53;var B23=U53;B23+=p53;B23+=r93;B23+=T13;var h23=w3ii[25714];h23+=a5v;var m23=P35;m23+=C1v;var J23=c13;J23+=w3ii[621556];J23+=o4v;var G23=y0V;G23+=p53;G23+=R1v;var p23=p0V;p23+=i13;var y23=G0V;y23+=W53;y23+=y53;y23+=i13;var v23=J0V;v23+=p53;v23+=w9v;var P23=R53;P23+=m0V;P23+=T13;var M23=R0V;M23+=t0V;var j23=v43;j23+=J53;j23+=W3v;j23+=r73;var e23=q5v;e23+=w3ii[621556];e23+=Q2v;e23+=G53;var o23=x0V;o23+=h0V;var L23=y35;L23+=w3ii[62535];var W23=B0V;W23+=Y0V;W23+=w0V;var U23=y35;U23+=w3ii[62535];var k23=K0V;k23+=A0V;k23+=q0V;var Z6G=E0V;Z6G+=R9v;var T6G=c33;T6G+=Q0V;T6G+=u53;T6G+=w9v;var I6G=c33;I6G+=R9v;var i6G=F63;i6G+=T33;var F6G=U53;F6G+=J53;F6G+=G53;F6G+=w3ii[62535];var c6G=C0V;c6G+=g0V;var r6G=E9v;r6G+=w3ii[621556];r6G+=z0V;r6G+=c33;var O6G=U4v;O6G+=G53;var l6G=U53;l6G+=J53;l6G+=J53;l6G+=L1v;var X6G=c33;X6G+=R9v;X6G+=z5A;X6G+=R9v;var b6G=e73;b6G+=D0V;b6G+=a0V;b6G+=t2V;var S6G=c33;S6G+=R9v;var n6G=d0v;n6G+=d53;n6G+=o7v;var N6G=R53;N6G+=C5v;N6G+=q03;var d6G=V0V;d6G+=H0V;d6G+=c33;var f6G=d53;f6G+=b2A;var s6G=Q5A;s6G+=u0V;s6G+=s0V;s6G+=a5A;var u6G=c33;u6G+=R9v;var H6G=d0v;H6G+=P4v;var V6G=Q85;V6G+=f0V;V6G+=c33;var a6G=G43;a6G+=d0V;var D6G=p53;D6G+=H7v;var z6G=p43;z6G+=h85;z6G+=c13;z6G+=T13;var g6G=K75;g6G+=w3ii[621556];g6G+=i13;g6G+=c13;var C6G=w3ii[621556];C6G+=I05;C6G+=F13;var Q6G=K35;Q6G+=r03;Q6G+=T13;var E6G=w3ii[25714];E6G+=c13;E6G+=Z2V;E6G+=F8A;var q6G=c13;q6G+=F13;q6G+=x2A;var K6G=N0V;K6G+=W53;K6G+=V75;K6G+=A63;var w6G=n0V;w6G+=S0V;var Y6G=Y55;Y6G+=w55;var B6G=Z73;B6G+=b0V;B6G+=f4A;B6G+=H73;var h6G=X0V;h6G+=l0V;h6G+=O0V;var x6G=r0V;x6G+=c13;var t6G=c0V;t6G+=G53;t6G+=F0V;var R6G=L93;R6G+=H55;var m6G=u95;m6G+=c13;m6G+=i0V;m6G+=T13;var J6G=Z73;J6G+=I0V;var G6G=P8v;G6G+=T0V;var p6G=t15;p6G+=u1A;var y6G=A6v;y6G+=q6v;var v6G=Z0V;v6G+=k4V;v6G+=T13;var P6G=R85;P6G+=t85;var M6G=U4V;M6G+=W4V;M6G+=D55;var j6G=Z0v;j6G+=X7v;j6G+=S53;var e6G=L4V;e6G+=o4V;e6G+=o63;var o6G=t43;o6G+=w3ii[621556];o6G+=r03;var L6G=w4v;L6G+=i13;L6G+=r03;L6G+=c13;var W6G=T13;W6G+=B75;W6G+=Z03;var U6G=T13;U6G+=c13;U6G+=i13;var k6G=L53;k6G+=w3ii[62535];k6G+=J53;k6G+=E73;var Z8G=E7v;Z8G+=W53;var T8G=m15;T8G+=Z25;var I8G=P93;I8G+=p53;I8G+=Q2v;var i8G=H73;i8G+=i13;var F8G=R83;F8G+=v93;F8G+=T13;var c8G=c13;c8G+=c25;c8G+=r03;c8G+=c13;var r8G=c13;r8G+=u53;r8G+=i13;var O8G=L0v;O8G+=o0v;O8G+=e4V;var l8G=L0v;l8G+=w3ii[621556];l8G+=O53;var X8G=w3ii[25714];X8G+=j4V;var b8G=M4V;b8G+=P4V;b8G+=W3v;var S8G=v4V;S8G+=c13;var n8G=v43;n8G+=F45;n8G+=T13;n8G+=c13;var N8G=y4V;N8G+=G53;var d8G=w8v;d8G+=p4V;d8G+=y03;var f8G=G4V;f8G+=v93;var s8G=R53;s8G+=r03;s8G+=w45;var u8G=J4V;u8G+=G53;u8G+=J53;u8G+=Q4v;var H8G=w3ii[621556];H8G+=D93;var _this=this;this[H8G]=add;this[u3v]=ajax;this[u8G]=background;this[s8G]=blur;this[f8G]=bubble;this[d8G]=bubblePosition;this[J35]=buttons;this[N8G]=clear;this[n8G]=close;this[S8G]=create;this[b8G]=undependent;this[c6v]=dependent;this[X8G]=destroy;this[l8G]=disable;this[p0v]=display;this[O8G]=displayed;this[m4V]=displayNode;this[r8G]=edit;this[c8G]=enable;this[N93]=error$1;this[Y63]=field;this[J63]=fields;this[R4V]=file;this[F8G]=files;this[i8G]=get;this[I8G]=hide;this[b1A]=ids;this[T8G]=inError;this[B85]=inline;this[A7V]=inlineCreate;this[P55]=message;this[K35]=mode;this[a6v]=modifier;this[t55]=multiGet;this[A3v]=multiSet;this[n93]=node;this[h63]=off;this[I53]=on;this[M5A]=one;this[Z8G]=open;this[Q3v]=order;this[k6G]=remove;this[U6G]=set;this[J75]=show;this[W6G]=submit;this[X83]=table;this[C25]=template;this[L6G]=title;this[o6G]=val;this[e6G]=_actionClass;this[l2A]=_ajax;this[j6G]=_animate;this[N6v]=_assembleMain;this[t4V]=_blur;this[M6G]=_clearDynamicInfo;this[O45]=_close;this[P6G]=_closeReg;this[v6G]=_crudArgs;this[R3v]=_dataSource;this[y6G]=_displayReorder;this[p6G]=_edit;this[P8v]=_event;this[G6G]=_eventName;this[J6G]=_fieldFromNode;this[m6G]=_fieldNames;this[R6G]=_focus;this[t6G]=_formOptions;this[x6G]=_inline;this[h6G]=_optionsUpdate;this[B6G]=_message;this[x4V]=_multiInfo;this[Q55]=_nestedClose;this[a55]=_nestedOpen;this[Y6G]=_postopen;this[K85]=_preopen;this[w6G]=_processing;this[w2A]=_noProcessing;this[h4V]=_submit;this[O2A]=_submitTable;this[r2A]=_submitSuccess;this[c2A]=_submitError;this[O15]=_tidy;this[K6G]=_weakInArray;if(!(this instanceof Editor)){var A6G=X93;A6G+=B4V;A6G+=Y4V;A6G+=w4V;alert(A6G);}init=$[q6G](J33,{},Editor[E6G],init);this[T13]=$[b33](J33,{},Editor[Q6G][h93],{actionName:init[A2A],table:init[K4V] || init[X83],ajax:init[C6G],idSrc:init[D63],formOptions:init[A15],template:init[C25]?$(init[g6G])[M7v]():p33});this[h3v]=$[b33](J33,{},Editor[z6G]);this[D6G]=init[n4v];Editor[A4V][a6G][q4V]++;var that=this;var classes=this[h3v];var wrapper=$(V6G + classes[H6G] + u6G + s6G + classes[f6G][E4V] + n2V + d6G + classes[N6G][n6G] + S6G + b6G + classes[p63][U7v] + X6G + V0v + Q4V + classes[l6G][O6G] + l9v + r6G + classes[S45][U7v] + c9v + V0v + V0v);var form=$(c6G + classes[F6G][i6G] + I6G + C4V + classes[U8v][U7v] + T6G + Z6G);this[Z9v]={wrapper:wrapper[v13],form:form[v13],formError:$(k23 + classes[U23][N93] + c9v)[v13],formInfo:$(W23 + classes[L23][c5V] + c9v)[v13],header:$(o23 + classes[Q5v][c5v] + g4V + classes[e23][j23] + z4V)[v13],buttons:$(M23 + classes[U8v][P23] + v23)[v13],formContent:el(y23,form)[v13],footer:el(p23,wrapper)[v13],body:el(D4v,wrapper)[v13],bodyContent:el(D4V,wrapper)[v13],processing:el(G23,wrapper)[v13]};$[J23](init[m23],function(evt,fn){var R23=J53;R23+=W53;that[R23](evt,function(){var a4V="hift";var x23=w3ii[621556];F7q.H0O();x23+=f7v;x23+=m2A;var t23=T13;t23+=a4V;var args=Array[T2V][b55][S63](arguments);args[t23]();fn[x23](that,args);});});this[h23];var table$1=this[T13][X83];if(init[B23]){this[W63](init[J63]);}$(document)[Y23](w23 + this[T13][K23],function(e,settings,json){F7q.X0O();if(_this[T13][X83] && settings[V4V] === $(table$1)[v13]){var A23=Z73;A23+=q1v;A23+=u7V;settings[A23]=_this;}})[q23](H4V + this[T13][q4V],function(e,settings){F7q.X0O();var d4V="anguage";var s4V="guage";var u4V="oLa";var f4V="oL";if(_this[T13][X83] && settings[V4V] === $(table$1)[v13]){var E23=u4V;E23+=W53;E23+=s4V;if(settings[E23][O13]){var C23=l93;C23+=G1v;var Q23=f4V;Q23+=d4V;$[b33](J33,_this[n4v],settings[Q23][C23]);}}})[I53](N4V + this[T13][q4V],function(e,settings,json){F7q.H0O();var S4V="_optionsUpdate";var n4V="nT";var g23=n4V;g23+=w3ii[621556];g23+=h73;g23+=c13;if(json && _this[T13][X83] && settings[g23] === $(table$1)[v13]){_this[S4V](json);}});if(!Editor[z23][init[p0v]]){var D23=b4V;D23+=X4V;D23+=x03;D23+=d43;throw new Error(D23 + init[p0v]);}this[T13][f25]=Editor[a23][init[V23]][H23](this);this[u23](l4V,[]);$(document)[s23](f23,[this]);}Editor[T2V][d23]=function(name,args){var N23=i45;N23+=c13;N23+=W53;N23+=i13;this[N23](name,args);};Editor[T2V][O4V]=function(){var n23=p53;n23+=K9v;n23+=W53;return this[n23];};Editor[T2V][r4V]=function(){F7q.X0O();return this[x4V]();};Editor[S23][b23]=function(){return this[T13];};Editor[X23]={checkbox:checkbox,datatable:datatable,datetime:datetime,hidden:hidden,password:password,radio:radio,readonly:readonly,select:select,text:text,textarea:textarea,upload:upload,uploadMany:uploadMany};Editor[l23]={};Editor[O23]=c4V;Editor[r23]=classNames;Editor[c23]=Field;Editor[F23]=p33;Editor[N93]=error;Editor[i23]=pairs;Editor[I23]=function(id){return safeDomId(id,I43);};Editor[T23]=upload$1;Editor[F4V]=defaults$1;Editor[A4V]={button:button,displayController:displayController,fieldType:fieldType,formOptions:formOptions,settings:settings};Editor[h35]={dataTable:dataSource$1,html:dataSource};Editor[p0v]={envelope:envelope,lightbox:self};return Editor;})();DataTable[i4V]=Editor;$[Z23][b43][i4V]=Editor;if(DataTable[k13]){var W13=B73;W13+=C83;W13+=c13;W13+=I4V;var U13=B73;U13+=T4V;U13+=k53;Editor[U13]=DataTable[W13];}if(DataTable[L13][o13]){var j13=c13;j13+=g03;var e13=c13;e13+=B7V;e13+=W53;e13+=w3ii[25714];$[e13](Editor[E2V],DataTable[j13][Z4V]);}DataTable[M13][P13]=Editor[E2V];return Editor;});

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to Buttons so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = '<h5 class="modal-title">'+i18nDefaults.create.title+'</h5>';
i18nDefaults.edit.title = '<h5 class="modal-title">'+i18nDefaults.edit.title+'</h5>';
i18nDefaults.remove.title = '<h5 class="modal-title">'+i18nDefaults.remove.title+'</h5>';


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn",
		"buttonInternal": "btn btn-outline-secondary"
	},
	"field": {
		"wrapper": "DTE_Field form-group row",
		"label":   "col-lg-4 col-form-label",
		"input":   "col-lg-8",
		"error":   "error is-invalid",
		"msg-labelInfo": "form-text text-secondary small",
		"msg-info":      "form-text text-secondary small",
		"msg-message":   "form-text text-secondary small",
		"msg-error":     "form-text text-danger small",
		"multiValue":    "card multi-value",
		"multiInfo":     "small",
		"multiRestore":  "card multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );

DataTable.Editor.fieldTypes.datatable.tableClass = 'table';

/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

let shown = false;
let fullyShown = false;

const dom = {
	// Note that `modal-dialog-scrollable` is BS4.3+ only. It has no effect on 4.0-4.2
	content: $(
		'<div class="modal fade DTED">'+
			'<div class="modal-dialog modal-dialog-scrollable"></div>'+
		'</div>'
	),
	close: $('<button class="close">&times;</div>')
};

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	init: function ( dte ) {
		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		return DataTable.Editor.display.bootstrap;
	},

	open: function ( dte, append, callback ) {
		$(append).addClass('modal-content');

		// Special class for DataTable buttons in the form
		$(append).find('div.DTE_Field_Type_datatable div.dt-buttons')
			.removeClass('btn-group')
			.addClass('btn-group-vertical');

		// Setup events on each show
		dom.close
			.attr('title', dte.i18n.close)
			.off('click.dte-bs4')
			.on('click.dte-bs4', function () {
				dte.close('icon');
			})
			.appendTo($('div.modal-header', append));

		// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
		// want to trigger a background action.
		let allowBackgroundClick = false;
		$(document)
			.off('mousedown.dte-bs4')
			.on('mousedown.dte-bs4', 'div.modal', function (e) {
				allowBackgroundClick = $(e.target).hasClass('modal') && shown
					? true
					: false;
			} );

		$(document)
			.off('click.dte-bs4')
			.on('click.dte-bs4', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && allowBackgroundClick ) {
					dte.background();
				}
			} );

		var content = dom.content.find('div.modal-dialog');
		content.children().detach();
		content.append( append );

		if ( shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		shown = true;
		fullyShown = false;

		$(dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( dte.s.setFocus ) {
					dte.s.setFocus.focus();
				}

				fullyShown = true;

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	close: function ( dte, callback ) {
		if ( ! shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if ( ! fullyShown ) {
			$(dom.content)
				.one('shown.bs.modal', function () {
					DataTable.Editor.display.bootstrap.close( dte, callback );
				} );

			return;
		}

		$(dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		shown = false;
		fullyShown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return dom.content[0];
	}
} );


return DataTable.Editor;
}));


/*! Buttons for DataTables 2.0.1
 * ©2016-2021 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeIn( duration, fn );

	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeOut( duration, fn );
	}
	else {
		el.css('display', 'none');
		
		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( Array.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton(
			buttons,
			config,
			config !== undefined ? config.split : undefined,
			(config === undefined || config.split === undefined || config.split.length === 0) && base !== undefined,
			false,
			idx );
		this._draw();

		return this;
	},

	/**
	 * Clear buttons from a collection and then insert new buttons
	 */
	collectionRebuild: function ( node, newButtons )
	{
		var button = this._nodeToButton( node );
		
		if(newButtons !== undefined) {
			var i;
			// Need to reverse the array
			for (i=button.buttons.length-1; i>=0; i--) {
				this.remove(button.buttons[i].node);
			}
	
			for (i=0; i<newButtons.length; i++) {
				this._expandButton(
					button.buttons,
					newButtons[i],
					newButtons[i] !== undefined && newButtons[i].config !== undefined && newButtons[i].config.split !== undefined,
					true,
					newButtons[i].parentConf !== undefined && newButtons[i].parentConf.split !== undefined,
					i,
					newButtons[i].parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node)
			.addClass( this.c.dom.button.disabled )
			.attr('disabled', true);

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node)
			.removeClass( this.c.dom.button.disabled )
			.removeAttr('disabled');

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var dt = this.s.dt;
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		$(dt.table().node()).triggerHandler( 'buttons-processing.dt', [
			flag, dt.button( node ), dt, $(node), button.conf
		] );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode
				.children( linerTag )
				.filter(':not(.dt-down-arrow)')
				.html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, split, inCollection, inSplit, attachPoint, parentConf )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var isSplit = false;
		var buttons = ! Array.isArray( button ) ?
			[ button ] :
			button;
		
		if(button === undefined ) {
			buttons = !Array.isArray(split) ?
				[ split ] :
				split;
		}

		if (button !== undefined && button.split !== undefined) {
			isSplit = true;
		}
			
		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			if( conf.config !== undefined && conf.config.split) {
				isSplit = true;
			}
			else {
				isSplit = false;
			}
			
			// If the configuration is an array, then expand the buttons at this
			// point
			if ( Array.isArray( conf ) ) {
				this._expandButton( attachTo, conf, built !== undefined && built.conf !== undefined ? built.conf.split : undefined, inCollection, parentConf !== undefined && parentConf.split !== undefined, attachPoint, parentConf );
				continue;
			}

			var built = this._buildButton( conf, inCollection, conf.split !== undefined || (conf.config !== undefined && conf.config.split !== undefined), inSplit );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined && attachPoint !== null ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			
			if ( built.conf.buttons || built.conf.split ) {
				built.collection = $('<'+(isSplit ? this.c.dom.splitCollection.tag : this.c.dom.collection.tag)+'/>');

				built.conf._collection = built.collection;

				if(built.conf.split) {
					for(var j = 0; j < built.conf.split.length; j++) {
						if(typeof built.conf.split[j] === "object") {
							built.conf.split[i].parent = parentConf;
							if(built.conf.split[j].collectionLayout === undefined) {
								built.conf.split[j].collectionLayout = built.conf.collectionLayout;
							}
							if(built.conf.split[j].dropup === undefined) {
								built.conf.split[j].dropup = built.conf.dropup;
							}
							if(built.conf.split[j].fade === undefined) {
								built.conf.split[j].fade = built.conf.fade;
							}
						}
					}
				}
				else {
					$(built.node).append($('<span class="dt-down-arrow">'+this.c.dom.splitDropdown.text+'</span>'))
				}

				this._expandButton( built.buttons, built.conf.buttons, built.conf.split, !isSplit, isSplit, attachPoint, built.conf );
			}
			built.conf.parent = parentConf;

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection, isSplit, inSplit )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var splitDom = this.c.dom.split;
		var splitCollectionDom = this.c.dom.splitCollection;
		var splitDropdownButton = this.c.dom.splitDropdownButton;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( !isSplit && inSplit && splitCollectionDom ) {
			buttonDom = splitDropdownButton;
		}
		else if ( !isSplit && inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		} 

		if ( !isSplit && inSplit && splitCollectionDom.buttonLiner ) {
			linerDom = splitCollectionDom.buttonLiner
		}
		else if ( !isSplit && inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, PDF button require pdfmake
		if ( config.available && ! config.available( dt, config ) && !config.hasOwnProperty('html') ) {
			return false;
		}

		var button;
		if(!config.hasOwnProperty('html')) {
			var action = function ( e, dt, button, config ) {
				config.action.call( dt.button( button ), e, dt, button, config );
	
				$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
					dt.button( button ), dt, button, config 
				] );
			};

			var tag = config.tag || buttonDom.tag;
			var clickBlurs = config.clickBlurs === undefined ? false : config.clickBlurs
			button = $('<'+tag+'/>')
				.addClass( buttonDom.className )
				.addClass( inSplit ? this.c.dom.splitDropdownButton.className : '')
				.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
				.attr( 'aria-controls', this.s.dt.table().node().id )
				.on( 'click.dtb', function (e) {
					e.preventDefault();
	
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
					if( clickBlurs ) {
						button.trigger('blur');
					}
				} )
				.on( 'keyup.dtb', function (e) {
					if ( e.keyCode === 13 ) {
						if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
							action( e, dt, button, config );
						}
					}
				} );
	
			// Make `a` tags act like a link
			if ( tag.toLowerCase() === 'a' ) {
				button.attr( 'href', '#' );
			}
	
			// Button tags should have `type=button` so they don't have any default behaviour
			if ( tag.toLowerCase() === 'button' ) {
				button.attr( 'type', 'button' );
			}
	
			if ( linerDom.tag ) {
				var liner = $('<'+linerDom.tag+'/>')
					.html( text( config.text ) )
					.addClass( linerDom.className );
	
				if ( linerDom.tag.toLowerCase() === 'a' ) {
					liner.attr( 'href', '#' );
				}
	
				button.append( liner );
			}
			else {
				button.html( text( config.text ) );
			}
	
			if ( config.enabled === false ) {
				button.addClass( buttonDom.disabled );
			}
	
			if ( config.className ) {
				button.addClass( config.className );
			}
	
			if ( config.titleAttr ) {
				button.attr( 'title', text( config.titleAttr ) );
			}
	
			if ( config.attr ) {
				button.attr( config.attr );
			}
	
			if ( ! config.namespace ) {
				config.namespace = '.dt-button-'+(_buttonCounter++);
			}

			if  ( config.config !== undefined && config.config.split ) {
				config.split = config.config.split;
			}
		}
		else {
			button = $(config.html)
		}
	
		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		var splitDiv;
		if(isSplit) {
			splitDiv = $('<div/>').addClass(this.c.dom.splitWrapper.className)
			splitDiv.append(button);
			var dropButtonConfig = $.extend(config, {
				text: this.c.dom.splitDropdown.text,
				className: this.c.dom.splitDropdown.className,
				attr: {
					'aria-haspopup': true,
					'aria-expanded': false
				},
				align: this.c.dom.splitDropdown.align,
				splitAlignClass: this.c.dom.splitDropdown.splitAlignClass
				
			})

			this._addKey(dropButtonConfig);

			var splitAction = function ( e, dt, button, config ) {
				_dtButtons.split.action.call( dt.button($('div.dt-btn-split-wrapper')[0] ), e, dt, button, config );
	
				$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
					dt.button( button ), dt, button, config 
				] );
				button.attr('aria-expanded', true)
			};
			
			var dropButton = $('<button class="' + this.c.dom.splitDropdown.className + ' dt-button"><span class="dt-btn-split-drop-arrow">'+this.c.dom.splitDropdown.text+'</span></button>')
				.on( 'click.dtb', function (e) {
					e.preventDefault();
					e.stopPropagation();

					if ( ! dropButton.hasClass( buttonDom.disabled ) && dropButtonConfig.action ) {
						splitAction( e, dt, dropButton, dropButtonConfig );
					}
					if ( clickBlurs ) {
						dropButton.trigger('blur');
					}
				} )
				.on( 'keyup.dtb', function (e) {
					if ( e.keyCode === 13 ) {
						if ( ! dropButton.hasClass( buttonDom.disabled ) && dropButtonConfig.action ) {
							splitAction( e, dt, dropButton, dropButtonConfig );
						}
					}
				} );

			if(config.split.length === 0) {
				dropButton.addClass('dtb-hide-drop');
			}

			splitDiv.append(dropButton).attr(dropButtonConfig.attr);
		}

		return {
			conf:         config,
			node:         isSplit ? splitDiv.get(0) : button.get(0),
			inserter:     isSplit ? splitDiv : inserter,
			buttons:      [],
			inCollection: inCollection,
			isSplit:	  isSplit,
			inSplit:	  inSplit,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! Array.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						return {html: base}
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return Array.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( Array.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			if (conf.config !== undefined && objArray.config !== undefined) {
				conf.config = $.extend({}, objArray.config, conf.config)
			}

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	},

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	_popover: function ( content, hostButton, inOpts, e ) {
		var dt = hostButton;
		var buttonsSettings = this.c;
		var closed = false;
		var options = $.extend( {
			align: 'button-left', // button-right, dt-container, split-left, split-right
			autoClose: false,
			background: true,
			backgroundClassName: 'dt-button-background',
			contentClassName: buttonsSettings.dom.collection.className,
			collectionLayout: '',
			collectionTitle: '',
			dropup: false,
			fade: 400,
			popoverTitle: '',
			rightAlignClassName: 'dt-button-right',
			splitRightAlignClassName: 'dt-button-split-right',
			splitLeftAlignClassName: 'dt-button-split-left',
			tag: buttonsSettings.dom.collection.tag
		}, inOpts );

		var hostNode = hostButton.node();

		var close = function () {
			closed = true;

			_fadeOut(
				$('.dt-button-collection'),
				options.fade,
				function () {
					$(this).detach();
				}
			);

			$(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes())
				.attr('aria-expanded', 'false');

			$('div.dt-button-background').off( 'click.dtb-collection' );
			Buttons.background( false, options.backgroundClassName, options.fade, hostNode );

			$('body').off( '.dtb-collection' );
			dt.off( 'buttons-action.b-internal' );
			dt.off( 'destroy' );
		};

		if (content === false) {
			close();
		}

		var existingExpanded = $(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes());
		if ( existingExpanded.length ) {
			hostNode = existingExpanded.eq(0);

			close();
		}

		var display = $('<div/>')
			.addClass('dt-button-collection')
			.addClass(options.collectionLayout)
			.addClass(options.splitAlignClass)
			.css('display', 'none');

		content = $(content)
			.addClass(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostNode.attr( 'aria-expanded', 'true' );

		if ( hostNode.parents('body')[0] !== document.body ) {
			hostNode = document.body.lastChild;
		}

		if ( options.popoverTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.popoverTitle+'</div>');
		}
		else if ( options.collectionTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.collectionTitle+'</div>');
		}

		_fadeIn( display.insertAfter( hostNode ), options.fade );

		var tableContainer = $( hostButton.table().container() );
		var position = display.css( 'position' );

		if ( options.align === 'dt-container' ) {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (position === 'absolute') {
			// Align relative to the host button
			var hostPosition = hostNode.position();
			var buttonPosition = $(hostButton.node()).position();

			display.css( {
				top: $($(hostButton[0].node).parent()[0]).hasClass('dt-buttons')
					? buttonPosition.top + hostNode.outerHeight()
					: hostPosition.top + hostNode.outerHeight(),
				left: hostPosition.left
			} );

			// calculate overflow when positioned beneath
			var collectionHeight = display.outerHeight();
			var tableBottom = tableContainer.offset().top + tableContainer.height();
			var listBottom = buttonPosition.top + hostNode.outerHeight() + collectionHeight;
			var bottomOverflow = listBottom - tableBottom;

			// calculate overflow when positioned above
			var listTop = buttonPosition.top - collectionHeight;
			var tableTop = tableContainer.offset().top;
			var topOverflow = tableTop - listTop;

			// if bottom overflow is larger, move to the top because it fits better, or if dropup is requested
			var moveTop = buttonPosition.top - collectionHeight - 5;
			if ( (bottomOverflow > topOverflow || options.dropup) && -moveTop < tableTop ) {
				display.css( 'top', moveTop);
			}

			// Get the size of the container (left and width - and thus also right)
			var tableLeft = tableContainer.offset().left;
			var tableWidth = tableContainer.width();
			var tableRight = tableLeft + tableWidth;

			// Get the size of the popover (left and width - and ...)
			var popoverLeft = display.offset().left;
			var popoverWidth = display.outerWidth();

			// Foundations display dom element has a width of 0 - the true width is within the child
			if (popoverWidth === 0) {
				if (display.children().length > 0) {
					popoverWidth = $(display.children()[0]).outerWidth();
				}
			}
			
			var popoverRight = popoverLeft + popoverWidth;

			// Get the size of the host buttons (left and width - and ...)
			var buttonsLeft = hostNode.offset().left;
			var buttonsWidth = hostNode.outerWidth()
			var buttonsRight = buttonsLeft + buttonsWidth;

			if (
				display.hasClass( options.rightAlignClassName ) ||
				display.hasClass( options.leftAlignClassName ) ||
				display.hasClass( options.splitAlignClass ) ||
				options.align === 'dt-container'
			){
				// default to the other buttons values
				var splitButtonLeft = buttonsLeft;
				var splitButtonWidth = buttonsWidth;
				var splitButtonRight = buttonsRight;

				// If the button is a split button then need to calculate some more values
				if (hostNode.hasClass('dt-btn-split-wrapper') && hostNode.children('button.dt-btn-split-drop').length > 0) {
					splitButtonLeft = hostNode.children('button.dt-btn-split-drop').offset().left;
					splitButtonWidth = hostNode.children('button.dt-btn-split-drop').outerWidth();
					splitButtonRight = splitButtonLeft + splitButtonWidth;
				}
				// You've then got all the numbers you need to do some calculations and if statements,
				//  so we can do some quick JS maths and apply it only once
				// If it has the right align class OR the buttons are right aligned OR the button container is floated right,
				//  then calculate left position for the popover to align the popover to the right hand
				//  side of the button - check to see if the left of the popover is inside the table container.
				// If not, move the popover so it is, but not more than it means that the popover is to the right of the table container
				var popoverShuffle = 0;
				if ( display.hasClass( options.rightAlignClassName )) {
					popoverShuffle = buttonsRight - popoverRight;
					if(tableLeft > (popoverLeft + popoverShuffle)){
						var leftGap = tableLeft - (popoverLeft + popoverShuffle);
						var rightGap = tableRight - (popoverRight + popoverShuffle);
		
						if(leftGap > rightGap){
							popoverShuffle += rightGap; 
						}
						else {
							popoverShuffle += leftGap;
						}
					}
				}
				else if ( display.hasClass( options.splitRightAlignClassName )) {
					popoverShuffle = splitButtonRight - popoverRight;
					if(tableLeft > (popoverLeft + popoverShuffle)){
						var leftGap = tableLeft - (popoverLeft + popoverShuffle);
						var rightGap = tableRight - (popoverRight + popoverShuffle);
		
						if(leftGap > rightGap){
							popoverShuffle += rightGap; 
						}
						else {
							popoverShuffle += leftGap;
						}
					}
				}
				else if ( display.hasClass( options.splitLeftAlignClassName )) {
					popoverShuffle = splitButtonLeft - popoverLeft;

					if(tableRight < (popoverRight + popoverShuffle) || tableLeft > (popoverLeft + popoverShuffle)){
						var leftGap = tableLeft - (popoverLeft + popoverShuffle);
						var rightGap = tableRight - (popoverRight + popoverShuffle);
	
						if(leftGap > rightGap ){
							popoverShuffle += rightGap;
						}
						else {
							popoverShuffle += leftGap;
						}
	
					}
				}
				// else attempt to left align the popover to the button. Similar to above, if the popover's right goes past the table container's right,
				//  then move it back, but not so much that it goes past the left of the table container
				else {
					popoverShuffle = tableLeft - popoverLeft;
	
					if(tableRight < (popoverRight + popoverShuffle)){
						var leftGap = tableLeft - (popoverLeft + popoverShuffle);
						var rightGap = tableRight - (popoverRight + popoverShuffle);
	
						if(leftGap > rightGap ){
							popoverShuffle += rightGap;
						}
						else {
							popoverShuffle += leftGap;
						}
	
					}
				}
	
				display.css('left', display.position().left + popoverShuffle);
			}
			else {
				var top = hostNode.offset().top
				var popoverShuffle = 0;

				popoverShuffle = options.align === 'button-right'
					? buttonsRight - popoverRight
					: buttonsLeft - popoverLeft;

				display.css('left', display.position().left + popoverShuffle);
			}
			
			
		}
		else {
			// Fix position - centre on screen
			var top = display.height() / 2;
			if ( top > $(window).height() / 2 ) {
				top = $(window).height() / 2;
			}

			display.css( 'marginTop', top*-1 );
		}

		if ( options.background ) {
			Buttons.background( true, options.backgroundClassName, options.fade, hostNode );
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

		if ( options.autoClose ) {
			setTimeout( function () {
				dt.on( 'buttons-action.b-internal', function (e, btn, dt, node) {
					if ( node[0] === hostNode[0] ) {
						return;
					}
					close();
				} );
			}, 0);
		}
		
		$(display).trigger('buttons-popover.dt');


		dt.on('destroy', close);

		setTimeout(function() {
			closed = false;
			$('body')
				.on( 'click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';
					var parent = $(e.target).parent()[0];
	
					if (( ! $(e.target).parents()[back]().filter( content ).length  && !$(parent).hasClass('dt-buttons')) || $(e.target).hasClass('dt-button-background')) {
						close();
					}
				} )
				.on( 'keyup.dtb-collection', function (e) {
					if ( e.keyCode === 27 ) {
						close();
					}
				} );
		}, 0);
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		_fadeIn(
			$('<div/>')
				.addClass( className )
				.css( 'display', 'none' )
				.insertAfter( insertPoint ),
			fade
		);
	}
	else {
		_fadeOut(
			$('div.'+className),
			fade,
			function () {
				$(this)
					.removeClass( className )
					.remove();
			}
		);
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( group === undefined || group === null ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( Array.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( input.trim(), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( Array.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( a[i].trim(), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};

/**
 * Default function used for formatting output data.
 * @param {*} str Data to strip
 */
Buttons.stripData = function ( str, config ) {
	if ( typeof str !== 'string' ) {
		return str;
	}

	// Always remove script tags
	str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

	// Always remove comments
	str = str.replace( /<!\-\-.*?\-\->/g, '' );

	if ( ! config || config.stripHtml ) {
		str = str.replace( /<[^>]*>/g, '' );
	}

	if ( ! config || config.trim ) {
		str = str.replace( /^\s+|\s+$/g, '' );
	}

	if ( ! config || config.stripNewlines ) {
		str = str.replace( /\n/g, ' ' );
	}

	if ( ! config || config.decodeEntities ) {
		_exportTextarea.innerHTML = str;
		str = _exportTextarea.value;
	}

	return str;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: ''
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		},
		split: {
			tag: 'div',
			className: 'dt-button-split',
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper',
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'dt-btn-split-drop',
			align: 'split-right',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button dt-button',
		},
		splitCollection: {
			tag: 'div',
			className: 'dt-button-split-collection',
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '2.0.1';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			if ( config._collection.parents('body').length ) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	split: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.split', 'Split' );
		},
		className: 'buttons-split',
		init: function ( dt, button, config ) {
			return button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			this.popover(config._collection, config);
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
	},
	csv: function ( dt, conf ) {
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
	},
	excel: function ( dt, conf ) {
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
	},
	pdf: function ( dt, conf ) {
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = [];
		var lang = [];
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		// Support for DataTables 1.x 2D array
		if (Array.isArray( lengthMenu[0] )) {
			vals = lengthMenu[0];
			lang = lengthMenu[1];
		}
		else {
			for (var i=0 ; i<lengthMenu.length ; i++) {
				var option = lengthMenu[i];

				// Support for DataTables 2 object in the array
				if ($.isPlainObject(option)) {
					vals.push(option.value);
					lang.push(option.label);
				}
				else {
					vals.push(option);
					lang.push(option);
				}
			}
		}

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Collection control
DataTable.Api.registerPlural( 'buttons().collectionRebuild()', 'button().collectionRebuild()', function ( buttons ) {
	return this.each( function ( set ) {
		for(var i = 0; i < buttons.length; i++) {
			if(typeof buttons[i] === 'object') {
				buttons[i].parentConf = set;
			}
		}
		set.inst.collectionRebuild( set.node, buttons );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Button resolver to the popover
DataTable.Api.register( 'button().popover()', function (content, options) {
	return this.map( function ( set ) {
		return set.inst._popover( content, this.button(this[0].node), options );
	} );
} );

// Get the container elements
DataTable.Api.register( 'buttons().containers()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

DataTable.Api.register( 'buttons().container()', function () {
	// API level of nesting is `buttons()` so we can zip into the containers method
	return this.containers().eq(0);
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		this.off('destroy.btn-info');
		_fadeOut(
			$('#datatables_buttons_info'),
			400,
			function () {
				$(this).remove();
			}
		);
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	_fadeIn(
		$('<div id="datatables_buttons_info" class="dt-button-info"/>')
			.html( title )
			.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
			.css( 'display', 'none' )
			.appendTo( 'body' )
	);

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	this.on('destroy.btn-info', function () {
		that.buttons.info(false);
	});

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = filename.replace( '*', $('head > title').text() ).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};




var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return Buttons.stripData( d, config );
			},
			footer: function ( d ) {
				return Buttons.stripData( d, config );
			},
			body: function ( d ) {
				return Buttons.stripData( d, config );
			}
		},
		customizeData: null
	}, inOpts );

	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings, options ) {
	var api = new DataTable.Api( settings );
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return Buttons;
}));


/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group flex-wrap'
		},
		button: {
			className: 'btn btn-secondary'
		},
		collection: {
			tag: 'div',
			className: 'dropdown-menu',
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'active',
				disabled: 'disabled'
			}
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper btn-group',
		},
		splitDropdown: {
			tag: 'button',
			text: '',
			className: 'btn btn-secondary dt-btn-split-drop dropdown-toggle dropdown-toggle-split',
			align: 'split-left',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button btn btn-secondary'
		}
	},
	buttonCreated: function ( config, button ) {
		return config.buttons ?
			$('<div class="btn-group"/>').append(button) :
			button;
	}
} );

DataTable.ext.buttons.collection.className += ' dropdown-toggle';
DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';

return DataTable.Buttons;
}));


/*! SearchPanes 1.4.0
 * 2019-2020 SpryMedia Ltd - datatables.net/license
 */
(function () {
    'use strict';

    var $;
    var dataTable;
    function setJQuery(jq) {
        $ = jq;
        dataTable = jq.fn.dataTable;
    }
    var SearchPane = /** @class */ (function () {
        /**
         * Creates the panes, sets up the search function
         *
         * @param paneSettings The settings for the searchPanes
         * @param opts The options for the default features
         * @param idx the index of the column for this pane
         * @returns {object} the pane that has been created, including the table and the index of the pane
         */
        function SearchPane(paneSettings, opts, idx, layout, panesContainer, panes) {
            var _this = this;
            if (panes === void 0) { panes = null; }
            // Check that the required version of DataTables is included
            if (!dataTable || !dataTable.versionCheck || !dataTable.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            // Check that Select is included
            // eslint-disable-next-line no-extra-parens
            if (!dataTable.select) {
                throw new Error('SearchPane requires Select');
            }
            var table = new dataTable.Api(paneSettings);
            this.classes = $.extend(true, {}, SearchPane.classes);
            // Get options from user
            this.c = $.extend(true, {}, SearchPane.defaults, opts);
            if (opts !== undefined && opts.hideCount !== undefined && opts.viewCount === undefined) {
                this.c.viewCount = !this.c.hideCount;
            }
            this.customPaneSettings = panes;
            this.s = {
                cascadeRegen: false,
                clearing: false,
                colOpts: [],
                deselect: false,
                displayed: false,
                dt: table,
                dtPane: undefined,
                filteringActive: false,
                firstSet: true,
                forceViewTotal: false,
                index: idx,
                indexes: [],
                lastCascade: false,
                lastSelect: false,
                listSet: false,
                name: undefined,
                redraw: false,
                rowData: {
                    arrayFilter: [],
                    arrayOriginal: [],
                    arrayTotals: [],
                    bins: {},
                    binsOriginal: {},
                    binsTotal: {},
                    filterMap: new Map(),
                    totalOptions: 0
                },
                scrollTop: 0,
                searchFunction: undefined,
                selectPresent: false,
                serverSelect: [],
                serverSelecting: false,
                showFiltered: false,
                tableLength: null,
                updating: false
            };
            var rowLength = table.columns().eq(0).toArray().length;
            this.colExists = this.s.index < rowLength;
            // Add extra elements to DOM object including clear and hide buttons
            this.c.layout = layout;
            var layVal = parseInt(layout.split('-')[1], 10);
            this.dom = {
                buttonGroup: $('<div/>').addClass(this.classes.buttonGroup),
                clear: $('<button type="button">&#215;</button>')
                    .addClass(this.classes.disabledButton)
                    .attr('disabled', 'true')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.clearButton),
                collapseButton: $('<button type="button"><span class="dtsp-caret">&#x5e;</span></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.collapseButton),
                container: $('<div/>')
                    .addClass(this.classes.container)
                    .addClass(this.classes.layout +
                    (layVal < 10 ? layout : layout.split('-')[0] + '-9')),
                countButton: $('<button type="button"></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.countButton),
                dtP: $('<table><thead><tr><th>' +
                    (this.colExists
                        ? $(table.column(this.colExists ? this.s.index : 0).header()).text()
                        : this.customPaneSettings.header || 'Custom Pane') + '</th><th/></tr></thead></table>'),
                lower: $('<div/>').addClass(this.classes.subRow2).addClass(this.classes.narrowButton),
                nameButton: $('<button type="button"></button>')
                    .addClass(this.classes.paneButton)
                    .addClass(this.classes.nameButton),
                panesContainer: panesContainer,
                searchBox: $('<input/>').addClass(this.classes.paneInputButton).addClass(this.classes.search),
                searchButton: $('<button type = "button" class="' + this.classes.searchIcon + '"></button>')
                    .addClass(this.classes.paneButton),
                searchCont: $('<div/>').addClass(this.classes.searchCont),
                searchLabelCont: $('<div/>').addClass(this.classes.searchLabelCont),
                topRow: $('<div/>').addClass(this.classes.topRow),
                upper: $('<div/>').addClass(this.classes.subRow1).addClass(this.classes.narrowSearch)
            };
            this.s.displayed = false;
            table = this.s.dt;
            this.selections = [];
            this.s.colOpts = this.colExists ? this._getOptions() : this._getBonusOptions();
            var colOpts = this.s.colOpts;
            var clear = $('<button type="button">X</button>').addClass(this.classes.paneButton);
            clear.text(table.i18n('searchPanes.clearPane', this.c.i18n.clearPane));
            this.dom.container.addClass(colOpts.className);
            this.dom.container.addClass(this.customPaneSettings !== null && this.customPaneSettings.className !== undefined
                ? this.customPaneSettings.className
                : '');
            // Set the value of name incase ordering is desired
            if (this.s.colOpts.name !== undefined) {
                this.s.name = this.s.colOpts.name;
            }
            else if (this.customPaneSettings !== null && this.customPaneSettings.name !== undefined) {
                this.s.name = this.customPaneSettings.name;
            }
            else {
                this.s.name = this.colExists ?
                    $(table.column(this.s.index).header()).text() :
                    this.customPaneSettings.header || 'Custom Pane';
            }
            $(panesContainer).append(this.dom.container);
            var tableNode = table.table(0).node();
            // Custom search function for table
            this.s.searchFunction = function (settings, searchData, dataIndex, origData) {
                // If no data has been selected then show all
                if (_this.selections.length === 0) {
                    return true;
                }
                if (settings.nTable !== tableNode) {
                    return true;
                }
                var filter = null;
                if (_this.colExists) {
                    // Get the current filtered data
                    filter = searchData[_this.s.index];
                    if (colOpts.orthogonal.filter !== 'filter') {
                        // get the filter value from the map
                        filter = _this.s.rowData.filterMap.get(dataIndex);
                        if (filter instanceof $.fn.dataTable.Api) {
                            // eslint-disable-next-line no-extra-parens
                            filter = filter.toArray();
                        }
                    }
                }
                return _this._search(filter, dataIndex);
            };
            $.fn.dataTable.ext.search.push(this.s.searchFunction);
            // If the clear button for this pane is clicked clear the selections
            if (this.c.clear) {
                clear.on('click', function () {
                    var searches = _this.dom.container.find('.' + _this.classes.search.replace(/\s+/g, '.'));
                    searches.each(function () {
                        $(this).val('');
                        $(this).trigger('input');
                    });
                    _this.clearPane();
                });
            }
            // Sometimes the top row of the panes containing the search box and ordering buttons appears
            //  weird if the width of the panes is lower than expected, this fixes the design.
            // Equally this may occur when the table is resized.
            table.on('draw.dtsp', function () {
                _this.adjustTopRow();
            });
            table.on('buttons-action', function () {
                _this.adjustTopRow();
            });
            // When column-reorder is present and the columns are moved, it is necessary to
            //  reassign all of the panes indexes to the new index of the column.
            table.on('column-reorder.dtsp', function (e, settings, details) {
                _this.s.index = details.mapping[_this.s.index];
            });
            return this;
        }
        /**
         * Adds a row to the panes table
         *
         * @param display the value to be displayed to the user
         * @param filter the value to be filtered on when searchpanes is implemented
         * @param shown the number of rows in the table that are currently visible matching this criteria
         * @param total the total number of rows in the table that match this criteria
         * @param sort the value to be sorted in the pane table
         * @param type the value of which the type is to be derived from
         */
        SearchPane.prototype.addRow = function (display, filter, shown, total, sort, type, className) {
            var index;
            for (var _i = 0, _a = this.s.indexes; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.filter === filter) {
                    index = entry.index;
                }
            }
            if (index === undefined) {
                index = this.s.indexes.length;
                this.s.indexes.push({ filter: filter, index: index });
            }
            return this.s.dtPane.row.add({
                className: className,
                display: display !== '' ?
                    display :
                    this.emptyMessage(),
                filter: filter,
                index: index,
                shown: shown,
                sort: sort,
                total: total,
                type: type
            });
        };
        /**
         * Adjusts the layout of the top row when the screen is resized
         */
        SearchPane.prototype.adjustTopRow = function () {
            var subContainers = this.dom.container.find('.' + this.classes.subRowsContainer.replace(/\s+/g, '.'));
            var subRow1 = this.dom.container.find('.' + this.classes.subRow1.replace(/\s+/g, '.'));
            var subRow2 = this.dom.container.find('.' + this.classes.subRow2.replace(/\s+/g, '.'));
            var topRow = this.dom.container.find('.' + this.classes.topRow.replace(/\s+/g, '.'));
            // If the width is 0 then it is safe to assume that the pane has not yet been displayed.
            //  Even if it has, if the width is 0 it won't make a difference if it has the narrow class or not
            if (($(subContainers[0]).width() < 252 || $(topRow[0]).width() < 252) && $(subContainers[0]).width() !== 0) {
                $(subContainers[0]).addClass(this.classes.narrow);
                $(subRow1[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowSearch);
                $(subRow2[0]).addClass(this.classes.narrowSub).removeClass(this.classes.narrowButton);
            }
            else {
                $(subContainers[0]).removeClass(this.classes.narrow);
                $(subRow1[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowSearch);
                $(subRow2[0]).removeClass(this.classes.narrowSub).addClass(this.classes.narrowButton);
            }
        };
        /**
         * In the case of a rebuild there is potential for new data to have been included or removed
         * so all of the rowData must be reset as a precaution.
         */
        SearchPane.prototype.clearData = function () {
            this.s.rowData = {
                arrayFilter: [],
                arrayOriginal: [],
                arrayTotals: [],
                bins: {},
                binsOriginal: {},
                binsTotal: {},
                filterMap: new Map(),
                totalOptions: 0
            };
        };
        /**
         * Clear the selections in the pane
         */
        SearchPane.prototype.clearPane = function () {
            // Deselect all rows which are selected and update the table and filter count.
            this.s.dtPane.rows({ selected: true }).deselect();
            this.updateTable();
            return this;
        };
        /**
         * Collapses the pane so that only the header is displayed
         */
        SearchPane.prototype.collapse = function () {
            var _this = this;
            if (!this.s.displayed ||
                (!this.c.collapse && this.s.colOpts.collapse !== true ||
                    this.s.colOpts.collapse === false)) {
                return;
            }
            this.dom.collapseButton.addClass(this.classes.rotated);
            $(this.s.dtPane.table().container()).addClass(this.classes.hidden);
            this.dom.topRow.addClass(this.classes.bordered);
            this.dom.countButton.addClass(this.classes.disabledButton);
            this.dom.nameButton.addClass(this.classes.disabledButton);
            this.dom.searchButton.addClass(this.classes.disabledButton);
            this.dom.topRow.one('click', function () {
                _this.show();
            });
        };
        /**
         * Strips all of the SearchPanes elements from the document and turns all of the listeners for the buttons off
         */
        SearchPane.prototype.destroy = function () {
            if (this.s.dtPane !== undefined) {
                this.s.dtPane.off('.dtsp');
            }
            this.dom.nameButton.off('.dtsp');
            this.dom.collapseButton.off('.dtsp');
            this.dom.countButton.off('.dtsp');
            this.dom.clear.off('.dtsp');
            this.dom.searchButton.off('.dtsp');
            this.dom.container.remove();
            var searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            while (searchIdx !== -1) {
                $.fn.dataTable.ext.search.splice(searchIdx, 1);
                searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.searchFunction);
            }
            // If the datatables have been defined for the panes then also destroy these
            if (this.s.dtPane !== undefined) {
                this.s.dtPane.destroy();
            }
            this.s.listSet = false;
        };
        /**
         * Getting the legacy message is a little complex due a legacy parameter
         */
        SearchPane.prototype.emptyMessage = function () {
            var def = this.c.i18n.emptyMessage;
            // Legacy parameter support
            if (this.c.emptyMessage) {
                def = this.c.emptyMessage;
            }
            // Override per column
            if (this.s.colOpts.emptyMessage !== false && this.s.colOpts.emptyMessage !== null) {
                def = this.s.colOpts.emptyMessage;
            }
            return this.s.dt.i18n('searchPanes.emptyMessage', def);
        };
        /**
         * Updates the number of filters that have been applied in the title
         */
        SearchPane.prototype.getPaneCount = function () {
            return this.s.dtPane !== undefined ?
                this.s.dtPane.rows({ selected: true }).data().toArray().length :
                0;
        };
        /**
         * Rebuilds the panes from the start having deleted the old ones
         *
         * @param? last boolean to indicate if this is the last pane a selection was made in
         * @param? dataIn data to be used in buildPane
         * @param? init Whether this is the initial draw or not
         * @param? maintainSelection Whether the current selections are to be maintained over rebuild
         */
        SearchPane.prototype.rebuildPane = function (last, dataIn, init, maintainSelection) {
            if (last === void 0) { last = false; }
            if (dataIn === void 0) { dataIn = null; }
            if (init === void 0) { init = null; }
            if (maintainSelection === void 0) { maintainSelection = false; }
            this.clearData();
            var selectedRows = [];
            this.s.serverSelect = [];
            var prevEl = null;
            // When rebuilding strip all of the HTML Elements out of the container and start from scratch
            if (this.s.dtPane !== undefined) {
                if (maintainSelection) {
                    if (!this.s.dt.page.info().serverSide) {
                        selectedRows = this.s.dtPane.rows({ selected: true }).data().toArray();
                    }
                    else {
                        this.s.serverSelect = this.s.dtPane.rows({ selected: true }).data().toArray();
                    }
                }
                this.s.dtPane.clear().destroy();
                prevEl = this.dom.container.prev();
                this.destroy();
                this.s.dtPane = undefined;
                $.fn.dataTable.ext.search.push(this.s.searchFunction);
            }
            this.dom.container.removeClass(this.classes.hidden);
            this.s.displayed = false;
            this._buildPane(!this.s.dt.page.info().serverSide ?
                selectedRows :
                this.s.serverSelect, last, dataIn, init, prevEl);
            return this;
        };
        /**
         * removes the pane from the page and sets the displayed property to false.
         */
        SearchPane.prototype.removePane = function () {
            this.s.displayed = false;
            this.dom.container.hide();
        };
        /**
         * Resizes the pane based on the layout that is passed in
         *
         * @param layout the layout to be applied to this pane
         */
        SearchPane.prototype.resize = function (layout) {
            this.c.layout = layout;
            var layVal = parseInt(layout.split('-')[1], 10);
            this.dom.container
                .removeClass()
                .addClass(this.classes.container)
                .addClass(this.classes.layout +
                (layVal < 10 ? layout : layout.split('-')[0] + '-9'))
                .addClass(this.s.colOpts.className)
                .addClass(this.customPaneSettings !== null && this.customPaneSettings.className !== undefined
                ? this.customPaneSettings.className
                : '')
                .addClass(this.classes.show);
            this.adjustTopRow();
        };
        /**
         * Sets the cascadeRegen property of the pane. Accessible from above because as SearchPanes.ts
         * deals with the rebuilds.
         *
         * @param val the boolean value that the cascadeRegen property is to be set to
         */
        SearchPane.prototype.setCascadeRegen = function (val) {
            this.s.cascadeRegen = val;
        };
        /**
         * This function allows the clearing property to be assigned. This is used when implementing cascadePane.
         * In setting this to true for the clearing of the panes selection on the deselects it forces the pane to
         * repopulate from the entire dataset not just the displayed values.
         *
         * @param val the boolean value which the clearing property is to be assigned
         */
        SearchPane.prototype.setClear = function (val) {
            this.s.clearing = val;
        };
        /**
         * Expands the pane from the collapsed state
         */
        SearchPane.prototype.show = function () {
            if (!this.s.displayed) {
                return;
            }
            this.dom.collapseButton.removeClass(this.classes.rotated);
            $(this.s.dtPane.table().container()).removeClass(this.classes.hidden);
            this.dom.topRow.removeClass(this.classes.bordered);
            this.dom.countButton.removeClass(this.classes.disabledButton);
            this.dom.nameButton.removeClass(this.classes.disabledButton);
            this.dom.searchButton.removeClass(this.classes.disabledButton);
        };
        /**
         * Updates the values of all of the panes
         *
         * @param draw whether this has been triggered by a draw event or not
         */
        SearchPane.prototype.updatePane = function (draw) {
            if (draw === void 0) { draw = false; }
            this.s.updating = true;
            this._updateCommon(draw);
            this.s.updating = false;
        };
        /**
         * Updates the panes if one of the options to do so has been set to true
         * rather than the filtered message when using viewTotal.
         */
        SearchPane.prototype.updateTable = function () {
            var selectedRows = this.s.dtPane.rows({ selected: true }).data().toArray();
            this.selections = selectedRows;
            this._searchExtras();
            // If either of the options that effect how the panes are displayed are selected then update the Panes
            if (this.c.cascadePanes || this.c.viewTotal) {
                this.updatePane();
            }
        };
        /**
         * Sets the listeners for the pane.
         *
         * Having it in it's own function makes it easier to only set them once
         */
        SearchPane.prototype._setListeners = function () {
            var _this = this;
            var rowData = this.s.rowData;
            var t0;
            // When an item is selected on the pane, add these to the array which holds selected items.
            // Custom search will perform.
            this.s.dtPane.off('select.dtsp');
            this.s.dtPane.on('select.dtsp', function () {
                clearTimeout(t0);
                if (_this.s.dt.page.info().serverSide && !_this.s.updating) {
                    if (!_this.s.serverSelecting) {
                        _this.s.serverSelect = _this.s.dtPane.rows({ selected: true }).data().toArray();
                        _this.s.scrollTop = $(_this.s.dtPane.table().node()).parent()[0].scrollTop;
                        _this.s.selectPresent = true;
                        _this.s.dt.draw(false);
                    }
                }
                else if (!_this.s.updating) {
                    _this.s.selectPresent = true;
                    _this._makeSelection();
                    _this.s.selectPresent = false;
                }
                _this.dom.clear.removeClass(_this.classes.disabledButton).removeAttr('disabled');
            });
            // When an item is deselected on the pane, re add the currently selected items to the array
            // which holds selected items. Custom search will be performed.
            this.s.dtPane.off('deselect.dtsp');
            this.s.dtPane.on('deselect.dtsp', function () {
                t0 = setTimeout(function () {
                    _this.s.scrollTop = $(_this.s.dtPane.table().node()).parent()[0].scrollTop;
                    if (_this.s.dt.page.info().serverSide && !_this.s.updating) {
                        if (!_this.s.serverSelecting) {
                            _this.s.serverSelect = _this.s.dtPane.rows({ selected: true }).data().toArray();
                            _this.s.deselect = true;
                            _this.s.dt.draw(false);
                        }
                    }
                    else {
                        _this.s.deselect = true;
                        _this._makeSelection();
                        _this.s.deselect = false;
                    }
                    if (_this.s.dtPane.rows({ selected: true }).data().toArray().length === 0) {
                        _this.dom.clear.addClass(_this.classes.disabledButton).attr('disabled', 'true');
                    }
                }, 50);
            });
            // If we attempty to turn off this event then it will ruin behaviour in other panes
            //  so need to make sure that it is only done once
            if (this.s.firstSet) {
                this.s.firstSet = false;
                // When saving the state store all of the selected rows for preselection next time around
                this.s.dt.on('stateSaveParams.dtsp', function (e, settings, data) {
                    // If the data being passed in is empty then state clear must have occured
                    // so clear the panes state as well
                    if ($.isEmptyObject(data)) {
                        _this.s.dtPane.state.clear();
                        return;
                    }
                    var selected = [];
                    var searchTerm;
                    var order;
                    var bins;
                    var arrayFilter;
                    var collapsed;
                    // Get all of the data needed for the state save from the pane
                    if (_this.s.dtPane !== undefined) {
                        selected = _this.s.dtPane
                            .rows({ selected: true })
                            .data()
                            .map(function (item) { return item.filter.toString(); })
                            .toArray();
                        searchTerm = _this.dom.searchBox.val();
                        order = _this.s.dtPane.order();
                        bins = rowData.binsOriginal;
                        arrayFilter = rowData.arrayOriginal;
                        collapsed = _this.dom.collapseButton.hasClass(_this.classes.rotated);
                    }
                    if (data.searchPanes === undefined) {
                        data.searchPanes = {};
                    }
                    if (data.searchPanes.panes === undefined) {
                        data.searchPanes.panes = [];
                    }
                    for (var i = 0; i < data.searchPanes.panes.length; i++) {
                        if (data.searchPanes.panes[i].id === _this.s.index) {
                            data.searchPanes.panes.splice(i, 1);
                            i--;
                        }
                    }
                    // Add the panes data to the state object
                    data.searchPanes.panes.push({
                        arrayFilter: arrayFilter,
                        bins: bins,
                        collapsed: collapsed,
                        id: _this.s.index,
                        order: order,
                        searchTerm: searchTerm,
                        selected: selected
                    });
                });
            }
            this.s.dtPane.off('user-select.dtsp');
            this.s.dtPane.on('user-select.dtsp', function (e, _dt, type, cell, originalEvent) {
                originalEvent.stopPropagation();
            });
            this.s.dtPane.off('draw.dtsp');
            this.s.dtPane.on('draw.dtsp', function () {
                _this.adjustTopRow();
            });
            // When the button to order by the name of the options is clicked then
            //  change the ordering to whatever it isn't currently
            this.dom.nameButton.off('click.dtsp');
            this.dom.nameButton.on('click.dtsp', function () {
                var currentOrder = _this.s.dtPane.order()[0][1];
                _this.s.dtPane.order([0, currentOrder === 'asc' ? 'desc' : 'asc']).draw();
                // This state save is required so that the ordering of the panes is maintained
                _this.s.dt.state.save();
            });
            // When the button to order by the number of entries in the column is clicked then
            //  change the ordering to whatever it isn't currently
            this.dom.countButton.off('click.dtsp');
            this.dom.countButton.on('click.dtsp', function () {
                var currentOrder = _this.s.dtPane.order()[0][1];
                _this.s.dtPane.order([1, currentOrder === 'asc' ? 'desc' : 'asc']).draw();
                // This state save is required so that the ordering of the panes is maintained
                _this.s.dt.state.save();
            });
            // When the button to order by the number of entries in the column is clicked then
            //  change the ordering to whatever it isn't currently
            this.dom.collapseButton.off('click.dtsp');
            this.dom.collapseButton.on('click.dtsp', function (e) {
                e.stopPropagation();
                var container = $(_this.s.dtPane.table().container());
                // Toggle the classes
                _this.dom.collapseButton.toggleClass(_this.classes.rotated);
                container.toggleClass(_this.classes.hidden);
                _this.dom.topRow.toggleClass(_this.classes.bordered);
                _this.dom.countButton.toggleClass(_this.classes.disabledButton);
                _this.dom.nameButton.toggleClass(_this.classes.disabledButton);
                _this.dom.searchButton.toggleClass(_this.classes.disabledButton);
                if (container.hasClass(_this.classes.hidden)) {
                    _this.dom.topRow.on('click', function () { return _this.dom.collapseButton.click(); });
                }
                else {
                    _this.dom.topRow.off('click');
                }
                _this.s.dt.state.save();
                return;
            });
            // When the clear button is clicked reset the pane
            this.dom.clear.off('click.dtsp');
            this.dom.clear.on('click.dtsp', function () {
                var searches = _this.dom.container.find('.' + _this.classes.search.replace(/ /g, '.'));
                searches.each(function () {
                    // set the value of the search box to be an empty string and then search on that, effectively reseting
                    $(this).val('');
                    $(this).trigger('input');
                });
                _this.clearPane();
            });
            // When the search button is clicked then draw focus to the search box
            this.dom.searchButton.off('click.dtsp');
            this.dom.searchButton.on('click.dtsp', function () {
                _this.dom.searchBox.focus();
            });
            // When a character is inputted into the searchbox search the pane for matching values.
            // Doing it this way means that no button has to be clicked to trigger a search, it is done asynchronously
            this.dom.searchBox.off('click.dtsp');
            this.dom.searchBox.on('input.dtsp', function () {
                var searchval = _this.dom.searchBox.val();
                _this.s.dtPane.search(searchval).draw();
                if (typeof searchval === 'string' &&
                    (searchval.length > 0 ||
                        searchval.length === 0 && _this.s.dtPane.rows({ selected: true }).data().toArray().length > 0)) {
                    _this.dom.clear.removeClass(_this.classes.disabledButton).removeAttr('disabled');
                }
                else {
                    _this.dom.clear.addClass(_this.classes.disabledButton).attr('disabled', 'true');
                }
                // This state save is required so that the searching on the panes is maintained
                _this.s.dt.state.save();
            });
            return true;
        };
        /**
         * Takes in potentially undetected rows and adds them to the array if they are not yet featured
         *
         * @param filter the filter value of the potential row
         * @param display the display value of the potential row
         * @param sort the sort value of the potential row
         * @param type the type value of the potential row
         * @param arrayFilter the array to be populated
         * @param bins the bins to be populated
         */
        SearchPane.prototype._addOption = function (filter, display, sort, type, arrayFilter, bins) {
            // If the filter is an array then take a note of this, and add the elements to the arrayFilter array
            if (Array.isArray(filter) || filter instanceof dataTable.Api) {
                // Convert to an array so that we can work with it
                if (filter instanceof dataTable.Api) {
                    filter = filter.toArray();
                    display = display.toArray();
                }
                if (filter.length === display.length) {
                    for (var i = 0; i < filter.length; i++) {
                        // If we haven't seen this row before add it
                        if (!bins[filter[i]]) {
                            bins[filter[i]] = 1;
                            arrayFilter.push({
                                display: display[i],
                                filter: filter[i],
                                sort: sort[i],
                                type: type[i]
                            });
                        }
                        // Otherwise just increment the count
                        else {
                            bins[filter[i]]++;
                        }
                        this.s.rowData.totalOptions++;
                    }
                    return;
                }
                else {
                    throw new Error('display and filter not the same length');
                }
            }
            // If the values were affected by othogonal data and are not an array then check if it is already present
            else if (typeof this.s.colOpts.orthogonal === 'string') {
                if (!bins[filter]) {
                    bins[filter] = 1;
                    arrayFilter.push({
                        display: display,
                        filter: filter,
                        sort: sort,
                        type: type
                    });
                    this.s.rowData.totalOptions++;
                }
                else {
                    bins[filter]++;
                    this.s.rowData.totalOptions++;
                    return;
                }
            }
            // Otherwise we must just be adding an option
            else {
                arrayFilter.push({
                    display: display,
                    filter: filter,
                    sort: sort,
                    type: type
                });
            }
        };
        /**
         * Method to construct the actual pane.
         *
         * @param selectedRows previously selected Rows to be reselected
         * @last boolean to indicate whether this pane was the last one to have a selection made
         */
        SearchPane.prototype._buildPane = function (selectedRows, last, dataIn, init, prevEl) {
            var _this = this;
            if (selectedRows === void 0) { selectedRows = []; }
            if (last === void 0) { last = false; }
            if (dataIn === void 0) { dataIn = null; }
            if (init === void 0) { init = null; }
            if (prevEl === void 0) { prevEl = null; }
            // Aliases
            this.selections = [];
            var table = this.s.dt;
            var column = table.column(this.colExists ? this.s.index : 0);
            var colOpts = this.s.colOpts;
            var rowData = this.s.rowData;
            // Other Variables
            var countMessage = table.i18n('searchPanes.count', this.c.i18n.count);
            var filteredMessage = table.i18n('searchPanes.countFiltered', this.c.i18n.countFiltered);
            var loadedFilter = table.state.loaded();
            // If the listeners have not been set yet then using the latest state may result in funny errors
            if (this.s.listSet) {
                loadedFilter = table.state();
            }
            // If it is not a custom pane in place
            if (this.colExists) {
                var idx = -1;
                if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.panes) {
                    for (var i = 0; i < loadedFilter.searchPanes.panes.length; i++) {
                        if (loadedFilter.searchPanes.panes[i].id === this.s.index) {
                            idx = i;
                            break;
                        }
                    }
                }
                // Perform checks that do not require populate pane to run
                if ((colOpts.show === false ||
                    colOpts.show !== undefined && colOpts.show !== true) &&
                    idx === -1) {
                    this.dom.container.addClass(this.classes.hidden);
                    this.s.displayed = false;
                    return false;
                }
                else if (colOpts.show === true || idx !== -1) {
                    this.s.displayed = true;
                }
                if (!this.s.dt.page.info().serverSide &&
                    (dataIn === null ||
                        dataIn.searchPanes === null ||
                        dataIn.searchPanes.options === null)) {
                    // Only run populatePane if the data has not been collected yet
                    if (rowData.arrayFilter.length === 0) {
                        this._populatePane(last);
                        this.s.rowData.totalOptions = 0;
                        this._detailsPane();
                        rowData.arrayOriginal = rowData.arrayTotals;
                        rowData.binsOriginal = rowData.binsTotal;
                    }
                    var binLength = Object.keys(rowData.binsOriginal).length;
                    var uniqueRatio = this._uniqueRatio(binLength, table.rows()[0].length);
                    // Don't show the pane if there isn't enough variance in the data, or there is only 1 entry
                    //  for that pane
                    if (this.s.displayed === false &&
                        ((colOpts.show === undefined && colOpts.threshold === null ?
                            uniqueRatio > this.c.threshold :
                            uniqueRatio > colOpts.threshold) ||
                            colOpts.show !== true && binLength <= 1)) {
                        this.dom.container.addClass(this.classes.hidden);
                        this.s.displayed = false;
                        return;
                    }
                    // If the option viewTotal is true then find
                    // the total count for the whole table to display alongside the displayed count
                    if (this.c.viewTotal && rowData.arrayTotals.length === 0) {
                        this.s.rowData.totalOptions = 0;
                        this._detailsPane();
                    }
                    else {
                        rowData.binsTotal = rowData.bins;
                    }
                    this.dom.container.addClass(this.classes.show);
                    this.s.displayed = true;
                }
                else if (dataIn !== null && dataIn.searchPanes !== null && dataIn.searchPanes.options !== null) {
                    if (dataIn.tableLength !== undefined) {
                        this.s.tableLength = dataIn.tableLength;
                        this.s.rowData.totalOptions = this.s.tableLength;
                    }
                    else if (this.s.tableLength === null || table.rows()[0].length > this.s.tableLength) {
                        this.s.tableLength = table.rows()[0].length;
                        this.s.rowData.totalOptions = this.s.tableLength;
                    }
                    var colTitle = table.column(this.s.index).dataSrc();
                    if (dataIn.searchPanes.options[colTitle] !== undefined) {
                        for (var _i = 0, _a = dataIn.searchPanes.options[colTitle]; _i < _a.length; _i++) {
                            var dataPoint = _a[_i];
                            this.s.rowData.arrayFilter.push({
                                display: dataPoint.label,
                                filter: dataPoint.value,
                                sort: dataPoint.label,
                                type: dataPoint.label
                            });
                            this.s.rowData.bins[dataPoint.value] = this.c.viewTotal || this.c.cascadePanes ?
                                dataPoint.count :
                                dataPoint.total;
                            this.s.rowData.binsTotal[dataPoint.value] = dataPoint.total;
                        }
                    }
                    var binLength = Object.keys(rowData.binsTotal).length;
                    var uniqueRatio = this._uniqueRatio(binLength, this.s.tableLength);
                    // Don't show the pane if there isnt enough variance in the data, or there is only 1 entry for that pane
                    if (this.s.displayed === false &&
                        ((colOpts.show === undefined && colOpts.threshold === null ?
                            uniqueRatio > this.c.threshold :
                            uniqueRatio > colOpts.threshold) ||
                            colOpts.show !== true && binLength <= 1)) {
                        this.dom.container.addClass(this.classes.hidden);
                        this.s.displayed = false;
                        return;
                    }
                    this.s.rowData.arrayOriginal = this.s.rowData.arrayFilter;
                    this.s.rowData.binsOriginal = this.s.rowData.bins;
                    this.s.displayed = true;
                }
            }
            else {
                this.s.displayed = true;
            }
            // If the variance is accceptable then display the search pane
            this._displayPane();
            if (!this.s.listSet) {
                // Here, when the state is loaded if the data object on the original table is empty,
                //  then a state.clear() must have occurred, so delete all of the panes tables state objects too.
                this.dom.dtP.on('stateLoadParams.dt', function (e, settings, data) {
                    if ($.isEmptyObject(table.state.loaded())) {
                        $.each(data, function (index, value) {
                            delete data[index];
                        });
                    }
                });
            }
            // Add the container to the document in its original location
            if (prevEl !== null && this.dom.panesContainer.has(prevEl).length > 0) {
                this.dom.container.insertAfter(prevEl);
            }
            else {
                this.dom.panesContainer.prepend(this.dom.container);
            }
            // Declare the datatable for the pane
            var errMode = $.fn.dataTable.ext.errMode;
            $.fn.dataTable.ext.errMode = 'none';
            // eslint-disable-next-line no-extra-parens
            var haveScroller = dataTable.Scroller;
            this.s.dtPane = this.dom.dtP.DataTable($.extend(true, {
                columnDefs: [
                    {
                        className: 'dtsp-nameColumn',
                        data: 'display',
                        render: function (data, type, row) {
                            if (type === 'sort') {
                                return row.sort;
                            }
                            else if (type === 'type') {
                                return row.type;
                            }
                            var message;
                            message =
                                (_this.s.filteringActive || _this.s.showFiltered) && _this.c.viewTotal ||
                                    _this.c.viewTotal && _this.s.forceViewTotal ?
                                    filteredMessage.replace(/{total}/, row.total) :
                                    countMessage.replace(/{total}/, row.total);
                            message = message.replace(/{shown}/, row.shown);
                            while (message.includes('{total}')) {
                                message = message.replace(/{total}/, row.total);
                            }
                            while (message.includes('{shown}')) {
                                message = message.replace(/{shown}/, row.shown);
                            }
                            // We are displaying the count in the same columne as the name of the search option.
                            // This is so that there is not need to call columns.adjust()
                            //  which in turn speeds up the code
                            var pill = '<span class="' + _this.classes.pill + '">' + message + '</span>';
                            if (!_this.c.viewCount || !colOpts.viewCount) {
                                pill = '';
                            }
                            if (type === 'filter') {
                                return typeof data === 'string' && data.match(/<[^>]*>/) !== null ?
                                    data.replace(/<[^>]*>/g, '') :
                                    data;
                            }
                            return '<div class="' + _this.classes.nameCont + '"><span title="' +
                                (typeof data === 'string' && data.match(/<[^>]*>/) !== null ?
                                    data.replace(/<[^>]*>/g, '') :
                                    data) +
                                '" class="' + _this.classes.name + '">' +
                                data + '</span>' +
                                pill + '</div>';
                        },
                        targets: 0,
                        // Accessing the private datatables property to set type based on the original table.
                        // This is null if not defined by the user, meaning that automatic type detection
                        //  would take place
                        type: table.settings()[0].aoColumns[this.s.index] !== undefined ?
                            table.settings()[0].aoColumns[this.s.index]._sManualType :
                            null
                    },
                    {
                        className: 'dtsp-countColumn ' + this.classes.badgePill,
                        data: 'shown',
                        orderData: [1, 2],
                        searchable: false,
                        targets: 1,
                        visible: false
                    },
                    {
                        data: 'total',
                        searchable: false,
                        targets: 2,
                        visible: false
                    }
                ],
                deferRender: true,
                dom: 't',
                info: false,
                language: this.s.dt.settings()[0].oLanguage,
                paging: haveScroller ? true : false,
                scrollX: false,
                scrollY: '200px',
                scroller: haveScroller ? true : false,
                select: true,
                stateSave: table.settings()[0].oFeatures.bStateSave ? true : false
            }, this.c.dtOpts, colOpts !== undefined ? colOpts.dtOpts : {}, this.s.colOpts.options !== undefined || !this.colExists ?
                {
                    createdRow: function (row, data, dataIndex) {
                        $(row).addClass(data.className);
                    }
                } :
                undefined, this.customPaneSettings !== null && this.customPaneSettings.dtOpts !== undefined ?
                this.customPaneSettings.dtOpts :
                {}, $.fn.dataTable.versionCheck('2')
                ? {
                    layout: {
                        bottomLeft: null,
                        bottomRight: null,
                        topLeft: null,
                        topRight: null
                    }
                }
                : {}));
            this.dom.dtP.addClass(this.classes.table);
            // Getting column titles is a little messy
            var headerText = 'Custom Pane';
            if (this.customPaneSettings && this.customPaneSettings.header) {
                headerText = this.customPaneSettings.header;
            }
            else if (colOpts.header) {
                headerText = colOpts.header;
            }
            else if (this.colExists) {
                headerText = $.fn.dataTable.versionCheck('2')
                    ? table.column(this.s.index).title()
                    : table.settings()[0].aoColumns[this.s.index].sTitle;
            }
            this.dom.searchBox.attr('placeholder', headerText);
            // As the pane table is not in the document yet we must initialise select ourselves
            // eslint-disable-next-line no-extra-parens
            $.fn.dataTable.select.init(this.s.dtPane);
            $.fn.dataTable.ext.errMode = errMode;
            // If it is not a custom pane
            if (this.colExists) {
                // On initialisation, do we need to set a filtering value from a
                // saved state or init option?
                var search = column.search();
                search = search ? search.substr(1, search.length - 2).split('|') : [];
                // Count the number of empty cells
                var count_1 = 0;
                rowData.arrayFilter.forEach(function (element) {
                    if (element.filter === '') {
                        count_1++;
                    }
                });
                // Add all of the search options to the pane
                for (var i = 0, ien = rowData.arrayFilter.length; i < ien; i++) {
                    var selected = false;
                    for (var _b = 0, _c = this.s.serverSelect; _b < _c.length; _b++) {
                        var option = _c[_b];
                        if (option.filter === rowData.arrayFilter[i].filter) {
                            selected = true;
                        }
                    }
                    if (this.s.dt.page.info().serverSide &&
                        (!this.c.cascadePanes ||
                            this.c.cascadePanes && rowData.bins[rowData.arrayFilter[i].filter] !== 0 ||
                            this.c.cascadePanes && init !== null ||
                            selected)) {
                        var row = this.addRow(rowData.arrayFilter[i].display, rowData.arrayFilter[i].filter, init ?
                            rowData.binsTotal[rowData.arrayFilter[i].filter] :
                            rowData.bins[rowData.arrayFilter[i].filter], this.c.viewTotal || init
                            ? String(rowData.binsTotal[rowData.arrayFilter[i].filter])
                            : rowData.bins[rowData.arrayFilter[i].filter], rowData.arrayFilter[i].sort, rowData.arrayFilter[i].type);
                        for (var _d = 0, _e = this.s.serverSelect; _d < _e.length; _d++) {
                            var option = _e[_d];
                            if (option.filter === rowData.arrayFilter[i].filter) {
                                this.s.serverSelecting = true;
                                row.select();
                                this.s.serverSelecting = false;
                            }
                        }
                    }
                    else if (!this.s.dt.page.info().serverSide &&
                        rowData.arrayFilter[i] &&
                        (rowData.bins[rowData.arrayFilter[i].filter] !== undefined || !this.c.cascadePanes)) {
                        this.addRow(rowData.arrayFilter[i].display, rowData.arrayFilter[i].filter, rowData.bins[rowData.arrayFilter[i].filter], rowData.binsTotal[rowData.arrayFilter[i].filter], rowData.arrayFilter[i].sort, rowData.arrayFilter[i].type);
                    }
                    else if (!this.s.dt.page.info().serverSide) {
                        // Just pass an empty string as the message will be calculated based on that in addRow()
                        this.addRow('', count_1, count_1, '', '', '');
                    }
                }
            }
            // eslint-disable-next-line no-extra-parens
            dataTable.select.init(this.s.dtPane);
            // If there are custom options set or it is a custom pane then get them
            if (colOpts.options !== undefined ||
                this.customPaneSettings !== null && this.customPaneSettings.options !== undefined) {
                this._getComparisonRows();
            }
            // Display the pane
            this.s.dtPane.draw();
            this.s.dtPane.table().node().parentNode.scrollTop = this.s.scrollTop;
            this.adjustTopRow();
            if (!this.s.listSet) {
                this._setListeners();
                this.s.listSet = true;
            }
            for (var _f = 0, selectedRows_1 = selectedRows; _f < selectedRows_1.length; _f++) {
                var selection = selectedRows_1[_f];
                if (selection !== undefined) {
                    for (var _g = 0, _h = this.s.dtPane.rows().indexes().toArray(); _g < _h.length; _g++) {
                        var row = _h[_g];
                        if (this.s.dtPane.row(row).data() !== undefined &&
                            selection.filter === this.s.dtPane.row(row).data().filter) {
                            // If this is happening when serverSide processing is happening then
                            //  different behaviour is needed
                            if (this.s.dt.page.info().serverSide) {
                                this.s.serverSelecting = true;
                                this.s.dtPane.row(row).select();
                                this.s.serverSelecting = false;
                            }
                            else {
                                this.s.dtPane.row(row).select();
                            }
                        }
                    }
                }
            }
            //  If SSP and the table is ready, apply the search for the pane
            if (this.s.dt.page.info().serverSide) {
                this.s.dtPane.search(this.dom.searchBox.val()).draw();
            }
            if ((this.c.initCollapsed && this.s.colOpts.initCollapsed !== false ||
                this.s.colOpts.initCollapsed) &&
                (this.c.collapse && this.s.colOpts.collapse !== false ||
                    this.s.colOpts.collapse)) {
                this.collapse();
            }
            // Reload the selection, searchbox entry and ordering from the previous state
            // Need to check here if SSP that this is the first draw, otherwise it will infinite loop
            if (loadedFilter &&
                loadedFilter.searchPanes &&
                loadedFilter.searchPanes.panes &&
                (dataIn === null ||
                    dataIn.draw === 1)) {
                if (!this.c.cascadePanes) {
                    this._reloadSelect(loadedFilter);
                }
                for (var _j = 0, _k = loadedFilter.searchPanes.panes; _j < _k.length; _j++) {
                    var pane = _k[_j];
                    if (pane.id === this.s.index) {
                        // Save some time by only triggering an input if there is a value
                        if (pane.searchTerm && pane.searchTerm.length > 0) {
                            this.dom.searchBox.val(pane.searchTerm);
                            this.dom.searchBox.trigger('input');
                        }
                        this.s.dtPane.order(pane.order).draw();
                        // Is the pane to be hidden or shown?
                        if (pane.collapsed) {
                            this.collapse();
                        }
                        else {
                            this.show();
                        }
                    }
                }
            }
            return true;
        };
        /**
         * Update the array which holds the display and filter values for the table
         */
        SearchPane.prototype._detailsPane = function () {
            var table = this.s.dt;
            this.s.rowData.arrayTotals = [];
            this.s.rowData.binsTotal = {};
            var settings = this.s.dt.settings()[0];
            var indexArray = table.rows().indexes();
            if (!this.s.dt.page.info().serverSide) {
                for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                    var rowIdx = indexArray_1[_i];
                    this._populatePaneArray(rowIdx, this.s.rowData.arrayTotals, settings, this.s.rowData.binsTotal);
                }
            }
        };
        /**
         * Appends all of the HTML elements to their relevant parent Elements
         */
        SearchPane.prototype._displayPane = function () {
            var container = this.dom.container;
            var colOpts = this.s.colOpts;
            var layVal = parseInt(this.c.layout.split('-')[1], 10);
            // Empty everything to start again
            this.dom.topRow.empty();
            this.dom.dtP.empty();
            this.dom.topRow.addClass(this.classes.topRow);
            // If there are more than 3 columns defined then make there be a smaller gap between the panes
            if (layVal > 3) {
                this.dom.container.addClass(this.classes.smallGap);
            }
            this.dom.topRow.addClass(this.classes.subRowsContainer);
            this.dom.upper.appendTo(this.dom.topRow);
            this.dom.lower.appendTo(this.dom.topRow);
            this.dom.searchCont.appendTo(this.dom.upper);
            this.dom.buttonGroup.appendTo(this.dom.lower);
            // If no selections have been made in the pane then disable the clear button
            if (this.c.dtOpts.searching === false ||
                colOpts.dtOpts !== undefined && colOpts.dtOpts.searching === false ||
                (!this.c.controls || !colOpts.controls) ||
                this.customPaneSettings !== null &&
                    this.customPaneSettings.dtOpts !== undefined &&
                    this.customPaneSettings.dtOpts.searching !== undefined &&
                    !this.customPaneSettings.dtOpts.searching) {
                this.dom.searchBox
                    .removeClass(this.classes.paneInputButton)
                    .addClass(this.classes.disabledButton)
                    .attr('disabled', 'true');
            }
            this.dom.searchBox.appendTo(this.dom.searchCont);
            // Create the contents of the searchCont div. Worth noting that this function will change when using semantic ui
            this._searchContSetup();
            // If the clear button is allowed to show then display it
            if (this.c.clear && this.c.controls && colOpts.controls) {
                this.dom.clear.appendTo(this.dom.buttonGroup);
            }
            if (this.c.orderable && colOpts.orderable && this.c.controls && colOpts.controls) {
                this.dom.nameButton.appendTo(this.dom.buttonGroup);
            }
            // If the count column is hidden then don't display the ordering button for it
            if (this.c.viewCount &&
                colOpts.viewCount &&
                this.c.orderable &&
                colOpts.orderable &&
                this.c.controls &&
                colOpts.controls) {
                this.dom.countButton.appendTo(this.dom.buttonGroup);
            }
            if ((this.c.collapse && this.s.colOpts.collapse !== false ||
                this.s.colOpts.collapse) &&
                this.c.controls && colOpts.controls) {
                this.dom.collapseButton.appendTo(this.dom.buttonGroup);
            }
            this.dom.topRow.prependTo(this.dom.container);
            container.append(this.dom.dtP);
            container.show();
        };
        /**
         * Gets the options for the row for the customPanes
         *
         * @returns {object} The options for the row extended to include the options from the user.
         */
        SearchPane.prototype._getBonusOptions = function () {
            // We need to reset the thresholds as if they have a value in colOpts then that value will be used
            var defaultMutator = {
                orthogonal: {
                    threshold: null
                },
                threshold: null
            };
            return $.extend(true, {}, SearchPane.defaults, defaultMutator, this.c !== undefined ? this.c : {});
        };
        /**
         * Adds the custom options to the pane
         *
         * @returns {Array} Returns the array of rows which have been added to the pane
         */
        SearchPane.prototype._getComparisonRows = function () {
            var colOpts = this.s.colOpts;
            // Find the appropriate options depending on whether this is a pane for a specific column or a custom pane
            var options = colOpts.options !== undefined
                ? colOpts.options
                : this.customPaneSettings !== null && this.customPaneSettings.options !== undefined
                    ? this.customPaneSettings.options
                    : undefined;
            if (options === undefined) {
                return;
            }
            var tableVals = this.s.dt.rows({ search: 'applied' }).data().toArray();
            var appRows = this.s.dt.rows({ search: 'applied' });
            var tableValsTotal = this.s.dt.rows().data().toArray();
            var allRows = this.s.dt.rows();
            var rows = [];
            // Clear all of the other rows from the pane, only custom options are to be displayed when they are defined
            this.s.dtPane.clear();
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var comp = options_1[_i];
                // Initialise the object which is to be placed in the row
                var insert = comp.label !== '' ?
                    comp.label :
                    this.emptyMessage();
                var comparisonObj = {
                    className: comp.className,
                    display: insert,
                    filter: typeof comp.value === 'function' ? comp.value : [],
                    shown: 0,
                    sort: insert,
                    total: 0,
                    type: insert
                };
                // If a custom function is in place
                if (typeof comp.value === 'function') {
                    // Count the number of times the function evaluates to true for the data currently being displayed
                    for (var tVal = 0; tVal < tableVals.length; tVal++) {
                        if (comp.value.call(this.s.dt, tableVals[tVal], appRows[0][tVal])) {
                            comparisonObj.shown++;
                        }
                    }
                    // Count the number of times the function evaluates to true for the original data in the Table
                    for (var i = 0; i < tableValsTotal.length; i++) {
                        if (comp.value.call(this.s.dt, tableValsTotal[i], allRows[0][i])) {
                            comparisonObj.total++;
                        }
                    }
                    // Update the comparisonObj
                    if (typeof comparisonObj.filter !== 'function') {
                        comparisonObj.filter.push(comp.filter);
                    }
                }
                // If cascadePanes is not active or if it is and the comparisonObj should be shown then add it to the pane
                if (!this.c.cascadePanes || this.c.cascadePanes && comparisonObj.shown !== 0) {
                    rows.push(this.addRow(comparisonObj.display, comparisonObj.filter, comparisonObj.shown, comparisonObj.total, comparisonObj.sort, comparisonObj.type, comparisonObj.className));
                }
            }
            return rows;
        };
        /**
         * Gets the options for the row for the customPanes
         *
         * @returns {object} The options for the row extended to include the options from the user.
         */
        SearchPane.prototype._getOptions = function () {
            var table = this.s.dt;
            // We need to reset the thresholds as if they have a value in colOpts then that value will be used
            var defaultMutator = {
                collapse: null,
                emptyMessage: false,
                initCollapsed: null,
                orthogonal: {
                    threshold: null
                },
                threshold: null
            };
            var columnOptions = table.settings()[0].aoColumns[this.s.index].searchPanes;
            var colOpts = $.extend(true, {}, SearchPane.defaults, defaultMutator, columnOptions);
            if (columnOptions !== undefined &&
                columnOptions.hideCount !== undefined &&
                columnOptions.viewCount === undefined) {
                colOpts.viewCount = !columnOptions.hideCount;
            }
            return colOpts;
        };
        /**
         * This method allows for changes to the panes and table to be made when a selection or a deselection occurs
         *
         * @param select Denotes whether a selection has been made or not
         */
        SearchPane.prototype._makeSelection = function () {
            this.updateTable();
            this.s.updating = true;
            this.s.dt.draw();
            this.s.updating = false;
        };
        /**
         * Fill the array with the values that are currently being displayed in the table
         *
         * @param last boolean to indicate whether this was the last pane a selection was made in
         */
        SearchPane.prototype._populatePane = function (last) {
            if (last === void 0) { last = false; }
            var table = this.s.dt;
            this.s.rowData.arrayFilter = [];
            this.s.rowData.bins = {};
            var settings = this.s.dt.settings()[0];
            // If cascadePanes or viewTotal are active it is necessary to get the data which is currently
            // being displayed for their functionality.
            // Also make sure that this was not the last pane to have a selection made
            if (!this.s.dt.page.info().serverSide) {
                var indexArray = (this.c.cascadePanes || this.c.viewTotal) && (!this.s.clearing && !last) ?
                    table.rows({ search: 'applied' }).indexes() :
                    table.rows().indexes();
                for (var _i = 0, _a = indexArray.toArray(); _i < _a.length; _i++) {
                    var index = _a[_i];
                    this._populatePaneArray(index, this.s.rowData.arrayFilter, settings);
                }
            }
        };
        /**
         * Populates an array with all of the data for the table
         *
         * @param rowIdx The current row index to be compared
         * @param arrayFilter The array that is to be populated with row Details
         * @param bins The bins object that is to be populated with the row counts
         */
        SearchPane.prototype._populatePaneArray = function (rowIdx, arrayFilter, settings, bins) {
            if (bins === void 0) { bins = this.s.rowData.bins; }
            var colOpts = this.s.colOpts;
            // Retrieve the rendered data from the cell using the fnGetCellData function
            // rather than the cell().render API method for optimisation
            if (typeof colOpts.orthogonal === 'string') {
                var rendered = settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal);
                this.s.rowData.filterMap.set(rowIdx, rendered);
                this._addOption(rendered, rendered, rendered, rendered, arrayFilter, bins);
            }
            else {
                var filter = settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.search);
                // Null and empty string are to be considered the same value
                if (filter === null) {
                    filter = '';
                }
                if (typeof filter === 'string') {
                    filter = filter.replace(/<[^>]*>/g, '');
                }
                this.s.rowData.filterMap.set(rowIdx, filter);
                if (!bins[filter]) {
                    bins[filter] = 1;
                    this._addOption(filter, settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.display), settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.sort), settings.oApi._fnGetCellData(settings, rowIdx, this.s.index, colOpts.orthogonal.type), arrayFilter, bins);
                    this.s.rowData.totalOptions++;
                }
                else {
                    bins[filter]++;
                    this.s.rowData.totalOptions++;
                    return;
                }
            }
        };
        /**
         * Reloads all of the previous selects into the panes
         *
         * @param loadedFilter The loaded filters from a previous state
         */
        SearchPane.prototype._reloadSelect = function (loadedFilter) {
            // If the state was not saved don't selected any
            if (loadedFilter === undefined) {
                return;
            }
            var idx;
            // For each pane, check that the loadedFilter list exists and is not null,
            // find the id of each search item and set it to be selected.
            for (var i = 0; i < loadedFilter.searchPanes.panes.length; i++) {
                if (loadedFilter.searchPanes.panes[i].id === this.s.index) {
                    idx = i;
                    break;
                }
            }
            if (idx !== undefined) {
                var table = this.s.dtPane;
                var rows = table.rows({ order: 'index' }).data().map(function (item) { return item.filter !== null ?
                    item.filter.toString() :
                    null; }).toArray();
                for (var _i = 0, _a = loadedFilter.searchPanes.panes[idx].selected; _i < _a.length; _i++) {
                    var filter = _a[_i];
                    var id = -1;
                    if (filter !== null) {
                        id = rows.indexOf(filter.toString());
                    }
                    if (id > -1) {
                        this.s.serverSelecting = true;
                        table.row(id).select();
                        this.s.serverSelecting = false;
                    }
                }
            }
        };
        /**
         * This method decides whether a row should contribute to the pane or not
         *
         * @param filter the value that the row is to be filtered on
         * @param dataIndex the row index
         */
        SearchPane.prototype._search = function (filter, dataIndex) {
            var colOpts = this.s.colOpts;
            var table = this.s.dt;
            // For each item selected in the pane, check if it is available in the cell
            for (var _i = 0, _a = this.selections; _i < _a.length; _i++) {
                var colSelect = _a[_i];
                if (typeof colSelect.filter === 'string' && typeof filter === 'string') {
                    // The filter value will not have the &amp; in place but a &,
                    // so we need to do a replace to make sure that they will match
                    colSelect.filter = colSelect.filter
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"');
                }
                // if the filter is an array then is the column present in it
                if (Array.isArray(filter)) {
                    if (filter.includes(colSelect.filter)) {
                        return true;
                    }
                }
                // if the filter is a function then does it meet the criteria of that function or not
                else if (typeof colSelect.filter === 'function') {
                    if (colSelect.filter.call(table, table.row(dataIndex).data(), dataIndex)) {
                        if (colOpts.combiner === 'or') {
                            return true;
                        }
                    }
                    // If the combiner is an "and" then we need to check against all possible selections
                    // so if it fails here then the and is not met and return false
                    else if (colOpts.combiner === 'and') {
                        return false;
                    }
                }
                // otherwise if the two filter values are equal then return true
                else if (filter === colSelect.filter ||
                    // Loose type checking incase number type in column comparing to a string
                    // eslint-disable-next-line eqeqeq
                    !(typeof filter === 'string' && filter.length === 0) && filter == colSelect.filter ||
                    colSelect.filter === null && typeof filter === 'string' && filter === '') {
                    return true;
                }
            }
            // If the combiner is an and then we need to check against all possible selections
            // so return true here if so because it would have returned false earlier if it had failed
            if (colOpts.combiner === 'and') {
                return true;
            }
            // Otherwise it hasn't matched with anything by this point so it must be false
            else {
                return false;
            }
        };
        /**
         * Creates the contents of the searchCont div
         *
         * NOTE This is overridden when semantic ui styling in order to integrate the search button into the text box.
         */
        SearchPane.prototype._searchContSetup = function () {
            if (this.c.controls && this.s.colOpts.controls) {
                this.dom.searchButton.appendTo(this.dom.searchLabelCont);
            }
            if (!(this.c.dtOpts.searching === false ||
                this.s.colOpts.dtOpts.searching === false ||
                this.customPaneSettings !== null &&
                    this.customPaneSettings.dtOpts !== undefined &&
                    this.customPaneSettings.dtOpts.searching !== undefined &&
                    !this.customPaneSettings.dtOpts.searching)) {
                this.dom.searchLabelCont.appendTo(this.dom.searchCont);
            }
        };
        /**
         * Adds outline to the pane when a selection has been made
         */
        SearchPane.prototype._searchExtras = function () {
            var updating = this.s.updating;
            this.s.updating = true;
            var filters = this.s.dtPane.rows({ selected: true }).data().pluck('filter').toArray();
            var nullIndex = filters.indexOf(this.emptyMessage());
            var container = $(this.s.dtPane.table().container());
            // If null index is found then search for empty cells as a filter.
            if (nullIndex > -1) {
                filters[nullIndex] = '';
            }
            // If a filter has been applied then outline the respective pane, remove it when it no longer is.
            if (filters.length > 0) {
                container.addClass(this.classes.selected);
            }
            else if (filters.length === 0) {
                container.removeClass(this.classes.selected);
            }
            this.s.updating = updating;
        };
        /**
         * Finds the ratio of the number of different options in the table to the number of rows
         *
         * @param bins the number of different options in the table
         * @param rowCount the total number of rows in the table
         * @returns {number} returns the ratio
         */
        SearchPane.prototype._uniqueRatio = function (bins, rowCount) {
            if (rowCount > 0 &&
                (this.s.rowData.totalOptions > 0 && !this.s.dt.page.info().serverSide ||
                    this.s.dt.page.info().serverSide && this.s.tableLength > 0)) {
                return bins / this.s.rowData.totalOptions;
            }
            else {
                return 1;
            }
        };
        /**
         * updates the options within the pane
         *
         * @param draw a flag to define whether this has been called due to a draw event or not
         */
        SearchPane.prototype._updateCommon = function (draw) {
            if (draw === void 0) { draw = false; }
            // Update the panes if doing a deselect. if doing a select then
            // update all of the panes except for the one causing the change
            if (!this.s.dt.page.info().serverSide &&
                this.s.dtPane !== undefined &&
                (!this.s.filteringActive || this.c.cascadePanes || draw === true) &&
                (this.c.cascadePanes !== true || this.s.selectPresent !== true) &&
                (!this.s.lastSelect || !this.s.lastCascade)) {
                var colOpts = this.s.colOpts;
                var selected = this.s.dtPane.rows({ selected: true }).data().toArray();
                var rowData = this.s.rowData;
                // Clear the pane in preparation for adding the updated search options
                this.s.dtPane.clear();
                // If it is not a custom pane
                if (this.colExists) {
                    // Only run populatePane if the data has not been collected yet
                    if (rowData.arrayFilter.length === 0) {
                        this._populatePane(!this.s.filteringActive);
                    }
                    // If cascadePanes is active and the table has returned to its default state then
                    // there is a need to update certain parts ofthe rowData.
                    else if (this.c.cascadePanes &&
                        this.s.dt.rows().data().toArray().length ===
                            this.s.dt.rows({ search: 'applied' }).data().toArray().length) {
                        rowData.arrayFilter = rowData.arrayOriginal;
                        rowData.bins = rowData.binsOriginal;
                    }
                    // Otherwise if viewTotal or cascadePanes is active then the data from the table must be read.
                    else if (this.c.viewTotal || this.c.cascadePanes) {
                        this._populatePane(!this.s.filteringActive);
                    }
                    // If the viewTotal option is selected then find the totals for the table
                    if (this.c.viewTotal) {
                        this._detailsPane();
                    }
                    else {
                        rowData.binsTotal = rowData.bins;
                    }
                    if (this.c.viewTotal && !this.c.cascadePanes) {
                        rowData.arrayFilter = rowData.arrayTotals;
                    }
                    var _loop_1 = function (dataP) {
                        // If both view Total and cascadePanes have been selected and the count of the row
                        // is not 0 then add it to pane
                        // Do this also if the viewTotal option has been selected and cascadePanes has not
                        if (dataP &&
                            (rowData.bins[dataP.filter] !== undefined &&
                                rowData.bins[dataP.filter] !== 0 &&
                                this_1.c.cascadePanes ||
                                !this_1.c.cascadePanes ||
                                this_1.s.clearing)) {
                            var row = this_1.addRow(dataP.display, dataP.filter, !this_1.c.viewTotal ?
                                rowData.bins[dataP.filter] :
                                rowData.bins[dataP.filter] !== undefined ?
                                    rowData.bins[dataP.filter] :
                                    0, this_1.c.viewTotal ?
                                String(rowData.binsTotal[dataP.filter]) :
                                rowData.bins[dataP.filter], dataP.sort, dataP.type);
                            // Find out if the filter was selected in the previous search,
                            // if so select it and remove from array.
                            var selectIndex = selected.findIndex(function (element) {
                                return element.filter === dataP.filter;
                            });
                            if (selectIndex !== -1) {
                                row.select();
                                selected.splice(selectIndex, 1);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = rowData.arrayFilter; _i < _a.length; _i++) {
                        var dataP = _a[_i];
                        _loop_1(dataP);
                    }
                }
                if (colOpts.searchPanes !== undefined && colOpts.searchPanes.options !== undefined ||
                    colOpts.options !== undefined ||
                    this.customPaneSettings !== null && this.customPaneSettings.options !== undefined) {
                    var rows = this._getComparisonRows();
                    var _loop_2 = function (row) {
                        var selectIndex = selected.findIndex(function (element) {
                            if (element.display === row.data().display) {
                                return true;
                            }
                        });
                        if (selectIndex !== -1) {
                            row.select();
                            selected.splice(selectIndex, 1);
                        }
                    };
                    for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
                        var row = rows_1[_b];
                        _loop_2(row);
                    }
                }
                // Add search options which were previously selected but whos results are no
                // longer present in the resulting data set.
                for (var _c = 0, selected_1 = selected; _c < selected_1.length; _c++) {
                    var selectedEl = selected_1[_c];
                    var row = this.addRow(selectedEl.display, selectedEl.filter, 0, this.c.viewTotal
                        ? selectedEl.total
                        : 0, selectedEl.display, selectedEl.display);
                    this.s.updating = true;
                    row.select();
                    this.s.updating = false;
                }
                this.s.dtPane.draw();
                this.s.dtPane.table().node().parentNode.scrollTop = this.s.scrollTop;
            }
        };
        SearchPane.version = '1.3.0';
        SearchPane.classes = {
            bordered: 'dtsp-bordered',
            buttonGroup: 'dtsp-buttonGroup',
            buttonSub: 'dtsp-buttonSub',
            clear: 'dtsp-clear',
            clearAll: 'dtsp-clearAll',
            clearButton: 'clearButton',
            collapseAll: 'dtsp-collapseAll',
            collapseButton: 'dtsp-collapseButton',
            container: 'dtsp-searchPane',
            countButton: 'dtsp-countButton',
            disabledButton: 'dtsp-disabledButton',
            hidden: 'dtsp-hidden',
            hide: 'dtsp-hide',
            layout: 'dtsp-',
            name: 'dtsp-name',
            nameButton: 'dtsp-nameButton',
            nameCont: 'dtsp-nameCont',
            narrow: 'dtsp-narrow',
            paneButton: 'dtsp-paneButton',
            paneInputButton: 'dtsp-paneInputButton',
            pill: 'dtsp-pill',
            rotated: 'dtsp-rotated',
            search: 'dtsp-search',
            searchCont: 'dtsp-searchCont',
            searchIcon: 'dtsp-searchIcon',
            searchLabelCont: 'dtsp-searchButtonCont',
            selected: 'dtsp-selected',
            smallGap: 'dtsp-smallGap',
            subRow1: 'dtsp-subRow1',
            subRow2: 'dtsp-subRow2',
            subRowsContainer: 'dtsp-subRowsContainer',
            title: 'dtsp-title',
            topRow: 'dtsp-topRow'
        };
        // Define SearchPanes default options
        SearchPane.defaults = {
            cascadePanes: false,
            clear: true,
            collapse: true,
            combiner: 'or',
            container: function (dt) {
                return dt.table().container();
            },
            controls: true,
            dtOpts: {},
            emptyMessage: null,
            hideCount: false,
            i18n: {
                clearPane: '&times;',
                count: '{total}',
                countFiltered: '{shown} ({total})',
                emptyMessage: '<em>No data</em>'
            },
            initCollapsed: false,
            layout: 'auto',
            name: undefined,
            orderable: true,
            orthogonal: {
                display: 'display',
                filter: 'filter',
                hideCount: false,
                search: 'filter',
                show: undefined,
                sort: 'sort',
                threshold: 0.6,
                type: 'type',
                viewCount: true
            },
            preSelect: [],
            threshold: 0.6,
            viewCount: true,
            viewTotal: false
        };
        return SearchPane;
    }());

    var $$1;
    var dataTable$1;
    function setJQuery$1(jq) {
        $$1 = jq;
        dataTable$1 = jq.fn.dataTable;
    }
    var SearchPanes = /** @class */ (function () {
        function SearchPanes(paneSettings, opts, fromInit) {
            var _this = this;
            if (fromInit === void 0) { fromInit = false; }
            this.regenerating = false;
            // Check that the required version of DataTables is included
            if (!dataTable$1 || !dataTable$1.versionCheck || !dataTable$1.versionCheck('1.10.0')) {
                throw new Error('SearchPane requires DataTables 1.10 or newer');
            }
            // Check that Select is included
            // eslint-disable-next-line no-extra-parens
            if (!dataTable$1.select) {
                throw new Error('SearchPane requires Select');
            }
            var table = new dataTable$1.Api(paneSettings);
            this.classes = $$1.extend(true, {}, SearchPanes.classes);
            // Get options from user
            this.c = $$1.extend(true, {}, SearchPanes.defaults, opts);
            // Add extra elements to DOM object including clear
            this.dom = {
                clearAll: $$1('<button type="button">Clear All</button>').addClass(this.classes.clearAll),
                collapseAll: $$1('<button type="button">Collapse All</button>').addClass(this.classes.collapseAll),
                container: $$1('<div/>').addClass(this.classes.panes).text(table.i18n('searchPanes.loadMessage', this.c.i18n.loadMessage)),
                emptyMessage: $$1('<div/>').addClass(this.classes.emptyMessage),
                options: $$1('<div/>').addClass(this.classes.container),
                panes: $$1('<div/>').addClass(this.classes.container),
                showAll: $$1('<button type="button">Show All</button>')
                    .addClass(this.classes.showAll)
                    .addClass(this.classes.disabledButton)
                    .attr('disabled', 'true'),
                title: $$1('<div/>').addClass(this.classes.title),
                titleRow: $$1('<div/>').addClass(this.classes.titleRow),
                wrapper: $$1('<div/>')
            };
            this.s = {
                colOpts: [],
                dt: table,
                filterCount: 0,
                filterPane: -1,
                page: 0,
                paging: false,
                panes: [],
                selectionList: [],
                serverData: {},
                stateRead: false,
                updating: false
            };
            if (table.settings()[0]._searchPanes !== undefined) {
                return;
            }
            this._getState();
            if (this.s.dt.page.info().serverSide) {
                table.on('preXhr.dt', function (e, settings, data) {
                    if (data.searchPanes === undefined) {
                        data.searchPanes = {};
                    }
                    if (data.searchPanes_null === undefined) {
                        data.searchPanes_null = {};
                    }
                    for (var _i = 0, _a = _this.s.selectionList; _i < _a.length; _i++) {
                        var selection = _a[_i];
                        var src = _this.s.dt.column(selection.index).dataSrc();
                        if (data.searchPanes[src] === undefined) {
                            data.searchPanes[src] = {};
                        }
                        if (data.searchPanes_null[src] === undefined) {
                            data.searchPanes_null[src] = {};
                        }
                        for (var i = 0; i < selection.rows.length; i++) {
                            data.searchPanes[src][i] = selection.rows[i].filter;
                            if (data.searchPanes[src][i] === null) {
                                data.searchPanes_null[src][i] = true;
                            }
                        }
                    }
                });
            }
            // We are using the xhr event to rebuild the panes if required due to viewTotal being enabled
            // If viewTotal is not enabled then we simply update the data from the server
            table.on('xhr', function (e, settings, json, xhr) {
                if (json && json.searchPanes && json.searchPanes.options) {
                    _this.s.serverData = json;
                    _this.s.serverData.tableLength = json.recordsTotal;
                    _this._serverTotals();
                }
            });
            table.settings()[0]._searchPanes = this;
            this.dom.clearAll.text(table.i18n('searchPanes.clearMessage', this.c.i18n.clearMessage));
            this.dom.collapseAll.text(table.i18n('searchPanes.collapseMessage', this.c.i18n.collapseMessage));
            this.dom.showAll.text(table.i18n('searchPanes.showMessage', this.c.i18n.showMessage));
            if (this.s.dt.settings()[0]._bInitComplete || fromInit) {
                this._paneDeclare(table, paneSettings, opts);
            }
            else {
                table.one('preInit.dt', function (settings) {
                    _this._paneDeclare(table, paneSettings, opts);
                });
            }
            return this;
        }
        /**
         * Clear the selections of all of the panes
         */
        SearchPanes.prototype.clearSelections = function () {
            // Load in all of the searchBoxes in the documents
            var searches = this.dom.container.find('.' + this.classes.search.replace(/\s+/g, '.'));
            // For each searchBox set the input text to be empty and then trigger
            // an input on them so that they no longer filter the panes
            searches.each(function () {
                $$1(this).val('');
                $$1(this).trigger('input');
            });
            var returnArray = [];
            // Clear the selectionList to prevent cascadePanes from reselecting rows
            this.s.selectionList = [];
            // For every pane, clear the selections in the pane
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    returnArray.push(pane.clearPane());
                }
            }
            return returnArray;
        };
        /**
         * returns the container node for the searchPanes
         */
        SearchPanes.prototype.getNode = function () {
            return this.dom.container;
        };
        /**
         * rebuilds all of the panes
         */
        SearchPanes.prototype.rebuild = function (targetIdx, maintainSelection) {
            if (targetIdx === void 0) { targetIdx = false; }
            if (maintainSelection === void 0) { maintainSelection = false; }
            this.dom.emptyMessage.remove();
            // As a rebuild from scratch is required, empty the searchpanes container.
            var returnArray = [];
            // Rebuild each pane individually, if a specific pane has been selected then only rebuild that one
            if (targetIdx === false) {
                this.dom.panes.empty();
            }
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (targetIdx !== false && pane.s.index !== targetIdx) {
                    continue;
                }
                pane.clearData();
                returnArray.push(
                // Pass a boolean to say whether this is the last choice made for maintaining selections when rebuilding
                pane.rebuildPane(this.s.selectionList[this.s.selectionList.length - 1] !== undefined ?
                    pane.s.index === this.s.selectionList[this.s.selectionList.length - 1].index :
                    false, this.s.dt.page.info().serverSide ?
                    this.s.serverData :
                    undefined, null, maintainSelection));
                this.dom.panes.append(pane.dom.container);
            }
            if (this.c.cascadePanes || this.c.viewTotal) {
                this.redrawPanes(true);
            }
            else {
                this._updateSelection();
            }
            // Attach panes, clear buttons, and title bar to the document
            this._updateFilterCount();
            this._attachPaneContainer();
            // If the selections are to be maintained, then it is safe to assume that paging is also to be maintained
            // Otherwise, the paging should be reset
            this.s.dt.draw(!maintainSelection);
            // Resize the panes incase there has been a change
            this.resizePanes();
            // If a single pane has been rebuilt then return only that pane
            if (returnArray.length === 1) {
                return returnArray[0];
            }
            // Otherwise return all of the panes that have been rebuilt
            else {
                return returnArray;
            }
        };
        /**
         * Redraws all of the panes
         */
        SearchPanes.prototype.redrawPanes = function (rebuild) {
            if (rebuild === void 0) { rebuild = false; }
            var table = this.s.dt;
            // Only do this if the redraw isn't being triggered by the panes updating themselves
            if (!this.s.updating && !this.s.dt.page.info().serverSide) {
                var filterActive = true;
                var filterPane = this.s.filterPane;
                var selectTotal = null;
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    if (pane.s.dtPane !== undefined) {
                        selectTotal += pane.s.dtPane.rows({ selected: true }).data().toArray().length;
                    }
                }
                // If the number of rows currently visible is equal to the number of rows in the table
                // then there can't be any filtering taking place
                if (selectTotal === 0 &&
                    table.rows({ search: 'applied' }).data().toArray().length === table.rows().data().toArray().length) {
                    filterActive = false;
                }
                // Otherwise if viewTotal is active then it is necessary to determine which panes a select is present in.
                // If there is only one pane with a selection present then it should not show the filtered message as
                // more selections may be made in that pane.
                else if (this.c.viewTotal) {
                    for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                        var pane = _c[_b];
                        if (pane.s.dtPane !== undefined) {
                            var selectLength = pane.s.dtPane.rows({ selected: true }).data().toArray().length;
                            if (selectLength === 0) {
                                for (var _d = 0, _e = this.s.selectionList; _d < _e.length; _d++) {
                                    var selection = _e[_d];
                                    if (selection.index === pane.s.index && selection.rows.length !== 0) {
                                        selectLength = selection.rows.length;
                                    }
                                }
                            }
                            // If filterPane === -1 then a pane with a selection has not been found yet,
                            // so set filterPane to that panes index
                            if (selectLength > 0 && filterPane === -1) {
                                filterPane = pane.s.index;
                            }
                            // Then if another pane is found with a selection then set filterPane to null to
                            // show that multiple panes have selections present
                            else if (selectLength > 0) {
                                filterPane = null;
                            }
                        }
                    }
                    // If the searchbox is in place and filtering is applied then need to cascade down anyway
                    if (selectTotal === 0) {
                        filterPane = null;
                    }
                }
                var deselectIdx = void 0;
                var newSelectionList = [];
                // Don't run this if it is due to the panes regenerating
                if (!this.regenerating) {
                    for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                        var pane = _g[_f];
                        // Identify the pane where a selection or deselection has been made and add it to the list.
                        if (pane.s.selectPresent) {
                            this.s.selectionList.push({
                                index: pane.s.index,
                                protect: false,
                                rows: pane.s.dtPane.rows({ selected: true }).data().toArray()
                            });
                            break;
                        }
                        else if (pane.s.deselect) {
                            deselectIdx = pane.s.index;
                            var selectedData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                            if (selectedData.length > 0) {
                                this.s.selectionList.push({
                                    index: pane.s.index,
                                    protect: true,
                                    rows: selectedData
                                });
                            }
                        }
                    }
                    if (this.s.selectionList.length > 0) {
                        var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                        for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                            var pane = _j[_h];
                            pane.s.lastSelect = pane.s.index === last;
                        }
                    }
                    // Remove selections from the list from the pane where a deselect has taken place
                    for (var i = 0; i < this.s.selectionList.length; i++) {
                        if (this.s.selectionList[i].index !== deselectIdx || this.s.selectionList[i].protect === true) {
                            var further = false;
                            // Find out if this selection is the last one in the list for that pane
                            for (var j = i + 1; j < this.s.selectionList.length; j++) {
                                if (this.s.selectionList[j].index === this.s.selectionList[i].index) {
                                    further = true;
                                }
                            }
                            // If there are no selections for this pane in the list then just push this one
                            if (!further) {
                                newSelectionList.push(this.s.selectionList[i]);
                                this.s.selectionList[i].protect = false;
                            }
                        }
                    }
                    var solePane = -1;
                    if (newSelectionList.length === 1 && selectTotal !== null && selectTotal !== 0) {
                        solePane = newSelectionList[0].index;
                    }
                    // Update all of the panes to reflect the current state of the filters
                    for (var _k = 0, _l = this.s.panes; _k < _l.length; _k++) {
                        var pane = _l[_k];
                        if (pane.s.dtPane !== undefined) {
                            var tempFilter = true;
                            pane.s.filteringActive = true;
                            if (filterPane !== -1 && filterPane !== null && filterPane === pane.s.index ||
                                filterActive === false ||
                                pane.s.index === solePane) {
                                tempFilter = false;
                                pane.s.filteringActive = false;
                            }
                            pane.updatePane(!tempFilter ? false : filterActive);
                        }
                    }
                    // If the length of the selections are different then some of them have been
                    // removed and a deselect has occured
                    if (newSelectionList.length > 0 && (newSelectionList.length < this.s.selectionList.length || rebuild)) {
                        this._cascadeRegen(newSelectionList, selectTotal);
                        var last = newSelectionList[newSelectionList.length - 1].index;
                        for (var _m = 0, _o = this.s.panes; _m < _o.length; _m++) {
                            var pane = _o[_m];
                            pane.s.lastSelect = pane.s.index === last;
                        }
                    }
                    else if (newSelectionList.length > 0) {
                        // Update all of the other panes as you would just making a normal selection
                        for (var _p = 0, _q = this.s.panes; _p < _q.length; _p++) {
                            var paneUpdate = _q[_p];
                            if (paneUpdate.s.dtPane !== undefined) {
                                var tempFilter = true;
                                paneUpdate.s.filteringActive = true;
                                if (filterPane !== -1 && filterPane !== null && filterPane === paneUpdate.s.index ||
                                    filterActive === false ||
                                    paneUpdate.s.index === solePane) {
                                    tempFilter = false;
                                    paneUpdate.s.filteringActive = false;
                                }
                                paneUpdate.updatePane(!tempFilter ? tempFilter : filterActive);
                            }
                        }
                    }
                    // Update the label that shows how many filters are in place
                    this._updateFilterCount();
                }
                else {
                    var solePane = -1;
                    if (newSelectionList.length === 1 && selectTotal !== null && selectTotal !== 0) {
                        solePane = newSelectionList[0].index;
                    }
                    for (var _r = 0, _s = this.s.panes; _r < _s.length; _r++) {
                        var pane = _s[_r];
                        if (pane.s.dtPane !== undefined) {
                            var tempFilter = true;
                            pane.s.filteringActive = true;
                            if (filterPane !== -1 && filterPane !== null && filterPane === pane.s.index ||
                                filterActive === false ||
                                pane.s.index === solePane) {
                                tempFilter = false;
                                pane.s.filteringActive = false;
                            }
                            pane.updatePane(!tempFilter ? tempFilter : filterActive);
                        }
                    }
                    // Update the label that shows how many filters are in place
                    this._updateFilterCount();
                }
                if (!filterActive || selectTotal === 0) {
                    this.s.selectionList = [];
                }
            }
        };
        /**
         * Resizes all of the panes
         */
        SearchPanes.prototype.resizePanes = function () {
            if (this.c.layout === 'auto') {
                var contWidth = $$1(this.s.dt.searchPanes.container()).width();
                var target = Math.floor(contWidth / 260.0); // The neatest number of panes per row
                var highest = 1;
                var highestmod = 0;
                var dispIndex = [];
                // Get the indexes of all of the displayed panes
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    if (pane.s.displayed) {
                        dispIndex.push(pane.s.index);
                    }
                }
                var displayCount = dispIndex.length;
                // If the neatest number is the number we have then use this.
                if (target === displayCount) {
                    highest = target;
                }
                else {
                    // Go from the target down and find the value with the most panes left over, this will be the best fit
                    for (var ppr = target; ppr > 1; ppr--) {
                        var rem = displayCount % ppr;
                        if (rem === 0) {
                            highest = ppr;
                            highestmod = 0;
                            break;
                        }
                        // If there are more left over at this amount of panes per row (ppr)
                        // then it fits better so new values
                        else if (rem > highestmod) {
                            highest = ppr;
                            highestmod = rem;
                        }
                    }
                }
                // If there is a perfect fit then none are to be wider
                var widerIndexes = highestmod !== 0 ? dispIndex.slice(dispIndex.length - highestmod, dispIndex.length) : [];
                for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                    var pane = _c[_b];
                    // Resize the pane with the new layout
                    if (pane.s.displayed) {
                        var layout = 'columns-' + (!widerIndexes.includes(pane.s.index) ? highest : highestmod);
                        pane.resize(layout);
                    }
                }
            }
            else {
                for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                    var pane = _e[_d];
                    pane.adjustTopRow();
                }
            }
            return this;
        };
        /**
         * Attach the panes, buttons and title to the document
         */
        SearchPanes.prototype._attach = function () {
            var _this = this;
            this.dom.container.removeClass(this.classes.hide);
            this.dom.titleRow.removeClass(this.classes.hide);
            this.dom.titleRow.remove();
            this.dom.title.appendTo(this.dom.titleRow);
            // If the clear button is permitted attach it
            if (this.c.clear) {
                this.dom.clearAll.appendTo(this.dom.titleRow);
                this.dom.clearAll.on('click.dtsps', function () {
                    _this.clearSelections();
                });
            }
            if (this.c.collapse) {
                this._setCollapseListener();
            }
            this.dom.titleRow.appendTo(this.dom.container);
            // Attach the container for each individual pane to the overall container
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                pane.dom.container.appendTo(this.dom.panes);
            }
            // Attach everything to the document
            this.dom.panes.appendTo(this.dom.container);
            if ($$1('div.' + this.classes.container).length === 0) {
                this.dom.container.prependTo(this.s.dt);
            }
            return this.dom.container;
        };
        /**
         * Attach the top row containing the filter count and clear all button
         */
        SearchPanes.prototype._attachExtras = function () {
            this.dom.container.removeClass(this.classes.hide);
            this.dom.titleRow.removeClass(this.classes.hide);
            this.dom.titleRow.remove();
            this.dom.title.appendTo(this.dom.titleRow);
            // If the clear button is permitted attach it
            if (this.c.clear) {
                this.dom.clearAll.appendTo(this.dom.titleRow);
            }
            // If collapsing is permitted attach those buttons
            if (this.c.collapse) {
                this.dom.showAll.appendTo(this.dom.titleRow);
                this.dom.collapseAll.appendTo(this.dom.titleRow);
            }
            this.dom.titleRow.appendTo(this.dom.container);
            return this.dom.container;
        };
        /**
         * If there are no panes to display then this method is called to either
         * display a message in their place or hide them completely.
         */
        SearchPanes.prototype._attachMessage = function () {
            // Create a message to display on the screen
            var message;
            try {
                message = this.s.dt.i18n('searchPanes.emptyPanes', this.c.i18n.emptyPanes);
            }
            catch (error) {
                message = null;
            }
            // If the message is an empty string then searchPanes.emptyPanes is undefined,
            // therefore the pane container should be removed from the display
            if (message === null) {
                this.dom.container.addClass(this.classes.hide);
                this.dom.titleRow.removeClass(this.classes.hide);
                return;
            }
            else {
                this.dom.container.removeClass(this.classes.hide);
                this.dom.titleRow.addClass(this.classes.hide);
            }
            // Otherwise display the message
            this.dom.emptyMessage.text(message);
            this.dom.emptyMessage.appendTo(this.dom.container);
            return this.dom.container;
        };
        /**
         * Attaches the panes to the document and displays a message or hides if there are none
         */
        SearchPanes.prototype._attachPaneContainer = function () {
            // If a pane is to be displayed then attach the normal pane output
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.displayed === true) {
                    return this._attach();
                }
            }
            // Otherwise attach the custom message or remove the container from the display
            return this._attachMessage();
        };
        /**
         * Prepares the panes for selections to be made when cascade is active and a deselect has occured
         *
         * @param newSelectionList the list of selections which are to be made
         */
        SearchPanes.prototype._cascadeRegen = function (newSelectionList, selectTotal) {
            // Set this to true so that the actions taken do not cause this to run until it is finished
            this.regenerating = true;
            // If only one pane has been selected then take note of its index
            var solePane = -1;
            if (newSelectionList.length === 1 && selectTotal !== null && selectTotal !== 0) {
                solePane = newSelectionList[0].index;
            }
            // Let the pane know that a cascadeRegen is taking place to avoid unexpected behaviour
            // and clear all of the previous selections in the pane
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                pane.setCascadeRegen(true);
                pane.setClear(true);
                // If this is the same as the pane with the only selection then pass it as a parameter into clearPane
                if (pane.s.dtPane !== undefined && pane.s.index === solePane || pane.s.dtPane !== undefined) {
                    pane.clearPane();
                }
                pane.setClear(false);
            }
            // Rebin panes
            this.s.dt.draw();
            // While all of the selections have been removed, check the table lengths
            // If they are different, another filter is in place and we need to force viewTotal to be used
            var noSelectionsTableLength = this.s.dt.rows({ search: 'applied' }).data().toArray().length;
            var tableLength = this.s.dt.rows().data().toArray().length;
            if (tableLength !== noSelectionsTableLength) {
                for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                    var pane = _c[_b];
                    pane.s.forceViewTotal = true;
                }
            }
            for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                var pane = _e[_d];
                pane.updatePane(true);
            }
            // Remake Selections
            this._makeCascadeSelections(newSelectionList);
            // Set the selection list property to be the list without the selections from the deselect pane
            this.s.selectionList = newSelectionList;
            // The regeneration of selections is over so set it back to false
            for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                var pane = _g[_f];
                pane.setCascadeRegen(false);
            }
            this.regenerating = false;
            // ViewTotal has already been forced at this point so can cancel that for future
            if (tableLength !== noSelectionsTableLength) {
                for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                    var pane = _j[_h];
                    pane.s.forceViewTotal = false;
                }
            }
        };
        /**
         * Attaches the message to the document but does not add any panes
         */
        SearchPanes.prototype._checkMessage = function () {
            // If a pane is to be displayed then attach the normal pane output
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.displayed === true) {
                    // Ensure that the empty message is removed if a pane is displayed
                    this.dom.emptyMessage.remove();
                    this.dom.titleRow.removeClass(this.classes.hide);
                    return;
                }
            }
            // Otherwise attach the custom message or remove the container from the display
            return this._attachMessage();
        };
        /**
         * Checks which panes are collapsed and then performs relevant actions to the collapse/show all buttons
         *
         * @param pane The pane to be checked
         */
        SearchPanes.prototype._checkCollapse = function () {
            var disableClose = true;
            var disableShow = true;
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.displayed) {
                    // It the pane is not collapsed
                    if (!pane.dom.collapseButton.hasClass(pane.classes.rotated)) {
                        // Enable the collapse all button
                        this.dom.collapseAll.removeClass(this.classes.disabledButton).removeAttr('disabled');
                        disableClose = false;
                    }
                    else {
                        // Otherwise enable the show all button
                        this.dom.showAll.removeClass(this.classes.disabledButton).removeAttr('disabled');
                        disableShow = false;
                    }
                }
            }
            // If this flag is still true, no panes are open so the close button should be disabled
            if (disableClose) {
                this.dom.collapseAll.addClass(this.classes.disabledButton).attr('disabled', 'true');
            }
            // If this flag is still true, no panes are closed so the show button should be disabled
            if (disableShow) {
                this.dom.showAll.addClass(this.classes.disabledButton).attr('disabled', 'true');
            }
        };
        /**
         * Collapses all of the panes
         */
        SearchPanes.prototype._collapseAll = function () {
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                pane.collapse();
            }
        };
        /**
         * Gets the selection list from the previous state and stores it in the selectionList Property
         */
        SearchPanes.prototype._getState = function () {
            var loadedFilter = this.s.dt.state.loaded();
            if (loadedFilter && loadedFilter.searchPanes && loadedFilter.searchPanes.selectionList !== undefined) {
                this.s.selectionList = loadedFilter.searchPanes.selectionList;
            }
        };
        /**
         * Makes all of the selections when cascade is active
         *
         * @param newSelectionList the list of selections to be made, in the order they were originally selected
         */
        SearchPanes.prototype._makeCascadeSelections = function (newSelectionList) {
            // make selections in the order they were made previously,
            // excluding those from the pane where a deselect was made
            for (var i = 0; i < newSelectionList.length; i++) {
                var _loop_1 = function (pane) {
                    if (pane.s.index === newSelectionList[i].index && pane.s.dtPane !== undefined) {
                        // When regenerating the cascade selections we need this flag so that
                        // the panes are only ignored if it
                        // is the last selection and the pane for that selection
                        if (i === newSelectionList.length - 1) {
                            pane.s.lastCascade = true;
                        }
                        // if there are any selections currently in the pane then
                        // deselect them as we are about to make our new selections
                        if (pane.s.dtPane.rows({ selected: true }).data().toArray().length > 0 && pane.s.dtPane !== undefined) {
                            pane.setClear(true);
                            pane.clearPane();
                            pane.setClear(false);
                        }
                        var _loop_2 = function (row) {
                            var found = false;
                            pane.s.dtPane.rows().every(function (rowIdx) {
                                if (pane.s.dtPane.row(rowIdx).data() !== undefined &&
                                    row !== undefined &&
                                    pane.s.dtPane.row(rowIdx).data().filter === row.filter) {
                                    found = true;
                                    pane.s.dtPane.row(rowIdx).select();
                                }
                            });
                            if (!found) {
                                var newRow = pane.addRow(row.display, row.filter, 0, row.total, row.sort, row.type, row.className);
                                newRow.select();
                            }
                        };
                        // select every row in the pane that was selected previously
                        for (var _i = 0, _a = newSelectionList[i].rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            _loop_2(row);
                        }
                        pane.s.scrollTop = $$1(pane.s.dtPane.table().node()).parent()[0].scrollTop;
                        pane.s.dtPane.draw();
                        pane.s.dtPane.table().node().parentNode.scrollTop = pane.s.scrollTop;
                        pane.s.lastCascade = false;
                    }
                };
                // As the selections may have been made across the panes
                // in a different order to the pane index we must identify
                // which pane has the index of the selection. This is also important for colreorder etc
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    _loop_1(pane);
                }
            }
        };
        /**
         * Declares the instances of individual searchpanes dependant on the number of columns.
         * It is necessary to run this once preInit has completed otherwise no panes will be
         * created as the column count will be 0.
         *
         * @param table the DataTable api for the parent table
         * @param paneSettings the settings passed into the constructor
         * @param opts the options passed into the constructor
         */
        SearchPanes.prototype._paneDeclare = function (table, paneSettings, opts) {
            var _this = this;
            // Create Panes
            table
                .columns(this.c.columns.length > 0 ? this.c.columns : undefined)
                .eq(0)
                .each(function (idx) {
                _this.s.panes.push(new SearchPane(paneSettings, opts, idx, _this.c.layout, _this.dom.panes));
            });
            // If there is any extra custom panes defined then create panes for them too
            var rowLength = table.columns().eq(0).toArray().length;
            var paneLength = this.c.panes.length;
            for (var i = 0; i < paneLength; i++) {
                var id = rowLength + i;
                this.s.panes.push(new SearchPane(paneSettings, opts, id, this.c.layout, this.dom.panes, this.c.panes[i]));
            }
            // If a custom ordering is being used
            if (this.c.order.length > 0) {
                // Make a new Array of panes based upon the order
                var newPanes = this.c.order.map(function (name, index, values) { return _this._findPane(name); });
                // Remove the old panes from the dom
                this.dom.panes.empty();
                this.s.panes = newPanes;
                // Append the panes in the correct order
                for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    this.dom.panes.append(pane.dom.container);
                }
            }
            // If this internal property is true then the DataTable has been initialised already
            if (this.s.dt.settings()[0]._bInitComplete) {
                this._startup(table);
            }
            else {
                // Otherwise add the paneStartup function to the list of functions
                // that are to be run when the table is initialised. This will garauntee that the
                // panes are initialised before the init event and init Complete callback is fired
                this.s.dt.settings()[0].aoInitComplete.push({ fn: function () {
                        _this._startup(table);
                    } });
            }
        };
        /**
         * Finds a pane based upon the name of that pane
         *
         * @param name string representing the name of the pane
         * @returns SearchPane The pane which has that name
         */
        SearchPanes.prototype._findPane = function (name) {
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (name === pane.s.name) {
                    return pane;
                }
            }
        };
        /**
         * Works out which panes to update when data is recieved from the server and viewTotal is active
         */
        SearchPanes.prototype._serverTotals = function () {
            var selectPresent = false;
            var deselectPresent = false;
            var table = this.s.dt;
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                // Identify the pane where a selection or deselection has been made and add it to the list.
                if (pane.s.selectPresent) {
                    this.s.selectionList.push({
                        index: pane.s.index,
                        protect: false,
                        rows: pane.s.dtPane.rows({ selected: true }).data().toArray()
                    });
                    pane.s.selectPresent = false;
                    selectPresent = true;
                    break;
                }
                else if (pane.s.deselect) {
                    var selectedData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                    if (selectedData.length > 0) {
                        this.s.selectionList.push({
                            index: pane.s.index,
                            protect: true,
                            rows: selectedData
                        });
                    }
                    selectPresent = true;
                    deselectPresent = true;
                }
            }
            // Build an updated list based on any selections or deselections added
            if (!selectPresent) {
                this.s.selectionList = [];
            }
            else {
                var newSelectionList = [];
                for (var i = 0; i < this.s.selectionList.length; i++) {
                    var further = false;
                    // Find out if this selection is the last one in the list for that pane
                    for (var j = i + 1; j < this.s.selectionList.length; j++) {
                        if (this.s.selectionList[j].index === this.s.selectionList[i].index) {
                            further = true;
                        }
                    }
                    // If there are no selections for this pane in the list then just push this one
                    if (!further) {
                        var push = false;
                        for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                            var pane = _c[_b];
                            if (pane.s.index === this.s.selectionList[i].index &&
                                pane.s.dtPane.rows({ selected: true }).data().toArray().length > 0) {
                                push = true;
                            }
                        }
                        if (push) {
                            newSelectionList.push(this.s.selectionList[i]);
                        }
                    }
                }
                this.s.selectionList = newSelectionList;
            }
            var initIdx = -1;
            // If there has been a deselect and only one pane has a selection then update everything
            if (deselectPresent && this.s.selectionList.length === 1) {
                for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                    var pane = _e[_d];
                    pane.s.lastSelect = false;
                    pane.s.deselect = false;
                    if (pane.s.dtPane !== undefined && pane.s.dtPane.rows({ selected: true }).data().toArray().length > 0) {
                        initIdx = pane.s.index;
                    }
                }
            }
            // Otherwise if there are more 1 selections then find the last one and set it to not update that pane
            else if (this.s.selectionList.length > 0) {
                var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                    var pane = _g[_f];
                    pane.s.lastSelect = pane.s.index === last;
                    pane.s.deselect = false;
                }
            }
            // Otherwise if there are no selections then find where that took place and do not update to maintain scrolling
            else if (this.s.selectionList.length === 0) {
                for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                    var pane = _j[_h];
                    // pane.s.lastSelect = (pane.s.deselect === true);
                    pane.s.lastSelect = false;
                    pane.s.deselect = false;
                }
            }
            this.dom.panes.empty();
            // Rebuild the desired panes
            for (var _k = 0, _l = this.s.panes; _k < _l.length; _k++) {
                var pane = _l[_k];
                if (!pane.s.lastSelect) {
                    pane.rebuildPane(undefined, this.s.dt.page.info().serverSide ? this.s.serverData : undefined, pane.s.index === initIdx ? true : null, true);
                }
                else {
                    pane._setListeners();
                }
                // append all of the panes and enable select
                this.dom.panes.append(pane.dom.container);
                if (pane.s.dtPane !== undefined) {
                    $$1(pane.s.dtPane.table().node()).parent()[0].scrollTop = pane.s.scrollTop;
                    // eslint-disable-next-line no-extra-parens
                    $$1.fn.dataTable.select.init(pane.s.dtPane);
                }
            }
            this._updateSelection();
        };
        /**
         * Sets the listeners for the collapse and show all buttons
         * Also sets and performs checks on current panes to see if they are collapsed
         */
        SearchPanes.prototype._setCollapseListener = function () {
            var _this = this;
            this.dom.collapseAll.on('click.dtsps', function () {
                _this._collapseAll();
                _this.dom.collapseAll.addClass(_this.classes.disabledButton).attr('disabled', 'true');
                _this.dom.showAll.removeClass(_this.classes.disabledButton).removeAttr('disabled');
                _this.s.dt.state.save();
            });
            this.dom.showAll.on('click.dtsps', function () {
                _this._showAll();
                _this.dom.showAll.addClass(_this.classes.disabledButton).attr('disabled', 'true');
                _this.dom.collapseAll.removeClass(_this.classes.disabledButton).removeAttr('disabled');
                _this.s.dt.state.save();
            });
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                // We want to make the same check whenever there is a collapse/expand
                pane.dom.collapseButton.on('click', function () { return _this._checkCollapse(); });
            }
            this._checkCollapse();
        };
        /**
         * Shows all of the panes
         */
        SearchPanes.prototype._showAll = function () {
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                pane.show();
            }
        };
        /**
         * Initialises the tables previous/preset selections and initialises callbacks for events
         *
         * @param table the parent table for which the searchPanes are being created
         */
        SearchPanes.prototype._startup = function (table) {
            var _this = this;
            this.dom.container.text('');
            // Attach clear button and title bar to the document
            this._attachExtras();
            this.dom.container.append(this.dom.panes);
            this.dom.panes.empty();
            var loadedFilter = this.s.dt.state.loaded();
            if (this.c.viewTotal && !this.c.cascadePanes) {
                if (loadedFilter !== null &&
                    loadedFilter !== undefined &&
                    loadedFilter.searchPanes !== undefined &&
                    loadedFilter.searchPanes.panes !== undefined) {
                    var filterActive = false;
                    for (var _i = 0, _a = loadedFilter.searchPanes.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        if (pane.selected.length > 0) {
                            filterActive = true;
                            break;
                        }
                    }
                    if (filterActive) {
                        for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                            var pane = _c[_b];
                            pane.s.showFiltered = true;
                        }
                    }
                }
            }
            for (var _d = 0, _e = this.s.panes; _d < _e.length; _d++) {
                var pane = _e[_d];
                pane.rebuildPane(undefined, Object.keys(this.s.serverData).length > 0 ? this.s.serverData : undefined);
                this.dom.panes.append(pane.dom.container);
            }
            // If the layout is set to auto then the panes need to be resized to their best fit
            if (this.c.layout === 'auto') {
                this.resizePanes();
            }
            // Reset the paging if that has been saved in the state
            if (!this.s.stateRead && loadedFilter !== null && loadedFilter !== undefined) {
                this.s.dt.page(loadedFilter.start / this.s.dt.page.len());
                this.s.dt.draw('page');
            }
            this.s.stateRead = true;
            if (this.c.viewTotal && !this.c.cascadePanes) {
                for (var _f = 0, _g = this.s.panes; _f < _g.length; _f++) {
                    var pane = _g[_f];
                    pane.updatePane();
                }
            }
            this._checkMessage();
            // When a draw is called on the DataTable, update all of the panes incase the data in the DataTable has changed
            table.on('preDraw.dtsps', function () {
                // Check that the panes are not updating to avoid infinite loops
                // Also check that this draw is not due to paging
                if (!_this.s.updating && !_this.s.paging) {
                    if ((_this.c.cascadePanes || _this.c.viewTotal) && !_this.s.dt.page.info().serverSide) {
                        _this.redrawPanes(_this.c.viewTotal);
                    }
                    else {
                        _this._updateFilterCount();
                        _this._updateSelection();
                    }
                    _this.s.filterPane = -1;
                }
                // Paging flag reset - we only need to dodge the draw once
                _this.s.paging = false;
            });
            $$1(window).on('resize.dtsp', dataTable$1.util.throttle(function () {
                _this.resizePanes();
            }));
            // Whenever a state save occurs store the selection list in the state object
            this.s.dt.on('stateSaveParams.dtsp', function (e, settings, data) {
                if (data.searchPanes === undefined) {
                    data.searchPanes = {};
                }
                data.searchPanes.selectionList = _this.s.selectionList;
            });
            // Listener for paging on main table
            table.off('page');
            table.on('page', function () {
                _this.s.paging = true;
                _this.s.page = _this.s.dt.page();
            });
            if (this.s.dt.page.info().serverSide) {
                table.off('preXhr.dt');
                table.on('preXhr.dt', function (e, settings, data) {
                    if (data.searchPanes === undefined) {
                        data.searchPanes = {};
                    }
                    if (data.searchPanes_null === undefined) {
                        data.searchPanes_null = {};
                    }
                    // Count how many filters are being applied
                    var filterCount = 0;
                    for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        var src = _this.s.dt.column(pane.s.index).dataSrc();
                        if (data.searchPanes[src] === undefined) {
                            data.searchPanes[src] = {};
                        }
                        if (data.searchPanes_null[src] === undefined) {
                            data.searchPanes_null[src] = {};
                        }
                        if (pane.s.dtPane !== undefined) {
                            var rowData = pane.s.dtPane.rows({ selected: true }).data().toArray();
                            for (var i = 0; i < rowData.length; i++) {
                                data.searchPanes[src][i] = rowData[i].filter;
                                if (data.searchPanes[src][i] === null) {
                                    data.searchPanes_null[src][i] = true;
                                }
                                filterCount++;
                            }
                        }
                    }
                    if (_this.c.viewTotal) {
                        _this._prepViewTotal(filterCount);
                    }
                    // If there is a filter to be applied, then we need to read from the start of the result set
                    // and set the paging to 0. This matches the behaviour of client side processing
                    if (filterCount > 0) {
                        // If the number of filters has changed we need to read from the start of the
                        // result set and reset the paging
                        if (filterCount !== _this.s.filterCount) {
                            data.start = 0;
                            _this.s.page = 0;
                        }
                        // Otherwise it is a paging request and we need to read from whatever the paging has been set to
                        else {
                            data.start = _this.s.page * _this.s.dt.page.len();
                        }
                        _this.s.dt.page(_this.s.page);
                        _this.s.filterCount = filterCount;
                    }
                });
            }
            else {
                table.on('preXhr.dt', function (e, settings, data) {
                    for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                        var pane = _a[_i];
                        pane.clearData();
                    }
                });
            }
            // If the data is reloaded from the server then it is possible that it has changed completely,
            // so we need to rebuild the panes
            this.s.dt.on('xhr', function (e, settings, json, xhr) {
                if (settings.nTable !== _this.s.dt.table().node()) {
                    return;
                }
                var processing = false;
                if (!_this.s.dt.page.info().serverSide) {
                    _this.s.dt.one('preDraw', function () {
                        if (processing) {
                            return;
                        }
                        var page = _this.s.dt.page();
                        processing = true;
                        _this.s.updating = true;
                        _this.dom.panes.empty();
                        for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                            var pane = _a[_i];
                            pane.clearData(); // Clears all of the bins and will mean that the data has to be re-read
                            // Pass a boolean to say whether this is the last choice made for maintaining selections
                            // when rebuilding
                            pane.rebuildPane(_this.s.selectionList[_this.s.selectionList.length - 1] !== undefined ?
                                pane.s.index === _this.s.selectionList[_this.s.selectionList.length - 1].index :
                                false, undefined, undefined, true);
                            _this.dom.panes.append(pane.dom.container);
                        }
                        if (!_this.s.dt.page.info().serverSide) {
                            _this.s.dt.draw();
                        }
                        _this.s.updating = false;
                        if (_this.c.cascadePanes || _this.c.viewTotal) {
                            _this.redrawPanes(_this.c.cascadePanes);
                        }
                        else {
                            _this._updateSelection();
                        }
                        _this._checkMessage();
                        _this.s.dt.one('draw', function () {
                            _this.s.updating = true;
                            _this.s.dt.page(page).draw(false);
                            _this.s.updating = false;
                        });
                    });
                }
            });
            // PreSelect any selections which have been defined using the preSelect option
            for (var _h = 0, _j = this.s.panes; _h < _j.length; _h++) {
                var pane = _j[_h];
                if (pane !== undefined &&
                    pane.s.dtPane !== undefined &&
                    (pane.s.colOpts.preSelect !== undefined && pane.s.colOpts.preSelect.length > 0 ||
                        pane.customPaneSettings !== null &&
                            pane.customPaneSettings.preSelect !== undefined &&
                            pane.customPaneSettings.preSelect.length > 0)) {
                    var tableLength = pane.s.dtPane.rows().data().toArray().length;
                    for (var i = 0; i < tableLength; i++) {
                        if (pane.s.colOpts.preSelect.includes(pane.s.dtPane.cell(i, 0).data()) ||
                            pane.customPaneSettings !== null &&
                                pane.customPaneSettings.preSelect !== undefined &&
                                pane.customPaneSettings.preSelect.includes(pane.s.dtPane.cell(i, 0).data())) {
                            pane.s.dtPane.row(i).select();
                        }
                    }
                    pane.updateTable();
                }
            }
            if (this.s.selectionList !== undefined && this.s.selectionList.length > 0) {
                var last = this.s.selectionList[this.s.selectionList.length - 1].index;
                for (var _k = 0, _l = this.s.panes; _k < _l.length; _k++) {
                    var pane = _l[_k];
                    pane.s.lastSelect = pane.s.index === last;
                }
            }
            // If cascadePanes is active then make the previous selections in the order they were previously
            if (this.s.selectionList.length > 0 && this.c.cascadePanes) {
                this._cascadeRegen(this.s.selectionList, this.s.selectionList.length);
            }
            // Update the title bar to show how many filters have been selected
            this._updateFilterCount();
            // If the table is destroyed and restarted then clear the selections so that they do not persist.
            table.on('destroy.dtsps', function () {
                for (var _i = 0, _a = _this.s.panes; _i < _a.length; _i++) {
                    var pane = _a[_i];
                    pane.destroy();
                }
                table.off('.dtsps');
                _this.dom.collapseAll.off('.dtsps');
                _this.dom.showAll.off('.dtsps');
                _this.dom.clearAll.off('.dtsps');
                _this.dom.container.remove();
                _this.clearSelections();
            });
            if (this.c.collapse) {
                this._setCollapseListener();
            }
            // When the clear All button has been pressed clear all of the selections in the panes
            if (this.c.clear) {
                this.dom.clearAll.on('click.dtsps', function () {
                    _this.clearSelections();
                });
            }
            table.settings()[0]._searchPanes = this;
            // This state save is required so that state is maintained over multiple refreshes if no actions are made
            this.s.dt.state.save();
        };
        SearchPanes.prototype._prepViewTotal = function (selectTotal) {
            var filterPane = this.s.filterPane;
            var filterActive = false;
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    var selectLength = pane.s.dtPane.rows({ selected: true }).data().toArray().length;
                    // If filterPane === -1 then a pane with a selection has not been found yet,
                    // so set filterPane to that panes index
                    if (selectLength > 0 && filterPane === -1) {
                        filterPane = pane.s.index;
                        filterActive = true;
                    }
                    // Then if another pane is found with a selection then set filterPane to null to
                    // show that multiple panes have selections present
                    else if (selectLength > 0) {
                        filterPane = null;
                    }
                }
            }
            if (selectTotal !== null && selectTotal !== 0) {
                filterPane = null;
            }
            // Update all of the panes to reflect the current state of the filters
            for (var _b = 0, _c = this.s.panes; _b < _c.length; _b++) {
                var pane = _c[_b];
                if (pane.s.dtPane !== undefined) {
                    pane.s.filteringActive = true;
                    if (filterPane !== -1 && filterPane !== null && filterPane === pane.s.index ||
                        filterActive === false) {
                        pane.s.filteringActive = false;
                    }
                }
            }
        };
        /**
         * Updates the number of filters that have been applied in the title
         */
        SearchPanes.prototype._updateFilterCount = function () {
            var filterCount = 0;
            // Add the number of all of the filters throughout the panes
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    filterCount += pane.getPaneCount();
                }
            }
            // Run the message through the internationalisation method to improve readability
            var message = this.s.dt.i18n('searchPanes.title', this.c.i18n.title, filterCount);
            this.dom.title.text(message);
            if (this.c.filterChanged !== undefined && typeof this.c.filterChanged === 'function') {
                this.c.filterChanged.call(this.s.dt, filterCount);
            }
            if (filterCount === 0) {
                this.dom.clearAll.addClass(this.classes.disabledButton).attr('disabled', 'true');
            }
            else {
                this.dom.clearAll.removeClass(this.classes.disabledButton).removeAttr('disabled');
            }
        };
        /**
         * Updates the selectionList when cascade is not in place
         */
        SearchPanes.prototype._updateSelection = function () {
            this.s.selectionList = [];
            for (var _i = 0, _a = this.s.panes; _i < _a.length; _i++) {
                var pane = _a[_i];
                if (pane.s.dtPane !== undefined) {
                    this.s.selectionList.push({
                        index: pane.s.index,
                        protect: false,
                        rows: pane.s.dtPane.rows({ selected: true }).data().toArray()
                    });
                }
            }
        };
        SearchPanes.version = '1.4.0';
        SearchPanes.classes = {
            clear: 'dtsp-clear',
            clearAll: 'dtsp-clearAll',
            collapseAll: 'dtsp-collapseAll',
            container: 'dtsp-searchPanes',
            disabledButton: 'dtsp-disabledButton',
            emptyMessage: 'dtsp-emptyMessage',
            hide: 'dtsp-hidden',
            panes: 'dtsp-panesContainer',
            search: 'dtsp-search',
            showAll: 'dtsp-showAll',
            title: 'dtsp-title',
            titleRow: 'dtsp-titleRow'
        };
        // Define SearchPanes default options
        SearchPanes.defaults = {
            cascadePanes: false,
            clear: true,
            collapse: true,
            columns: [],
            container: function (dt) {
                return dt.table().container();
            },
            filterChanged: undefined,
            i18n: {
                clearMessage: 'Clear All',
                clearPane: '&times;',
                collapse: {
                    0: 'SearchPanes',
                    _: 'SearchPanes (%d)'
                },
                collapseMessage: 'Collapse All',
                count: '{total}',
                countFiltered: '{shown} ({total})',
                emptyMessage: '<em>No data</em>',
                emptyPanes: 'No SearchPanes',
                loadMessage: 'Loading Search Panes...',
                showMessage: 'Show All',
                title: 'Filters Active - %d'
            },
            layout: 'auto',
            order: [],
            panes: [],
            viewTotal: false
        };
        return SearchPanes;
    }());

    /*! SearchPanes 1.4.0
     * 2019-2020 SpryMedia Ltd - datatables.net/license
     */
    // DataTables extensions common UMD. Note that this allows for AMD, CommonJS
    // (with window and jQuery being allowed as parameters to the returned
    // function) or just default browser loading.
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery', 'datatables.net'], function ($) {
                return factory($, window, document);
            });
        }
        else if (typeof exports === 'object') {
            // CommonJS
            module.exports = function (root, $) {
                if (!root) {
                    root = window;
                }
                if (!$ || !$.fn.dataTable) {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    $ = require('datatables.net')(root, $).$;
                }
                return factory($, root, root.document);
            };
        }
        else {
            // Browser - assume jQuery has already been loaded
            // eslint-disable-next-line no-extra-parens
            factory(window.jQuery, window, document);
        }
    }(function ($, window, document) {
        setJQuery($);
        setJQuery$1($);
        var dataTable = $.fn.dataTable;
        // eslint-disable-next-line no-extra-parens
        $.fn.dataTable.SearchPanes = SearchPanes;
        // eslint-disable-next-line no-extra-parens
        $.fn.DataTable.SearchPanes = SearchPanes;
        // eslint-disable-next-line no-extra-parens
        $.fn.dataTable.SearchPane = SearchPane;
        // eslint-disable-next-line no-extra-parens
        $.fn.DataTable.SearchPane = SearchPane;
        // eslint-disable-next-line no-extra-parens
        var apiRegister = $.fn.dataTable.Api.register;
        apiRegister('searchPanes()', function () {
            return this;
        });
        apiRegister('searchPanes.clearSelections()', function () {
            return this.iterator('table', function (ctx) {
                if (ctx._searchPanes) {
                    ctx._searchPanes.clearSelections();
                }
            });
        });
        apiRegister('searchPanes.rebuildPane()', function (targetIdx, maintainSelections) {
            return this.iterator('table', function (ctx) {
                if (ctx._searchPanes) {
                    ctx._searchPanes.rebuild(targetIdx, maintainSelections);
                }
            });
        });
        apiRegister('searchPanes.resizePanes()', function () {
            var ctx = this.context[0];
            return ctx._searchPanes ?
                ctx._searchPanes.resizePanes() :
                null;
        });
        apiRegister('searchPanes.container()', function () {
            var ctx = this.context[0];
            return ctx._searchPanes
                ? ctx._searchPanes.getNode()
                : null;
        });
        $.fn.dataTable.ext.buttons.searchPanesClear = {
            action: function (e, dt, node, config) {
                dt.searchPanes.clearSelections();
            },
            text: 'Clear Panes'
        };
        $.fn.dataTable.ext.buttons.searchPanes = {
            action: function (e, dt, node, config) {
                e.stopPropagation();
                this.popover(config._panes.getNode(), {
                    align: 'dt-container'
                });
                config._panes.rebuild(undefined, true);
            },
            config: {},
            init: function (dt, node, config) {
                var panes = new $.fn.dataTable.SearchPanes(dt, $.extend({
                    filterChanged: function (count) {
                        // console.log(dt.context[0])
                        dt.button(node).text(dt.i18n('searchPanes.collapse', dt.context[0].oLanguage.searchPanes !== undefined ?
                            dt.context[0].oLanguage.searchPanes.collapse :
                            dt.context[0]._searchPanes.c.i18n.collapse, count));
                    }
                }, config.config));
                var message = dt.i18n('searchPanes.collapse', panes.c.i18n.collapse, 0);
                dt.button(node).text(message);
                config._panes = panes;
            },
            text: 'Search Panes'
        };
        function _init(settings, options, fromPre) {
            if (options === void 0) { options = null; }
            if (fromPre === void 0) { fromPre = false; }
            var api = new dataTable.Api(settings);
            var opts = options
                ? options
                : api.init().searchPanes || dataTable.defaults.searchPanes;
            var searchPanes = new SearchPanes(api, opts, fromPre);
            var node = searchPanes.getNode();
            return node;
        }
        // Attach a listener to the document which listens for DataTables initialisation
        // events so we can automatically initialise
        $(document).on('preInit.dt.dtsp', function (e, settings, json) {
            if (e.namespace !== 'dt') {
                return;
            }
            if (settings.oInit.searchPanes ||
                dataTable.defaults.searchPanes) {
                if (!settings._searchPanes) {
                    _init(settings, null, true);
                }
            }
        });
        // DataTables `dom` feature option
        dataTable.ext.feature.push({
            cFeature: 'P',
            fnInit: _init
        });
        // DataTables 2 layout feature
        if (dataTable.ext.features) {
            dataTable.ext.features.register('searchPanes', _init);
        }
    }));

}());


/*! Bootstrap integration for DataTables' SearchPanes
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net-bs4', 'datatables.net-searchpanes'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                $ = require('datatables.net-bs4')(root, $).$;
            }
            if (!$.fn.dataTable.SearchPanes) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require('datatables.net-searchpanes')(root, $);
            }
            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document) {
    'use strict';
    var dataTable = $.fn.dataTable;
    $.extend(true, dataTable.SearchPane.classes, {
        buttonGroup: 'btn-group',
        disabledButton: 'disabled',
        narrow: 'col',
        pane: {
            container: 'table'
        },
        paneButton: 'btn btn-light',
        pill: 'pill badge badge-pill badge-secondary',
        search: 'form-control search',
        searchCont: 'input-group',
        searchLabelCont: 'input-group-append',
        subRow1: 'dtsp-subRow1',
        subRow2: 'dtsp-subRow2',
        table: 'table table-sm table-borderless',
        topRow: 'dtsp-topRow'
    });
    $.extend(true, dataTable.SearchPanes.classes, {
        clearAll: 'dtsp-clearAll btn btn-light',
        collapseAll: 'dtsp-collapseAll btn btn-light',
        container: 'dtsp-searchPanes',
        disabledButton: 'disabled',
        panes: 'dtsp-panes dtsp-panesContainer',
        showAll: 'dtsp-showAll btn btn-light',
        title: 'dtsp-title',
        titleRow: 'dtsp-titleRow'
    });
    return dataTable.searchPanes;
}));


/*! Select for DataTables 1.3.3
 * 2015-2021 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.3.3
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.3.3';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var toggleable = true;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}
		
		if ( opts.toggleable !== undefined ) {
			toggleable = opts.toggleable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}
		else {
			style = 'os';
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.toggleable( toggleable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string       - Can be `rows`, `columns` or `cells`. Defines what item 
	                     will be selected if the user is allowed to activate row
	                     selection using the mouse.
	style:string       - Can be `none`, `single`, `multi` or `os`. Defines the
	                     interaction style when selecting items
	blurable:boolean   - If row selection can be cleared by clicking outside of
	                     the table
	toggleable:boolean - If row selection can be cancelled by repeated clicking
	                     on the row
	info:boolean       - If the selection summary should be shown in the table
	                     information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + _safeId(dt.table().node()) );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;
	var matchSelection;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}

			if ( window.getSelection ) {
				matchSelection = window.getSelection();
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( matchSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( selection !== matchSelection ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];
			var wrapperClass = dt.settings()[0].oClasses.sWrapper.trim().replace(/ +/g, '.');

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.'+wrapperClass)[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + _safeId(dt.table().node()), function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function (e, settings) {
		if (settings !== api.settings()[0]) {
			// Not triggered by our DataTable!
			return;
		}

		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		api.rows({selected: true}).deselect();

		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var toggleable = dt.select.toggleable();
	var isSelected = dt[type]( idx, { selected: true } ).any();
	
	if ( isSelected && ! toggleable ) {
		return;
	}

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}

function _safeId( node ) {
	return node.id.replace(/[^a-zA-Z0-9\-\_]/g, '-');
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.toggleable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.toggleable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.toggleable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api.cells(api[i]).indexes().toArray() ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		ctx._select_lastCell = null;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


