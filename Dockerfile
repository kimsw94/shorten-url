# FROM node:16.15.1 as builder
FROM node:18.14.0 as builder

ARG BUILD_ENV

WORKDIR /usr/src/app
# COPY ./package.json /usr/src/app/package.json
# COPY ./package-lock.json /usr/src/app/package-lock.json
# COPY ./tsconfig.json /usr/src/app/tsconfig.json
# COPY ./tsconfig.build.json /usr/src/app/tsconfig.build.json
COPY . .

RUN npm install 
RUN npm run build

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
ENV BUILD_ENV=$BUILD_ENV

EXPOSE 3100
CMD [ "npm", "run", "start:prod" ]

# FROM node:16 AS runner
# # Copy the app code to the runner container
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./

# CMD ["npm", "run", "start:prod"]