/*!
 * @author: Pojo Team
 */
/* global jQuery */

;( function( $ ) {
	'use strict';

	var Pojo_Forms_App = {
		cache: {
			$document: $( document ),
			$window: $( window )
		},

		cacheElements: function() {},

		buildElements: function() {},

		bindEvents: function() {
			$( 'form.pojo-form.pojo-form-ajax' ).on( 'submit', function() {
				var $thisForm = $( this ),
					serializeForm = $thisForm.serialize(),
					prefixFieldWrap = $thisForm.data( 'prefix' ) || '',
					$submitButton = $thisForm.find( 'div.form-actions button.submit' );

				if ( $thisForm.hasClass( 'form-waiting' ) ) {
					return false;
				}

				$thisForm
					.animate( { opacity: '0.45' }, 500 )
					.addClass( 'form-waiting' );

				$submitButton
					.attr( 'disabled', 'disabled' )
					.html( '<i class="fa fa-spinner fa-spin"></i> ' + $submitButton.html() );

				$thisForm
					.find( 'div.form-message' )
					.remove();

				$thisForm
					.find( 'div.field-group' )
					.removeClass( 'error' )
					.find( 'span.form-help-inline' )
					.remove();

				$.post( Pojo.ajaxurl, serializeForm, function( response ) {
					if ( ! response.data.hide_form || ! response.success ) {
						$submitButton
							.html( $submitButton.text() )
							.removeAttr( 'disabled' );

						$thisForm
							.animate( { opacity: '1' }, 100 )
							.removeClass( 'form-waiting' );
					}

					if ( ! response.success ) {
						$.each( response.data.fields, function( key, title ) {
							$thisForm
								.find( 'div.field-group.' + prefixFieldWrap + key )
								.addClass( 'error' )
								//.find( 'div.controls')
								.append( '<span class="help-inline form-help-inline">' + title + '</span>' );
						} );
						$thisForm.append( '<div class="form-message form-message-danger">' + response.data.message + '</div>' );
					} else {
						if ( ! response.data.hide_form ) {
							$thisForm.trigger( 'reset' );
						}

						if ( '' !== response.data.message ) {
							$thisForm.append( '<div class="form-message form-message-success">' + response.data.message + '</div>' );
						}
						if ( '' !== response.data.link ) {
							location.href = response.data.link;
						}
					}
				}, 'json' );
				return false;
			} );
		},

		init: function() {
			this.cacheElements();
			this.buildElements();
			this.bindEvents();
		}
	};

	$( document ).ready( function( $ ) {
		Pojo_Forms_App.init();
	} );

}( jQuery ) );
