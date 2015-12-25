<div class="form-group" ng-class="{ 'has-error': vsphereNetworkForm.vsphere_networkName.$dirty && vsphereNetworkForm.vsphere_networkName.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_networkName">{{msg.name_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" ng-pattern="/^[a-zA-Z][-a-zA-Z0-9]*$/" name="vsphere_networkName" ng-model="network.name" ng-minlength="5" ng-maxlength="100" required id="vsphere_networkName" placeholder="{{msg.name_placeholder}}">
        <div class="help-block" ng-show="vsphereNetworkForm.vsphere_networkName.$dirty && vsphereNetworkForm.vsphere_networkName.$invalid">
            <i class="fa fa-warning"></i> {{msg.network_name_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>
<div class="form-group" ng-class="{ 'has-error': vsphereNetworkForm.vsphere_networkDescription.$dirty && vsphereNetworkForm.vsphere_networkDescription.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_networkDescription">{{msg.description_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" name="vsphere_networkDescription" ng-model="network.description" ng-maxlength="1000" id="vsphere_networkDescription" placeholder="{{msg.network_form_description_placeholder}}">
        <div class="help-block" ng-show="vsphereNetworkForm.vsphere_networkDescription.$dirty && vsphereNetworkForm.vsphere_networkDescription.$invalid">
            <i class="fa fa-warning"></i> {{msg.netowrk_description_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>
<div class="form-group" ng-class="{ 'has-error': vsphereNetworkForm.vsphere_networkSubnet.$dirty && vsphereNetworkForm.vsphere_networkSubnet.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_networkSubnet">{{msg.network_form_subnet_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" name="vsphere_networkSubnet" ng-model="network.subnetCIDR" ng-maxlength="30" id="vsphere_networkSubnet" placeholder="{{msg.network_form_subnet_placeholder}}" required>
        <div class="help-block" ng-show="vsphereNetworkForm.vsphere_networkSubnet.$dirty && vsphereNetworkForm.vsphere_networkSubnet.$invalid">
            <i class="fa fa-warning"></i> {{msg.network_subnet_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>
<div class="form-group">
    <label class="col-sm-3 control-label" for="vsphere_network_public">{{msg.public_in_account_label}}</label>
    <div class="col-sm-9">
        <input type="checkbox" name="vsphere_network_public" id="vsphere_network_public" ng-model="network.publicInAccount">
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="row btn-row">
    <div class="col-sm-9 col-sm-offset-3">
        <a id="createAwsTemplate" ng-disabled="vsphereNetworkForm.$invalid" class="btn btn-success btn-block" ng-click="createVsphereNetwork()" role="button"><i class="fa fa-plus fa-fw"></i>
                {{msg.network_form_create}}</a>
    </div>
</div>