#!/bin/bash
echo "

███████╗███████╗██╗   ██╗███████╗███████╗                             
██╔════╝╚══███╔╝╚██╗ ██╔╝██╔════╝██╔════╝                             
█████╗    ███╔╝  ╚████╔╝ █████╗  ███████╗                             
██╔══╝   ███╔╝    ╚██╔╝  ██╔══╝  ╚════██║                             
███████╗███████╗   ██║   ██║     ███████║                             
╚══════╝╚══════╝   ╚═╝   ╚═╝     ╚══════╝                             

"
echo "Starting containers...."
docker-compose up -d
echo "Registering services to Service Registry container..."
source scripts/service-register.sh
echo "Attaching container logs to user's terminal"
docker-compose  --project-directory=. -f docker-compose.yml logs --follow

