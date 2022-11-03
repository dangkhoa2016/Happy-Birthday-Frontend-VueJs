<template>

  <div id='list-templates' class='pb-1'>
    <h1>{{ $t('templates.header') }} <label class='h5 text-success'> {{ $t('total') }}: {{ loadingTemplates ? '?' : templates.length }}</label></h1>
    <b-row>
      <b-col sm='6' md='9' class='d-flex align-items-center'>
        <label class='text-info mb-50 mb-sm-0'>{{ $t('unsaved_id') }}: {{ loadingTemplates ? '?' : countTemporatory }}</label>
      </b-col>
      <b-col sm='6' md='3'>
        <v-select :options='statusOptions' :placeholder="$t('select_placeholder')" v-model='status'
          :reduce='option => option.value' :clearable='false'
          :key='(new Date()).valueOf()' label='text'>
        </v-select>
      </b-col>
    </b-row>

    <div class='card my-1'>
      <div class='card-content collapse show'>
        <div class='card-body'>
          <b-row class='mb-2'>
            <b-col cols='12' md='6'>
              <b-input-group size='sm'>
                <b-form-input size='sm'
                  v-model='search' :placeholder="$t('placeholder_search')"
                  type='search' autocomplete='off'
                ></b-form-input>
                <b-button :disabled='!search' @click="search = ''">{{ $t('action.clear') }}</b-button>
              </b-input-group>
            </b-col>
            <b-col cols='12' md='6' class='d-flex justify-content-end mt-md-0 mt-50'>
              <button type='button' class='btn btn-sm btn-outline-primary waves-effect me-50 btn-reload'
                @click.prevent='loadTemplates' :disabled='savingTemplate || loadingTemplates'>
                <refresh-cw-icon size='1x' /> {{ $t('action.refresh') }}
              </button>
              <b-dropdown :disabled='loadingTags'
                split size='sm'
                split-variant='outline-primary'
                variant='info' @click.prevent="addTemporatoryTemplate('unshift')"
                text='' toggle-text='' right
                class='waves-effect btn-reload mx-50'
              >
                <template #button-content>
                  <plus-square-icon size='1x' /> {{ $t('action.add_new') }}
                </template>
                <b-dropdown-item @click.prevent="addTemporatoryTemplate('unshift')">{{ $t('action.add_new') }}</b-dropdown-item>
                <b-dropdown-item @click.prevent='setShowModalImport(true)'>{{ $t('action.import') }}</b-dropdown-item>
              </b-dropdown>
              <b-dropdown :disabled='loadingTags'
                variant='warning' text='' size='sm'
                toggle-class='px-1' right
              >
                <template #button-content>
                  <briefcase-icon size='1x' /> {{ $t('action.export') }}
                </template>
                <b-dropdown-item @click="download('json')">
                  <server-icon class='me-1' size='1x' />
                  <span class='align-middle'>JSON</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-col>
          </b-row>

          <loading v-if='loadingTemplates' />
          <error v-else-if='!hasData && errorAction'>
            <p>{{ errorAction }}</p>
          </error>
          <error v-else-if='!hasData' type='warning'>
            <p>{{ $t('no_data') }}</p>
          </error>
          <div v-else>
            <template-item :index='index' :data-template='item'
              v-for='(item, index) in templates'
              :key='item.id' v-show='showItem(item)' />
          </div>

          <div class='d-flex justify-content-between'>
            <button class='btn btn-icon btn-primary' type='button' @click.prevent="addTemporatoryTemplate('push')"
              :disabled='loadingTemplates'>
              <plus-icon size='1x' /> {{ $t('action.add_new') }}
            </button>
            <button class='btn btn-icon btn-primary' type='button' @click.prevent="addTemporatoryTemplate('push')"
              :disabled='loadingTemplates'>
              <plus-icon size='1x' /> {{ $t('action.add_new') }}
            </button>
          </div>

        </div>
      </div>
      
      <b-modal
        id='confirm-delete-template' :no-close-on-backdrop='true'
        @show='setNeedLogin(false)' @ok='handleOk'
        centered ok-variant='danger' :ok-disabled='deletingTemplate'
        :ok-title="$t('ok_title')"
        :cancel-title="$t('cancel_title')"
      >
        <template #modal-header='{ close }'>
          <h4 class='mb-0'>{{ $t('action.confirm') }}</h4>
          <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
            :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
        </template>

        <div class='modal-body'>
          <p>{{ $t('templates.confirm_action', { name: confirmDeletedMessage }) }}</p>
          <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
            {{ errorAction }}
          </div>
        </div>
      </b-modal>
    </div>
  </div>

</template>

<script src='./templates.js'></script>
