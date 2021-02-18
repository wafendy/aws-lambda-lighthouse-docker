FROM amazon/aws-lambda-nodejs:12
COPY app.js package*.json ./
RUN npm install --save-prod
CMD [ "app.lambdaHandler" ]
