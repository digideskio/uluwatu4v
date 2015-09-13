'use strict';

var log = log4javascript.getLogger("notificationController-logger");

angular.module('uluwatuControllers').controller('notificationController', ['$scope', '$rootScope', '$filter', 'Cluster', 'GlobalStack',
function ($scope, $rootScope, $filter, Cluster, GlobalStack) {
    var successEvents = [ "REQUESTED",
                          "CREATE_IN_PROGRESS",
                          "START_REQUESTED",
                          "START_IN_PROGRESS",
                          "STOPPED",
                          "STOP_REQUESTED",
                          "STOP_IN_PROGRESS",
                          "DELETE_IN_PROGRESS" ];

    var errorEvents = [ "CLUSTER_CREATION_FAILED",
                        "CREATE_FAILED",
                        "START_FAILED",
                        "DELETE_FAILED",
                        "UPDATE_FAILED",
                        "STOP_FAILED" ];

    var socket = io();
    socket.on('notification', handleNotification);

    function handleNotification(notification) {
      var eventType = notification.eventType;

      if (successEvents.indexOf(eventType) > -1) {
        $scope.showSuccess(notification.eventMessage, notification.stackName);
        handleStatusChange(notification);
      } else if (errorEvents.indexOf(eventType) > -1) {
        $scope.showErrorMessage(notification.eventMessage, notification.stackName);
        handleStatusChange(notification);
      } else {
        switch(eventType) {
          case "DELETE_COMPLETED":
            $scope.showSuccess(notification.eventMessage, notification.stackName);
            $rootScope.clusters = $filter('filter')($rootScope.clusters, function(value, index) { return value.id != notification.stackId;});
            break;
          case "AVAILABLE":
            handleAvailableNotification(notification);
            break;
          case "UPTIME_NOTIFICATION":
            handleUptimeNotification(notification);
            break;
          case "UPDATE_IN_PROGRESS":
            handleUpdateInProgressNotification(notification);
            break;
        }
      }
      $scope.$apply();
    }

    function setProgressForStatus(actCluster){
        if (actCluster.status == 'AVAILABLE') {
            if (actCluster.cluster != undefined && actCluster.cluster.status != 'REQUESTED') {
                if (actCluster.cluster.status == 'AVAILABLE') {
                    return 100;
                } else if (endsWith(actCluster.status, 'FAILED')){

                    return 100;
                } else if ('UPDATE_IN_PROGRESS') {
                    return 75;
                }
            }
            return 50;
        } else if (endsWith(actCluster.status, 'FAILED')){
            return 100;
        } else if ('UPDATE_IN_PROGRESS') {
            return 50;
        } else if ('CREATE_IN_PROGRESS') {
            return 50;
        }
        return 0;
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function handleStatusChange(notification){
      var actCluster = $filter('filter')($rootScope.clusters, { id: notification.stackId })[0];
      if (actCluster != undefined) {
        actCluster.status = notification.eventType;
        addNotificationToGlobalEvents(notification);
      }
    }

    function handleAvailableNotification(notification) {
      var actCluster = $filter('filter')($rootScope.clusters, { id: notification.stackId })[0];
      var msg = notification.eventMessage;
      var nodeCount = notification.nodeCount;
      if (nodeCount != null && nodeCount != undefined && nodeCount != 0) {
        actCluster.nodeCount = nodeCount;
      }
      refreshMetadata(notification)
      actCluster.status = notification.eventType;
      actCluster.progress = setProgressForStatus(actCluster);
      $scope.showSuccess(msg, actCluster.name);
      addNotificationToGlobalEvents(notification);
      $rootScope.$broadcast('START_PERISCOPE_CLUSTER', actCluster, msg);
    }

    function handleUptimeNotification(notification) {
      var actCluster = $filter('filter')($rootScope.clusters, { id: notification.stackId })[0];
      if (actCluster != undefined) {
        var SECONDS_PER_MINUTE = 60;
        var MILLIS_PER_SECOND = 1000;
        var runningInMs = parseInt(notification.eventMessage);
        var minutes = ((runningInMs/ (MILLIS_PER_SECOND * SECONDS_PER_MINUTE)) % SECONDS_PER_MINUTE);
        var hours = (runningInMs / (MILLIS_PER_SECOND * SECONDS_PER_MINUTE * SECONDS_PER_MINUTE));
        actCluster.minutesUp = parseInt(minutes);
        actCluster.hoursUp = parseInt(hours);
      }
    }

    function handleUpdateInProgressNotification(notification) {
      var actCluster = $filter('filter')($rootScope.clusters, { id: notification.stackId })[0];
      var msg = notification.eventMessage;
      var indexOfAmbariIp = msg.indexOf("Ambari ip:");
      if (actCluster != undefined && msg != null && msg != undefined && indexOfAmbariIp > -1) {
        if (actCluster.cluster == undefined) {
          actCluster.cluster = {};
        }
        actCluster.cluster.ambariServerIp = msg.split(':')[1];
        actCluster.progress = 50;
      }
      actCluster.progress = setProgressForStatus(actCluster);
      $scope.showSuccess(notification.eventMessage, notification.stackName);
      handleStatusChange(notification);
    }

    function addNotificationToGlobalEvents(item) {
      item.customTimeStamp =  new Date(item.eventTimestamp).toLocaleDateString() + " " + new Date(item.eventTimestamp).toLocaleTimeString();
      $rootScope.events.push(item);
    }

    function refreshMetadata(notification) {
      if($rootScope.activeCluster.id != undefined && $rootScope.activeCluster.id == notification.stackId) {
        GlobalStack.get({ id: notification.stackId }, function(success) {
          // refresh host metadata
          if (success.cluster != null && success.cluster.hostGroups != null) {
            $rootScope.activeCluster.cluster.hostGroups = success.cluster.hostGroups;
          }
          // refresh instance metadata
          var metadata = []
          angular.forEach(success.instanceGroups, function(item) {
              angular.forEach(item.metadata, function(item1) {
              metadata.push(item1)
              $rootScope.activeCluster.metadata = metadata // trigger activeCluster.metadata
            });
          });
        });
      }
    }

  }
]);
