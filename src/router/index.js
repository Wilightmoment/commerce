import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/pages/Login";
import Dashboard from "@/components/Dashboard";
import Products from "@/components/pages/Products";
import Orders from "@/components/pages/Orders";
import Coupon from "@/components/pages/Coupon";
import CustomerOrder from "@/components/pages/CustomerOrder"
import CustomerCheckout from "@/components/pages/CustomerCheckout"
import FrontShop from "@/components/pages/FrontShop"
import FrontSingleProduct from "@/components/pages/FrontSingleProduct"
import CheckOut from "@/components/CheckOut"
import CheckOutOrder from "@/components/pages/CheckOutOrder"
import CheckOutComplete from "@/components/pages/CheckOutComplete"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/frontshop"
    },
    {
      path: "/frontshop",
      name: "FrontShop",
      component: FrontShop
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/admin",
      name: "Dashboard",
      component: Dashboard,
      children: [
        {
          path: "products",
          name: "Products",
          component: Products,
          meta: { requireAuth: true }
        },
        {
          path: "orders",
          name: "Orders",
          component: Orders,
          meta: { requireAuth: true }
        },
        {
          path: "coupon",
          name: "Coupon",
          component: Coupon,
          meta: { requireAuth: true }
        },
      ]
    },
    {
      path: "/customer",
      name: "CustomerDashboard",
      component: Dashboard,
      children: [
        {
          path: "customerorder",
          name: "CustomerOrder",
          component: CustomerOrder
        },
        {
          path: "customer_checkout/:orderId",
          name: "CustomerCheckout",
          component: CustomerCheckout
        }
      ]
    },    
    {
      path: "/singleproduct/:productId",
      name: "FrontSingleProduct",
      component: FrontSingleProduct
    },
    {
      path: "/checkout",
      name: "CheckOut",
      component: CheckOut,
      children:[
        {
          path: "checkoutorder",
          name: "CheckOutOrder",
          component: CheckOutOrder
        },
        {
          path: "checkoutcomplete/:orderId",
          name: "CheckOutComplete",
          component: CheckOutComplete
        },
      ]
    }
  ]
});
