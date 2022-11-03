<template>

  <div id='list-birthdays' class='pb-3'>
    <h1>{{ $t('birthdays.header') }} <label class='h5 text-success'>{{ $t('total') }}: {{ loadingBirthdays ? '? ' : birthdays.length }}</label></h1>

    <div class='my-1 d-flex justify-content-between'>
      <div>
        <button type='button' class='btn btn-sm btn-outline-primary waves-effect btn-reload'
          @click.prevent='loadBirthdays' :disabled='loadingBirthdays'>
          <refresh-cw-icon size='1x' /> {{ $t('action.refresh') }}
        </button>
        <b-dropdown :disabled='loadingBirthdays'
          split size='sm'
          split-variant='outline-primary'
          variant='info' @click="$bvModal.show('modal-birthday-form')"
          text='' toggle-text='' right
          class='waves-effect btn-reload mx-50'
        >
          <template #button-content>
            <plus-square-icon size='1x' /> {{ $t('action.add_new') }}
          </template>
          <b-dropdown-item v-b-modal.modal-birthday-form>{{ $t('action.add_new') }}</b-dropdown-item>
          <b-dropdown-item @click.prevent='setShowModalImport(true)'>{{ $t('action.import') }}</b-dropdown-item>
        </b-dropdown>
        <b-dropdown :disabled='loadingBirthdays'
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
      </div>
      <a :href='`${endpoint}/`' target='_blank' class='btn btn-dark btn-sm text-nowrap px-1 waves-effect'>
        <home-icon size='1x' /> {{ $t('birthdays.view_list_at_home') }}
      </a>
    </div>

    <div class='mb-2 row'>
      <b-col cols='12' md='6'>
        <b-form-group
          :label="$t('action.search')" class='mb-0'
          label-class='col-form-label'
          label-for='txt-search'
        >
          <b-input-group size='sm'>
            <b-form-input size='sm'
              id='txt-search' v-model='search'
              type='search' autocomplete='off'
              :placeholder="$t('birthdays.enter_username')"
            ></b-form-input>
            <b-button :disabled='!search' @click="search = ''">{{ $t('action.clear') }}</b-button>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm='6' md='3'>
        <label class='col-form-label' for='sel-templateOptions'>{{ $t('birthdays.filter_by_template') }}</label>
        <v-select :options='templateOptions' :clearable='false' :placeholder="$t('select_placeholder')" v-model='templateId'
          :reduce='option => option.id' id='sel-templateOptions' label='name'></v-select>
      </b-col>
      <b-col sm='6' md='3'>
        <label class='col-form-label' for='sel-birthdayStatusOptions'>{{ $t('birthdays.filter_by_status') }}</label>
        <v-select :options='birthdayStatusOptions' :placeholder="$t('select_placeholder')" v-model='birthdayStatus'
          :reduce='option => option.value' :clearable='false'
          id='sel-birthdayStatusOptions' label='text' :key='(new Date()).valueOf()'></v-select>
      </b-col>
    </div>

    <loading v-if='loadingBirthdays' />
    <error v-else-if='!hasData && errorAction'>
      <p>{{ errorAction }}</p>
    </error>
    <error v-else-if='!hasData' type='warning'>
      <p>{{ $t('no_data') }}</p>
    </error>
    <div class='row items' v-else>
      <birthday-item v-for='(item, index) in birthdays'
        v-show='showItem(item)' :birthday='item' :key='`birthday-${index}`' />
    </div>

    <div class='d-flex justify-content-between'>
      <button class='btn btn-icon btn-primary' type='button'
        v-b-modal.modal-birthday-form :disabled='loadingBirthdays'>
        <plus-icon size='1x' /> {{ $t('action.add_new') }}
      </button>
      <button class='btn btn-icon btn-primary' type='button'
        v-b-modal.modal-birthday-form :disabled='loadingBirthdays'>
        <plus-icon size='1x' /> {{ $t('action.add_new') }}
      </button>
    </div>

    <b-modal
      id='confirm-action-birthday' :no-close-on-backdrop='true'
      @ok='handleOk' centered :ok-variant='actionColor' @hide='onHide'
      :ok-disabled='deletingBirthday || updatingStatusBirthday'
      :ok-title="$t('ok_title')"
      :cancel-title="$t('cancel_title')"
      :cancel-disabled='deletingBirthday || updatingStatusBirthday'
    >
      <template #modal-header='{ close }'>
        <h5>{{ $t('action.confirm') }}</h5>
        <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
          :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
      </template>

      <div class='modal-body'>
        <p>{{ confirmMessage }}</p>
        <div class='col-12' :class="errorAction ? 'text-danger mt-50' : 'd-none'">
          {{ errorAction }}
        </div>
      </div>
    </b-modal>

  </div>

</template>

<script src='./birthdays.js'></script>
