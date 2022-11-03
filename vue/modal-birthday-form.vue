<template>

  <b-modal id='modal-birthday-form' centered
    :ok-disabled='savingBirthday || !formValid || !allDataLoaded'
    :ok-title="$t('modal-birthday-form.ok_title')"
    :cancel-title="$t('cancel_title')"
    :no-close-on-backdrop='true' @hide='onHide'
    @ok='handleOk' size='lg' @hidden='onHidden' :cancel-disabled='savingBirthday'>

    <template #modal-header='{ close }'>
      <h5>{{ $t(`modal-birthday-form.modal_header_${isEdit ? 'edit' : 'add'}`) }}</h5>
      <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
        :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
    </template>

    <validation-observer ref='modal-form' tag='form'>
      <div class='row'>
        <div class='col-sm'>
          <div class='form-group'>
            <label>{{ $t('modal-birthday-form.select_user') }}</label>
            <validation-provider :name="$t('modal-birthday-form.select_user')" rules='required2' v-slot='{ errors }'>
              <v-select :options='users' :disabled='loadingUsers || savingBirthday' :clearable='!isEdit'
                :placeholder="$t(loadingUsers ? 'modal-birthday-form.loading_user' : 'select_placeholder')"
                ref='sel-user' v-model='form.username' :reduce='user => user.username'
                label='name' class='sel-user' :class="{ 'is-invalid': errors.length > 0 }">
                <template slot='option' slot-scope='option'>
                  <div class='d-flex my-25 align-items-center'>
                    <div class='avatar avatar-lg me-1'>
                      <img :src='option.avatar || getDefaultAvatar(option.gender)' :data-gender='option.gender'
                        @error='replaceDefault' :alt='option.name' />
                    </div>
                    <div>
                      <h6 class='text-secondary mb-50'>{{ option.name }}</h6>
                      <h5 class='text-dark mb-0'>{{ option.username }}</h5>
                    </div>
                  </div>
                </template>
                <!-- eslint-disable-next-line vue/no-unused-vars  -->
                <template #no-options='{ }'>
                  {{ $t('modal-birthday-form.no_data') }}
                </template>
              </v-select>
              <small class='form-text text-muted'>{{ $t('modal-birthday-form.user_tip') }}</small>
              <span class='invalid-feedback'>{{ errors[0] }}</span>
            </validation-provider>
          </div>
        </div>

        <div class='col-sm'>
          <div class='form-group'>
            <label>{{ $t('modal-birthday-form.select_template') }}</label>
            <validation-provider :name="$t('modal-birthday-form.template')" rules='required2' v-slot='{ errors }'>
              <v-select :options='templates' :disabled='loadingTemplates || savingBirthday'
                :placeholder="$t(loadingTemplates ? 'modal-birthday-form.loading_template' : 'select_placeholder')"
                ref='sel-template' v-model='form.template' :reduce='template => template.id'
                label='name' :class="{ 'is-invalid': errors.length > 0 }">
                <template slot='option' slot-scope='option'>
                  <div class='d-flex my-25 align-items-center'>
                    <span class='avatar avatar-lg bg-transparent me-50'>
                      <img :src='option.thumb ? `${endpoint}${option.thumb}` : defaultTemplateThumb'
                      :alt='option.name' class='rounded' @error='replaceDefaultTemplate' />
                    </span>
                    <span>{{ option.name }}</span>
                  </div>
                </template>
                <!-- eslint-disable-next-line vue/no-unused-vars  -->
                <template #no-options='{ }'>
                  {{ $t('modal-birthday-form.no_data') }}
                </template>
              </v-select>
              <small class='form-text text-muted'>{{ $t('modal-birthday-form.template_tip') }}</small>
              <span class='invalid-feedback'>{{ errors[0] }}</span>
            </validation-provider>
          </div>
        </div>

        <div class='col-sm'>
          <div class='form-group'>
            <label>{{ $t('status') }}</label>
            <div class='form-check form-check-success'>
              <input type='checkbox' class='form-check-input'
                id='chk-enabled' v-model='form.enabled' :disabled='savingBirthday'>
              <label class='form-check-label' for='chk-enabled'>{{ $t('active') }}</label>
            </div>
            <small class='form-text text-muted'>{{ $t('current') }}: <strong>{{ form.enabled }}</strong></small>
          </div>
        </div>
      </div>

      <div :class="errorAction ? 'text-danger' : 'd-none'">
        {{ errorAction }}
      </div>
    </validation-observer>
  </b-modal>

</template>

<script src='./modal-birthday-form.js'></script>
