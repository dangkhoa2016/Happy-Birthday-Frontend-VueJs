<template>

  <validation-observer tag='div' :data-id='item.id'
    class='form form-horizontal' v-slot='{ invalid }'>
    <div class='row d-flex mb-3'>
      <div class='col-md-8 col-12'>
        <div class='form-group'>
          <label class='col-form-label' :for='`txt-wish-quote-${item.id}`'>{{ $t('wish-quote-item.form.txt_quote') }} {{index + 1}}</label>
          <validation-provider :name="`${$t('wish-quote-item.form.txt_quote') }}} ${index + 1}`" tag='div' rules='required|min:3' v-slot='{ errors }'>
            <textarea required :disabled='item.saving || loadingWishQuotes' :aria-describedby='`txt-wish-quote-${item.id}`'
              class='form-control' :class="{ 'is-invalid': errors.length > 0 }" :id='`txt-wish-quote-${item.id}`' rows='3'
              :placeholder="`${$t('wish-quote-item.form.placeholder_txt_quote')} ${index + 1}`" v-model='item.quote' autocomplete='off'></textarea>
            <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
          </validation-provider>
        </div>
        <div class='form-group mt-1'>
          <label class='col-form-label'>{{ $t('status') }} (<small class='form-text text-muted'>{{ $t('current') }}: <strong>{{ item.enabled }}</strong></small>)</label>
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
                type='button' :disabled='invalid || item.saving || loadingWishQuotes' @click.prevent='saveWishQuote'>
                <save-icon size='1x' /> {{ $t('action.save') }}
              </button>

              <button class='btn btn-outline-danger btn-sm text-nowrap px-1'
                type='button' :disabled='item.saving || loadingWishQuotes' @click.prevent='showConfirmDelete'>
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

<script src='./wish-quote-item.js'></script>