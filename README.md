# antero js
a small library for simple web applications

## history

created in order to enable quick prototyping of simple web applications

## philosophy

the ideas behind antero was to guide developers toward creating small ecapsulated modules. a library built with refacorting in mind: something both easy to refactor into and out of. all application logic should contained in the smallest possible function methods inside of modules

leveraging jquery's event delegation mechanism and inspired but the simplicity of Backbone's View modules api, antero provides one `events` object for binding events.  modules can talk to each other through a publish/subscribe pattern, with antero being the `mediator`.

## Example
```
var App = App || {};
Antero.Extend({
	namespace: "App.MyFeature", // the namespace for the modules
	container: ".my-feature",
	events: { // all events should be encapsulated here.  this uses event delegation from the container
		"click .child-of-my-feature": "doSomething"
	},
	init: function () {
		// document ready event
		this.dom.container.animate({
      opacity: 0.25
    });
	},
	doSomething: function (event) { // passes in original jQuery event object
		this.doSomethingElese(); // this is the context of the module
	}
});
```
