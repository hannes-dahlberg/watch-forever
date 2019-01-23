// Libs
import { container } from "artos";
import { Request, RequestHandler, Response, Router } from "express";

// Controllers
import { AuthController, ForeverController, InstancesController } from "./controllers";

// Middlewares
import { Middlewares } from "./middlewares";

const middlewares: Middlewares = container.getService(Middlewares);
const authController: AuthController = container.getService(AuthController);
const foreverController: ForeverController = container.getService(ForeverController);
const instancesController: InstancesController = container.getService(InstancesController);

const router: Router = Router();

router.post("/auth/login", middlewares.guest(), authController.login());

router.get("/forever", middlewares.auth(), foreverController.index());
router.post("/forever", middlewares.auth(), foreverController.start());
router.put("/forever/:uid", middlewares.auth(), foreverController.end());
router.get("/instances", middlewares.auth(), instancesController.index());

export { router };
