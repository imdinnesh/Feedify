# write the setup file for the project

echo "Make sure docker deamon is running"

echo "Waiting for the database to start..."
docker compose up -d mongodb


echo "Database started successfully"

