if [ ! "$(docker network ls | grep aurora-jewelry-rnd-network)" ]; then
  echo "Creating aurora-jewelry-rnd-network network ..."
  docker network create --driver bridge aurora-jewelry-rnd-network
else
  echo "aurora-jewelry-rnd-network network exists."
fi