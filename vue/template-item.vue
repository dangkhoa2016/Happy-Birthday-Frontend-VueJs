<template>

  <validation-observer tag='div' :data-id='item.id'
    class='form form-horizontal' v-slot='{ invalid }'>
    <div class='row d-flex mb-3'>
      <div class='col-md-8 col-12'>
        <div class='form-group'>
          <div class='row'>
            <div class='col'>
              <label class='col-form-label' :for='`txt-name-${item.id}`'>{{ $t('template-item.form.txt_name') }} {{index + 1}}</label>
              <validation-provider :name="`${$t('template-item.form.txt_name')} ${index + 1}`" tag='div' rules='required|min:3' v-slot='{ errors }'>
                <input type='text' required :disabled='item.saving || loadingTemplates' :aria-describedby='`txt-name-${item.id}`'
                  class='form-control' :class="{ 'is-invalid': errors.length > 0 }" :id='`txt-name-${item.id}`'
                  :placeholder="`${$t('template-item.form.placeholder_txt_name')} ${index + 1}`" v-model='item.name' autocomplete='off' />
                <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
              </validation-provider>
            </div>
            <div class='col'>
              <label class='col-form-label' :for='`txt-thumb-${index}`'>{{ $t('template-item.form.txt_thumb') }} {{index + 1}}</label>
              <input class='form-control' :id='`txt-thumb-${index}`'
                :placeholder="`${$t('template-item.form.placeholder_txt_thumb')} ${index + 1}`" v-model='item.thumb'
                :disabled='item.saving || loadingTemplates' />
            </div>
          </div>
        </div>
        <div class='form-group mt-1'>
          <label class='col-form-label' :for='`txt-url-${index}`'>{{ $t('template-item.form.url_label') }} {{index + 1}}</label>
          <validation-provider :name="`${$t('template-item.form.txt_url')} ${index + 1}`" tag='div' rules='required|url|min:3' v-slot='{ errors }'>
            <input type='text' required :disabled='item.saving || loadingTemplates' :aria-describedby='`txt-url-${index}`'
              class='form-control' :class="{ 'is-invalid': errors.length > 0 }" :id='`txt-url-${index}`'
              :placeholder="`${$t('template-item.form.placeholder_txt_url')} ${index + 1}`" v-model='item.url' autocomplete='off' />
            <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
          </validation-provider>
        </div>
        <div class='form-group mt-1'>
          <label class='col-form-label'>{{ $t('status') }} (<small class='form-text text-muted'>{{ $t('current') }}: <strong>{{ item.enabled || false }}</strong></small>)</label>
          <div class='form-check form-check-success'>
            <input type='checkbox' class='form-check-input' :id='`chk-enabled-quote-${index}`' v-model='item.enabled'>
            <label class='form-check-label' :for='`chk-enabled-quote-${index}`'>{{ $t('active') }}</label>
          </div>
        </div>
      </div>
      <div class='col-md-4 col-12'>
        <div class='row'>
          <div class='col-md-3 col-sm-6 align-top mt-1 mt-md-0'>
            <div class='form-group'>
              <label class='col-form-label'>Id</label>
              <input type='number' :title="isTemporatory ? '' : item.id"
                class='form-control-sm form-control'
                disabled aria-describedby='id' :value="isTemporatory ? '' : item.id" />
            </div>
          </div>

          <div class='col-md-9 col-sm-6 mb-50 align-top mt-1 mt-md-0'>
            <label class='col-form-label'>{{ $t('action.name') }}</label>
            <div class='form-group'>
              <button class='btn btn-outline-success btn-sm text-nowrap px-1 mr-2'
                type='button' :disabled='invalid || item.saving || loadingTemplates' @click.prevent='saveTemplate'>
                <save-icon size='1x' /> {{ $t('action.save') }}
              </button>

              <button class='btn btn-outline-danger btn-sm text-nowrap px-1'
                type='button' :disabled='item.saving || loadingTemplates' @click.prevent='showConfirmDelete'>
                <x-icon size='1x' /> {{ $t('action.delete') }}
              </button>
            </div>
          </div>
        </div>
        <div class='form-group'>
          {{ $t('created_at') }}: {{ item.created_at | date }}<br/>
          {{ $t('updated_at') }}: {{ item.updated_at | date }}
        </div>
      </div>

      <div class='col-12' :class="errorAction ? 'text-danger mt-50' : 'd-none'">
        {{ errorAction }}
      </div>
    </div>
    <hr />
  </validation-observer>

</template>

<script src='./template-item.js'></script>