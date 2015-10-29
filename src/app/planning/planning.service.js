'use strict'

angular.module('planning')
  .service('planningService', function (
    dbService,
    pouchUtil,
    log,
    utility,
    ROUND_STATUS,
    authService
  ) {
    var deliveryDocType = 'deliveryRound'

    function formatDoc (doc, id) {
      doc.roundCode = id
      // TODO: investigate if roundCode is used on the mobile app and drop roundCode after
      // updating mobile app to use _id
      doc.doc_type = deliveryDocType
      doc.startDate = utility.formatDate(doc.startDate)
      doc.endDate = utility.formatDate(doc.endDate)
      return doc
    }

    this.all = function () {
      var view = 'delivery-rounds/all'
      var options = {
        include_docs: true
      }
      return dbService.getView(view, options)
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
    }

    this.byAuthorisedStates = function () {
      var view = 'delivery-rounds/by-state-code'
      var options = {
        include_docs: true
      }

      function getStatesByUser (user) {
        if (user.isAdmin()) {
          return
        }
        var stateIds = authService.authorisedStates(user)
        options.keys = stateIds
      }

      return authService.getCurrentUser()
        .then(getStatesByUser)
        .then(dbService.getView.bind(null, view, options))
        .then(pouchUtil.pluckDocs)
        .then(pouchUtil.rejectIfEmpty)
    }

    this.getByRoundId = function (id) {
      return dbService.get(id)
    }

    this.getRoundCode = function (deliveryRound) {
      if (deliveryRound._id) {
        return deliveryRound._id
      }
      var startYear = new Date(deliveryRound.startDate).getFullYear()
      return [
        deliveryRound.stateCode || deliveryRound.state,
        deliveryRound.roundNo,
        startYear
      ].join('-')
    }

    this.createRound = function (deliveryRound) {
      var doc = angular.copy(deliveryRound)
      var id = this.getRoundCode(doc)
      doc = formatDoc(doc, id)
      return dbService.insertWithId(doc, id)
    }

    this.saveRound = function (deliveryRound) {
      var doc = angular.copy(deliveryRound)
      doc._id = this.getRoundCode(doc)
      doc = formatDoc(doc, doc._id)
      return dbService.save(doc)
    }

    this.isEmailReady = function (deliveryRound) {
      return deliveryRound.status && deliveryRound.status !== ROUND_STATUS.PLANNING
    }

    this.completePlanning = function (deliveryRound) {
      if (deliveryRound.status && deliveryRound.status === ROUND_STATUS.PLANNING) {
        deliveryRound.status = ROUND_STATUS.ROUTING_READY
      }
      return this.saveRound(deliveryRound)
    }

    this.onSaveError = function (err) {
      if (err.status === 401) {
        return log.error('unauthorizedAccess', err)
      }
      if (err.status === 409) {
        return log.error('updateConflict', err)
      }
      return log.error('saveDeliveryRoundFailed', err)
    }
  })
