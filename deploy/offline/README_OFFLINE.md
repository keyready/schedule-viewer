Offline bundle usage

1) Prepare bundle on an online machine
   - Requirements: Docker + Docker Compose
   - Run:
     ./deploy/offline/build_bundle.sh
   - Result: deploy/offline/bundle contains:
     - mongo-image.tar
     - server-image.tar (schedule-viewer-server:prod)
     - client-image.tar (schedule-viewer-client:prod)
     - docker-compose.prod.yml, run_offline.sh, stop_offline.sh

2) Copy the bundle to a USB drive
   - Copy the entire deploy/offline/bundle folder

3) Run offline on the target machine (no Internet)
   - Install Docker + Docker Compose
   - Copy bundle folder to the target machine
   - In deploy/offline on the target, run:
     ./run_offline.sh
   - Open:
     - Client: http://localhost:2000
     - API: http://localhost:6000

4) Stop services
   - ./stop_offline.sh

Notes
 - To override schedule Excel files, mount host folder in docker-compose.prod.yml:
   server:
     volumes:
       - ../../server/files:/app/files:ro
 - MongoDB will restore from ../../server/backup/dump if present.

