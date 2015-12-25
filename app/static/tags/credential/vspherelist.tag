<form class="form-horizontal" role="document">
    <!-- role: 'document' - non-editable "form" -->

    <div class="form-group">
        <label class="col-sm-3 control-label" for="name">{{msg.name_label}}</label>

        <div class="col-sm-9">
            <p id="name" class="form-control-static">{{credential.name}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <!-- .form-group -->
    <div class="form-group" ng-show="credential.description">
        <label class="col-sm-3 control-label" for="vspheredescriptionfield">{{msg.description_label}}</label>

        <div class="col-sm-9">
            <p id="vspheredescriptionfield" class="form-control-static">{{credential.description}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="vsphereendpoint">{{msg.credential_vsphere_form_endpoint_label}}</label>

        <div class="col-sm-9">
            <p id="vsphereendpoint" class="form-control-static">{{credential.parameters.endpoint}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>

</form>