import express from 'express';
import { userRoute } from '../modules/users/user.route.js';
import { jwtRouter } from '../modules/jwt/jwt.route.js';
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
]

routes.forEach((route)=>{
    router.use(route.path,route.route)
})

export default router 