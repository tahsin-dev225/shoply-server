import express from 'express';
import { userRoute } from '../modules/users/user.route.js';
import { jwtRouter } from '../modules/jwt/jwt.route.js';
import { productRoute } from '../modules/products/product.route.js';
import { orderRoute } from '../modules/orders/order.route.js';
import { reviewsRoute } from '../modules/reviews/review.route.js';
import { categoryRoute } from '../modules/category/category.route.js';
const router = express.Router();

const routes = [
    {
        path : "/users",
        route : userRoute
    },
    {
        path : "/jwt",
        route : jwtRouter
    },
    {
        path : "/products",
        route : productRoute
    },
    {
        path : "/orders",
        route : orderRoute
    },
    {
        path : "/reviews",
        route : reviewsRoute
    },
    {
        path : "/categorys",
        route : categoryRoute
    },
]

routes.forEach((route)=>{
    router.use(route.path,route.route)
})

export default router 