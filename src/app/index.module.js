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
			'eha-drag-n-drop'
		])
		.run(function ($rootScope, $state, log, AuthService, editableOptions) {

			//set xeditable bootstrap theme
			editableOptions.theme = 'bs3';

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
				if (!AuthService.initialized) {
					AuthService.init()
							.then(function (user) {
								if (user) {
									$state.go(toState, toParams);
								} else {
									$state.go('login');
								}
							})
							.catch(function (err) {
								log.error(err);
								$state.go('login');
							});

					event.preventDefault();
				}
				else if (!AuthService.isLoggedIn && toState.name !== 'login') {
					$state.go('login');
					event.preventDefault();
				}
			});
		});
