<template>

  <div id='user-form'>
    <b-modal id='modal-user-form' static centered :ok-disabled='!formValid || savingUser'
      :ok-title="$t('user-form.ok_title')"
      :cancel-title="$t('cancel_title')"
      :no-close-on-backdrop='true' @ok='handleOk' size='lg'
      @hidden='onHidden' :cancel-disabled='savingUser' @hide='onHide' @shown='onShown'>

      <template #modal-header='{ close }'>
        <h5>{{ $t(`user-form.modal_header_${isEdit ? 'edit' : 'add'}`) }}</h5>
        <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
          :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
      </template>

      <validation-observer ref='modal-form' class='form form-horizontal' tag='form'>
        <div class='row'>
          <div class='col-12'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-fullname'>{{ $t('user-form.form.txt_full_name') }}</label>
              <validation-provider :name="$t('user-form.form.txt_full_name')" tag='div' rules='required|min:3' v-slot='{ errors }'>
                <input type='text' required
                  class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-fullname'
                  aria-describedby='txt-fullname' tabindex='1'
                  :placeholder="$t('user-form.form.placeholder_txt_full_name')" v-model='form.name' autocomplete='off' />
                <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
              </validation-provider>
            </div>
          </div>

          <div class='col-6'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-username'>{{ $t('user-form.form.txt_username') }}</label>
              <validation-provider :name="$t('user-form.form.txt_username')" tag='div' rules='required|min:3' v-slot='{ errors }'>
                <input type='text' required :disabled='isEdit'
                  class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-username'
                  aria-describedby='txt-username' tabindex='2'
                  :placeholder="$t('user-form.form.placeholder_txt_username')" v-model='form.username' autocomplete='off' />
                <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
              </validation-provider>
            </div>
          </div>
 
          <div class='col-6'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-birthday'>{{ $t('user-form.form.birth_date') }}</label>
              <validation-provider :name="$t('user-form.form.birth_date')" tag='div'
                rules='required' v-slot='{ errors }'>
                <date-picker required :placeholder="$t('user-form.form.placeholder_birth_date')"
                  aria-describedby='txt-birthday' v-model='form.birthday' :lang="$i18n.locale"
                  input-class='form-control' class='w-100' value-type='D-M-YYYY'
                  :disabled-date="disabledBeforeTodayAndAfterAWeek"
                  :class="{ 'is-invalid': errors.length > 0 }"
                  id='txt-birthday' format='DD MMM YYYY' title-format='DD MMM YYYY' />
                <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
              </validation-provider>
            </div>
          </div>
 
          <div class='col-6'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-username'>{{ $t('user-form.form.gender') }}</label>
              <validation-provider :name="$t('user-form.form.gender')" tag='div'
                rules='required2' v-slot='{ errors }'>
                <v-select :options='genders' :placeholder="$t('select_placeholder')" v-model='form.gender'
                  :reduce='gender => gender.value' :get-option-label="option => $t(`user-form.${option.text}`)"
                  label='text' :class="{ 'is-invalid': errors.length > 0 }">
                  <template slot='option' slot-scope='option'>
                    {{ $t(`user-form.${option.text}`) }}
                  </template>
                </v-select>
                <span class='invalid-feedback'>{{ errors[0] }}</span>
              </validation-provider>
            </div>
          </div>

          <div class='col-6'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-username'>{{ $t('status') }}</label>
              <div class='form-check form-check-success'>
                <input type='checkbox' class='form-check-input' id='chk-enabled1' v-model='form.enabled'>
                <label class='form-check-label' for='chk-enabled1'>{{ $t('active') }}</label>
              </div>
              <small class='form-text text-muted'>{{ $t('current') }}: <strong>{{ form.enabled }}</strong></small>
            </div>
          </div>

          <div class='col-12'>
            <div class='mb-1'>
              <label class='col-form-label' for='txt-avatar'>{{ $t('avatar') }}</label>
              <validation-provider :name="$t('avatar')" tag='div' rules='avatar' v-slot='{ errors }'>
                <div class='input-group' :class="{ 'is-invalid': errors.length > 0 }">
                  <input type='text' class='form-control' id='txt-avatar'
                    aria-describedby='txt-avatar' tabindex='3' :class="{ 'is-invalid': errors.length > 0 }"
                    :placeholder="$t('user-form.form.placeholder_avatar')" v-model='form.avatar' autocomplete='off' />
                  <a :href="validAvatarUrl ? form.avatar : 'javascript:void(0);'"
                    :target="validAvatarUrl ? '_blank' : null" class='btn'
                    :class="validAvatarUrl ? 'btn-success' : 'btn-danger'">
                    <eye-icon size='1x' />
                  </a>
                </div>
                <span class='invalid-feedback'>{{ errors[0] }}</span>
              </validation-provider>
            </div>
          </div>

          <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
            {{ errorAction }}
          </div>
        </div>
      </validation-observer>
    </b-modal>
  </div>

</template>

<script src='./user-form.js'></script>
