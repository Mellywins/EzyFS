#!/bin/bash
# shellcheck disable=SC2207
PROJECTS=$(jq -r '.projects[] | select(.type == "application") | .root' ./nest-cli.json)
BOOTSTRAP_PATH=src/consul.bootstrap.yml
CONFIG_PATH=config.json

echo "Service Registration system started"

for PROJECT_DIR in ${PROJECTS} ; do
  if [ ! -f "./${PROJECT_DIR}/${BOOTSTRAP_PATH}" ]; then
    echo "./${PROJECT_DIR}/${BOOTSTRAP_PATH} not found, skipping service"
    continue
  fi

  SVC_NAME=$(yq eval '.service.name' ./"${PROJECT_DIR}"/${BOOTSTRAP_PATH}  )
  echo "Registering ${SVC_NAME}"

  if [ ! -f "./${PROJECT_DIR}/${CONFIG_PATH}" ]; then
    echo "./${PROJECT_DIR}/${CONFIG_PATH} not found, skipping service"
    continue
  fi

    echo "**** ${PROJECT_DIR}"
    echo " Saving config from path: ./${PROJECT_DIR}/${CONFIG_PATH} to ezyfs/config/${SVC_NAME} "
    docker exec -it consul-server /bin/sh -c  "consul kv put ezyfs/config/"${SVC_NAME}" \@/usr/src/app/"${PROJECT_DIR}"/${CONFIG_PATH}"
done

echo "Service Registration system completed"