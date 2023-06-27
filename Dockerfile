FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

WORKDIR /app
COPY web .
COPY .env .
COPY .env frontend

RUN npm install && npm run build
RUN cd frontend && npm install && npm run build

EXPOSE 80
EXPOSE 443

CMD ["npm", "run", "serve"]
