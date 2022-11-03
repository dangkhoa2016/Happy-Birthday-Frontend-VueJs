<template>

  <nav class='header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-light navbar-shadow'>
    <div class='navbar-container d-flex content'>
      <div class='bookmark-wrapper d-flex align-items-center'>
        <ul class='nav navbar-nav d-xl-none'>
          <li class='nav-item'>
            <a class='nav-link menu-toggle' href='#' @click.prevent='setSidebarVisible(true)'>
              <menu-icon size='1.5x' />
            </a>
          </li>
        </ul>
      </div>
      <ul class='nav navbar-nav align-items-center ms-auto'>
        <li class='nav-item dropdown dropdown-user'>
          <b-dropdown class=''
            variant='temp' toggle-tag='a'
            text='' right
            toggle-class='nav-link dropdown-toggle dropdown-user-link'
          >
            <template #button-content>
              <div class='user-nav d-sm-flex d-none'>
                <span class='user-name fw-bolder'>Dang Khoa</span>
                <span class='user-status mt-50'>{{ $t('top-header.admin_role') }}</span>
              </div>
              <span class='avatar'>
                <img class='round'
                  src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/portrait/small/avatar-s-11.jpg'
                  alt='avatar' height='40' width='40' />
                <span class='avatar-status-online'></span>
              </span>
            </template>
            <b-dropdown-item @click='logout'>
              <span class='d-flex align-items-center'>
                <log-out-icon class='me-1' /> {{ $t('top-header.logout') }}
              </span>
            </b-dropdown-item>
          </b-dropdown>
        </li>
      </ul>
    </div>
  </nav>

</template>

<script src='./top-header.js'></script>
