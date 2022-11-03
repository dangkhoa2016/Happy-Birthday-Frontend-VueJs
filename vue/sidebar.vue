<template>

  <div class='main-menu menu-fixed menu-light menu-accordion menu-shadow expanded'>
    <div class='navbar-header expanded'>
      <ul class='nav navbar-nav flex-row'>
        <li class='nav-item me-auto'>
          <b-link :to="{ name: 'home' }" class='navbar-brand'>
            <div class='brand-logo'>
              <img src='/assets/favicon.png' class='rounded-0 w-100'>                
            </div>
            <h2 class='brand-text'>HBM</h2>
          </b-link>
        </li>
        <li class='nav-item nav-toggle' v-if='toggleButtonVisible'>
          <a class='nav-link modern-nav-toggle pe-0' data-bs-toggle='collapse'>
            <x-icon size='1.5x' @click.prevent='setSidebarVisible(false)' />
          </a>
        </li>
      </ul>
    </div>
    <div class='shadow-bottom'></div>
    <div class='main-menu-content ps'>
      <ul class='navigation navigation-main' id='main-menu-navigation'>
        <router-link v-for='link in navigations' :key='link.text' :exact='link.exact'
          :to='link.to' custom v-slot='{ href, navigate, isActive }'>
          <li class='nav-item my-25' :class="{ 'active': isActive }">
            <b-link class='d-flex align-items-center' :href='href' @click='navigate'>
              <component :is='link.icon' size='1.5x' />
              <span class='menu-item text-truncate'>{{ $t(`navigations.${link.text}`) }}</span>
            </b-link>
          </li>
        </router-link>
      </ul>
    </div>
  </div>

</template>

<script src='./sidebar.js'></script>
