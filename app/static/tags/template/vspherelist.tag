<form class="form-horizontal" role="document">
    <!-- role: 'document' - non-editable "form" -->
    <div class="form-group">
        <label class="col-sm-3 control-label" for="vsphereclusterName">{{msg.name_label}}</label>

        <div class="col-sm-9">
            <p id="vsphereclusterName" class="form-control-static">{{template.name}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <div class="form-group" ng-show="template.description">
        <label class="col-sm-3 control-label" for="vsphereclusterDesc">{{msg.description_label}}</label>

        <div class="col-sm-9">
            <p id="vsphereclusterDesc" class="form-control-static">{{template.description}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="vsphereinstanceType">{{msg.template_form_instance_type_label}}</label>

        <div class="col-sm-9">
            <p id="vsphereinstanceType" class="form-control-static">{{template.parameters.instanceType}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="vspherevolumecount">{{msg.template_form_volume_count_label}}</label>

        <div class="col-sm-9">
            <p id="vspherevolumecount" class="form-control-static">{{template.volumeCount}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
    <div class="form-group">
        <label class="col-sm-3 control-label" for="vspherevolumesize">{{msg.template_form_volume_size_label}}</label>

        <div class="col-sm-9">
            <p id="vspherevolumesize" class="form-control-static">{{template.volumeSize}}</p>
        </div>
        <!-- .col-sm-9 -->
    </div>
</form>