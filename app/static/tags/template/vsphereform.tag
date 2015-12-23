<div class="form-group" ng-class="{ 'has-error': TemplateForm.vsphere_tclusterName.$dirty && vsphereTemplateForm.vsphere_tclusterName.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_tclusterName">{{msg.name_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" ng-pattern="/^[a-zA-Z][-a-zA-Z0-9]*$/" name="vsphere_tclusterName" ng-model="vsphereTemp.name" ng-minlength="5" ng-maxlength="100" required id="vsphere_tclusterName" placeholder="{{msg.name_placeholder}}">
        <div class="help-block" ng-show="vsphereTemplateForm.vsphere_tclusterName.$dirty && vsphereTemplateForm.vsphere_tclusterName.$invalid">
            <i class="fa fa-warning"></i> {{msg.template_name_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->

</div>

<div class="form-group" ng-class="{ 'has-error': vsphereTemplateForm.vsphere_tdescription.$dirty && vsphereTemplateForm.vsphere_tdescription.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_tdescription">{{msg.description_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" name="vsphere_tdescription" ng-model="vsphereTemp.description" ng-maxlength="1000" id="vsphere_tdescription" placeholder="{{msg.template_form_description_placeholder}}">
        <div class="help-block" ng-show="vsphereTemplateForm.vsphere_tdescription.$dirty && vsphereTemplateForm.vsphere_tdescription.$invalid">
            <i class="fa fa-warning"></i> {{msg.template_description_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="form-group">
    <label class="col-sm-3 control-label" for="vsphere_tinstanceType">{{msg.template_form_instance_type_label}}</label>

    <div class="col-sm-9">
        <input type="text" name="vsphere_tinstancetype" class="form-control" ng-model="vsphereTemp.parameters.instanceType" id="vsphere_tinstancetype" placeholder="custom instance type name" required>

        <div class="help-block" ng-show="vsphereTemplateForm.vsphere_tinstancetype.$dirty && vsphereTemplateForm.vsphere_tinstancetype.$invalid"><i class="fa fa-warning"></i> {{msg.vsphere_template_instancetype_invalid}}
        </div>
        <!-- .col-sm-9 -->
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="form-group" ng-class="{ 'has-error' : vsphereTemplateForm.vsphere_tvolumecount.$dirty && vsphereTemplateForm.vsphere_tvolumecount.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_tvolumecount">{{msg.template_form_volume_count_label}}</label>

    <div class="col-sm-9">
        <input type="number" name="vsphere_tvolumecount" class="form-control" ng-model="vsphereTemp.volumeCount" id="vsphere_tvolumecount" min="1" max="12" placeholder="{{msg.template_form_volume_count_placeholder}}" required>

        <div class="help-block" ng-show="vsphereTemplateForm.vsphere_tvolumecount.$dirty && vsphereTemplateForm.vsphere_tvolumecount.$invalid"><i class="fa fa-warning"></i> {{msg.volume_count_invalid}}
        </div>
        <!-- .col-sm-9 -->
    </div>
</div>

<div class="form-group" ng-class="{ 'has-error': vsphereTemplateForm.vsphere_tvolumesize.$dirty && vsphereTemplateForm.vsphere_tvolumesize.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_tvolumesize">{{msg.template_form_volume_size_label}}</label>

    <div class="col-sm-9">
        <input type="number" name="vsphere_tvolumesize" class="form-control" ng-model="vsphereTemp.volumeSize" id="vsphere_tvolumesize" min="10" max="1000" placeholder="{{msg.template_form_volume_size_placeholder}}" required>

        <div class="help-block" ng-show="vsphereTemplateForm.vsphere_tvolumesize.$dirty && vsphereTemplateForm.vsphere_tvolumesize.$invalid"><i class="fa fa-warning"></i> {{msg.volume_size_invalid}}
        </div>
        <!-- .col-sm-9 -->
    </div>
</div>

<div class="form-group">
    <label class="col-sm-3 control-label" for="vsphere_publicinaccount">{{msg.public_in_account_label}}</label>
    <div class="col-sm-9">
        <input type="checkbox" name="vsphere_publicinaccount" id="vsphere_publicinaccount" ng-model="vsphereTemp.public">
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="row btn-row">
    <div class="col-sm-9 col-sm-offset-3">
        <a id="createVsphereTemplate" ng-disabled="vsphereTemplateForm.$invalid" class="btn btn-success btn-block" ng-click="createVsphereTemplate()" role="button"><i class="fa fa-plus fa-fw"></i>
                {{msg.template_form_create}}</a>
    </div>
</div>