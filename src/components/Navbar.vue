<template>
  <b-navbar toggleable="sm" type="primary" variant="light" id="topnav">
    <b-navbar-brand class="img-link" href="#">
      <img src="../assets/logo.png" alt="DCP logo" class="nav-img" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

    <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/garments/overview" v-if="role != dRoles.RECYCLER"
          >My Garments</b-nav-item
        >
        <b-nav-item to="/account/history" v-if="role != dRoles.RECYCLER"
          >Account History</b-nav-item
        >
        <b-nav-item to="/progress">In Progress</b-nav-item>
        <b-nav-item to="/create" v-if="role == dRoles.COMPANY"
          >Create Garment</b-nav-item
        >
        <b-nav-item to="/set-role" v-if="role == dRoles.OWNER"
          >Set Role</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style lang="scss">
#topnav {
  color: black;
  background: none;
  box-shadow: 0 0 5px #444;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1;

  .img-link {
    padding: 0;
  }

  .nav-img {
    height: 40px;
    margin: 0 20px 0 40px;
    padding: 5px 0;
  }

  .navbar-brand {
    margin: 0;
  }

  .navbar-collapse {
    a {
      color: black;
      transition: 0.3s;
      letter-spacing: 1px;
      padding: 0.75rem 10px;
      border-bottom: 4px solid transparent;

      @media only screen and (min-width: 576px) {
        &.router-link-exact-active {
          border-bottom: 4px solid #289672;
          color: #289672;
          font-weight: bold;
        }

        &:hover {
          color: #29bb89;
          border-bottom: 4px solid #29bb89;
        }
      }

      @media only screen and (min-width: 768px) {
        padding: 0.75rem 1rem;
      }
      &.router-link-exact-active {
        color: #289672;
        font-weight: bold;
      }
    }
  }

  .navbar-toggler {
    min-height: 50px;
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Cpath stroke='rgba(0, 0, 0, 0.5)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  }
}
</style>

<script>
import { web3Store, roles } from "@/store/web3";

export default {
  data: function () {
    return {
      dRoles: roles,
    };
  },

  computed: {
    role() {
      return web3Store.getters.getRole;
    },
  },
};
</script>
