<template>

  <div class='col-12 col-sm-6 col-md-4 col-lg-3'>
    <div class='card' :class="birthday.enabled ? 'border-info' : 'border-danger'">
      <div class='card-header d-flex justify-content-between align-items-center'>
        <h4 class='card-title'>{{ birthday.user && birthday.user.username }}</h4>
        <span @click.prevent="showConfirm('delete')" class='text-muted cursor-pointer'
          :title="$t('action.delete')">
          <x-square-icon class='font-medium-5' size='1.5x' />
        </span>
      </div>
      <div class='card-body'>
        <h6 class='card-subtitle text-muted'>{{ birthday.user && birthday.user.name }}</h6>
        <img class='img-fluid my-2' :src='birthday.template ? `${endpoint}${birthday.template.thumb}` : null'
          :alt="$t('birthday-item.img_alt_for', { user: birthday.user && birthday.user.username })" />
        <div class='d-flex justify-content-between mb-1'>
          <div class='btn-group btn-group-sm'>
            <a target='_blank' :href='birthday.user ? `${endpoint}/${birthday.user.username}` : `#`'
              class='btn btn-primary btn-sm waves-effect waves-float waves-light'
              v-b-popover.hover.top="{ offset: 5, title:'', content: $t('birthday-item.view_in_new_tab', { user: birthday.user && birthday.user.username }) }">
              <eye-icon size='1.5x' />
            </a>
            <a target='_blank' :href='birthday.template ? birthday.template.url : null'
              v-b-popover.hover.top="{ offset: 5, title: '', content: $t('birthday-item.view_template_design_in_new_tab') }"
              class='btn btn-primary btn-sm waves-effect waves-float waves-light'>
              <aperture-icon size='1.5x' />
            </a>
          </div>
          <b-dropdown
            split size='sm'
            split-variant='outline-warning'
            variant='warning' @click.prevent='showEdit'
            :text="$t('action.edit')" toggle-text='' right
            class='waves-effect waves-float waves-light'
          >
            <b-dropdown-item @click.prevent="showConfirm('delete')">{{ $t('action.delete') }}</b-dropdown-item>
            <b-dropdown-item @click.prevent='showEdit'>{{ $t('action.edit') }}</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :class="birthday.enabled ? '' : 'disabled'"
              :disabled='!birthday.enabled' href='javascript:void(0);'
              @click.prevent="showConfirm('disable')"
              :title="$t('birthday-item.make_inactive')"
              v-b-popover.hover.top="{ offset: 5, title: '', content: $t('birthday-item.make_inactive') }">{{ $t('action.turn_off') }}</b-dropdown-item>
            <b-dropdown-item :class="birthday.enabled ? 'disabled' : ''"
              :disabled='birthday.enabled' href='javascript:void(0);'
              @click.prevent="showConfirm('enable')"
              :title="$t('birthday-item.make_active')"
              v-b-popover.hover.top="{ offset: 5, title: '', content: $t('birthday-item.make_active') }">{{ $t('action.turn_on') }}</b-dropdown-item>
          </b-dropdown>
        </div>
        <b-button v-b-toggle='[`collapse-${birthday.id}`]' size='sm' variant=''
          class='btn-sm w-100 btn-gradient-primary waves-effect waves-float waves-light'>{{ $t('action.detail') }}</b-button>
        <b-collapse :id='`collapse-${birthday.id}`'>
          <ul class='list-group list-group-flush'>
            <li class='list-group-item px-0' v-for='detail in detailFields' :key='detail.field'>
              <div class='d-flex align-items-center justify-content-between flex-grow-1'>
                <span class='h5 mb-0 fw-bolder'>{{ $t(detail.label) }}</span>
                <span>{{ birthday[detail.field] | date }}</span>
              </div>
            </li>
          </ul>
        </b-collapse>
      </div>
    </div>
  </div>

</template>

<script src='./birthday-item.js'></script>
