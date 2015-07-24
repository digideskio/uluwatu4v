'use strict';

var log = log4javascript.getLogger("clusterController-logger");
var $jq = jQuery.noConflict();

angular.module('uluwatuControllers').controller('clusterController', ['$scope', '$rootScope', '$filter', 'UluwatuCluster', 'GlobalStack', 'Cluster', 'GlobalStackInstance', 'AccountNetwork', 'AccountSecurityGroup', '$interval', 'UserEvents', 'PeriscopeCluster',
    function ($scope, $rootScope, $filter, UluwatuCluster, GlobalStack, Cluster, GlobalStackInstance, AccountNetwork, AccountSecurityGroup, $interval, UserEvents, PeriscopeCluster) {

        $rootScope.ledStyles = {
            "REQUESTED": "state2-run-blink",
            "CREATE_IN_PROGRESS": "state2-run-blink",
            "UPDATE_IN_PROGRESS": "state2-run-blink",
            "AVAILABLE": "state5-run",
            "DELETE_IN_PROGRESS": "state0-stop-blink",
            "DELETE_COMPLETED": "state3-stop",
            "STOPPED": "state4-ready",
            "START_REQUESTED": "state1-ready-blink",
            "START_IN_PROGRESS": "state1-ready-blink",
            "STOP_REQUESTED": "state1-ready-blink",
            "STOP_IN_PROGRESS": "state1-ready-blink",
            "CREATE_FAILED": "state3-stop",
            "START_FAILED": "state3-stop",
            "DELETE_FAILED": "state3-stop",
            "UPDATE_FAILED": "state3-stop",
            "STOP_FAILED": "state3-stop"
        }

        $rootScope.buttonStyles = {
            "REQUESTED": "fa-pause",
            "CREATE_IN_PROGRESS": "fa-pause",
            "UPDATE_IN_PROGRESS": "fa-pause",
            "AVAILABLE": "fa-stop",
            "DELETE_IN_PROGRESS": "fa-pause",
            "DELETE_COMPLETED": "fa-stop",
            "STOPPED": "fa-play",
            "START_REQUESTED": "fa-refresh",
            "START_IN_PROGRESS": "fa-refresh",
            "STOP_REQUESTED": "fa-refresh",
            "STOP_IN_PROGRESS": "fa-refresh",
            "CREATE_FAILED": "fa-play",
            "START_FAILED": "fa-play",
            "DELETE_FAILED": "fa-play",
            "UPDATE_FAILED": "fa-play",
            "STOP_FAILED": "fa-play"
        }
        $rootScope.activeCluster = {};
        $rootScope.networks = AccountNetwork.query();
        $rootScope.securityGroups = AccountSecurityGroup.query()

        $scope.detailsShow = true;
        $scope.periscopeShow = false;
        $scope.metricsShow = false;
        $scope.showAdvancedOptionForm = false;
        getUluwatuClusters();
        initCluster();

        $scope.showAdvancedOption = function() {
            if ($scope.showAdvancedOptionForm === false) {
              $scope.showAdvancedOptionForm = true;
            } else {
              $scope.showAdvancedOptionForm = false;
            }
        }

        $scope.selectedAdjustmentChange = function() {
            if ($scope.cluster.bestEffort === "BEST_EFFORT") {
                $scope.cluster.failurePolicy.adjustmentType = "BEST_EFFORT";
            } else {
                $scope.cluster.failurePolicy.adjustmentType = "EXACT";
                $scope.cluster.failurePolicy.threshold = 3;
            }
        }

        $scope.selectBlueprintreinstallChange = function () {
          var actualBp = $filter('filter')($rootScope.blueprints, { id: $rootScope.reinstallClusterObject.blueprintId}, true);
          var hostGroups = [];
          var index = 0;
          $rootScope.activeCluster.instanceGroups.forEach(function(value) {
            if (value.type != 'GATEWAY') {
              var tmpRecipes = $filter('filter')($rootScope.activeCluster.cluster.hostGroups, {instanceGroupName: value.group}, true)[0];
              hostGroups.push({name: actualBp[0].ambariBlueprint.host_groups[index].name, instanceGroupName: value.group, recipeIds: tmpRecipes.recipeIds});
              index++;
            }
          });
          $rootScope.reinstallClusterObject.hostgroups = hostGroups;
          $rootScope.reinstallClusterObject.fullBp = actualBp[0];
        }

        $scope.selectedBlueprintChange = function () {
          var tmpCloudPlatform = $rootScope.activeCredential.cloudPlatform;
          var tmpTemplate = $filter('filter')($rootScope.templates, {cloudPlatform: tmpCloudPlatform}, true)[0];
          var tmpTemplateId = null;
          if (tmpTemplate != null) {
            tmpTemplateId = tmpTemplate.id;
          }
          var actualBp = $filter('filter')($rootScope.blueprints, { id: $scope.cluster.blueprintId}, true);
          var instanceGroups = [];
          var hostGroups = [];
          instanceGroups.push({templateId: tmpTemplateId, group: "cbgateway", nodeCount: 1, type: "GATEWAY"});
          actualBp[0].ambariBlueprint.host_groups.forEach(function(k){
            instanceGroups.push({templateId: tmpTemplateId, group: k.name, nodeCount: 1, type: "CORE"});
            hostGroups.push({name: k.name, instanceGroupName: k.name})
          });
          $scope.cluster.instanceGroups = instanceGroups;
          $scope.cluster.hostGroups = hostGroups;
        }

        $scope.isUndefined = function (variable) {
            return angular.isUndefined(variable) || variable === null;
        }

        $scope.createCluster = function () {
            var blueprint = $filter('filter')($rootScope.blueprints, {id: $scope.cluster.blueprintId}, true)[0];

            if (blueprint.hostGroupCount > $scope.cluster.nodeCount) {
                $scope.showErrorMessage($rootScope.msg.hostgroup_invalid_node_count);
                return;
            }
            if (blueprint.hostGroupCount === 1 && $scope.cluster.nodeCount != 1) {
                $scope.showErrorMessage($rootScope.msg.hostgroup_single_invalid);
                return;
            }
            if (!$scope.isUndefined($scope.cluster.ambariStackDetails)) {
                 for (var item in $scope.cluster.ambariStackDetails) {
                    if ($scope.cluster.ambariStackDetails[item] === "" || $scope.cluster.ambariStackDetails[item] === undefined) {
                        delete $scope.cluster.ambariStackDetails[item];
                    }
                 }
            }
            if (!$scope.isUndefined($scope.cluster.ambariStackDetails) && Object.keys($scope.cluster.ambariStackDetails).length !== 0) {
                if ($scope.isUndefined($scope.cluster.ambariStackDetails.stack) ||
                    $scope.isUndefined($scope.cluster.ambariStackDetails.version) ||
                    $scope.isUndefined($scope.cluster.ambariStackDetails.stackRepoId) ||
                    $scope.isUndefined($scope.cluster.ambariStackDetails.stackBaseURL) ||
                    $scope.isUndefined($scope.cluster.ambariStackDetails.utilsRepoId) ||
                    $scope.isUndefined($scope.cluster.ambariStackDetails.utilsBaseURL)) {
                    $scope.showErrorMessage($rootScope.msg.ambari_repository_config_error);
                    return;
                } else {
                    $scope.cluster.ambariStackDetails.os = "redhat6";
                    if ($scope.isUndefined($scope.cluster.ambariStackDetails.verify)) {
                        $scope.cluster.ambariStackDetails.verify = false;
                    }
                }
            } else {
                $scope.cluster.ambariStackDetails = null;
            }
            $scope.cluster.credentialId = $rootScope.activeCredential.id;
            var network = getNetwork($rootScope.activeCredential.cloudPlatform)
            var securityGroup = getSecurityGroup()
            $scope.cluster.networkId = network.id
            $scope.cluster.securityGroupId = securityGroup.id
            $scope.prepareParameters($scope.cluster);
            UluwatuCluster.save($scope.cluster, function (result) {
                var nodeCount = 0;
                angular.forEach(result.instanceGroups, function(group) {
                  nodeCount += group.nodeCount;
                });
                result.nodeCount = nodeCount;
                result.cloudPlatform = $filter('filter')($rootScope.credentials, {id: $rootScope.activeCredential.id}, true)[0].cloudPlatform;
                result.public = $scope.cluster.public;
                angular.forEach(result.instanceGroups, function(item) {
                  item.templateId = parseFloat(item.templateId);
                });
                result.blueprintId = parseFloat(result.blueprintId);

                var existingCluster = $filter('filter')($rootScope.clusters, {id: result.id}, true)[0];
                if (existingCluster != undefined) {
                    existingCluster = result;
                } else {
                    $rootScope.clusters.push(result);
                    $jq('.carousel').carousel(0);
                    // enable toolbar buttons
                    $jq('#toggle-cluster-block-btn').removeClass('disabled');
                    $jq('#sort-clusters-btn').removeClass('disabled');
                    $jq('#create-cluster-btn').removeClass('disabled');
                    $jq("#notification-n-filtering").prop("disabled", false);
                    $scope.clusterCreationForm.$setPristine();
                    initCluster();
                }
            }, function(failure) {
                $scope.showError(failure, $rootScope.msg.cluster_failed);
            });
        }

        $scope.prepareParameters = function (cluster) {
            if (cluster.consulServerCount === null || cluster.consulServerCount === undefined) {
              delete cluster.consulServerCount;
            }
            for (var item in cluster.parameters) {
                if (cluster.parameters[item] === "" || cluster.parameters[item] === undefined) {
                  delete cluster.parameters[item];
                }
            }
        }

        $scope.deleteStackInstance = function (stackId, instanceId) {
            GlobalStackInstance.delete({ stackid: stackId, instanceid: instanceId }, null, function (result) {

            }, function(failure){
                $scope.showError(failure, $rootScope.msg.stack_instance_delete_failed);
            });
        }

        $scope.deleteCluster = function (cluster) {
            UluwatuCluster.delete(cluster, function (result) {
                var actCluster = $filter('filter')($rootScope.clusters, { id: cluster.id }, true)[0];
                actCluster.status = "DELETE_IN_PROGRESS";
                $scope.$broadcast('DELETE_PERISCOPE_CLUSTER', cluster.id);
            }, function (failure){
                $scope.showError(failure, $rootScope.msg.cluster_delete_failed);
            });
        }

        $scope.changeActiveCluster = function (clusterId) {
            $rootScope.activeCluster = $filter('filter')($rootScope.clusters, { id: clusterId })[0];
            $rootScope.activeClusterBlueprint = $filter('filter')($rootScope.blueprints, { id: $rootScope.activeCluster.blueprintId})[0];
            $rootScope.activeClusterCredential = $filter('filter')($rootScope.credentials, {id: $rootScope.activeCluster.credentialId}, true)[0];
            $rootScope.activeClusterNetwork = $filter('filter')($rootScope.networks, {id: $rootScope.activeCluster.networkId})[0];
            $rootScope.activeCluster.cloudPlatform =  $rootScope.activeClusterCredential.cloudPlatform;
            $rootScope.activeClusterNetwork = getNetwork($rootScope.activeCluster.cloudPlatform)
            $rootScope.activeCluster.metadata = [];
            $rootScope.reinstallClusterObject = {
              validateBlueprint: true,
              blueprintId: $rootScope.activeClusterBlueprint.id,
              hostgroups: $rootScope.activeCluster.cluster != undefined ? $rootScope.activeCluster.cluster.hostGroups : [],
              ambariStackDetails: $rootScope.activeCluster.cluster != undefined ? $rootScope.activeCluster.cluster.ambariStackDetails : '',
              fullBp: $rootScope.activeClusterBlueprint,
            };
            GlobalStack.get({ id: clusterId }, function(success) {
                    var metadata = []
                    angular.forEach(success.instanceGroups, function(item) {
                      angular.forEach(item.metadata, function(item1) {
                        metadata.push(item1)
                      });
                    });
                    $scope.pagination = {
                                currentPage: 1,
                                itemsPerPage: 10,
                                totalItems: $rootScope.activeCluster.metadata.length
                    }
                    $rootScope.activeCluster.metadata = metadata
                }
            );
        }

        function getSecurityGroup() {
            return $filter('orderBy')($rootScope.securityGroups, "id")[1];
        }

        function getNetwork(cloudPlatform) {
            return $filter('filter')($filter('orderBy')($rootScope.networks, "id"), {cloudPlatform: cloudPlatform})[0];
        }

        $scope.$watch('pagination.currentPage + pagination.itemsPerPage', function(){
            if ($rootScope.activeCluster.metadata != null) {
                paginateMetadata();
            }
        });

        $rootScope.$watch('activeCredential', function() {
            if ($rootScope.activeCredential != null) {
                $scope.cluster.bestEffort = "BEST_EFFORT";
                $scope.cluster.failurePolicy.adjustmentType = "BEST_EFFORT";
                $scope.cluster.failurePolicy.threshold = null;
                $scope.cluster.parameters = {};
            }
        });

        $rootScope.$watch('activeCluster.metadata', function() {
            if ($rootScope.activeCluster.metadata != null) {
                paginateMetadata();
            }
        });

        function paginateMetadata() {
            if ($scope.pagination != null) {
                $scope.pagination.totalItems = $rootScope.activeCluster.metadata.length;
                var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage),
                end = begin + $scope.pagination.itemsPerPage;
                $scope.filteredActiveClusterData = addStatesToMetadata($rootScope.activeCluster.metadata.slice(begin, end));
            } else {
                $scope.filteredActiveClusterData = [];
            }
        }

        function addStatesToMetadata(filteredData) {
            angular.forEach(filteredData, function(data){
                if (data != null && data.discoveryFQDN != null) {
                    var hostGroup = $filter('filter')($rootScope.activeCluster.cluster.hostGroups, {instanceGroupName: data.instanceGroup});
                    if (hostGroup != null && hostGroup.length > 0) {
                        var hostMetadata = $filter('filter')(hostGroup[0].metadata, {name: data.discoveryFQDN})
                        if (hostMetadata != null && hostMetadata.length > 0) {
                            data.state = hostMetadata[0].state
                        }
                    }
                }
            });
            return filteredData;
        }

        $scope.getSelectedTemplate = function (templateId) {
            return $filter('filter')($rootScope.templates, { id: templateId}, true)[0];
        }

        $rootScope.events = [];

        $scope.loadEvents = function () {
            $rootScope.events = UserEvents.query(function(success) {
                angular.forEach(success, function(item) {
                    item.customTimeStamp =  new Date(item.eventTimestamp).toLocaleDateString() + " " + new Date(item.eventTimestamp).toLocaleTimeString();
                });
            });
        }

        $scope.loadEvents();

        $scope.stopCluster = function (activeCluster) {
            var newStatus = {"status":"STOPPED"};
            Cluster.update({id: activeCluster.id}, newStatus, function(success){
                GlobalStack.update({id: activeCluster.id}, newStatus, function(result){
                  activeCluster.status = "STOP_REQUESTED";
                }, function(error) {
                  $scope.showError(error, $rootScope.msg.cluster_stop_failed);
                });

            }, function(error) {
              $scope.showError(error, $rootScope.msg.cluster_stop_failed);
            });
        }

        $scope.reinstallCluster = function (activeCluster) {
            if (!$scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails)) {
                for (var item in $rootScope.reinstallClusterObject.ambariStackDetails) {
                    if ($rootScope.reinstallClusterObject.ambariStackDetails[item] === "" || $rootScope.reinstallClusterObject.ambariStackDetails[item] === undefined) {
                        delete $rootScope.reinstallClusterObject.ambariStackDetails[item];
                    }
                }
            }
            if (!$scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails) && Object.keys($rootScope.reinstallClusterObject.ambariStackDetails).length !== 0) {
                if ($scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.stack) ||
                    $scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.version) ||
                    $scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.stackRepoId) ||
                    $scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.stackBaseURL) ||
                    $scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.utilsRepoId) ||
                    $scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.utilsBaseURL)) {
                    $scope.showErrorMessage($rootScope.msg.ambari_repository_config_error);
                    return;
                } else {
                    $rootScope.reinstallClusterObject.ambariStackDetails.os = "redhat6";
                    if ($scope.isUndefined($rootScope.reinstallClusterObject.ambariStackDetails.verify)) {
                        $rootScope.reinstallClusterObject.ambariStackDetails.verify = false;
                    }
                }
            } else {
                $rootScope.reinstallClusterObject.ambariStackDetails = null;
            }
            var newInstall = {
                "blueprintId": $rootScope.reinstallClusterObject.blueprintId,
                "hostgroups": $rootScope.reinstallClusterObject.hostgroups,
                "validateBlueprint": $rootScope.reinstallClusterObject.validateBlueprint,
                "ambariStackDetails": $rootScope.reinstallClusterObject.ambariStackDetails
            };
            Cluster.update({id: activeCluster.id}, newInstall, function(success){
                  $rootScope.activeCluster.blueprintId = $rootScope.reinstallClusterObject.blueprintId;
                  $rootScope.activeCluster.cluster.status = 'REQUESTED';
            }, function(error) {
              $scope.showError(error, $rootScope.msg.cluster_reinstall_failed);
            });
        }

        $scope.startCluster = function (activeCluster) {
            var newStatus = {"status":"STARTED"};
            GlobalStack.update({id: activeCluster.id}, newStatus, function(result){

                Cluster.update({id: activeCluster.id}, newStatus, function(success){
                    activeCluster.status = "START_REQUESTED";
                }, function(error) {
                  $scope.showError(error, $rootScope.msg.cluster_start_failed);
                });

            }, function(error) {
              $scope.showError(error, $rootScope.msg.cluster_start_failed);
            });
        }

        $scope.syncCluster = function (activeCluster) {
            var newStatus = {"status":"SYNC"};
            GlobalStack.update({id: activeCluster.id}, newStatus, function(result){
                Cluster.update({id: activeCluster.id}, newStatus, function(success){}, function(error) {
                    $scope.showError(error, $rootScope.msg.cluster_sync_failed);
                });
            }, function(error) {
                $scope.showError(error, $rootScope.msg.cluster_sync_failed);
            });
        }

        $scope.requestStatusChange = function(cluster) {
            if(cluster.status == "STOPPED") {
                $scope.startCluster(cluster);
            } else if(cluster.status == "AVAILABLE") {
                $scope.stopCluster(cluster);
            }
        }

        function getUluwatuClusters(){
          UluwatuCluster.query(function (clusters) {
              $rootScope.clusters = clusters;
              angular.forEach($rootScope.clusters, function(item) {
                   var nodeCount = 0;
                   angular.forEach(item.instanceGroups, function(group) {
                       nodeCount += group.nodeCount;
                   });
                   item.nodeCount = nodeCount;
              });
              $scope.$parent.orderClusters();
          });
        }

        function initCluster(){
            $scope.cluster = {
                password: "admin",
                userName: "admin",
                onFailureAction: "DO_NOTHING",
                bestEffort: "BEST_EFFORT",
                validateBlueprint: true,
                consulServerCount: 3,
                parameters: {},
                failurePolicy: {
                  adjustmentType: "BEST_EFFORT",
                }
            };
        }

        $scope.showDetails = function () {
            $scope.detailsShow = true;
            $scope.periscopeShow = false;
            $scope.metricsShow = false;
        }

        $scope.showPeriscope = function () {
            $scope.detailsShow = false;
            $scope.periscopeShow = true;
            $scope.metricsShow = false;
        }

        $scope.showMetrics = function () {
            $scope.detailsShow = false;
            $scope.periscopeShow = false;
            $scope.metricsShow = true;
        }

         $scope.jsonBp = true;
         $scope.serviceBp = false;

         $scope.changeViewJsonBp = function () {
            $scope.jsonBp = true;
            $scope.serviceBp = false;
         }

         $scope.changeViewServiceBp = function () {
            $scope.jsonBp = false;
            $scope.serviceBp = true;
         }

        $scope.logFilterFunction = function(element) {
            try {
                if (element.stackId === $rootScope.activeCluster.id) {
                    return (!element.eventType.match('BILLING_STARTED') && !element.eventType.match('BILLING_STOPPED') && !element.eventType.match('BILLING_CHANGED')) ? true : false;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        }

        $scope.selectCluster = function(cluster) {
            $scope.selectedCluster = cluster
        }

    }]);
