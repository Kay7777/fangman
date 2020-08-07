# FANGMAN course and tutor booking website

## Technology

- Built the microservices based on TypeScript and Express
- Implemented Authentication service with JWT and local strategy.
- Built Expiration service by Bull.js to monitor order valiadation.
- Built Payment service by Stripe API.
- Implemented request traffic by Ingress Nginx and Cluster IP.
- Built Deployment of Kubernetes for scaling and mantaining microservices.
- Built NATS streaming message server to allow communications among the microservices.
- Dockerize each microservices with Docker and used Skaffold to run them locally.

## Update

- 2020.06.13
  Built auth microservice with JWT and local strategy authentication.

- 2020.06.24
  Built @fangman/common error handlers and nats events interfaces.

- 2020.07.05
  Built courses microservices.

- 2020.07.12
  Built orders microservices and nats publishers and listeners in both courses microservice and orders microservice.

- 2020.07.25
  Built Expiration microservices with Bull.js library to monitor the order validation.

- 2020.08.05
  Built payment microservice with Stripe API.
