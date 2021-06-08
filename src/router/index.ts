import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import GarmentsOverview from '../views/GarmentOverview.vue'
import AccountHistory from '../views/AccountHistory.vue'
import OwnershipHistory from '../views/OwnershipHistory.vue'
import CreateGarment from '../views/CreateGarment.vue'
import { web3Store, roles } from "@/store/web3";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/garments/overview',
    name: 'GarmentsOverview',
    component: GarmentsOverview,
  },
  {
    path: '/garments/overview',
    name: 'GarmentsOverview',
    component: () => import('../views/GarmentOverview.vue')
  },
  {
    path: '/account/history',
    name: 'AccountHistory',
    component: () => import('../views/AccountHistory.vue')
  },
  {
    path: '/progress',
    name: 'Progress',
    component: () => import('../views/InProgress.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateGarment,
    beforeEnter: (to, from, next) => {
      let role = web3Store.getters.getRole; // get users role

      if (role != roles.COMPANY) { // if user doesnt have the company role then they aren't allowed to view the create page and redirected to the "/" route
        console.log('if');
        next({ name: 'GarmentsOverview' })
      }
      else next()
    }
  },
  {
    path: '/garment/:id/transfer',
    name: 'Transaction',
    component: () => import('../views/Transaction.vue')
  },
  {
    path: '/garment/:id/owners',
    name: 'OwnershipHistory',
    component: () => import('../views/OwnershipHistory.vue')
  },
  {
    path: '/garment/:id/detail',
    name: 'Detail',
    component: () => import('../views/DetailView.vue')
  },

  {
    path: '/set-role',
    name: 'SetRole',
    component: () => import('../views/SetRole.vue'),
    beforeEnter: (to, from, next) => {
      let role = web3Store.getters.getRole; // get users role

      if (role != roles.OWNER) { // if user doesnt have the owner role then they aren't allowed to view the set-role page and redirected to the "/" route
        next({ name: 'GarmentsOverview' })
      }
      else next()
    }
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let role = web3Store.getters.getRole; // get users role

  // recycler should only be able to use the in progress page to accept and or decline transactions
  if (role == roles.RECYCLER && to.name !== 'Progress') {
    next({name: 'Progress'})
  } else
    next();
})

export default router
