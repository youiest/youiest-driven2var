var str = navigator.language;
// Language.defaultLanguage = str.toLowerCase();
lang = str.split("-");
Language.defaultLanguage = lang[0];
// if(Language.defaultLanguage == "en-in")
// 	Language.defaultLanguage = "en-us"

Language.getText = function(){
	var lang = null, message = null, localLang = null;
	
	lang = app.lang;
	message = "Language from app.lang";
	
	localLang = window.localStorage.getItem("language");
	if(localLang){
		try{
			lang = JSON.parse(localLang);
			message = "Language from localStorage";
		}catch(err){}
	}

	
	if(Language.findOne({"_id":Session.get("language")})){
		lang = Language.findOne({"_id":Session.get("language")});	
		message = "Language from live DB";
		window.localStorage.setItem("language", JSON.stringify(lang));
	}

	// console.info(message);
	return lang;
}

Language.onTimeChange = function(){
	if(!$.timeago){
		setTimeout(Language.onTimeChange,100);
		return;
	}
	$(".timeagoClass").remove();
	// $("head").append(
	// 	'<script type="text/javascript" class="timeagoClass" src="/timeago/jquery.timeago.'
	// 	+Session.get("language") 
	// 	+'.js"></script>'
	// );
}

// Session.set("language",Language.defaultLanguage);
Tracker.autorun(function(){
		Meteor.subscribe("language",Session.get("language")); 
  	Language.onTimeChange();	
  	// alert(Session.get("language"))
});


UI.registerHelper("lang", function () {
	Language.findOne({"_id":Session.get("language")});
	 // || app.lang;
	// if(Language.lang)
	// 	app.lang = Language.lang;
	Language.lang = Language.getText();
	return Language.lang;
});