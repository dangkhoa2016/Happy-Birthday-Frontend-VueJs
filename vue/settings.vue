<template>

  <validation-observer ref='settings-form' class='form form-horizontal' tag='form' v-slot='{ invalid }'>
    <div class='row'>
      <div class='col-12'>
        <h3>{{ $t('settings.main.header') }}</h3>
        <div class='mb-1'>
          <label class='col-form-label' for='txt-endpoint'>{{ $t('settings.main.endpoint') }}</label>
          <validation-provider :name="$t('settings.main.endpoint')" rules='required|min:3' tag='div' v-slot='{ errors }'>
            <input type='text' required aria-describedby='txt-endpoint'
              class='form-control' :class="{ 'is-invalid': errors.length > 0 }" id='txt-endpoint'
              :placeholder="$t('settings.main.placeholder_endpoint')" 
              v-model='form.endpoint' autocomplete='off' />
            <div class='fv-plugins-message-container invalid-feedback' v-html="errors.join('<br/>')"></div>
          </validation-provider>
        </div>
      </div>

      <div class='col-12 mt-2'>
        <h3>{{ $t('settings.users_page.header') }}</h3>
      </div>
      <div class='col-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-usersPageSize'>{{ $t('settings.users_page.per_page') }}</label>
          <v-select :options='usersPageOptions' :get-option-label="option => $t(option.text)"
            :placeholder="$t('select_placeholder')" v-model='form.usersPageSize'
            :reduce='option => option.value' :clearable='false' id='sel-usersPageSize' label='text'>
              <template slot='option' slot-scope='option'>
                {{ $t(option.text) }}
              </template>
            </v-select>
        </div>
      </div>
      <div class='col-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-usersSortBy'>{{ $t('sort_by') }}</label>
          <v-select :options='usersSortOptions' :get-option-label="option => $t(option.text)"
            :placeholder="$t('select_placeholder')" v-model='form.usersSortBy'
            :reduce='option => option.value' :clearable='false' id='sel-usersSortBy' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>
      <div class='col-4'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-usersSortDirection'>{{ $t('settings.users_page.sort_direction') }}</label>
          <v-select :options='directionOptions' :get-option-label="option => $t(option.text)"
            :placeholder="$t('select_placeholder')" v-model='form.usersSortDirection'
            :reduce='option => option.value' :clearable='false' id='sel-usersSortDirection' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>

      <div class='col-12 mt-2'>
        <h3>{{ $t('settings.birthdays_page.header') }}</h3>
      </div>

      <div class='col-6'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-birthdaysSortBy'>{{ $t('sort_by') }}</label>
          <v-select :options='birthdaysSortOptions' :get-option-label="option => $t(option.text)"
            :placeholder="$t('select_placeholder')" v-model='form.birthdaysSortBy'
            :reduce='option => option.value' :clearable='false' id='sel-birthdaysSortBy' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>
      <div class='col-6'>
        <div class='mb-1'>
          <label class='col-form-label' for='sel-birthdaysSortDirection'>{{ $t('settings.birthdays_page.sort_direction') }}</label>
          <v-select :options='directionOptions' :get-option-label="option => $t(option.text)"
            :placeholder="$t('select_placeholder')" v-model='form.birthdaysSortDirection'
            :reduce='option => option.value' :clearable='false' id='sel-birthdaysSortDirection' label='text'>
            <template slot='option' slot-scope='option'>
              {{ $t(option.text) }}
            </template>
          </v-select>
        </div>
      </div>

      <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
        {{ errorAction }}
      </div>

      <div class='col-12'>
        <b-button :disabled='invalid || submitting'
          @click.prevent='save'>{{ $t('settings.save') }}</b-button>
        <b-button variant='primary' :disabled='submitting'
          @click.prevent='reset'>{{ $t('settings.reset') }}</b-button>
      </div>
    </div>
  </validation-observer>

</template>

<script src='./settings.js'></script>
