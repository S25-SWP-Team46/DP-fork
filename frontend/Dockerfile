FROM node:24

ARG REACT_APP_API_URL=http://localhost:8000

WORKDIR /app
COPY . /app

RUN echo "REACT_APP_API_URL=${REACT_APP_API_URL}" > .env

RUN npm install --force

# Debug: list node_modules/react-scripts
RUN ls -l node_modules/react-scripts || echo "react-scripts not found"

CMD ["npm", "start", "--", "--host", "0.0.0.0"]