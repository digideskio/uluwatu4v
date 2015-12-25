<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.vspherecname.$dirty && vsphereCredentialForm.vspherecname.$invalid }">
    <label class="col-sm-3 control-label" for="vspherecname">{{msg.name_label}}</label>

    <div class="col-sm-9">
        <input type="text" ng-pattern="/^[a-z][-a-z0-9]*$/" class="form-control" ng-model="credentialVsphere.name" id="vspherecname" name="vspherecname" ng-minlength="5" ng-maxlength="100" required placeholder="{{msg.name_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.vspherecname.$dirty && vsphereCredentialForm.vspherecname.$invalid">
            <i class="fa fa-warning"></i> {{msg.credential_name_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->

</div>

<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.vspherecdescription.$dirty && vsphereCredentialForm.vspherecdescription.$invalid }">
    <label class="col-sm-3 control-label" for="vspherecdescription">{{msg.description_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" ng-model="credentialVsphere.description" id="vspherecdescription" name="vspherecdescription" ng-maxlength="1000" placeholder="{{msg.credential_form_description_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.vspherecdescription.$dirty && vsphereCredentialForm.vspherecdescription.$invalid">
            <i class="fa fa-warning"></i> {{msg.credential_description_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->

</div>

<!-- .form-group -->
<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.ouser.$dirty && vsphereCredentialForm.ouser.$invalid }">
    <label class="col-sm-3 control-label" for="ouser">{{msg.credential_vsphere_form_user_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" name="ouser" ng-model="credentialVsphere.parameters.user" required id="ouser" placeholder="{{msg.credential_vsphere_user_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.ouser.$dirty && vsphereCredentialForm.ouser.$invalid">
            <i class="fa fa-warning"></i> {{msg.vsphere_credential_ouser_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>

<!-- .form-group -->
<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.opassword.$dirty && vsphereCredentialForm.opassword.$invalid }">
    <label class="col-sm-3 control-label" for="opassword">{{msg.credential_vsphere_form_password_label}}</label>

    <div class="col-sm-9">
        <input type="password" class="form-control" name="opassword" ng-model="credentialVsphere.parameters.password" required id="opassword" placeholder="{{msg.credential_vsphere_password_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.opassword.$dirty && vsphereCredentialForm.opassword.$invalid">
            <i class="fa fa-warning"></i> {{msg.vsphere_credential_opassword_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>

<!-- .form-group -->
<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.oendpoint.$dirty && vsphereCredentialForm.oendpoint.$invalid }">
    <label class="col-sm-3 control-label" for="oendpoint">{{msg.credential_vsphere_form_endpoint_label}}</label>

    <div class="col-sm-9">
        <input type="text" class="form-control" name="oendpoint" ng-model="credentialVsphere.parameters.endpoint" ng-minlength="5" required id="oendpoint" placeholder="{{msg.credential_vsphere_form_endpoint_placeholder}}">
        <div class="help-block" ng-show="vsphereCredentialForm.oendpoint.$dirty && vsphereCredentialForm.oendpoint.$invalid">
            <i class="fa fa-warning"></i> {{msg.vsphere_credential_oendpoint_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="form-group" ng-class="{ 'has-error': vsphereCredentialForm.vsphere_sshPublicKey.$dirty && vsphereCredentialForm.vsphere_sshPublicKey.$invalid }">
    <label class="col-sm-3 control-label" for="vsphere_sshPublicKey">{{msg.credential_vsphere_form_ssh_key_label}}</label>

    <div class="col-sm-9">
        <textarea placeholder="{{msg.credential_vsphere_form_ssh_key_placeholder}}" rows="4" type="text" class="form-control" ng-model="credentialVsphere.publicKey" name="vsphere_sshPublicKey" id="vsphere_sshPublicKey" required></textarea>
        <div class="help-block" ng-show="vsphereCredentialForm.vsphere_sshPublicKey.$dirty && vsphereCredentialForm.vsphere_sshPublicKey.$invalid">
            <i class="fa fa-warning"></i> {{msg.credential_ssh_key_invalid}}
        </div>
    </div>
    <!-- .col-sm-9 -->

</div>

<div class="form-group">
    <label class="col-sm-3 control-label" for="credPublic">{{msg.public_in_account_label}}</label>
    <div class="col-sm-9">
        <input type="checkbox" name="credPublic" id="credPublic" ng-model="credentialVsphere.public">
    </div>
    <!-- .col-sm-9 -->
</div>

<div class="row btn-row">
    <div class="col-sm-9 col-sm-offset-3">
        <a id="createVsphereCredential" ng-disabled="vsphereCredentialForm.$invalid" ng-click="createVsphereCredential()" class="btn btn-success btn-block" role="button"><i
                class="fa fa-plus fa-fw"></i>
          {{msg.credential_form_create}}</a>
    </div>
</div>