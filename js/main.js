$._messengerDefaults = {
	extraClasses: 'messenger-fixed messenger-theme-future messenger-on-bottom messenger-on-right'
}

$.globalMessenger().post "Your request has succeded!"

$.globalMessenger().post
    message: 'There was an explosion while processing your request.'
    type: 'error'
    showCloseButton: true

msg = $.globalMessenger().post "My Message"
msg.update "I changed my mind, this is my message"
msg.hide()

# Want to put actions at the end of your messages?
msg = $.globalMessenger().post
    message: 'Launching thermonuclear war...'
    type: 'info'
    actions:
        cancel:
            label: 'cancel launch'
            action: ->
                msg.update
                    message: 'Thermonuclear war averted'
                    type: 'success'
                    actions: false

# This guy will 500 a few times, then succeed
i = 0
$.globalMessenger().do
  errorMessage: 'Error destroying alien planet'
  successMessage: 'Alien planet destroyed!'

  action: (opts) ->
    if (++i < 3)
      opts.error({status: 500, readyState: 0, responseText: 0})
    else
      opts.success()


# Have an error? How about auto retrys with a Gmail-style countdown
# (hidden in the future theme)?:
msg = $.globalMessenger().post
    message: "I'm sorry Hal, I just can't do that."
    actions:
        retry:
            label: 'retry now'
            phrase: 'Retrying TIME'
            auto: true
            delay: 10
            action: ->
                # Do some retrying...

        cancel:
            action: ->
                do msg.cancel

# You can bind to action events as well:
msg.on 'action:retry', ->
    alert('Hey, you retried!')

# Need more control? You can bind events backbone-style based
# on the type of message.
msg.update
    events:
        'success click': ->
            # Will fire when the user clicks the message
            # in a success state.

        'error click a.awesome-class': ->
            # Rock on

# Need your message to hide after a while, or when the Backbone
# router changes the page?
$.globalMessenger().post
    message: "Weeeeee"

    hideAfter: 10
    hideOnNavigate: true

# You can use the id property to ensure that only one
# instance of a message will appear on the page at a time
# (the older message will be hidden).
$.globalMessenger().post
  message: "Only one at a time!"
  id: "Only-one-message"

# When you add the singleton attribute, it ensures that no
# other messages with that id will ever be shown again
# (the newer message will be hidden).
$.globalMessenger().post
  message: "It's just me!"
  id: '4'
  singleton: true

$.globalMessenger().post
  message: "You'll never see me"
  id: '4'
  singleton: true

# Rather than hiding and showing multiple messages
# you can also maintain a single message between
# requests.
msg = $.globalMessenger().do()
$.globalMessenger().do({messageInstance: msg})

# Don't want your message hidden on a long page? (Not necessary
# if you're using the default fixed positioning)
msg = $.globalMessenger().post
    message: "You'll see me!"

    scrollTo: true
    # Requires jQuery scrollTo plugin

msg.scrollTo() # also works

# Lazy/smart? How about messenger does it all for you?  All the
# retry magic comes with.
$.globalMessenger().do
    successMessage: 'Data saved.'
    errorMessage: 'Error saving data'
    progressMessage: 'Saving data' # Don't include messages you
                                   # don't want to appear.

    # Any standard message opts can go here
,
    # All the standard jQuery ajax options here

    url: '/data'

# Need to override the messages based on the response?
$.globalMessenger().do
    errorMessage: 'Oops'
,
    url: '/data'
    error: (xhr) ->
        # Whatever you return from your handlers will replace
        # the default messages

        if xhr?.status is 404
            return "Data not found"

        # Return true or undefined for your predefined message
        # Return false to not show any message

        return true

# Sometimes you only want to show the success message when a
# retry succeeds, not if a retry wasen't required:
$.globalMessenger().do
    successMessage: 'Successfully saved.'
    errorMessage: 'Error saving'

    showSuccessWithoutError: false
,
    url: '/data'

# You don't have to use $.ajax as your action, messenger works
# great for any async process:
$.globalMessenger().do
    successMessage: 'Bomb defused successfully'

    action: defuseBomb
    # You can put options for defuseBomb here
    # It will be passed success and error callbacks

# Need to hide all messages?
$.globalMessenger().hideAll()

# If your action responds with a promise-like thing, its
# methods will be copied onto the message:

$.globalMessenger().do({}, {url: 'a'}).fail(-> alert "Uh oh")

# Do you use Backbone? Hook all backbone calls:
$.globalMessenger().hookBackboneAjax()

# By default, there will be no error message (just background
# retries), return an error message from your backbone error handler,
# or add an errorMessage to the messenger opts to set one.
# You can override these options by passing them into
# hookBackboneAjax, or adding a {'messenger': } hash to your
# fetch call.

# You don't have to use the global messenger
$('div#message-container').messenger().post "My message"

# By default, the global messenger will create an ActionMessenger
# instance fixed to the bottom-right corner of the screen.

# You can pass an instance of messenger into globalMessenger
# to override the default position.
myAwesomeMessenger = $('.mess').messenger()
$.globalMessenger({instance: myAwesomeMessenger});

$.globalMessenger() # <-- Will return your messenger

$.globalMessenger({'parentLocations': ['.page', 'body']});
# Will try to insert the messenger into the el matching
# .page before inserting it into the page.

# This can be important if you're not using fixed positioning.

# All the options for globalMessenger and their defaults:

{
  'parentLocations': ['body'],
  'maxMessages': 9,
  'extraClasses': 'messenger-fixed messenger-on-right messenger-on-bottom messenger-theme-future',
  'instance': undefined,
  'messageDefaults': {
    # Default message options
  }
}

# You can also set default options on the $._messengerDefaults object.
$._messengerDefaults = {'extraClasses': 'messenger-fixed messenger-on-left'}
