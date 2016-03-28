(function ($) {
	"use strict";

	var event = {
		events: {},
		bind: function (module) {
			try {
				// make sure we have a module and that it has an events object
				if (module && module.events) {
					var events = module.events;

					// loop through each event in the events object and bind to the container
					for (var event in events) {
						if (events.hasOwnProperty(event)) {
							// get the function name from the events object
							var eventFunction = events[event],
								moduleFunction = module[eventFunction];

							// check if the function name is on the module and that it is a function
							if (_.isFunction(moduleFunction)) {

								var eventProperties = event.split(" "),
									eventType = eventProperties[0],
									eventName = eventProperties[1];

								if (eventType === "publish") {
									module[eventFunction] = this.overridePublishFunction(eventName, moduleFunction);
								} else if (eventType === "subscribe") {
									this.subscribe(eventName, moduleFunction, module);
								} else if (module.dom && module.dom.container && module.dom.container.length) {
									// bind the dom event to the container
									module.dom.container.off(eventType, eventName);
									module.dom.container.on(eventType, eventName, $.proxy(moduleFunction, module));
								}
							}
						}
					}
				}
			}
			catch (ex) {
				console.info('error binding an event in an Antero module');
			}
		},
		subscribe: function (event, listener, module) {
			// create the event if not yet created
			var eventCreated = this.events[event];
			if (!eventCreated) {
				this.events[event] = [];
			}

			// add the listener, with the module context
			this.events[event].push({ listener: listener, context: module });
		},
		publish: function (event, data) {
			// return if the event doesn't exist, or there are no listeners
			var eventExists = this.events[event];

			var hasListeners = eventExists && this.events[event].length < 1;
			if (hasListeners) {
				return;
			}

			// send the event to all listeners
			this.events[event].forEach(function (subscriber) {
				subscriber.listener.apply(subscriber.context, [data || {}]);
			});
		},
		overridePublishFunction: function (eventName, moduleFunction) {
			var originalFunction = moduleFunction;

			return function () {
				var passedData = originalFunction();
				event.publish(eventName, passedData);
			};
		}
	};

		// parses string namespaces and automatically generating nested namespaces
	var atttachNamespace = function (namespace, namespacedString) {
			var parts = namespacedString.split('.'),
				parent = namespace,
				partsLength, index;

			// TODO: determine how to restructure this so App is not hard coded into antero
			if (parts[0] == "App") {
				parts = parts.slice(1);
			}

			partsLength = parts.length;

			for (index = 0; index < partsLength; index++) {
				//create a property if it doesnt exist
				if (typeof parent[parts[index]] == 'undefined') {
					parent[parts[index]] = {};
				}
				parent = parent[parts[index]];
			}
			return parent;
		};

	var modules = [];

	function Antero() {
		this.Extend = function (module) {
			var nameSpacedModule = atttachNamespace(window.App || {}, module.namespace);
			module.dom = module.dom || {};
			module = $.extend(nameSpacedModule, window[module.namespace], module);
			modules.push(module);
			return module;
		};
	}

	window.Antero = window.λ = new Antero();

	$(document).ready(function () {
		var initialized = [],
			lastModuleIndex = (modules.length - 1),
			index;

		// iterate backwards through the array of modules that need to be initted, only initting once for each module
		for (index = lastModuleIndex; index >= 0; --index) {
			var module = modules[index],
				needsToBeInitialized = !_.contains(initialized, module.namespace);

			// exit if module has already been initialized
			if (needsToBeInitialized) {
				// bind dom
				if (module.container) {
					module.dom.container = $(module.container);
				}

				event.bind(module);
				initialized.push(module.namespace);
			} else {
				modules.splice(index, 1);
			}
		}

		for (var i = 0; i < modules.length; i++) {
			if (_.isFunction(modules[i].init)) {
				$.proxy(modules[i].init(), modules[i]);
			}
		}
	});

})(jQuery);
