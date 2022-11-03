<template>

  <div id='list-users' class='pb-1'>
    <h1>{{ $t('users.header') }} <label class='h5 text-success'>{{ $t('total') }}: {{ loadingUsers ? '?' : totalRows }}</label></h1>

    <!-- User Interface controls -->
    <b-row>
      <b-col md='6' class='my-1'>
        <b-form-group
          :label="$t('sort_by')" class='mb-0'
          label-for='sort-by-select'
          label-class='col-form-label'
        >
          <b-dropdown :text='displaySortOption' size='sm' class=''>
            <b-dropdown-item v-for='sortOption in sortOptions' :key='`sort-${sortOption.value}`'
              @click.prevent='sortBy = sortOption.value'>
              {{ sortOption.text }}
            </b-dropdown-item>
          </b-dropdown>
          <b-dropdown :text="$t(sortDesc === true ? 'sort_desc' : 'sort_asc')" size='sm' class=''>
            <b-dropdown-item @click.prevent='sortDesc = true'>{{ $t('sort_desc') }}</b-dropdown-item>
            <b-dropdown-item @click.prevent='sortDesc = false'>{{ $t('sort_asc') }}</b-dropdown-item>
          </b-dropdown>
        </b-form-group>
      </b-col>

      <b-col md='6' class='my-1'>
        <b-form-group
          :label="$t('action.search')" class='mb-0'
          label-class='col-form-label'
          label-for='filter-input'
        >
          <b-input-group size='sm'>
            <b-form-input size='sm'
              id='filter-input'
              v-model='filter' type='search'
              :placeholder="$t('placeholder_search')"
            ></b-form-input>
            <b-button :disabled='!filter' @click="filter = ''">{{ $t('action.clear') }}</b-button>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md='6' class='my-1'>
        <b-form-group
          v-model='sortDirection'
          :label="$t('users.filter')" class='mb-0'
          label-class='col-form-label'
          :description="$t('users.uncheck_all')"
          v-slot='{ ariaDescribedby }'
        >
          <b-form-checkbox-group
            :aria-describedby='ariaDescribedby'
            class='mt-1'
          >
            <div class='form-check form-check-inline form-check-success'>
              <input type='checkbox' v-model='filterOn' value='name' class='form-check-input' id='chk-name-filter' />
              <label class='form-check-label' for='chk-name-filter'>{{ $t('users.name') }}</label>
            </div>
            <div class='form-check form-check-inline form-check-success'>
              <input type='checkbox' v-model='filterOn' value='age' class='form-check-input' id='chk-age-filter' />
              <label class='form-check-label' for='chk-age-filter'>{{ $t('users.age') }}</label>
            </div>
            <div class='form-check form-check-inline form-check-success'>
              <input type='checkbox' v-model='filterOn' value='enabled' class='form-check-input' id='chk-enabled-filter' />
              <label class='form-check-label' for='chk-enabled-filter'>{{ $t('active') }}</label>
            </div>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col md='6' class='my-1'>
        <b-form-group
          label-class='col-form-label' class='mb-0'
          :label="$t('settings.users_page.per_page')"
        >
          <b-dropdown :text='displayPageOption' size='sm' class=''>
            <b-dropdown-item v-for='pageOption in pageOptions' :key='`sort-${pageOption.value}`'
              @click.prevent='perPage = pageOption.value'>
              {{ $t(pageOption.text) }}
            </b-dropdown-item>
          </b-dropdown>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm='7' class='my-1'>
        <button type='button' class='btn btn-sm btn-outline-primary waves-effect btn-reload'
          @click.prevent='loadUsers' :disabled='loadingUsers'>
          <refresh-cw-icon size='1x' /> {{ $t('action.refresh') }}
        </button>
        <b-dropdown :disabled='loadingUsers'
          split size='sm'
          split-variant='outline-primary'
          variant='info' @click="$bvModal.show('modal-user-form')"
          text='' toggle-text='' right
          class='waves-effect btn-reload mx-50'
        >
          <template #button-content>
            <plus-square-icon size='1x' /> {{ $t('action.add_new') }}
          </template>
          <b-dropdown-item v-b-modal.modal-user-form>{{ $t('action.add_new') }}</b-dropdown-item>
          <b-dropdown-item @click.prevent='setShowModalImport(true)'>{{ $t('action.import') }}</b-dropdown-item>
        </b-dropdown>
        <b-dropdown :disabled='loadingUsers'
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
      <b-col sm='5' class='my-1'>
        <b-pagination
          v-model='currentPage' :total-rows='totalRows'
          :per-page='perPage' size='sm' class='my-0'
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <div class='card mb-1'>
      <div class='card-header'>
        <h4 class="card-title">{{ $t('users.list') }}</h4>
      </div>
      <div class='table-responsive'>
        <b-table
          :items='users' :busy='loadingUsers'
          :current-page='currentPage'
          :filter='filter' :fields='fields'
          :filter-included-fields='filterOn'
          :sort-by.sync='sortBy' :per-page='perPage'
          :sort-desc.sync='sortDesc'
          sort-direction='desc' stacked='md' show-empty
          thead-class='table-dark' @filtered='onFiltered'
        >
          <template #table-caption>
            <div class='px-2'>{{ $t('total') }}: {{ totalRows }}</div>
          </template>

          <template #cell(name)='row'>
            <div class='d-flex justify-content-left align-items-center'>
              <div class='avatar-wrapper'>
                <div class='avatar me-50'>
                  <img :src='row.item.avatar || replaceDefault' class='border-info' :data-gender='row.item.gender'
                    @error='replaceDefault' :alt="$t('users.avatar', { name: row.item.name })" width='64' />
                </div>
              </div>
              <div class='d-flex flex-column'>
                <h6 class='user-name text-truncate mb-0'>{{ row.item.name }}</h6>
                <small class='text-truncate text-muted'>{{ row.item.username }}</small>
              </div>
            </div>
          </template>

          <template #cell(actions)='row'>
            <b-button-group size="sm">
              <b-button size='sm' variant='success' @click='info(row.item, row.index, $event.target)'
                v-b-popover.hover.top="{ offset: 5, title:'', content: $t('users.view_json_data') }"
                :title="$t('users.view_json_data')" class='mr-1'>
                <align-center-icon size='1x' />
              </b-button>
              <b-button size='sm' variant='info' @click='row.toggleDetails'
                v-b-popover.hover.top="{ offset: 5, title:'', content: $t(`users.${row.detailsShowing ? 'hide' : 'show'}_detail`) }"
                :title="$t(`users.${row.detailsShowing ? 'hide' : 'show'}_detail`)">
                <pen-tool-icon size='1x' />
              </b-button>
              <b-button size='sm' variant='danger' @click="showConfirm(row.item.username, 'delete')"
                v-b-popover.hover.top="{ offset: 5, title:'', content: $t('action.delete') }" :title="$t('action.delete')">
                <trash-2-icon size='1x' />
              </b-button>
              <b-dropdown
                split-variant='outline-warning'
                variant='warning' @click.prevent='showEdit(row.item)'
                :text="$t('action.edit')" toggle-text='' right split size='sm'
                class='waves-effect waves-float waves-light'
              >
                <b-dropdown-item @click.prevent="showConfirm(row.item.username, 'delete')">{{ $t('action.delete') }}</b-dropdown-item>
                <b-dropdown-item @click.prevent='showEdit(row.item)'>{{ $t('action.edit') }}</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item :class="row.item.enabled ? '' : 'disabled'"
                  :disabled='!row.item.enabled' href='javascript:void(0);'
                  @click.prevent="showConfirm(row.item.username, 'disable')"
                  :title="$t('users.disable_action')"
                  v-b-popover.hover.top="{ offset: 5, title:'', content: $t('users.disable_action') }">{{ $t('action.turn_off') }}</b-dropdown-item>
                <b-dropdown-item :class="row.item.enabled ? 'disabled' : ''"
                  :disabled='row.item.enabled' href='javascript:void(0);'
                  @click.prevent="showConfirm(row.item.username, 'enable')"
                  :title="$t('users.enable_action')"
                  v-b-popover.hover.top="{ offset: 5, title:'', content: $t('users.enable_action') }">{{ $t('action.turn_on') }}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </template>

          <template #cell(age)='row'>
            <label class='badge bg-primary'>{{ row.value }}</label>
            <br/>
            <label class='badge bg-secondary'>{{ row.item.birthday }}</label>
          </template>

          <template #row-details='row'>
            <ul class='list-group list-group-numbered'>
              <li class='list-group-item' v-for='(value, key) in row.item' :key='key'><span>{{ key }}: {{ value }}</span></li>
            </ul>
          </template>

          <template #empty>
            <h4 class='text-secondary text-center'>{{ $t('no_data') }}</h4>
          </template>
          <template #emptyfiltered>
            <h4 class='text-secondary text-center'>{{ $t('users.not_found_with_criteria') }}</h4>
          </template>
        </b-table>
      </div>
    </div>

    <!-- Info modal -->
    <b-modal :id='infoModal.id' ok-only @hide='resetInfoModal'>
      <template #modal-header='{ close }'>
        <h5>{{ infoModal.title }}</h5>
        <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
          :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
      </template>
      <pre>{{ infoModal.content }}</pre>

    </b-modal>
    
    <b-pagination
      v-model='currentPage' :total-rows='totalRows'
      :per-page='perPage' size='sm'
      class='pagination-success my-2 justify-content-center'
    >
      <template #first-text><span class='text-success'>{{ $t('users.first_page') }}</span></template>
      <template #last-text><span class='text-success'>{{ $t('users.last_page') }}</span></template>
    </b-pagination>

    <b-modal
      id='confirm-action-user' :no-close-on-backdrop='true'
      @ok='handleOk' centered :ok-variant='actionColor'
      :ok-disabled='deletingUser || updatingStatusUser'
      :ok-title="$t('users.ok_title')"
      :cancel-title="$t('cancel_title')"
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

<script src='./users.js'></script>
