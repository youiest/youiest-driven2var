Meteor.publish("language",function(language){
	return Language.find({"_id":language});//"_id":language
});
Meteor.publish("languages",function(language){
	return W.find().sort( { _id : -1 } ).limit(1)
});
