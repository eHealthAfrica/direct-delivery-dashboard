angular.module('planning')
		.service('copyRoundService', function () {

			var newStatus = 'Upcoming: 1st attempt';
			//TODO: move this to a constant of delivery statuses

			function clearPackingList(packingList) {
				delete packingList.packedQty;
				return packingList;
			}

			function clearPackedProducts(packedProducts) {
				return packedProducts.map(function(packedProduct){
					delete packedProduct.returnedQty;
					delete packedProduct.onHandQty;
					delete packedProduct.deliveredQty;
					delete packedProduct.receivedInterimStock;
					delete packedProduct.btwDeliveryReceivedQty;
					return packedProduct;
				});
			}

			function clearFacRnd(facRnd){
				delete facRnd.arrivedAt;
				delete facRnd.receivedBy;
				delete facRnd.recipientPhoneNo;
				facRnd.signature = {};
				facRnd.cancelReport = {};
				//TODO: Ask Michael or Adamu, how they assign delivery status when copying sheets
				if(!facRnd.status || facRnd.status !== 'Canceled: CCE'){
					facRnd.status = newStatus;
				}
				//clear packed product
				facRnd.packedProduct = clearPackedProducts(facRnd.packedProduct);

				return facRnd;
			}

			this.prepareFromTemplate = function(currentRoundId, roundDailySchedules) {

				function cleanUpASchedule(dailySchedule) {
					var temp = angular.copy(dailySchedule);
					temp.deliveryRoundID = currentRoundId;
					temp.date = '';
					delete temp._id;
					delete temp._rev;
					delete temp.createdOn;
					delete temp.modifiedOn;

					if(temp.balance){
						delete temp.balance;
					}

					if(angular.isArray(temp.packingList)){
						temp.packingList = temp.packingList.map(clearPackingList);
					}

					if(angular.isArray(temp.facilityRounds)){
						temp.facilityRounds = temp.facilityRounds.map(clearFacRnd);
					}

					return temp;
				}

				return roundDailySchedules.map(cleanUpASchedule);
			};

		});