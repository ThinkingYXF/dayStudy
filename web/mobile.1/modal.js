$.modal = function(template, data, callback) {
	var deferred = $.Deferred();
	callback = callback || $.noop;
	if (!template)
		return deferred.reject(template, data, 'No Template Defined');

	$.ajax({
		url: '/web/mobile.1/' + template + '.html',
		method: 'GET',
		cache: true,
		dataType: 'html'
	}).done(function(html) {
		//Mustache.parse(html);
		var rendered = Mustache.render(html, $.extend({}, {modalTitleId: 'modal-' + Math.random()}, data));
		var modal = $(rendered).modal('show').on('hidden.bs.modal', function() {
			deferred.reject(template, data);
			$(this).remove();
		}).on('shown.bs.modal',function() {
			callback(modal);
		});
		$.modal.attachEvents(modal, function(action) {
			deferred[action](modal, template, data);
		});
	}).fail(function() {
		deferred.reject(template, data, 'Error GET template');
	});

	return deferred;
}

/**
 * action results callback execution
 * notify => progress
 * resolve => done
 * reject => fail
 */
$.modal.attachEvents = function(modal, callback) {
	$.each(['resolve', 'notify', 'reject'], function(idx, action) {
		var eventElement = $('[data-' + action + ']', modal);
		if (eventElement.length) {
			var eventName = eventElement.data(action);
			modal.on(eventName, '[data-' + action + ']', function() {
				callback(action);
			});
		}
	});
}

$.alert = function() {
	var data = {};
	$.each(arguments, function(idx, value) {
		if (typeof value !== 'string')
			return true;
		if (data['content'])
			data['title'] = data['content'];
		data['content'] = value;
		if (data['title'])
			return false;
	});
	return $.modal('alert', data);
};

$.confirm = function() {
	var data = {};
	$.each(arguments, function(idx, value) {
		if (typeof value !== 'string')
			return true;
		if (data['content'])
			data['title'] = data['content'];
		data['content'] = value;
		if (data['title'])
			return false;
	});
	return $.modal('confirm', data).done(function(modal) {
		modal.modal('hide');
	});
}
