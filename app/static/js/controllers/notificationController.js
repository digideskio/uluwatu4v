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

    function handleStatusChange(notification){
      var actCluster = getClusterReference(notification.stackId);
      if (actCluster != undefined) {
        actCluster.status = notification.eventType;
        actCluster.statusReason = notification.eventMessage;
        addNotificationToGlobalEvents(notification);
      }
      actCluster.progress = $rootScope.setProgressForStatus(actCluster);
    }

    function handleAvailableNotification(notification) {
      var actCluster = getClusterReference(notification.stackId);
      var msg = notification.eventMessage;
      var nodeCount = notification.nodeCount;
      if (nodeCount != null && nodeCount != undefined && nodeCount != 0) {
        actCluster.nodeCount = nodeCount;
      }
      refreshMetadata(notification, actCluster);
      actCluster.status = notification.eventType;
      $scope.showSuccess(msg, actCluster.name);
      addNotificationToGlobalEvents(notification);
      actCluster.progress = $rootScope.setProgressForStatus(actCluster);
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
      var actCluster = getClusterReference(notification.stackId);
      var msg = notification.eventMessage;
      var indexOfAmbariIp = msg.indexOf("Ambari ip:");
      if (actCluster != undefined && msg != null && msg != undefined && indexOfAmbariIp > -1) {
        if (actCluster.cluster == undefined) {
          actCluster.cluster = {};
        }
        actCluster.cluster.ambariServerIp = msg.split(':')[1];
        actCluster.progress = 75;
      }
      refreshMetadata(notification, actCluster);
      $scope.showSuccess(notification.eventMessage, notification.stackName);
      handleStatusChange(notification);
    }

    function addNotificationToGlobalEvents(item) {
      item.customTimeStamp =  new Date(item.eventTimestamp).toLocaleDateString() + " " + new Date(item.eventTimestamp).toLocaleTimeString();
      $rootScope.events.push(item);
    }

    function refreshMetadata(notification, filteredCluster) {
      console.log(notification)
      
      if(filteredCluster != undefined) {
        GlobalStack.get({ id: notification.stackId }, function(success) {
          var actCluster = success;
          actCluster.hoursUp = success.cluster.hoursUp;
          actCluster.minutesUp = success.cluster.minutesUp;
          actCluster.blueprintId = success.cluster.blueprintId;

          var nodeCount = 0;
          var credential = $filter('filter')($rootScope.credentials, {id: actCluster.credentialId, cloudPlatform: 'AZURE_RM'}, true)[0];
          actCluster.stackCredential= credential;
          angular.forEach(actCluster.instanceGroups, function(group) {
             nodeCount += group.nodeCount;
          });
          actCluster.nodeCount = nodeCount;
          actCluster.progress = $rootScope.setProgressForStatus(actCluster);
          for(var i=0;i<$rootScope.clusters.length;++i) {
              if ($rootScope.clusters[i].id === actCluster.id) {
              $rootScope.clusters[i] = actCluster;
              break;
            };
          }
        });
      }
    }

    function getClusterReference(clusterId) {
      var cluster = undefined;
      for(var i=0;i<$rootScope.clusters.length;++i) {
        if ($rootScope.clusters[i].id === clusterId) {
          cluster = $rootScope.clusters[i];
          break;
        };
      }
      return cluster;
    }

  }
]);
