# antero
a small library for simple web applications

## history

created in order to enable quick prototyping of simple web applications

## philosophy

the ideas behind antero was to guide developers toward creating small ecapsulated modules. a library built with refacorting in mind: something both easy to refactor into and out of. all application logic should contained in the smallest possible function methods inside of modules

leveraging jquery's event delegation mechanism and inspired but the simplicity of Backbone's View modules api, antero provides one `events` object for binding events.  modules can talk to each other through a publish/subscribe pattern, with antero being the `mediator`.
