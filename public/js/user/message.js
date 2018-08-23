/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.10
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.Lang=factory()}})(this,function(){"use strict";function inferLocale(){if(typeof document!=="undefined"&&document.documentElement){return document.documentElement.lang}}function convertNumber(str){if(str==="-Inf"){return-Infinity}else if(str==="+Inf"||str==="Inf"||str==="*"){return Infinity}return parseInt(str,10)}var intervalRegexp=/^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;var anyIntervalRegexp=/({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;var defaults={locale:"en"};var Lang=function(options){options=options||{};this.locale=options.locale||inferLocale()||defaults.locale;this.fallback=options.fallback;this.messages=options.messages};Lang.prototype.setMessages=function(messages){this.messages=messages};Lang.prototype.getLocale=function(){return this.locale||this.fallback};Lang.prototype.setLocale=function(locale){this.locale=locale};Lang.prototype.getFallback=function(){return this.fallback};Lang.prototype.setFallback=function(fallback){this.fallback=fallback};Lang.prototype.has=function(key,locale){if(typeof key!=="string"||!this.messages){return false}return this._getMessage(key,locale)!==null};Lang.prototype.get=function(key,replacements,locale){if(!this.has(key,locale)){return key}var message=this._getMessage(key,locale);if(message===null){return key}if(replacements){message=this._applyReplacements(message,replacements)}return message};Lang.prototype.trans=function(key,replacements){return this.get(key,replacements)};Lang.prototype.choice=function(key,number,replacements,locale){replacements=typeof replacements!=="undefined"?replacements:{};replacements.count=number;var message=this.get(key,replacements,locale);if(message===null||message===undefined){return message}var messageParts=message.split("|");var explicitRules=[];for(var i=0;i<messageParts.length;i++){messageParts[i]=messageParts[i].trim();if(anyIntervalRegexp.test(messageParts[i])){var messageSpaceSplit=messageParts[i].split(/\s/);explicitRules.push(messageSpaceSplit.shift());messageParts[i]=messageSpaceSplit.join(" ")}}if(messageParts.length===1){return message}for(var j=0;j<explicitRules.length;j++){if(this._testInterval(number,explicitRules[j])){return messageParts[j]}}var pluralForm=this._getPluralForm(number);return messageParts[pluralForm]};Lang.prototype.transChoice=function(key,count,replacements){return this.choice(key,count,replacements)};Lang.prototype._parseKey=function(key,locale){if(typeof key!=="string"||typeof locale!=="string"){return null}var segments=key.split(".");var source=segments[0].replace(/\//g,".");return{source:locale+"."+source,sourceFallback:this.getFallback()+"."+source,entries:segments.slice(1)}};Lang.prototype._getMessage=function(key,locale){locale=locale||this.getLocale();key=this._parseKey(key,locale);if(this.messages[key.source]===undefined&&this.messages[key.sourceFallback]===undefined){return null}var message=this.messages[key.source];var entries=key.entries.slice();var subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]!==undefined){message=message[subKey];subKey=""}}if(typeof message!=="string"&&this.messages[key.sourceFallback]){message=this.messages[key.sourceFallback];entries=key.entries.slice();subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]){message=message[subKey];subKey=""}}}if(typeof message!=="string"){return null}return message};Lang.prototype._findMessageInTree=function(pathSegments,tree){while(pathSegments.length&&tree!==undefined){var dottedKey=pathSegments.join(".");if(tree[dottedKey]){tree=tree[dottedKey];break}tree=tree[pathSegments.shift()]}return tree};Lang.prototype._applyReplacements=function(message,replacements){for(var replace in replacements){message=message.replace(new RegExp(":"+replace,"gi"),function(match){var value=replacements[replace];var allCaps=match===match.toUpperCase();if(allCaps){return value.toUpperCase()}var firstCap=match===match.replace(/\w/i,function(letter){return letter.toUpperCase()});if(firstCap){return value.charAt(0).toUpperCase()+value.slice(1)}return value})}return message};Lang.prototype._testInterval=function(count,interval){if(typeof interval!=="string"){throw"Invalid interval: should be a string."}interval=interval.trim();var matches=interval.match(intervalRegexp);if(!matches){throw"Invalid interval: "+interval}if(matches[2]){var items=matches[2].split(",");for(var i=0;i<items.length;i++){if(parseInt(items[i],10)===count){return true}}}else{matches=matches.filter(function(match){return!!match});var leftDelimiter=matches[1];var leftNumber=convertNumber(matches[2]);if(leftNumber===Infinity){leftNumber=-Infinity}var rightNumber=convertNumber(matches[3]);var rightDelimiter=matches[4];return(leftDelimiter==="["?count>=leftNumber:count>leftNumber)&&(rightDelimiter==="]"?count<=rightNumber:count<rightNumber)}return false};Lang.prototype._getPluralForm=function(count){switch(this.locale){case"az":case"bo":case"dz":case"id":case"ja":case"jv":case"ka":case"km":case"kn":case"ko":case"ms":case"th":case"tr":case"vi":case"zh":return 0;case"af":case"bn":case"bg":case"ca":case"da":case"de":case"el":case"en":case"eo":case"es":case"et":case"eu":case"fa":case"fi":case"fo":case"fur":case"fy":case"gl":case"gu":case"ha":case"he":case"hu":case"is":case"it":case"ku":case"lb":case"ml":case"mn":case"mr":case"nah":case"nb":case"ne":case"nl":case"nn":case"no":case"om":case"or":case"pa":case"pap":case"ps":case"pt":case"so":case"sq":case"sv":case"sw":case"ta":case"te":case"tk":case"ur":case"zu":return count==1?0:1;case"am":case"bh":case"fil":case"fr":case"gun":case"hi":case"hy":case"ln":case"mg":case"nso":case"xbr":case"ti":case"wa":return count===0||count===1?0:1;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return count%10==1&&count%100!=11?0:count%10>=2&&count%10<=4&&(count%100<10||count%100>=20)?1:2;case"cs":case"sk":return count==1?0:count>=2&&count<=4?1:2;case"ga":return count==1?0:count==2?1:2;case"lt":return count%10==1&&count%100!=11?0:count%10>=2&&(count%100<10||count%100>=20)?1:2;case"sl":return count%100==1?0:count%100==2?1:count%100==3||count%100==4?2:3;case"mk":return count%10==1?0:1;case"mt":return count==1?0:count===0||count%100>1&&count%100<11?1:count%100>10&&count%100<20?2:3;case"lv":return count===0?0:count%10==1&&count%100!=11?1:2;case"pl":return count==1?0:count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?1:2;case"cy":return count==1?0:count==2?1:count==8||count==11?2:3;case"ro":return count==1?0:count===0||count%100>0&&count%100<20?1:2;case"ar":return count===0?0:count==1?1:count==2?2:count%100>=3&&count%100<=10?3:count%100>=11&&count%100<=99?4:5;default:return 0}};return Lang});

(function () {
    Lang = new Lang();
    Lang.setMessages({"en.admin.breadcrumb":{"action":{"create":"Create","edit":"Edit"},"clinic_types":"Clinic types","clinics":"Clinics","dashboard":"Dashboard","users":"Users"},"en.admin.clinic":{"create":{"add":"Add","heading":"Add new clinic","reset":"Reset","title":"Clinic"},"delete":{"confirm":"Are you sure?","success":"The clinic has been deleted"},"edit":{"edit":"Edit","heading":"Update a clinic","title":"Clinic"},"fields":{"address":"Address","clinic_type":"Clinic Type","created_at":"Created at","description":"Description","email":"Email","image":"Image","lat":"Latitude","lng":"Longitude","name":"Name","phone":"Phone","slug":"Slug","updated_at":"Updated at"},"index":{"delete":"Delete","edit":"Edit","heading":"List clinics","show":"Show","title":"Clinic"},"show":{"heading":"Clinic id :id","title":"Clinic detail"},"store":{"success":"A new clinic is added"},"update":{"success":"The clinic has been updated"}},"en.admin.clinic_type":{"create":{"add":"Add","heading":"Create clinic type","name":"Name","placeholder":"Please enter clinic type","reset":"Reset","title":"Clinic type"},"delete":{"confirm":"Are you sure?","del":"Delete","error":"Can't delete this clinic type now. Some clinics still related to this type.<br>Try to remove them first","success":"Clinic type is deleted"},"edit":{"heading":"Edit clinic type","title":"Clinic type","update":"Update"},"index":{"add":"Add","created_at":"created_at","delete":"delete","edit":"edit","heading":"List clinic types","name":"name","title":"Clinic type"},"store":{"success":"A new clinic type is added"},"update":{"success":"Clinic type is updated"}},"en.admin.dashboard":{"heading":"Dashboard","title":"Dashboard"},"en.admin.layout":{"btn":{"add":"Add","detail":"Detail","reset":"Reset","update":"Update"},"message":{"success":"Add new item successfully"},"navbar":{"app_name":"Booking clinic","logout":"Logout","search":"Search"},"sidebar":{"clinic_types":"Clinic types","clinics":"Clinics","dashboard":"Dashboard","users":"Users"}},"en.admin.register":{"btn-register":"Register","confirm_password":"Confirm Password","email":"E-Mail Address","heading":"Register","name":"Name","password":"Password"},"en.admin.user":{"fields":{"address":"Address","created_at":"Created At","dob":"Day of Birth","email":"Email","gender":"Gender","gender_type":{"female":"Female","male":"Male"},"name":"Name","phone":"Phone Number","show":"Show","updated_at":"Updated At"},"index":{"heading":"List users","title":"Users"},"show":{"heading":"User id :id","title":"User detail"}},"en.admin_clinic.appointment":{"fields":{"book_time":"book_time","created_at":"created_at","description":"description","detail":"detail","status":"status","updated_at":"updated_at","user_name":"User name"},"index":{"filter":"Filter status","heading":"List appointments","search":"Search","status":{"all":"All","cancel":"Cancel","completed":"Completed","confirmed":"Confirmed"},"title":"Appointments"},"show":{"heading":"Appointment id :id","title":"Appointment detail"},"status":{"cancel":"Cancel","confirmed":"Confirmed"},"update":{"success":"List appointments is updated"}},"en.admin_clinic.breadcrumb":{"action":{"create":"Create","edit":"Edit"},"admin":"Admin","appointments":"Appointments","calendar":"Calendar","clinic":"Clinic","dashboard":"Dashboard","profile":"Profile"},"en.admin_clinic.calendar":{"appointment_title":"Appointment #:id\n :username","heading":"Appointment Calendar","title":"Calendar"},"en.admin_clinic.dashboard":{"appointments":"Appointments","cancel":"Cancel appointment","confirm":"Confirm appointment","examinations":"Examinations","heading":"Dashboard","statitics":"Statitics","title":"Dashboard","users":"Users","views":"View Detail"},"en.admin_clinic.layout":{"btn":{"add":"Add","detail":"Detail","reset":"Reset","update":"Update"},"message":{"success":"Add new item successfully"},"navbar":{"app_name":"Booking clinic","logout":"Logout","search":"Search"},"sidebar":{"appointments":"Appointments","calendar":"Calendar","dashboard":"Dashboard","profile":"Profile"}},"en.admin_clinic.profile":{"edit":{"admin":{"heading":"Update admin information","section":{"adminname":"Change Admin Name","password":"Change Password"}},"clinic":{"confirm":"Are you sure ?","heading":"Update a clinic"}},"fields":{"admin":{"confirm_password":"Confirm password","current_password":"Current password","name":"Name","new_password":"New password"},"clinic":{"address":"Address","clinic_type":"Clinic Type","created_at":"Created at","description":"Description","email":"Email","image":"Image","lat":"Lat","lng":"Lng","name":"Name","phone":"Phone","slug":"Slug","updated_at":"Updated at"}},"show":{"heading":"Clinic detail","link_to_edit":{"account":"Admin","clinic":"Clinic"},"title":"Profile"},"update":{"error":{"password":"The current password isn't correct"},"success":{"admin":{"name":"The admin name has been updated","password":"The admin information has been updated."},"clinic":"The clinic information has been updated."}}},"en.api.appointment":{"store":{"fail":"Create appointment fail"}},"en.api.clinic":{"error":{"404":"Clinic not found"}},"en.api.user":{"change_password":{"fail":"Change password fail","success":"Your password is changed"},"log_out":["Successfully logged out"],"login":{"fail":"Email or password is incorrect"},"register":{"confirm_pass":"Confirm Password","email":"Email Address","find":"It's time to find you!","h_1":"Let patients to Find you!","h_2":"Easly manage Bookings","h_3":"Instantly via Mobile","name":"Name","p_1":"Te pri adhuc simul. No eros errem mea. Diam mandamus has ad. Invenire senserit ad has, has ei quis iudico, ad mei nonumes periculis.","p_2":"Ut nam graece accumsan cotidieque. Has voluptua vivendum accusamus cu. Ut per assueverit temporibus dissentiet.","p_3":"Has voluptua vivendum accusamus cu. Ut per assueverit temporibus dissentiet. Eum no atqui putant democritum, velit nusquam sententiae vis no.","p_4":"Eos eu epicuri eleifend suavitate, te primis placerat suavitate his. Nam ut dico intellegat reprehendunt, everti audiam diceret in pri, id has clita consequat suscipiantur.","p_5":"Ut nam graece accumsan cotidieque. Has voluptua vivendum accusamus cu. Ut per assueverit temporibus dissentiet.","password":"Password"},"sign_up":{"fail":"Register fail"},"update":{"fail":"Edit profile fail"},"validation":{"new_password.regex":"Password contain at least one uppercase\/lowercase letters and one number and one special character"}},"en.auth":{"failed":"These credentials do not match our records.","throttle":"Too many login attempts. Please try again in :seconds seconds."},"en.pagination":{"next":"Next &raquo;","previous":"&laquo; Previous"},"en.passwords":{"password":"Passwords must be at least six characters and match the confirmation.","reset":"Your password has been reset!","sent":"We have e-mailed your password reset link!","token":"This password reset token is invalid.","user":"We can't find a user with that e-mail address."},"en.user.booking":{"additional_information":"Additional Information","booking_fail_message":"The data you provide not valid. Please re-booking your appointment","confirm":"Confirm","confirm_message":"Are you sure!","description":"Description","for_your_booking":"for your booking!","info":{"clinic_name":"Clinic name","date":"Date","phone":"Phone","time":"Time"},"receive_email":"You'll receive a confirmation email at","redirect":"Redirect to Homepage in second","select_datetime":"Please select your datetime!","thanks":"Thanks","type_something":"Type something...","your_booking":"Your booking","your_details":"Your Details"},"en.user.breadcrumb":{"booking":"Booking appointment","change_password":"Change password","home":"Home","profile":"Profile"},"en.user.change_password":{"change_password":"Change password","confirm_new_password":"Confirm new password","current_password":"Current password","new_password":"New password","update":"Update"},"en.user.clinic":{"index":{"clinic_item":{"book":"Book now","direction":"Directions","read_more":"Read more","view_map":"View on map"},"js":{"page":"page"},"paginator":{"first_page":"First","last_page":"Last","next_page":"Next","previous_page":"Previous"}},"show":{"booking_tab":{"btn_booking":"Book Now","date":{"heading":"Select your date","legend_1":"Available","legend_2":"Not available"},"guide":{"heading":"Guide","li_1":"Firstly, choose your date of booking in section.","li_2":"Then, choose one of list options below to select the time for booking.","li_3":"And, click \"book now\" button for next step."},"tab_name":"Book an appointment","time":{"heading":"Select your time"}},"info_box":{"address":"Address","email":"Email","patient":"Patients","phone":"Phone","view":"Views","view_map":"View on map"},"info_tab":{"section_1":{"full_title":"Short description about our clinic","title":"Description"},"section_2":{"date_work":{"li_1":"every week","li_1_strong":"Monday - Friday","li_2_strong":"Not including weekend and special days","ul":"Date working"},"full_title":"Information below is about time working of our doctocs","time_work":{"li_1":"Morning:","li_1_strong":"8:00am - 12:00am","li_2":"Afternoon:","li_2_strong":"1:30pm - 5:30pm","ul":"Time working"},"title":"Time working"},"section_3":{"full_title":"Some images picture","span_next":"Next","span_previous":"Previous","title":"Image preview"},"tab_name":"General info"},"login_page":"login page","please_login":"Please login to booking! Go to"}},"en.user.layout":{"app":{"app_name":"FinClinic","slogan":"Find easily a clinic and book online an appointment","title":"Booking clinic"},"navbar":{"change_password":"Change password","clinic_types":"Clinic types","logout":"Logout","profile":"My profile"}},"en.user.login":{"forgot_password":"Forgot password?","login_facebook":"Login with Facebook","login_google":"Login with Google","login_linkedin":"Login with Linkedin","not_have_account":"Do not have an account yet?","please_login":"Please login to","register_now":"Register now!","your_email":"Your email address","your_password":"Your password"},"en.user.profile":{"basic_info":"Basic info","contact":"Contact","edit":"Edit","fields":{"address":"Address","dob":"Day of birth","email":"Email","gender":"Gender","name":"Name","phone":"Phone"},"gender":{"female":"Female","male":"Male"}},"en.validation":{"accepted":"The :attribute must be accepted.","active_url":"The :attribute is not a valid URL.","after":"The :attribute must be a date after :date.","after_or_equal":"The :attribute must be a date after or equal to :date.","alpha":"The :attribute may only contain letters.","alpha_dash":"The :attribute may only contain letters, numbers, dashes and underscores.","alpha_num":"The :attribute may only contain letters and numbers.","array":"The :attribute must be an array.","attributes":[],"before":"The :attribute must be a date before :date.","before_or_equal":"The :attribute must be a date before or equal to :date.","between":{"array":"The :attribute must have between :min and :max items.","file":"The :attribute must be between :min and :max kilobytes.","numeric":"The :attribute must be between :min and :max.","string":"The :attribute must be between :min and :max characters."},"boolean":"The :attribute field must be true or false.","confirmed":"The :attribute confirmation does not match.","custom":{"attribute-name":{"rule-name":"custom-message"}},"date":"The :attribute is not a valid date.","date_format":"The :attribute does not match the format :format.","different":"The :attribute and :other must be different.","digits":"The :attribute must be :digits digits.","digits_between":"The :attribute must be between :min and :max digits.","dimensions":"The :attribute has invalid image dimensions.","distinct":"The :attribute field has a duplicate value.","email":"The :attribute must be a valid email address.","exists":"The selected :attribute is invalid.","file":"The :attribute must be a file.","filled":"The :attribute field must have a value.","gt":{"array":"The :attribute must have more than :value items.","file":"The :attribute must be greater than :value kilobytes.","numeric":"The :attribute must be greater than :value.","string":"The :attribute must be greater than :value characters."},"gte":{"array":"The :attribute must have :value items or more.","file":"The :attribute must be greater than or equal :value kilobytes.","numeric":"The :attribute must be greater than or equal :value.","string":"The :attribute must be greater than or equal :value characters."},"image":"The :attribute must be an image.","in":"The selected :attribute is invalid.","in_array":"The :attribute field does not exist in :other.","integer":"The :attribute must be an integer.","ip":"The :attribute must be a valid IP address.","ipv4":"The :attribute must be a valid IPv4 address.","ipv6":"The :attribute must be a valid IPv6 address.","json":"The :attribute must be a valid JSON string.","lt":{"array":"The :attribute must have less than :value items.","file":"The :attribute must be less than :value kilobytes.","numeric":"The :attribute must be less than :value.","string":"The :attribute must be less than :value characters."},"lte":{"array":"The :attribute must not have more than :value items.","file":"The :attribute must be less than or equal :value kilobytes.","numeric":"The :attribute must be less than or equal :value.","string":"The :attribute must be less than or equal :value characters."},"max":{"array":"The :attribute may not have more than :max items.","file":"The :attribute may not be greater than :max kilobytes.","numeric":"The :attribute may not be greater than :max.","string":"The :attribute may not be greater than :max characters."},"mimes":"The :attribute must be a file of type: :values.","mimetypes":"The :attribute must be a file of type: :values.","min":{"array":"The :attribute must have at least :min items.","file":"The :attribute must be at least :min kilobytes.","numeric":"The :attribute must be at least :min.","string":"The :attribute must be at least :min characters."},"not_in":"The selected :attribute is invalid.","not_regex":"The :attribute format is invalid.","numeric":"The :attribute must be a number.","present":"The :attribute field must be present.","regex":"The :attribute format is invalid.","required":"The :attribute field is required.","required_if":"The :attribute field is required when :other is :value.","required_unless":"The :attribute field is required unless :other is in :values.","required_with":"The :attribute field is required when :values is present.","required_with_all":"The :attribute field is required when :values is present.","required_without":"The :attribute field is required when :values is not present.","required_without_all":"The :attribute field is required when none of :values are present.","same":"The :attribute and :other must match.","size":{"array":"The :attribute must contain :size items.","file":"The :attribute must be :size kilobytes.","numeric":"The :attribute must be :size.","string":"The :attribute must be :size characters."},"string":"The :attribute must be a string.","timezone":"The :attribute must be a valid zone.","unique":"The :attribute has already been taken.","uploaded":"The :attribute failed to upload.","url":"The :attribute format is invalid."}});
})();
