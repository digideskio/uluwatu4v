<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.vspherecname.$dirty && vsphereCredentialForm.vspherecname.$invalid }">
    <label class="col-sm-3 control-label" for="vspherecname">{{msg.name_label}}</label>

    <div class="col-sm-9">
        <input type="text" ng-pattern="/^[a-z][-a-z0-9]*$/" class="form-control" ng-model="credentialvsphere.name" id="vspherecname" name="vspherecname" ng-minlength="5" ng-maxlength="100" required placeholder="{{msg.name_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.vspherecname.$dirty && vsphereCredentialForm.vspherecname.$invalid">
            <i class="fa fa-warning"></i> {{msg.credential_name_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->

</div>


<div class="row btn-row">
    <div class="col-sm-9 col-sm-offset-3">
        <a id="createvsphereCredential" ng-disabled="vsphereCredentialForm.$invalid" ng-click="createVsphereCredential()" class="btn btn-success btn-block" role="button"><i
                class="fa fa-plus fa-fw"></i>
          {{msg.credential_form_create}}</a>
    </div>
</div>