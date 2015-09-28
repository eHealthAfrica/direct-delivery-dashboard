'use strict';

angular
		.module('directDeliveryDashboard', [
			'ngSanitize',
			'xeditable',
			'ngCsv',
			'ngCsvImport',
			'nvd3ChartDirectives',
			'gantt',
			'gantt.tooltips',
			'core',
			'navbar',
			'footer',
			'home',
			'auth',
			'planning',
			'log',
			'login',
			'reports',
			'planning',
			'finance',
			'users',
			'db',
			'location',
			'configurations',
			'allocations',
			'products',
			'utility',
			'eha-drag-n-drop',
      'Measurements'
		])
		.run(function(indexService) {
      indexService.bootstrap();
		});
