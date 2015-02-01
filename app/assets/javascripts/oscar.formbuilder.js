(function ($) {
	$.fn.formbuilder = function (options) {
		// Extend the configuration options with user-provided
		var defaults = {
			save_url: false,
			load_url: false,
			control_box_target: false,
			serialize_prefix: 'frmb',
			css_ol_sortable_class : 'ol_opt_sortable',
			messages: {
				save				: "Save",
				add_new_field		: "Add New Field...",
				text				: "Text Field",
				title				: "Title",
				paragraph			: "Text Area",
				checkboxes			: "Checkboxes",
				radio				: "Radio",
				select				: "Select List",
				text_field			: "Text Field",
				label				: "Label",
				paragraph_field		: "Paragraph Field",
				select_options		: "Select Options",
				add					: "Add",
				checkbox_group		: "Checkbox Group",
				remove_message		: "Are you sure you want to remove this element?",
				remove				: "Remove",
				radio_group			: "Radio Group",
				selections_message	: "Allow Multiple Selections",
				hide				: "Hide",
				required			: "Required",
				show				: "Show",
				data_type           : "Answer Type",
				limit               : "Limit",
				format              : "Format",
				encryption          : "Allow Encryption",
				helptext            : "Help Text"
			}
		};
		var opts = $.extend(defaults, options);
		var frmb_id = 'frmb-' + $('ul[id^=frmb-]').length++;
		return this.each(function () {
			var ul_obj = $(this).append('<ul id="' + frmb_id + '" class="frmb"></ul>').find('ul');
			var field = '', field_type = '', last_id = 1, help, form_db_id;
			// Add a unique class to the current element
			$(ul_obj).addClass(frmb_id);
			// load existing form data
			if (opts.load_url) {
				$.getJSON(opts.load_url, function(json) {
					form_db_id = json.form_id;
					fromJson(json.form_structure);
				});
			}
			// Create form control select box and add into the editor
			var controlBox = function (target) {
					
					var select = '';
					var box_content = '';
					var save_button = '';
					var box_id = frmb_id + '-control-box';
					var save_id = frmb_id + '-save-button';
					//alert(save_id);
					// Add the available options
					select += '<option value="0">' + opts.messages.add_new_field + '</option>';
					select += '<option value="input_text">' + opts.messages.text + '</option>';
					select += '<option value="textarea">' + opts.messages.paragraph + '</option>';
					select += '<option value="checkbox">' + opts.messages.checkboxes + '</option>';
					select += '<option value="radio">' + opts.messages.radio + '</option>';
					select += '<option value="select">' + opts.messages.select + '</option>';
					// Build the control box and search button content
					box_content = '<select id="' + box_id + '" class="frmb-control">' + select + '</select>';
					save_button = '<input type="submit" id="' + save_id + '" class="frmb-submit" value="' + opts.messages.save + '"/>';
					// Insert the control box into page
					if (!target) {
						$(ul_obj).before(box_content);
					} else {
						$(target).append(box_content);
					}
					// Insert the search button
					//$(ul_obj).after(save_button);
					// Set the form save action
					$('#' + save_id).click(function () {
						save();
						return false;
					});
					
					// Add a callback to the select element
					$('#' + box_id).change(function () {
						appendNewField($(this).val());
						
						$(this).val(0).blur();
						// This solves the scrollTo dependency
						$('html, body').animate({
							scrollTop: $('#frm-' + (last_id - 1) + '-item').offset().top
						}, 500);
						return false;
					});
				}(opts.control_box_target);
			// Json parser to build the form builder
			var fromJson = function (json) {
					var values = '';
					var options = false;
					// Parse json
					$(json).each(function () {
						// checkbox type
						
						if (this.helptext == 'null') {
							this.helptext = '';
						}
						if (this.cssClass === 'checkbox') {
							options = [this.title, this.helptext];
							values = [];
							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						// radio type
						else if (this.cssClass === 'radio') {
							options = [this.title, this.helptext];
							values = [];
							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						// select type
						else if (this.cssClass === 'select') {
							options = [this.title, this.multiple, this.helptext];
							values = [];
							$.each(this.values, function () {
								values.push([this.value, this.baseline]);
							});
						}
						else if (this.cssClass === 'input_text') {
							values = [this.values, this.data_type, this.limit, this.format, this.encryption, this.helptext];
						}
						else {
							values = [this.values, this.helptext];
						}
						appendNewField(this.cssClass, values, options, this.required);
					});
				};
			// Wrapper for adding a new field
			var appendNewField = function (type, values, options, required) {
					field = '';
					field_type = type;
					if (typeof (values) === 'undefined') {
						values = '';
					}
					switch (type) {
					case 'input_text':
						appendTextInput(values, required);
						break;
					case 'textarea':
						appendTextarea(values, required);
						break;
					case 'checkbox':
						appendCheckboxGroup(values, options, required);
						break;
					case 'radio':
						appendRadioGroup(values, options, required);
						break;
					case 'select':
						appendSelectList(values, options, required);
						break;
					}
				};
				
				
			// single line input type="text"
			var appendTextInput = function (values, required) {
					if (typeof (values[0]) === 'undefined') {
						values = []
						values[0] = '';
						values[1] = '';
						values[2] = '';
						values[3] = '';
						values[4] = '';
						values[5] = '';
					}
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input class="fld-title update"  id="title-' + last_id + '" type="text" value="' + values[0] + '" />';
					field += '<label>' + opts.messages.helptext + '</label>';
					field += '<textarea  style="width:682px;" id="textarea-' + last_id + '" rows="2" cols="100" >' + values[5] + '</textarea>';
					answer_type = ['Varchar','Numeric', 'Email', 'Date', 'File']
					answer_format = [{phone:'(xxx)xxx-xxxx'}, {ssn:'xxx-xx-xxxx'}]
					answer_encryption = [{No:'0'}, {Yes:'1'}]
					
					field += '<label>' + opts.messages.data_type + '</label>';
					field += '<span style="float:left;width:70%"><select id="data-type-' + last_id + '">';
					for (var i = 0; i < answer_type.length; i++) { 
						if($.trim(answer_type[i]) == $.trim(values[1])	) {
							selected = "selected = 'selected'";
						} else {
							selected = '';
						}
    					field += '<option value="'+answer_type[i]+'" '+selected+'>'+answer_type[i]+'</option>';
					}
					field += '</select></span>';
					field += '<label>' + opts.messages.limit + '</label>';
					field += '<span style="float:left;width:70%"><input  style="width:10%"  id="limit-' + last_id + '" type="text" value="' + values[2] + '" /></span>';
					field += '<label>' + opts.messages.format + '</label>';
					field += '<span style="float:left;width:70%"><select id="format-' + last_id + '"><option value="">Select</option>';
					for (var i = 0; i < answer_format.length; i++) { 
						for (var key in answer_format[i]) { 
							if($.trim(key) == $.trim(values[3])) {
								selected = "selected = 'selected'";
							} else {
								selected = '';
							}
	    				  field += '<option value="'+key+'" '+selected+'">'+answer_format[i][key]+'</option>';
						}
					}	
					field += '</select></span>';
					field += '<label>' + opts.messages.encryption + '</label>';
					field += '<span style="float:left;width:70%"><select id="encrypt-' + last_id + '">';
					for (var i = 0; i < answer_encryption.length; i++) { 
						for (var key in answer_encryption[i]) { 
							if($.trim(answer_encryption[i][key]) == $.trim(values[4])) {
								selected = "selected = 'selected'";
							} else {
								selected = '';
							}
	    				  field += '<option value="'+answer_encryption[i][key]+'" '+selected+'>'+key+'</option>';
						}
					}	
					field += '</select></span>';
					
					help = 'padding-left:140px';
					appendFieldLi(opts.messages.text, field, required, help);
				};
			// multi-line textarea
			var appendTextarea = function (values, required) {
					if (typeof (values[0]) === 'undefined') {
						values = []
						values[0] = '';
						values[1] = '';
					}
					field += '<label>' + opts.messages.label + '</label>';
					field += '<input type="text" class="update" value="' + values[0] + '" />';
					
					field += '<label>' + opts.messages.helptext + '</label>';
					field += '<textarea  style="width:682px;" id="textarea-' + last_id + '" rows="2" cols="100" >' + values[1] + '</textarea>';
					
					help = 'padding-left:105px';
					appendFieldLi(opts.messages.paragraph_field, field, required, help);
				};
			// adds a checkbox element
			var appendCheckboxGroup = function (values, options, required) {
					var title = '';
					var helptext = '';
					if (typeof (options) === 'object') {
						title = options[0];
						helptext = options[1] 
					} 
					
					field += '<div class="chk_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					field += '<input type="text" name="title" class="update" value="' + title + '" /></div>';
					field += '<label>' + opts.messages.helptext + '</label>';
					field += '<textarea  style="width:682px;" id="textarea-' + last_id + '" rows="2" cols="100" >' + helptext + '</textarea>';
					
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';

					field += '<ul style="list-style-type: none;padding:0; margin:0;">';

					if (typeof (values) === 'object') {
						for (i = 0; i < values.length; i++) {
							field += checkboxFieldHtml(values[i]);
						}
					}
					else {
						field += checkboxFieldHtml('');
					}

					field += '</ul>';

					field += '<div class="add-area"><a href="#" class="add add_ck">' + opts.messages.add + '</a></div>';
					field += '</div>';
					field += '</div>';
					help = 'padding-left:98px';
					appendFieldLi(opts.messages.checkbox_group, field, required, help);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable.
				};
			// Checkbox field html, since there may be multiple
			var checkboxFieldHtml = function (values) {
					var checked = false;
					var value = '';
					if (typeof (values) === 'object') {
						value = values[0];
						checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
					}
					field = '<li style="padding-left:0px;">';
					field += '<div>';
					//field += '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + ' />';
					field += '<input type="text" value="' + value + '" />';
					field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
					field += '</div></li>';
					return field;
				};
			// adds a radio element
			var appendRadioGroup = function (values, options, required) {
					var title = '';
					var helptext = '';
					if (typeof (options) === 'object') {
						title = options[0];
						helptext = options[1]
					}
					field += '<div class="rd_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					field += '<input type="text" name="title" class="update" value="' + title + '" /></div>';
					field += '<label>' + opts.messages.helptext + '</label>';
					field += '<textarea  style="width:682px;" id="textarea-' + last_id + '" rows="2" cols="100" >' + helptext + '</textarea>';
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';

					field += '<ul style="list-style-type: none;padding:0; margin:0;">';

					if (typeof (values) === 'object') {
						for (i = 0; i < values.length; i++) {
							field += radioFieldHtml(values[i], 'frm-' + last_id + '-fld');
						}
					}
					else {
						field += radioFieldHtml('', 'frm-' + last_id + '-fld');
					}

					field += '</ul>';

					field += '<div class="add-area"><a href="#" class="add add_rd">' + opts.messages.add + '</a></div>';
					field += '</div>';
					field += '</div>';
					help = 'padding-left:125px';
					appendFieldLi(opts.messages.radio_group, field, required, help);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable. 
				};
			// Radio field html, since there may be multiple
			var radioFieldHtml = function (values, name) {
					var checked = false;
					var value = '';
					if (typeof (values) === 'object') {
						value = values[0];
						checked = ( values[1] === 'false' || values[1] === 'undefined' ) ? false : true;
					}
					field = '<li style="padding-left:0px;">'; 
					field += '<div>';
					//field += '<input type="radio"' + (checked ? ' checked="checked"' : '') + ' name="radio_' + name + '" />';
					field += '<input type="text" value="' + value + '" />';
					field += '<a href="#" class="remove"  title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
					field += '</div></li>';

					return field;
				};
			// adds a select/option element
			var appendSelectList = function (values, options, required) {
					var multiple = false;
					var title = '';
					var helptext = '';
					if (typeof (options) === 'object') {
						title = options[0];
						multiple = options[1] === 'true' || options[1] === 'checked' ? true : false;
						helptext = options[2]
					}
					field += '<div class="opt_group">';
					field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
					field += '<input type="text" name="title" class="update" value="' + title + '" /></div>';
					field += '<label>' + opts.messages.helptext + '</label>';
					field += '<textarea  style="width:682px;" id="textarea-' + last_id + '" rows="2" cols="100" >' + helptext + '</textarea>';
					field += '';
					field += '<div class="false-label">' + opts.messages.select_options + '</div>';
					field += '<div class="fields">';
					field += '<input type="checkbox" name="multiple"' + (multiple ? 'checked="checked"' : '') + '>';
					field += '<label class="auto">' + opts.messages.selections_message + '</label>';

					field += '<ul style="background:none;margin:0 0 0 0px;border:none;">';

						if (typeof (values) === 'object') {
							for (i = 0; i < values.length; i++) {
								field += selectFieldHtml(values[i], multiple);
							}
						}
						else {
							field += selectFieldHtml('', multiple);
						}

					field += '</ul>';

					field += '<div class="add-area" style="padding-top:0px;"><a href="#" class="add add_opt">' + opts.messages.add + '</a></div>';
					field += '</div>';
					field += '</div>';
					help = 'padding-left:135px';
					appendFieldLi(opts.messages.select, field, required, help);

					$('.'+ opts.css_ol_sortable_class).sortable(); // making the dynamically added option fields sortable.  
				};
			// Select field html, since there may be multiple
			var selectFieldHtml = function (values, multiple) {
					if (multiple) {
						return checkboxFieldHtml(values);
					}
					else {
						return radioFieldHtml(values);
					}
				};
			// Appends the new field markup to the editor
			var appendFieldLi = function (title, field_html, required, help) {
					if (required) {
						required = required === 'checked' ? true : false;
					}
					
					var css = field_type === 'checkbox' ? "style='margin-left:0px;'" : ""  
					var li = '';
					li += '<li id="frm-' + last_id + '-item" class="' + field_type + '">';
					li += '<div class="legend">';
					li += '<a id="frm-' + last_id + '" class="toggle-form" href="#">' + opts.messages.hide + '</a> ';
					li += '<a id="del_' + last_id + '" class="del-button delete-confirm" href="#" title="' + opts.messages.remove_message + '"><span>' + opts.messages.remove + '</span></a>';
					li += '<strong id="txt-title-' + last_id + '">' + title + '</strong><span class="live" style="'+help+'"></span></div>';
					li += '<div id="frm-' + last_id + '-fld" class="frm-holder">';
					li += '<div class="frm-elements">';
					li += '<div class="frm-fld"><label for="required-' + last_id + '">' + opts.messages.required + '</label>';
					li += '<input class="required" type="checkbox" '+css+' value="1" name="required-' + last_id + '" id="required-' + last_id + '"' + (required ? ' checked="checked"' : '') + ' /></div>';
					li += field;
					li += '</div>';
					li += '</div>';
					li += '</li>';
					$(ul_obj).append(li);
					$('#frm-' + last_id + '-item').hide();
					$('#frm-' + last_id + '-item').animate({
						opacity: 'show',
						height: 'show'
					}, 'slow');
					last_id++;
				};
			// handle field delete links
			$('.frmb').delegate('.remove', 'click', function () {
				$(this).parent('div').animate({
					opacity: 'hide',
					height: 'hide',
					marginBottom: '0px'
				}, 'fast', function () {
					$(this).remove();
				});
				return false;
			});
			// handle field display/hide
			$('.frmb').delegate('.toggle-form', 'click', function () {
				var target = $(this).attr("id");
				if ($(this).html() === opts.messages.hide) {
					$(this).removeClass('open').addClass('closed').html(opts.messages.show);
					$('#' + target + '-fld').animate({
						opacity: 'hide',
						height: 'hide'
					}, 'slow');
					return false;
				}
				if ($(this).html() === opts.messages.show) {
					$(this).removeClass('closed').addClass('open').html(opts.messages.hide);
					$('#' + target + '-fld').animate({
						opacity: 'show',
						height: 'show'
					}, 'slow');
					return false;
				}
				return false;
			});
			// handle delete confirmation
			$('.frmb').delegate('.delete-confirm', 'click', function () {
				var delete_id = $(this).attr("id").replace(/del_/, '');
				if (confirm($(this).attr('title'))) {
					$('#frm-' + delete_id + '-item').animate({
						opacity: 'hide',
						height: 'hide',
						marginBottom: '0px'
					}, 'slow', function () {
						$(this).remove();
					});
				}
				return false;
			});
			// Attach a callback to add new checkboxes
			$('.frmb').delegate('.add_ck', 'click', function () {
				$(this).parent().before(checkboxFieldHtml());
				return false;
			});
			// Attach a callback to add new options
			$('.frmb').delegate('.add_opt', 'click', function () {
				$(this).parent().before(selectFieldHtml('', false));
				return false;
			});
			// Attach a callback to add new radio fields
			$('.frmb').delegate('.add_rd', 'click', function () {
				$(this).parent().before(radioFieldHtml(false, $(this).parents('.frm-holder').attr('id')));
				return false;
			});
			
			// Attach a callback to add new radio fields
			$('.frmb').delegate('.update', 'keyup', function () {
				text = $(this).val();
				$(this).closest('li').find(".live").html(text);
				//alert($(this).val());
			});
			// saves the serialized data to the server
			var save = function () {
				
				var data= $(ul_obj).serializeFormList({
						prepend: opts.serialize_prefix
					})
				if(data && data != 'err') {
					jQuery("#action").hide();
					jQuery("#loading").show();
					//alert(opts.save_url);
					$.ajax({
								type: "POST",
								url: opts.save_url,
							    headers: {
    								'X-CSRF-Token': AUTH_TOKEN
  								},
								data: $(ul_obj).serializeFormList({
									prepend: opts.serialize_prefix
								}),
								success: function (data) {
									if(data == 'error') {
										alert('Data has not been saved. Please try again.');
										jQuery("#action").hide();
										jQuery("#loading").show();
									} else {
										window.location = "/users/"+data+"/forms"						
									}
								}
					});
				} else if (data == '') {
					alert('Please add atleast one field.');
				}
				
						
			};
		});
	};
})(jQuery);

(function ($) {
	
	
	$.fn.serializeFormList = function (options) {
		// Extend the configuration options with user-provided
		var error = false;
		var file_count = 0;
		var defaults = {
			prepend: 'ul',
			is_child: false,
			attributes: ['class']
		};
		var opts = $.extend(defaults, options);
		if (!opts.is_child) {
			opts.prepend = '&' + opts.prepend;
		}
		var serialStr = '';
		// Begin the core plugin
		this.each(function () {
			var ul_obj = this;
			var li_count = 0;
			var c = 1;
			
			
			jQuery("#error_msg").remove();
			$(this).children().each(function () {
				for (att = 0; att < opts.attributes.length; att++) {
					var key = (opts.attributes[att] === 'class' ? 'cssClass' : opts.attributes[att]);
					serialStr += opts.prepend + '[' + li_count + '][' + key + ']=' + encodeURIComponent($(this).attr(opts.attributes[att]));
					// append the form field values
					if (opts.attributes[att] === 'class') {
						serialStr += opts.prepend + '[' + li_count + '][required]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input.required').is(':checked'));
						var index = $(this).attr('id').split('-')[1];
						switch ($(this).attr(opts.attributes[att])) {
						case 'input_text':
							if ($.trim($('#' + $(this).attr('id') + ' input[type=text]').val()).length < 1) {
								$('#' + $(this).attr('id')).find(".error_msg").remove();
								error = true;
								$('#' + $(this).attr('id')).append('<span style="color:#BD4247;padding-left:200px;" class="error_msg">Plesae enter title.</span>');
							} else {
								if($('#data-type-'+index).val() == 'File') {
									file_count = file_count + 1
								}
								$('#' + $(this).attr('id')).find(".error_msg").remove();
								serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
								serialStr += opts.prepend + '[' + li_count + '][helptext]=' + encodeURIComponent($('#textarea-'+index).val());
								serialStr += opts.prepend + '[' + li_count + '][data-type]=' + encodeURIComponent($('#data-type-'+index).val());
								serialStr += opts.prepend + '[' + li_count + '][limit]=' + encodeURIComponent($('#limit-'+index).val());
								serialStr += opts.prepend + '[' + li_count + '][encryption]=' + encodeURIComponent($('#encrypt-'+index).val());
								serialStr += opts.prepend + '[' + li_count + '][format]=' + encodeURIComponent($('#format-'+index).val());
							}
							break;
						case 'textarea':
							if ($.trim($('#' + $(this).attr('id') + ' input[type=text]').val()).length < 1) {
								error = true;
								$('#' + $(this).attr('id')).find(".error_msg").remove();
								$('#' + $(this).attr('id')).append('<span style="color:#BD4247;padding-left:200px;" class="error_msg">Plesae enter title.</span>');
							} else {
								$('#' + $(this).attr('id')).find(".error_msg").remove();
								serialStr += opts.prepend + '[' + li_count + '][values]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
								serialStr += opts.prepend + '[' + li_count + '][helptext]=' + encodeURIComponent($('#textarea-'+index).val());
							}
							break;
						case 'checkbox':
							c = 1;
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($.trim($(this).val()).length < 1) {
										$(this).parent().find(".error_msg").remove();
										error = true;
										if ($(this).attr('name') === 'title') {
											$(this).parent().append('<span style="color:#BD4247;float:left;padding-left:200px;" class="error_msg">Plesae enter required info.</span>');
										} else {
											$(this).parent().append('<span style="color:#BD4247;float:left" class="error_msg">Please enter required info.</span>');
										}
								} else {
									$(this).parent().find(".error_msg").remove();
									if ($(this).attr('name') === 'title') {
										serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									}
									else {
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
										serialStr += opts.prepend + '[' + li_count + '][helptext]=' + encodeURIComponent($('#textarea-'+index).val());
									}
								}	
								c++;
							});
							break;
						case 'radio':
							c = 1;
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($.trim($(this).val()).length < 1) {
										$(this).parent().find(".error_msg").remove();
										error = true;
										if ($(this).attr('name') === 'title') {
											$(this).parent().append('<span style="color:#BD4247;float:left;padding-left:200px;" class="error_msg">Please enter required info.</span>');
										} else {
											$(this).parent().append('<span style="color:#BD4247;float:left" class="error_msg">Please enter required info.</span>');
										}
								} else {
									$(this).parent().find(".error_msg").remove();	
									if ($(this).attr('name') === 'title') {
										serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									}
									else {
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
										serialStr += opts.prepend + '[' + li_count + '][helptext]=' + encodeURIComponent($('#textarea-'+index).val());
									}
								}	
								c++;
							});
							break;
						case 'select':
							c = 1;
							serialStr += opts.prepend + '[' + li_count + '][multiple]=' + $('#' + $(this).attr('id') + ' input[name=multiple]').is(':checked');
							
							$('#' + $(this).attr('id') + ' input[type=text]').each(function () {
								if ($.trim($(this).val()).length < 1) {
										$(this).parent().find(".error_msg").remove();
										error = true;
										if ($(this).attr('name') === 'title') {
											$(this).parent().append('<span style="color:#BD4247;float:left;padding-left:200px;" class="error_msg">Please enter required info.</span>');
										} else {
											$(this).parent().append('<span style="color:#BD4247;float:left" class="error_msg">Please enter required info.</span>');
										}
								} else {
									$(this).parent().find(".error_msg").remove();
									if ($(this).attr('name') === 'title') {
									    serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
									}
									else {
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
										serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
										serialStr += opts.prepend + '[' + li_count + '][helptext]=' + encodeURIComponent($('#textarea-'+index).val());
									}
								}	
								c++;
							});
							break;
						}
					}
				}
				li_count++;
			});
		});
		if(error) {
			return 'err';
	   } else {
	   	     if (file_count > 2) {
	   	     	alert("Form can have maximum 2 File Type Questions.	");
	   	     	return 'err';
	   	     }
	   		return (serialStr);
	   }	
	};
})(jQuery);



	