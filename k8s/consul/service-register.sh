#!/bin/bash
# shellcheck disable=SC2207
exec /usr/local/bin/docker-entrypoint.sh "$@" &
sleep 3
CONFIG_DIR="/usr/tmp/consul/configs"
PROJECTS=$(jq -r '.projects[] | select(.type == "application") | .root' ./nest-cli.json | sed  's/apps\///g')

echo "Service Registration system started..."

for PROJECT_NAME in ${PROJECTS} ; do
    echo "${CONFIG_DIR}/${PROJECT_NAME}/config.json"
    SVC_NAME="$( jq -r '.app.name' ${CONFIG_DIR}/${PROJECT_NAME}/config.json )"

    echo "Registering ${SVC_NAME}"

  if [ ! -f "${CONFIG_DIR}/${PROJECT_NAME}/config.json" ]; then
    echo "${PROJECT_NAME}/${CONFIG_PATH} not found, skipping service"
    continue
  fi
  
    echo "**** ${PROJECT_NAME}"
    echo " Saving config from path: ${CONFIG_DIR}/${PROJECT_NAME}/${CONFIG_PATH} to ezyfs/config/${SVC_NAME} "
    consul kv put ezyfs/config/"${SVC_NAME}" \@"${CONFIG_DIR}/"${PROJECT_NAME}"/config.json"
done
consul monitor