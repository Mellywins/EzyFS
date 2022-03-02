FROM hashicorp/consul
WORKDIR /usr/tmp/consul/configs
RUN apk add jq bash
COPY nest-cli.json .
COPY apps/api-gateway/config.json ./api-gateway/config.json 
COPY apps/notifications/config.json ./notifications/config.json 
COPY apps/registration-authority/config.json ./registration-authority/config.json 

COPY k8s/consul/service-register.sh ./service-register.sh
RUN chmod +x ./service-register.sh
RUN ls -l ./service-register.sh
ENTRYPOINT ["/usr/tmp/consul/configs/service-register.sh"]
CMD ["agent", "-dev", "-client", "0.0.0.0"]

