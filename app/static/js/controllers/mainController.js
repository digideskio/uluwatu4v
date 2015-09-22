'use strict';

var log = log4javascript.getLogger("mainController-logger");
var $jq = jQuery.noConflict();

angular.module('uluwatuControllers').controller('mainController', ['$scope', '$rootScope', '$filter', '$interval',
    function ($scope, $rootScope, $filter, $interval) {

        $scope.successEvents = [ "REQUESTED",
                                  "CREATE_IN_PROGRESS",
                                  "START_REQUESTED",
                                  "START_IN_PROGRESS",
                                  "STOPPED",
                                  "STOP_REQUESTED",
                                  "STOP_IN_PROGRESS",
                                  "DELETE_IN_PROGRESS" ];

        $scope.errorEvents = [ "CLUSTER_CREATION_FAILED",
                                "CREATE_FAILED",
                                "START_FAILED",
                                "DELETE_FAILED",
                                "UPDATE_FAILED",
                                "STOP_FAILED" ];


        $scope.showManagement = true;
        $scope.showAccountPanel = false;

        $scope.activateManagement = function () {
            $scope.showManagement = true;
            $scope.showAccountPanel = false;
        }

        $scope.activateAccountPanel = function () {
            $scope.showManagement = false;
            $scope.showAccountPanel = true;
        }

        $scope.eventErrorMessageTransformer = function(event){
            if (event.eventMessage != undefined) {
                return event.eventMessage.replace(new RegExp("^.+Exception: "), "").replace(new RegExp("^.+due to: "), "");
            }
            return "";
        }

        $scope.getClassForEventIndex = function(event){
            if ($rootScope.events.indexOf(event) == $rootScope.events.length - 1 ) {
                return "notification-new";
            }
            return "";
        }

        $scope.eventTimestampAsFloat = function(element) {
            return parseFloat(element.eventTimestamp) * (-1);
        }

        $scope.getHourDifference = function(element) {
            var hours = Math.abs(Math.round((new Date(element.eventTimestamp) - new Date()) / 36e5));
            if (hours > 0) {
                return hours + ' hrs ago';
            } else {
                return 'Now';
            }
        }

        $scope.getMaxEventCount = function() {
            if ($rootScope.events && $rootScope.events.length < 10) {
                return $rootScope.events.length;
            } else {
                return 10;
            }
        }

        $scope.getClassforEvent = function(event) {
            if($scope.successEvents.indexOf(event.eventType) !== -1) {
                return "label label-success";
            } else if($scope.errorEvents.indexOf(event.eventType) !== -1) {
                return "label label-danger";
            } else {
                return "label label-warning";
            }
        }

        $scope.getStringforEvent = function(event) {
            if($scope.successEvents.indexOf(event.eventType) !== -1) {
                return "Success";
            } else if($scope.errorEvents.indexOf(event.eventType) !== -1) {
                return "Error";
            } else {
                return "Warning";
            }
        }

        $rootScope.config = {
            'GCP' : {
                gcpRegions: [
                    {key: 'US_CENTRAL1_A', value: "us-central1-a", cloud: 'GCP'},
                    {key: 'US_CENTRAL1_B', value: "us-central1-b", cloud: 'GCP'},
                    {key: 'US_CENTRAL1_C', value: "us-central1-c", cloud: 'GCP'},
                    {key: 'US_CENTRAL1_F', value: "us-central1-f", cloud: 'GCP'},
                    {key: 'EUROPE_WEST1_B', value: "europe-west1-b", cloud: 'GCP'},
                    {key: 'EUROPE_WEST1_C', value: "europe-west1-c", cloud: 'GCP'},
                    {key: 'EUROPE_WEST1_D', value: "europe-west1-d", cloud: 'GCP'},
                    {key: 'ASIA_EAST1_A', value: "asia-east1-a", cloud: 'GCP'},
                    {key: 'ASIA_EAST1_B', value: "asia-east1-b", cloud: 'GCP'},
                    {key: 'ASIA_EAST1_C', value: "asia-east1-c", cloud: 'GCP'}
                ],
                gcpDiskTypes: [
                    {key: 'HDD', value: 'Magnetic'},
                    {key: 'SSD', value: 'SSD'}
                ],
                gcpInstanceTypes: [
                    {key: 'N1_STANDARD_1', value: 'n1-standard-1', cloud: 'GCP'},
                    {key: 'N1_STANDARD_2', value:'n1-standard-2', cloud: 'GCP'},
                    {key: 'N1_STANDARD_4', value:'n1-standard-4', cloud: 'GCP'},
                    {key: 'N1_STANDARD_8', value:'n1-standard-8', cloud: 'GCP'},
                    {key: 'N1_STANDARD_16', value:'n1-standard-16', cloud: 'GCP'},
                    {key: 'N1_HIGHMEM_2', value:'n1-highmem-2', cloud: 'GCP'},
                    {key: 'N1_HIGHMEM_4', value:'n1-highmem-4', cloud: 'GCP'},
                    {key: 'N1_HIGHMEM_8', value:'n1-highmem-8', cloud: 'GCP'},
                    {key: 'N1_HIGHMEM_16', value:'n1-highmem-16', cloud: 'GCP'},
                    {key: 'N1_HIGHCPU_2', value:'n1-highcpu-2', cloud: 'GCP'},
                    {key: 'N1_HIGHCPU_4', value:'n1-highcpu-4', cloud: 'GCP'},
                    {key: 'N1_HIGHCPU_8', value:'n1-highcpu-8', cloud: 'GCP'},
                    {key: 'N1_HIGHCPU_16', value:'n1-highcpu-16', cloud: 'GCP'}
                ]
            },
            'AZURE': {
                azureRegions: [
                    {key: 'BRAZIL_SOUTH', value: 'Brazil South', cloud: 'AZURE'},
                    {key: 'EAST_ASIA', value: 'East Asia', cloud: 'AZURE'},
                    {key: 'EAST_US', value: 'East US', cloud: 'AZURE'},
                    {key: 'CENTRAL_US', value: 'Central US', cloud: 'AZURE'},
                    {key: 'NORTH_EUROPE', value: 'North Europe', cloud: 'AZURE'},
                    {key: 'SOUTH_CENTRAL_US', value: 'South Central US'},
                    {key: 'NORTH_CENTRAL_US', value: 'North Central US', cloud: 'AZURE'},
                    {key: 'EAST_US_2', value: 'East US 2', cloud: 'AZURE'},
                    {key: 'JAPAN_EAST', value: 'Japan East', cloud: 'AZURE'},
                    {key: 'JAPAN_WEST', value: 'Japan West', cloud: 'AZURE'},
                    {key: 'SOUTHEAST_ASIA', value: 'Southeast Asia', cloud: 'AZURE'},
                    {key: 'BRAZIL_SOUTH', value: 'Brazil South', cloud: 'AZURE'},
                    {key: 'WEST_US', value: 'West US', cloud: 'AZURE'},
                    {key: 'WEST_EUROPE', value: 'West EU', cloud: 'AZURE'}
                ],
                azureVmTypes: [
                    {key: 'A5', value: 'A5', cloud: 'AZURE'},
                    {key: 'A6', value: 'A6', cloud: 'AZURE'},
                    {key: 'A7', value: 'A7', cloud: 'AZURE'},
                    {key: 'A8', value: 'A8', cloud: 'AZURE'},
                    {key: 'A9', value: 'A9', cloud: 'AZURE'},
                    {key: 'STANDARD_D1', value: 'D1', cloud: 'AZURE'},
                    {key: 'STANDARD_D2', value: 'D2', cloud: 'AZURE'},
                    {key: 'STANDARD_D3', value: 'D3', cloud: 'AZURE'},
                    {key: 'STANDARD_D4', value: 'D4', cloud: 'AZURE'},
                    {key: 'STANDARD_G1', value: 'G1', cloud: 'AZURE'},
                    {key: 'STANDARD_G2', value: 'G2', cloud: 'AZURE'},
                    {key: 'STANDARD_G3', value: 'G3', cloud: 'AZURE'},
                    {key: 'STANDARD_G4', value: 'G4', cloud: 'AZURE'},
                    {key: 'STANDARD_G5', value: 'G5', cloud: 'AZURE'},
                    {key: 'STANDARD_D11', value: 'D11', cloud: 'AZURE'},
                    {key: 'STANDARD_D12', value: 'D12', cloud: 'AZURE'},
                    {key: 'STANDARD_D13', value: 'D13', cloud: 'AZURE'},
                    {key: 'STANDARD_D14', value: 'D14', cloud: 'AZURE'}
                ]
            },
            'AWS': {
                volumeTypes: [
                    {key: 'Gp2', value: 'SSD', encryptable: true},
                    {key: 'Standard', value: 'Magnetic', encryptable: true},
                    {key: 'Ephemeral', value: 'Ephemeral', encryptable: false}
                ],
                awsRegions : [
                    {key: 'US_EAST_1', value: 'US East(N. Virginia)', cloud: 'AWS'},
                    {key: 'US_WEST_1', value: 'US West (N. California)', cloud: 'AWS'},
                    {key: 'US_WEST_2', value: 'US West (Oregon)', cloud: 'AWS'},
                    {key: 'EU_WEST_1', value: 'EU (Ireland)', cloud: 'AWS'},
                    {key: 'AP_SOUTHEAST_1', value: 'Asia Pacific (Singapore)', cloud: 'AWS'},
                    {key: 'AP_SOUTHEAST_2', value: 'Asia Pacific (Sydney)', cloud: 'AWS'},
                    {key: 'AP_NORTHEAST_1', value: 'Asia Pacific (Tokyo)', cloud: 'AWS'},
                    {key: 'SA_EAST_1', value: 'South America (São Paulo)', cloud: 'AWS'}
                ],
                amis: [
                    {key: 'US_EAST_1', value: 'ami-b4eb9adc'},
                    {key: 'US_WEST_1', value: 'ami-63283726'},
                    {key: 'US_WEST_2', value: 'ami-632e7253'},
                    {key: 'EU_WEST_1', value: 'ami-953cbbe2'},
                    {key: 'AP_SOUTHEAST_1', value: 'ami-27bf9675'},
                    {key: 'AP_SOUTHEAST_2', value: 'ami-9b86eca1'},
                    {key: 'AP_NORTHEAST_1', value: 'ami-58627359'},
                    {key: 'SA_EAST_1', value: 'ami-272c9e3a'}
                ],
                instanceType: [
                    {key: 'C3Large', value: 'C3Large', cloud: 'AWS', ephemeralVolumeSize: '16 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'C3Xlarge', value: 'C3Xlarge', cloud: 'AWS', ephemeralVolumeSize: '40 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'C32xlarge', value: 'C32xlarge', cloud: 'AWS', ephemeralVolumeSize: '80 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'C34xlarge', value: 'C34xlarge', cloud: 'AWS', ephemeralVolumeSize: '160 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'C38xlarge', value: 'C38xlarge', cloud: 'AWS', ephemeralVolumeSize: '320 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'Cc28xlarge', value: 'Cc28xlarge', cloud: 'AWS', ephemeralVolumeSize: '840 GB STANDARD', maxEphemeralVolumeCount: 4},
                    {key: 'Cg14xlarge', value: 'Cg14xlarge', cloud: 'AWS', ephemeralVolumeSize: '840 GB STANDARD', maxEphemeralVolumeCount: 2},
                    {key: 'Cr18xlarge', value: 'Cr18xlarge', cloud: 'AWS', ephemeralVolumeSize: '120 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'G22xlarge', value: 'G22xlarge', cloud: 'AWS', ephemeralVolumeSize: '60 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'Hi14xlarge', value: 'Hi14xlarge', cloud: 'AWS', ephemeralVolumeSize: '1024 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'Hs18xlarge', value: 'Hs18xlarge', cloud: 'AWS', ephemeralVolumeSize: '2048 GB STANDARD', maxEphemeralVolumeCount: 24},
                    {key: 'I2Xlarge', value: 'I2Xlarge', cloud: 'AWS', ephemeralVolumeSize: '800 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'I22xlarge', value: 'I22xlarge', cloud: 'AWS', ephemeralVolumeSize: '800 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'I24xlarge', value: 'I24xlarge', cloud: 'AWS', ephemeralVolumeSize: '800 GB SSD', maxEphemeralVolumeCount: 4},
                    {key: 'I28xlarge', value: 'I28xlarge', cloud: 'AWS', ephemeralVolumeSize: '800 GB SSD', maxEphemeralVolumeCount: 8},
                    {key: 'M3Medium', value: 'M3Medium', cloud: 'AWS', ephemeralVolumeSize: '4 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'M3Large', value: 'M3Large', cloud: 'AWS', ephemeralVolumeSize: '32 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'M3Xlarge', value: 'M3Xlarge', cloud: 'AWS', ephemeralVolumeSize: '40 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'M32xlarge', value: 'M32xlarge', cloud: 'AWS', ephemeralVolumeSize: '80 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'R3Large', value: 'R3Large', cloud: 'AWS', ephemeralVolumeSize: '32 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'R3Xlarge', value: 'R3Xlarge', cloud: 'AWS', ephemeralVolumeSize: '80 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'R32xlarge', value: 'R32xlarge', cloud: 'AWS', ephemeralVolumeSize: '160 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'R34xlarge', value: 'R34xlarge', cloud: 'AWS', ephemeralVolumeSize: '320 GB SSD', maxEphemeralVolumeCount: 1},
                    {key: 'R38xlarge', value: 'R38xlarge', cloud: 'AWS', ephemeralVolumeSize: '320 GB SSD', maxEphemeralVolumeCount: 2},
                    {key: 'D2Xlarge', value: 'D2Xlarge', cloud: 'AWS', ephemeralVolumeSize: '2000 GB STANDARD', maxEphemeralVolumeCount: 3},
                    {key: 'D22xlarge', value: 'D22xlarge', cloud: 'AWS', ephemeralVolumeSize: '2000 GB STANDARD', maxEphemeralVolumeCount: 6},
                    {key: 'D24xlarge', value: 'D24xlarge', cloud: 'AWS', ephemeralVolumeSize: '2000 GB STANDARD', maxEphemeralVolumeCount: 12}
                ]

            },
            'OPENSTACK': {
              regions : [
                {key: 'LOCAL', value: 'local', cloud: 'OPENSTACK'}
              ]
            },
            'EVENT_TYPE': {
                "REQUESTED": "requested",
                "CREATE_IN_PROGRESS": "create in progress",
                "AVAILABLE": "available",
                "UPDATE_IN_PROGRESS": "update in progress",
                "CREATE_FAILED": "create failed",
                "DELETE_IN_PROGRESS": "delete in progress",
                "DELETE_FAILED": "delete failed",
                "DELETE_COMPLETED": "delete completed",
                "STOPPED": "stopped",
                "STOP_REQUESTED": "stop requested",
                "START_REQUESTED": "start requested",
                "STOP_IN_PROGRESS": "stop in progress",
                "START_IN_PROGRESS": "start in progress",
                "START_FAILED": "start failed",
                "STOP_FAILED": "stop failed",
                "BILLING_STARTED": "billing started",
                "BILLING_STOPPED": "billing stopped"
            },
            'EVENT_CLASS': {
                "REQUESTED": "has-warning",
                "CREATE_IN_PROGRESS": "has-warning",
                "AVAILABLE": "has-success",
                "UPDATE_IN_PROGRESS": "has-warning",
                "CREATE_FAILED": "has-error",
                "DELETE_IN_PROGRESS": "has-warning",
                "DELETE_FAILED": "has-error",
                "DELETE_COMPLETED": "has-success",
                "STOPPED": "has-success",
                "STOP_REQUESTED": "has-warning",
                "START_REQUESTED": "has-warning",
                "STOP_IN_PROGRESS": "has-warning",
                "START_IN_PROGRESS": "has-warning",
                "START_FAILED": "has-error",
                "STOP_FAILED": "has-error",
                "BILLING_STARTED": "has-success",
                "BILLING_STOPPED": "has-success"
            },
            'TIME_ZONES': [
              {key: 'Etc/GMT+1', value: 'GMT-1'},
              {key: 'Etc/GMT+2', value: 'GMT-2'},
              {key: 'Etc/GMT+3', value: 'GMT-3'},
              {key: 'Etc/GMT+4', value: 'GMT-4'},
              {key: 'Etc/GMT+5', value: 'GMT-5'},
              {key: 'Etc/GMT+6', value: 'GMT-6'},
              {key: 'Etc/GMT+7', value: 'GMT-7'},
              {key: 'Etc/GMT+8', value: 'GMT-8'},
              {key: 'Etc/GMT+9', value: 'GMT-9'},
              {key: 'Etc/GMT+10', value: 'GMT-10'},
              {key: 'Etc/GMT+11', value: 'GMT-11'},
              {key: 'Etc/GMT+12', value: 'GMT-12'},
              {key: 'Etc/GMT', value: 'GMT/UTC'},
              {key: 'Etc/GMT-1', value: 'GMT+1'},
              {key: 'Etc/GMT-2', value: 'GMT+2'},
              {key: 'Etc/GMT-3', value: 'GMT+3'},
              {key: 'Etc/GMT-4', value: 'GMT+4'},
              {key: 'Etc/GMT-5', value: 'GMT+5'},
              {key: 'Etc/GMT-6', value: 'GMT+6'},
              {key: 'Etc/GMT-7', value: 'GMT+7'},
              {key: 'Etc/GMT-8', value: 'GMT+8'},
              {key: 'Etc/GMT-9', value: 'GMT+9'},
              {key: 'Etc/GMT-10', value: 'GMT+10'},
              {key: 'Etc/GMT-11', value: 'GMT+11'},
              {key: 'Etc/GMT-12', value: 'GMT+12'}
            ]
        }


    }]);
